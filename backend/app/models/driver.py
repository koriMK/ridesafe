from app import db
from datetime import datetime

class DriverProfile(db.Model):
    __tablename__ = 'driver_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    license_expiry = db.Column(db.Date, nullable=False)
    id_number = db.Column(db.String(20), unique=True, nullable=False)
    
    vehicle_make = db.Column(db.String(50), nullable=True)
    vehicle_model = db.Column(db.String(50), nullable=True)
    vehicle_year = db.Column(db.Integer, nullable=True)
    vehicle_plate = db.Column(db.String(20), nullable=True)
    
    approval_status = db.Column(db.String(20), nullable=False, default='pending')
    is_available = db.Column(db.Boolean, default=False)
    
    current_lat = db.Column(db.Float, nullable=True)
    current_lng = db.Column(db.Float, nullable=True)
    last_location_update = db.Column(db.DateTime, nullable=True)
     
    total_trips = db.Column(db.Integer, default=0)
    average_rating = db.Column(db.Float, default=0.0)
    total_earnings = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'license_number': self.license_number,
            'approval_status': self.approval_status,
            'is_available': self.is_available,
            'vehicle_make': self.vehicle_make,
            'vehicle_model': self.vehicle_model,
            'vehicle_plate': self.vehicle_plate,
            'total_trips': self.total_trips,
            'average_rating': self.average_rating,
            'total_earnings': self.total_earnings
        }
