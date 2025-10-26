import { useState } from 'react';
import { Menu, X, Car, User, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isRole } = useAuth();

  return (
    <header style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Car size={32} color="var(--primary)" />
          <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gray-900)' }}>SafeRide</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="/" style={{ color: 'var(--gray-700)', textDecoration: 'none' }}>Home</a>
          <a href="/about" style={{ color: 'var(--gray-700)', textDecoration: 'none' }}>About</a>
          <a href="/driver" style={{ color: 'var(--gray-700)', textDecoration: 'none' }}>Drive with Us</a>
          <a href="/support" style={{ color: 'var(--gray-700)', textDecoration: 'none' }}>Support</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {!isAuthenticated ? (
            <>
              <a href="/login" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Sign In</Button>
              </a>
              <a href="/signup" style={{ textDecoration: 'none' }}>
                <Button>Get Started</Button>
              </a>
            </>
          ) : (
            <>
              {isRole('rider') && (
                <a href="/request-trip" style={{ textDecoration: 'none' }}>
                  <Button>Request Ride</Button>
                </a>
              )}
              {isRole('driver') && (
                <a href="/dashboard" style={{ textDecoration: 'none' }}>
                  <Button>Driver Dashboard</Button>
                </a>
              )}
              {isRole('admin') && (
                <a href="/admin" style={{ textDecoration: 'none' }}>
                  <Button>Admin Panel</Button>
                </a>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} />
                <span style={{ fontSize: '0.875rem' }}>{user?.role}</span>
                <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-700)' }}>
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};