from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.trip import Trip
from app.models.user import User
from app.utils.maps import calculate_distance_and_fare, geocode_address
import random

trips_bp = Blueprint('trips', __name__)

@trips_bp.route('/request', methods=['POST'])
@jwt_required()
def request_trip():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    pickup_location = data.get('pickup_location')
    dropoff_location = data.get('dropoff_location')
    service_type = data.get('service_type', 'designated')
    
    if not pickup_location or not dropoff_location:
        return jsonify({'error': 'Pickup and dropoff locations required'}), 400
    
    # Geocode addresses (implement with Google Maps)
    pickup_coords = geocode_address(pickup_location)
    dropoff_coords = geocode_address(dropoff_location)
    
    # Calculate fare
    distance_km, duration_min, fare = calculate_distance_and_fare(pickup_coords, dropoff_coords)
    
    trip = Trip(
        rider_id=user_id,
        pickup_location=pickup_location,
        pickup_lat=pickup_coords['lat'] if pickup_coords else None,
        pickup_lng=pickup_coords['lng'] if pickup_coords else None,
        dropoff_location=dropoff_location,
        dropoff_lat=dropoff_coords['lat'] if dropoff_coords else None,
        dropoff_lng=dropoff_coords['lng'] if dropoff_coords else None,
        service_type=service_type,
        fare_estimate=fare,
        distance_km=distance_km,
        duration_minutes=duration_min
    )
    
    db.session.add(trip)
    db.session.commit()
    
    return jsonify(trip.to_dict()), 201

@trips_bp.route('/calculate-fare', methods=['POST'])
@jwt_required()
def calculate_fare():
    data = request.get_json()
    pickup_location = data.get('pickup_location')
    dropoff_location = data.get('dropoff_location')
    
    pickup_coords = geocode_address(pickup_location)
    dropoff_coords = geocode_address(dropoff_location)
    
    distance_km, duration_min, fare = calculate_distance_and_fare(pickup_coords, dropoff_coords)
    
    return jsonify({
        'distance_km': distance_km,
        'duration_minutes': duration_min,
        'fare_estimate': fare
    }), 200

@trips_bp.route('/my-trips', methods=['GET'])
@jwt_required()
def get_my_trips():
    user_id = get_jwt_identity()
    trips = Trip.query.filter_by(rider_id=user_id).order_by(Trip.requested_at.desc()).all()
    return jsonify([trip.to_dict() for trip in trips]), 200

@trips_bp.route('/<int:trip_id>', methods=['GET'])
@jwt_required()
def get_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter(
        Trip.id == trip_id,
        (Trip.rider_id == user_id) | (Trip.driver_id == user_id)
    ).first()
    
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404
    
    return jsonify(trip.to_dict()), 200

@trips_bp.route('/<int:trip_id>/accept', methods=['POST'])
@jwt_required()
def accept_trip(trip_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'driver':
        return jsonify({'error': 'Only drivers can accept trips'}), 403
    
    trip = Trip.query.filter_by(id=trip_id, status='pending').first()
    if not trip:
        return jsonify({'error': 'Trip not available'}), 404
    
    trip.driver_id = user_id
    trip.status = 'accepted'
    db.session.commit()
    
    return jsonify(trip.to_dict()), 200

@trips_bp.route('/<int:trip_id>/complete', methods=['POST'])
@jwt_required()
def complete_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, driver_id=user_id).first()
    
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404
    
    data = request.get_json()
    final_fare = data.get('final_fare', trip.fare_estimate)
    
    trip.status = 'completed'
    trip.final_fare = final_fare
    trip.completed_at = db.func.now()
    db.session.commit()
    
    return jsonify(trip.to_dict()), 200

@trips_bp.route('/available', methods=['GET'])
@jwt_required()
def get_available_trips():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'driver':
        return jsonify({'error': 'Only drivers can view available trips'}), 403
    
    trips = Trip.query.filter_by(status='pending').order_by(Trip.requested_at.desc()).limit(10).all()
    return jsonify([trip.to_dict() for trip in trips]), 200