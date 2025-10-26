import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import apiService from '../services/api';

export const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    averageRating: 0,
    thisMonth: 0
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await apiService.getMyTrips();
      setTrips(response);
      
      // Calculate stats
      const totalTrips = response.length;
      const totalSpent = response.reduce((sum, trip) => sum + (trip.final_fare || trip.fare_estimate || 0), 0);
      const completedTrips = response.filter(trip => trip.status === 'completed');
      const averageRating = completedTrips.length > 0 
        ? completedTrips.reduce((sum, trip) => sum + (trip.driver_rating || 0), 0) / completedTrips.length 
        : 0;
      const thisMonth = response.filter(trip => {
        const tripDate = new Date(trip.requested_at);
        const now = new Date();
        return tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear();
      }).length;
      
      setStats({ totalTrips, totalSpent, averageRating, thisMonth });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gray-900)' }}>Dashboard</h1>
          <Button>
            <a href="/request-trip" style={{ textDecoration: 'none', color: 'inherit' }}>Request New Trip</a>
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stats.totalTrips}</div>
            <div style={{ color: 'var(--gray-600)' }}>Total Trips</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.5rem' }}>KSh {stats.totalSpent.toLocaleString()}</div>
            <div style={{ color: 'var(--gray-600)' }}>Total Spent</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)', marginBottom: '0.5rem' }}>{stats.averageRating.toFixed(1)}</div>
            <div style={{ color: 'var(--gray-600)' }}>Average Rating</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--info)', marginBottom: '0.5rem' }}>{stats.thisMonth}</div>
            <div style={{ color: 'var(--gray-600)' }}>This Month</div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Trips</h2>
          {error && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
                No trips yet. <a href="/request-trip" style={{ color: 'var(--primary)' }}>Request your first ride!</a>
              </div>
            ) : (
              trips.map(trip => (
                <div key={trip.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} color="var(--success)" />
                      <span style={{ fontWeight: '500' }}>{trip.pickup_location}</span>
                      <span style={{ color: 'var(--gray-400)' }}>→</span>
                      <MapPin size={16} color="var(--danger)" />
                      <span style={{ fontWeight: '500' }}>{trip.dropoff_location}</span>
                    </div>
                    <span style={{ padding: '0.25rem 0.5rem', background: trip.status === 'completed' ? 'var(--success)' : 'var(--warning)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                      {trip.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {formatDate(trip.requested_at)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        {formatTime(trip.requested_at)}
                      </span>
                      {trip.driver_rating && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={14} fill="var(--warning)" color="var(--warning)" />
                          {trip.driver_rating}
                        </span>
                      )}
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                      <DollarSign size={14} />
                      KSh {trip.final_fare || trip.fare_estimate || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};