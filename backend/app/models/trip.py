from app import db
from datetime import datetime

class Trip(db.Model):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    rider_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    pickup_location = db.Column(db.String(255), nullable=False)
    pickup_lat = db.Column(db.Float, nullable=True)
    pickup_lng = db.Column(db.Float, nullable=True)
    
    dropoff_location = db.Column(db.String(255), nullable=False)
    dropoff_lat = db.Column(db.Float, nullable=True)
    dropoff_lng = db.Column(db.Float, nullable=True)
    
    service_type = db.Column(db.String(20), nullable=False, default='designated')
    status = db.Column(db.String(20), nullable=False, default='pending')
    
    fare_estimate = db.Column(db.Float, nullable=True)
    final_fare = db.Column(db.Float, nullable=True)
    distance_km = db.Column(db.Float, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=True)
    
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    rider_rating = db.Column(db.Integer, nullable=True)  # 1-5
    driver_rating = db.Column(db.Integer, nullable=True)  # 1-5
    
    # Relationships
    payment = db.relationship('Payment', backref='trip', uselist=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'rider_id': self.rider_id,
            'driver_id': self.driver_id,
            'pickup_location': self.pickup_location,
            'dropoff_location': self.dropoff_location,
            'service_type': self.service_type,
            'status': self.status,
            'fare_estimate': self.fare_estimate,
            'final_fare': self.final_fare,
            'distance_km': self.distance_km,
            'duration_minutes': self.duration_minutes,
            'requested_at': self.requested_at.isoformat() if self.requested_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'rider_rating': self.rider_rating,
            'driver_rating': self.driver_rating
        }