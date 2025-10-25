import { useState, useEffect } from 'react';
import { Users, Car, DollarSign, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { user, isRole } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalDrivers: 89,
    totalTrips: 3420,
    totalRevenue: 125000,
    pendingApplications: 12
  });

  // Redirect if not admin
  if (!isRole('admin')) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--gray-600)' }}>Manage SafeRide platform operations</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Users size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stats.totalUsers}</div>
            <div style={{ color: 'var(--gray-600)' }}>Total Users</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <Car size={32} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.5rem' }}>{stats.totalDrivers}</div>
            <div style={{ color: 'var(--gray-600)' }}>Active Drivers</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <TrendingUp size={32} color="var(--info)" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--info)', marginBottom: '0.5rem' }}>{stats.totalTrips}</div>
            <div style={{ color: 'var(--gray-600)' }}>Total Trips</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <DollarSign size={32} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)', marginBottom: '0.5rem' }}>KSh {stats.totalRevenue.toLocaleString()}</div>
            <div style={{ color: 'var(--gray-600)' }}>Total Revenue</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pending Driver Applications</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pendingApplications}</span>
              <Clock size={24} color="var(--warning)" />
            </div>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>Applications waiting for review</p>
            <Button style={{ width: '100%' }}>Review Applications</Button>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>System Status</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="var(--success)" />
                <span style={{ fontSize: '0.875rem' }}>API Services: Online</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="var(--success)" />
                <span style={{ fontSize: '0.875rem' }}>Payment Gateway: Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="var(--success)" />
                <span style={{ fontSize: '0.875rem' }}>SMS Service: Connected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="var(--success)" />
                <span style={{ fontSize: '0.875rem' }}>Maps API: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};