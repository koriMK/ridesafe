import { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

export const LocationInput = ({ 
  value, 
  onChange, 
  placeholder, 
  icon = 'pickup',
  className = '' 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasGoogleMaps, setHasGoogleMaps] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Check Google Maps availability
  useEffect(() => {
    const checkGoogle = () => {
      setHasGoogleMaps(!!window.google?.maps?.places);
    };
    
    if (window.google) {
      checkGoogle();
    } else {
      const timer = setTimeout(checkGoogle, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!hasGoogleMaps || !window.google || !inputRef.current || autocompleteRef.current) return;
    
    if (window.google && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(-1.444471, 36.752243), // SW Nairobi
          new window.google.maps.LatLng(-1.163332, 37.103882)  // NE Nairobi
        ),
        componentRestrictions: { country: 'ke' },
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['establishment', 'geocode']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          onChange(place.formatted_address);
          setShowSuggestions(false);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [onChange]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Always show Nairobi location suggestions
    if (inputValue.length > 2) {
      const nairobiLocations = [
        'Westlands, Nairobi',
        'CBD, Nairobi', 
        'Karen, Nairobi',
        'Kilimani, Nairobi',
        'Kasarani, Nairobi',
        'Eastlands, Nairobi',
        'Kileleshwa, Nairobi',
        'Lavington, Nairobi',
        'Parklands, Nairobi',
        'South B, Nairobi',
        'South C, Nairobi',
        'Donholm, Nairobi',
        'Embakasi, Nairobi',
        'Langata, Nairobi'
      ].filter(loc => loc.toLowerCase().includes(inputValue.toLowerCase()));
      
      setSuggestions(nairobiLocations.map((loc, i) => ({
        place_id: i,
        description: loc,
        structured_formatting: {
          main_text: loc.split(',')[0],
          secondary_text: 'Nairobi, Kenya'
        }
      })));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    if (hasGoogleMaps && inputValue.length > 2 && window.google) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({
        input: inputValue,
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(-1.444471, 36.752243),
          new window.google.maps.LatLng(-1.163332, 37.103882)
        ),
        componentRestrictions: { country: 'ke' }
      }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions || []);
          setShowSuggestions(true);
        }
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const iconColor = icon === 'pickup' ? 'var(--success)' : 'var(--danger)';

  return (
    <div style={{ position: 'relative' }} className={className}>
      <div style={{ position: 'relative' }}>
        <MapPin 
          size={20} 
          color={iconColor}
          style={{ 
            position: 'absolute', 
            left: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 1
          }} 
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length > 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{ 
            width: '100%', 
            paddingLeft: '2.75rem', 
            paddingRight: '2.5rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '1rem', 
            outline: 'none' 
          }}
          placeholder={placeholder}
        />
        <Search 
          size={16} 
          color="var(--gray-400)"
          style={{ 
            position: 'absolute', 
            right: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)'
          }} 
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid var(--border)',
          borderTop: 'none',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                borderBottom: '1px solid var(--gray-100)',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--gray-50)'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
            >
              <div style={{ fontWeight: '500' }}>{suggestion.structured_formatting.main_text}</div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.75rem' }}>
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};