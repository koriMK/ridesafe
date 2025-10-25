from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.driver import DriverProfile
from datetime import datetime

drivers_bp = Blueprint('drivers', __name__)

@drivers_bp.route('/apply', methods=['POST'])
@jwt_required()
def apply_as_driver():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'driver':
        user.role = 'driver'
    
    data = request.get_json()
    
    driver_profile = DriverProfile(
        user_id=user_id,
        license_number=data.get('license_number'),
        license_expiry=datetime.strptime(data.get('license_expiry'), '%Y-%m-%d').date(),
        id_number=data.get('id_number'),
        vehicle_make=data.get('vehicle_make'),
        vehicle_model=data.get('vehicle_model'),
        vehicle_year=data.get('vehicle_year'),
        vehicle_plate=data.get('vehicle_plate'),
        approval_status='under_review'
    )
    
    db.session.add(driver_profile)
    db.session.commit()
    
    return jsonify(driver_profile.to_dict()), 201

@drivers_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_driver_profile():
    user_id = get_jwt_identity()
    profile = DriverProfile.query.filter_by(user_id=user_id).first()
    
    if not profile:
        return jsonify({'error': 'Driver profile not found'}), 404
    
    return jsonify(profile.to_dict()), 200

@drivers_bp.route('/update-location', methods=['POST'])
@jwt_required()
def update_location():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    profile = DriverProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'error': 'Driver profile not found'}), 404
    
    profile.current_lat = data.get('lat')
    profile.current_lng = data.get('lng')
    profile.last_location_update = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Location updated'}), 200

@drivers_bp.route('/toggle-availability', methods=['POST'])
@jwt_required()
def toggle_availability():
    user_id = get_jwt_identity()
    profile = DriverProfile.query.filter_by(user_id=user_id).first()
    
    if not profile:
        return jsonify({'error': 'Driver profile not found'}), 404
    
    profile.is_available = not profile.is_available
    db.session.commit()
    
    return jsonify({'is_available': profile.is_available}), 200