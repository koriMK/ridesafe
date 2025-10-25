from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.payment import OTPVerification
from app.utils.sms import send_otp
import random
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/send-otp', methods=['POST'])
def send_otp_code():
    data = request.get_json()
    phone = data.get('phone')
    
    if not phone:
        return jsonify({'error': 'Phone number required'}), 400
    
    # Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Save OTP to database
    otp = OTPVerification(
        phone=phone,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.session.add(otp)
    db.session.commit()
    
    # Send SMS (implement with Twilio)
    send_otp(phone, otp_code)
    
    return jsonify({'message': 'OTP sent successfully'}), 200

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    phone = data.get('phone')
    otp_code = data.get('otp_code')
    
    otp = OTPVerification.query.filter_by(
        phone=phone, 
        otp_code=otp_code,
        is_verified=False
    ).first()
    
    if not otp or otp.expires_at < datetime.utcnow():
        return jsonify({'error': 'Invalid or expired OTP'}), 400
    
    otp.is_verified = True
    db.session.commit()
    
    # Check if user exists
    user = User.query.filter_by(phone=phone).first()
    if not user:
        user = User(phone=phone, is_verified=True)
        db.session.add(user)
        db.session.commit()
    else:
        user.is_verified = True
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    role = data.get('role', 'rider')
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(email=email, phone=phone, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200