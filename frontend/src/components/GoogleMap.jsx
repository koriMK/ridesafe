import { useEffect, useRef, useState } from 'react';

export const GoogleMap = ({ pickup, dropoff, driverLocation, onLocationSelect, className = '' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [mapError, setMapError] = useState(false);

  // Check if Google Maps is available
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!window.google) {
        setMapError(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fallback map when Google Maps fails
  if (mapError || !window.google) {
    return (
      <div className={className} style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ textAlign: 'center', color: 'var(--gray-600)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
          <div>Nairobi Map</div>
          {pickup && <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>📍 Pickup: {pickup}</div>}
          {dropoff && <div style={{ fontSize: '0.875rem' }}>🎯 Dropoff: {dropoff}</div>}
          <div style={{ fontSize: '0.75rem', marginTop: '1rem', opacity: 0.7 }}>Google Maps API key required</div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!window.google) return;
    
    if (window.google && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: -1.2921, lng: 36.8219 }, // Nairobi center
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      setMap(newMap);

      // Add click listener for location selection
      if (onLocationSelect) {
        newMap.addListener('click', (event) => {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: event.latLng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              onLocationSelect({
                address: results[0].formatted_address,
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              });
            }
          });
        });
      }
    }
  }, [map, onLocationSelect]);

  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    Object.values(markers).forEach(marker => marker.setMap(null));
    const newMarkers = {};

    // Add pickup marker
    if (pickup) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: pickup }, (results, status) => {
        if (status === 'OK') {
          const marker = new window.google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            title: 'Pickup Location',
            icon: {
              path: window.google.maps.SymbolPath.MARKER,
              fillColor: '#10b981',
              strokeColor: '#059669',
              scale: 8
            }
          });
          newMarkers.pickup = marker;
          map.setCenter(results[0].geometry.location);
        }
      });
    }

    // Add dropoff marker
    if (dropoff) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: dropoff }, (results, status) => {
        if (status === 'OK') {
          const marker = new window.google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            title: 'Dropoff Location',
            icon: {
              path: window.google.maps.SymbolPath.MARKER,
              fillColor: '#ef4444',
              strokeColor: '#dc2626',
              scale: 8
            }
          });
          newMarkers.dropoff = marker;
        }
      });
    }

    // Add driver marker
    if (driverLocation) {
      const marker = new window.google.maps.Marker({
        position: { lat: -1.2921, lng: 36.8219 }, // Mock driver location in Nairobi
        map: map,
        title: 'Driver Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#3b82f6',
          strokeColor: '#2563eb',
          scale: 10
        },
        animation: window.google.maps.Animation.BOUNCE
      });
      newMarkers.driver = marker;
    }

    setMarkers(newMarkers);
  }, [map, pickup, dropoff, driverLocation]);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
    </div>
  );
};