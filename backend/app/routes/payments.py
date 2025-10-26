from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.payment import Payment
from app.models.trip import Trip
from app.utils.mpesa import initiate_stk_push, query_payment_status
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/initiate-mpesa', methods=['POST'])
@jwt_required()
def initiate_mpesa_payment():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    trip_id = data.get('trip_id')
    phone_number = data.get('phone_number')
    
    if not trip_id or not phone_number:
        return jsonify({'error': 'Trip ID and phone number required'}), 400
    
    trip = Trip.query.filter_by(id=trip_id, rider_id=user_id).first()
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404
    
    amount = trip.final_fare or trip.fare_estimate
    if not amount or amount <= 0:
        return jsonify({'error': 'Invalid trip amount'}), 400
    
    print(f"Initiating M-Pesa payment: Trip {trip_id}, Amount {amount}, Phone {phone_number}")
    
    # Initiate STK Push
    response = initiate_stk_push(phone_number, amount, trip_id)
    
    print(f"M-Pesa response: {response}")
    
    if response.get('ResponseCode') == '0':
        payment = Payment(
            trip_id=trip_id,
            amount=amount,
            payment_method='mpesa',
            merchant_request_id=response.get('MerchantRequestID'),
            checkout_request_id=response.get('CheckoutRequestID'),
            phone_number=phone_number,
            status='pending'
        )
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({
            'message': 'Payment initiated successfully',
            'merchant_request_id': response.get('MerchantRequestID'),
            'checkout_request_id': response.get('CheckoutRequestID'),
            'payment_id': payment.id
        }), 200
    
    error_msg = response.get('errorMessage') or response.get('ResponseDescription') or 'Failed to initiate payment'
    return jsonify({'error': error_msg}), 400

@payments_bp.route('/check-status/<int:payment_id>', methods=['GET'])
@jwt_required()
def check_payment_status(payment_id):
    user_id = get_jwt_identity()
    payment = Payment.query.join(Trip).filter(
        Payment.id == payment_id,
        Trip.rider_id == user_id
    ).first()
    
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404
    
    if payment.status == 'pending':
        # Query M-Pesa API for status
        status_response = query_payment_status(payment.checkout_request_id)
        
        if status_response.get('ResultCode') == '0':
            payment.status = 'completed'
            payment.mpesa_receipt_number = status_response.get('MpesaReceiptNumber')
            payment.completed_at = datetime.utcnow()
            db.session.commit()
        elif status_response.get('ResultCode') != '1032':  # 1032 = pending
            payment.status = 'failed'
            db.session.commit()
    
    return jsonify(payment.to_dict()), 200

@payments_bp.route('/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """M-Pesa callback endpoint"""
    data = request.get_json()
    
    checkout_request_id = data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
    result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
    
    payment = Payment.query.filter_by(checkout_request_id=checkout_request_id).first()
    
    if payment:
        if result_code == 0:  # Success
            callback_metadata = data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {}).get('Item', [])
            
            for item in callback_metadata:
                if item.get('Name') == 'MpesaReceiptNumber':
                    payment.mpesa_receipt_number = item.get('Value')
            
            payment.status = 'completed'
            payment.completed_at = datetime.utcnow()
        else:
            payment.status = 'failed'
        
        db.session.commit()
    
    return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'}), 200

@payments_bp.route('/trip/<int:trip_id>/payments', methods=['GET'])
@jwt_required()
def get_trip_payments(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter(
        Trip.id == trip_id,
        (Trip.rider_id == user_id) | (Trip.driver_id == user_id)
    ).first()
    
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404
    
    payments = Payment.query.filter_by(trip_id=trip_id).all()
    return jsonify([payment.to_dict() for payment in payments]), 200