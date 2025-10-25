import { useState } from 'react';
import { User, Car, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SignupForm } from './SignupForm';

export const Signup = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) return;
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedRole('');
  };

  if (showForm) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '28rem', width: '100%' }}>
          <SignupForm role={selectedRole} onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '32rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gray-900)' }}>Join SafeRide</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--gray-600)' }}>Choose your role to get started</p>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div onClick={() => setSelectedRole('rider')} style={{ padding: '1.5rem', border: selectedRole === 'rider' ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: selectedRole === 'rider' ? '#dbeafe' : 'white' }}>
              <User size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Rider</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Book safe rides and designated drivers</p>
            </div>

            <div onClick={() => setSelectedRole('driver')} style={{ padding: '1.5rem', border: selectedRole === 'driver' ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: selectedRole === 'driver' ? '#dbeafe' : 'white' }}>
              <Car size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Driver</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Earn money providing safe transportation</p>
            </div>

            <div onClick={() => setSelectedRole('admin')} style={{ padding: '1.5rem', border: selectedRole === 'admin' ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: selectedRole === 'admin' ? '#dbeafe' : 'white' }}>
              <Shield size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Admin</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Manage platform operations and safety</p>
            </div>
          </div>

          <Button onClick={handleContinue} disabled={!selectedRole} style={{ width: '100%' }}>
            Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}
          </Button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              Already have an account? <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};