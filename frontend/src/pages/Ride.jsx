import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, MessageCircle, Star, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NairobiMap } from '../components/NairobiMap';
import { PaymentModal } from '../components/PaymentModal';
import apiService from '../services/api';

export const Ride = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    loadTrip();
    const interval = setInterval(loadTrip, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [id]);

  const loadTrip = async () => {
    try {
      const response = await apiService.getTrip(id);
      setTrip(response);
      
      if (response.status === 'completed' && !response.rider_rating) {
        setShowRating(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    loadTrip();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading trip details...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Trip Not Found</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>{error || 'The requested trip could not be found.'}</p>
          <Button>
            <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Back to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--warning)';
      case 'accepted': return 'var(--info)';
      case 'in_progress': return 'var(--primary)';
      case 'completed': return 'var(--success)';
      case 'cancelled': return 'var(--danger)';
      default: return 'var(--gray-500)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Finding Driver...';
      case 'accepted': return 'Driver Assigned';
      case 'in_progress': return 'Trip in Progress';
      case 'completed': return 'Trip Completed';
      case 'cancelled': return 'Trip Cancelled';
      default: return status;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Map Section */}
        <div style={{ gridColumn: window.innerWidth >= 1024 ? 'span 2' : 'span 1' }}>
          <div className="card" style={{ padding: 0, height: '400px' }}>
            <NairobiMap 
              pickup={trip.pickup_location}
              dropoff={trip.dropoff_location}
              driverLocation={trip.status === 'in_progress' || trip.status === 'accepted'}
            />
          </div>
        </div>

        {/* Trip Details */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Trip Details</h2>
              <span style={{ 
                padding: '0.5rem 1rem', 
                background: getStatusColor(trip.status), 
                color: 'white', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.875rem', 
                fontWeight: '500' 
              }}>
                {getStatusText(trip.status)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Pickup</div>
                <div style={{ fontWeight: '500' }}>{trip.pickup_location}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Drop-off</div>
                <div style={{ fontWeight: '500' }}>{trip.dropoff_location}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Distance</div>
                  <div style={{ fontWeight: '500' }}>{trip.distance_km} km</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Fare</div>
                  <div style={{ fontWeight: '500' }}>KSh {trip.final_fare || trip.fare_estimate}</div>
                </div>
              </div>
            </div>

            {trip.driver_id && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Driver Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '3rem', height: '3rem', background: 'var(--gray-200)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>D</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: '500' }}>Driver #{trip.driver_id}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Professional Driver</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="secondary" size="sm" style={{ flex: 1 }}>
                    <Phone size={16} style={{ marginRight: '0.5rem' }} />
                    Call
                  </Button>
                  <Button variant="secondary" size="sm" style={{ flex: 1 }}>
                    <MessageCircle size={16} style={{ marginRight: '0.5rem' }} />
                    Chat
                  </Button>
                </div>
              </div>
            )}

            {trip.status === 'completed' && !trip.payment && (
              <Button onClick={() => setShowPayment(true)} style={{ width: '100%', marginBottom: '1rem' }}>
                <CreditCard size={16} style={{ marginRight: '0.5rem' }} />
                Pay Now - KSh {trip.final_fare || trip.fare_estimate}
              </Button>
            )}

            {trip.status === 'completed' && trip.payment && (
              <div style={{ padding: '1rem', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', color: '#166534', textAlign: 'center' }}>
                ✓ Payment Completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        trip={trip}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Rating Modal */}
      {showRating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '28rem', width: '90%', margin: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Rate Your Trip</h2>
            <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              How was your experience with the driver?
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Star 
                    size={32} 
                    fill={star <= rating ? 'var(--warning)' : 'none'} 
                    color={star <= rating ? 'var(--warning)' : 'var(--gray-300)'} 
                  />
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="secondary" onClick={() => setShowRating(false)} style={{ flex: 1 }}>
                Skip
              </Button>
              <Button onClick={() => setShowRating(false)} disabled={rating === 0} style={{ flex: 1 }}>
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};