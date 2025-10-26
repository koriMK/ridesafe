import { MapPin, Navigation } from 'lucide-react';

export const MapContainer = ({ pickup = null, dropoff = null, driverLocation = null, className = '' }) => {
  return (
    <div className={`map-container ${className}`}>
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {pickup && (
          <div style={{ position: 'absolute', top: '25%', left: '33%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ background: 'var(--success)', color: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-lg)' }}>
              <MapPin size={24} />
            </div>
            <div style={{ background: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', fontSize: '0.75rem', marginTop: '0.25rem', whiteSpace: 'nowrap' }}>
              Pickup: {pickup}
            </div>
          </div>
        )}

        {dropoff && (
          <div style={{ position: 'absolute', top: '75%', right: '33%', transform: 'translate(50%, -50%)' }}>
            <div style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-lg)' }}>
              <MapPin size={24} />
            </div>
            <div style={{ background: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', fontSize: '0.75rem', marginTop: '0.25rem', whiteSpace: 'nowrap' }}>
              Dropoff: {dropoff}
            </div>
          </div>
        )}

        {driverLocation && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-lg)', animation: 'pulse 2s infinite' }}>
              <Navigation size={24} />
            </div>
            <div style={{ background: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', fontSize: '0.75rem', marginTop: '0.25rem', whiteSpace: 'nowrap' }}>
              Driver Location
            </div>
          </div>
        )}

        {pickup && dropoff && (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path d="M 33% 25% Q 50% 40% 66% 75%" stroke="var(--primary)" strokeWidth="3" strokeDasharray="8,4" fill="none" style={{ opacity: 0.8 }} />
          </svg>
        )}

        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(255, 255, 255, 0.9)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
          🗺️ Replace with Google Maps API
        </div>
      </div>
    </div>
  );
};