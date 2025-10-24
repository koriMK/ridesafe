import { useState } from 'react';
import { Clock, DollarSign, Car } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NairobiMap } from '../components/NairobiMap';
import { LocationInput } from '../components/LocationInput';
import apiService from '../services/api';

export const RequestTrip = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [fareEstimate, setFareEstimate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviceType, setServiceType] = useState('designated');

  const calculateFare = async () => {
    if (!pickup || !dropoff) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.calculateFare(pickup, dropoff);
      setFareEstimate({
        amount: response.fare_estimate,
        distance: response.distance_km,
        duration: response.duration_minutes
      });
    } catch (err) {
      setError(err.message);
      // Fallback calculation
      const distance = Math.random() * 20 + 5;
      const estimate = 200 + (distance * 15);
      setFareEstimate({
        amount: Math.round(estimate),
        distance: distance.toFixed(1),
        duration: Math.round(distance * 2.5)
      });
    } finally {
      setLoading(false);
    }
  };

  const requestTrip = async () => {
    if (!fareEstimate) return;
    
    setLoading(true);
    setError('');
    
    try {
      const tripData = {
        pickup_location: pickup,
        dropoff_location: dropoff,
        service_type: serviceType
      };
      
      const response = await apiService.requestTrip(tripData);
      window.location.href = `/ride/${response.id}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <div className="card" style={{ padding: 0, height: '400px' }}>
            <NairobiMap pickup={pickup} dropoff={dropoff} />
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '800px' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Request a Ride</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Pickup Location</label>
                <LocationInput
                  value={pickup}
                  onChange={setPickup}
                  placeholder="Search pickup location in Nairobi"
                  icon="pickup"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Drop-off Location</label>
                <LocationInput
                  value={dropoff}
                  onChange={setDropoff}
                  placeholder="Search destination in Nairobi"
                  icon="dropoff"
                />
              </div>

              <Button onClick={calculateFare} variant="secondary" style={{ width: '100%' }} disabled={!pickup || !dropoff || loading}>
                {loading ? 'Calculating...' : 'Calculate Fare'}
              </Button>
            </div>

            {fareEstimate && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Fare Estimate</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}><Car size={16} style={{ marginRight: '0.5rem' }} />Distance</span>
                    <span>{fareEstimate.distance} km</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}><Clock size={16} style={{ marginRight: '0.5rem' }} />Duration</span>
                    <span>{fareEstimate.duration} min</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.125rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}><DollarSign size={16} style={{ marginRight: '0.5rem' }} />Total</span>
                    <span>KSh {fareEstimate.amount}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Service Type</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                  <input type="radio" name="service" value="designated" checked={serviceType === 'designated'} onChange={(e) => setServiceType(e.target.value)} style={{ marginRight: '0.75rem' }} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Designated Driver</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Driver uses your car</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                  <input type="radio" name="service" value="ride" checked={serviceType === 'ride'} onChange={(e) => setServiceType(e.target.value)} style={{ marginRight: '0.75rem' }} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Ride Service</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Driver provides vehicle</div>
                  </div>
                </label>
              </div>
            </div>

            <Button onClick={requestTrip} style={{ width: '100%', marginTop: '1.5rem' }} size="lg" disabled={!fareEstimate || loading}>
              {loading ? 'Requesting...' : 'Request Driver'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};