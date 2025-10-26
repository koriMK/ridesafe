import { Car, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: 'var(--gray-900)', color: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Car size={32} color="var(--primary)" />
            <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>SafeRide</span>
          </div>
          <p style={{ color: 'var(--gray-300)', marginBottom: '1rem' }}>Safe, reliable transportation with designated drivers. Your safety is our priority.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Facebook size={20} style={{ color: 'var(--gray-400)', cursor: 'pointer' }} />
            <Twitter size={20} style={{ color: 'var(--gray-400)', cursor: 'pointer' }} />
            <Instagram size={20} style={{ color: 'var(--gray-400)', cursor: 'pointer' }} />
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/about" style={{ color: 'var(--gray-300)', textDecoration: 'none' }}>About Us</a>
            <a href="/driver" style={{ color: 'var(--gray-300)', textDecoration: 'none' }}>Become a Driver</a>
            <a href="/support" style={{ color: 'var(--gray-300)', textDecoration: 'none' }}>Support</a>
            <a href="/privacy" style={{ color: 'var(--gray-300)', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Phone size={16} style={{ marginRight: '0.5rem' }} />
              <span style={{ color: 'var(--gray-300)' }}>+254 700 000 000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ marginRight: '0.5rem' }} />
              <span style={{ color: 'var(--gray-300)' }}>support@saferide.co.ke</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid var(--gray-800)', padding: '2rem 1rem', textAlign: 'center', maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{ color: 'var(--gray-400)' }}>© 2024 SafeRide. All rights reserved. Safe Transportation Platform.</p>
      </div>
    </footer>
  );
};