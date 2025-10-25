import { useEffect, useRef, useState } from 'react';

export const NairobiMap = ({ pickup, dropoff, driverLocation, className = '' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Nairobi locations database
  const nairobiLocations = {
    'westlands': { lat: -1.2676, lng: 36.8108, name: 'Westlands' },
    'cbd': { lat: -1.2921, lng: 36.8219, name: 'CBD' },
    'karen': { lat: -1.3197, lng: 36.6859, name: 'Karen' },
    'kilimani': { lat: -1.2921, lng: 36.7872, name: 'Kilimani' },
    'kasarani': { lat: -1.2258, lng: 36.8986, name: 'Kasarani' },
    'eastlands': { lat: -1.2921, lng: 36.8919, name: 'Eastlands' },
    'kileleshwa': { lat: -1.2676, lng: 36.7872, name: 'Kileleshwa' },
    'lavington': { lat: -1.2676, lng: 36.7672, name: 'Lavington' },
    'parklands': { lat: -1.2558, lng: 36.8581, name: 'Parklands' },
    'south b': { lat: -1.3197, lng: 36.8319, name: 'South B' },
    'south c': { lat: -1.3297, lng: 36.8419, name: 'South C' },
    'donholm': { lat: -1.2797, lng: 36.8919, name: 'Donholm' },
    'embakasi': { lat: -1.3197, lng: 36.8919, name: 'Embakasi' },
    'langata': { lat: -1.3697, lng: 36.7519, name: 'Langata' }
  };

  const getLocationCoords = (locationName) => {
    if (!locationName) return null;
    const key = locationName.toLowerCase().split(',')[0].trim();
    
    // Try exact match first
    if (nairobiLocations[key]) {
      return nairobiLocations[key];
    }
    
    // Try partial match
    const partialMatch = Object.keys(nairobiLocations).find(loc => 
      loc.includes(key) || key.includes(loc)
    );
    
    return partialMatch ? nairobiLocations[partialMatch] : null;
  };

  useEffect(() => {
    if (!window.L || !mapRef.current || map) return;

    const newMap = window.L.map(mapRef.current, {
      center: [-1.2921, 36.8219], // Nairobi center
      zoom: 12,
      zoomControl: true
    });

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!map || !window.L) return;

    // Clear existing markers efficiently
    markers.forEach(marker => {
      try {
        map.removeLayer(marker);
      } catch (e) {
        // Ignore if marker already removed
      }
    });
    const newMarkers = [];

    const pickupCoords = getLocationCoords(pickup);
    const dropoffCoords = getLocationCoords(dropoff);

    // Add pickup marker
    if (pickupCoords) {
      const pickupIcon = window.L.divIcon({
        html: `<div style="background: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">P</div>`,
        className: 'pickup-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });

      const marker = window.L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>Pickup Location</b><br/>${pickupCoords.name}`);
      
      newMarkers.push(marker);
    }

    // Add dropoff marker
    if (dropoffCoords) {
      const dropoffIcon = window.L.divIcon({
        html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">D</div>`,
        className: 'dropoff-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });

      const marker = window.L.marker([dropoffCoords.lat, dropoffCoords.lng], { icon: dropoffIcon })
        .addTo(map)
        .bindPopup(`<b>Dropoff Location</b><br/>${dropoffCoords.name}`);
      
      newMarkers.push(marker);
    }

    // Add driver marker
    if (driverLocation && pickupCoords) {
      const driverIcon = window.L.divIcon({
        html: `<div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); animation: pulse 2s infinite; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">🚗</div>`,
        className: 'driver-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      // Place driver near pickup for demo
      const driverLat = pickupCoords.lat + (Math.random() - 0.5) * 0.01;
      const driverLng = pickupCoords.lng + (Math.random() - 0.5) * 0.01;
      
      const marker = window.L.marker([driverLat, driverLng], { icon: driverIcon })
        .addTo(map)
        .bindPopup('<b>Driver Location</b><br/>On the way!');
      
      newMarkers.push(marker);
    }

    // Draw route line and fit bounds
    if (pickupCoords && dropoffCoords) {
      const routeLine = window.L.polyline([
        [pickupCoords.lat, pickupCoords.lng],
        [dropoffCoords.lat, dropoffCoords.lng]
      ], {
        color: '#3b82f6',
        weight: 5,
        opacity: 0.7,
        dashArray: '15, 10'
      }).addTo(map);
      
      newMarkers.push(routeLine);
      
      // Fit map to show route with padding
      const bounds = window.L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [dropoffCoords.lat, dropoffCoords.lng]
      ]);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (pickupCoords) {
      // Center on pickup if only pickup is set
      map.setView([pickupCoords.lat, pickupCoords.lng], 14);
    } else if (dropoffCoords) {
      // Center on dropoff if only dropoff is set
      map.setView([dropoffCoords.lat, dropoffCoords.lng], 14);
    }

    setMarkers(newMarkers);
  }, [map, pickup, dropoff, driverLocation]);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};