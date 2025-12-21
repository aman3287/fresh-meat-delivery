import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiNavigation, FiClock, FiTruck } from 'react-icons/fi';

const LiveTrackingMap = ({ order }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const deliveryMarkerRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Initialize map
  useEffect(() => {
    if (!window.google && API_KEY) {
      loadGoogleMapsScript();
    } else if (window.google) {
      initializeMap();
    } else {
      // Demo mode without API key
      setError('Google Maps API key not configured. Using demo mode.');
      initializeDemoMode();
    }
  }, []);

  // Update delivery partner location in real-time
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    // Poll for location updates every 5 seconds
    const interval = setInterval(() => {
      fetchDeliveryPartnerLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, [order]);

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => initializeMap();
    script.onerror = () => {
      setError('Failed to load Google Maps. Using demo mode.');
      initializeDemoMode();
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // Customer location from order
      const customerLoc = {
        lat: order.deliveryAddress.location?.coordinates[1] || 28.7041,
        lng: order.deliveryAddress.location?.coordinates[0] || 77.1025
      };

      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: customerLoc,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(newMap);
      setCustomerLocation(customerLoc);

      // Add customer marker
      const marker = new window.google.maps.Marker({
        position: customerLoc,
        map: newMap,
        title: 'Delivery Address',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
              <path fill="#DC2626" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });
      customerMarkerRef.current = marker;

      setIsLoading(false);
      fetchDeliveryPartnerLocation();
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Map initialization failed. Using demo mode.');
      initializeDemoMode();
    }
  };

  const initializeDemoMode = () => {
    setIsLoading(false);
    // Set demo locations
    setCustomerLocation({
      lat: 28.7041,
      lng: 77.1025
    });
    setDeliveryLocation({
      lat: 28.7141,
      lng: 77.1125
    });
    setEta('8-10 minutes');
    setDistance('2.5 km');
  };

  const fetchDeliveryPartnerLocation = async () => {
    if (!order.deliveryPartner) return;

    try {
      // In production, this would fetch from your backend API
      // For now, simulate moving delivery partner
      const simulatedLocation = getSimulatedLocation();
      
      setDeliveryLocation(simulatedLocation);
      
      if (map && window.google) {
        updateDeliveryMarker(simulatedLocation);
        updateRoute(simulatedLocation, customerLocation);
        calculateETA(simulatedLocation, customerLocation);
      }
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  const getSimulatedLocation = () => {
    // Simulate delivery partner moving towards customer
    const baseTime = Date.now() / 10000;
    return {
      lat: 28.7041 + (Math.sin(baseTime) * 0.01),
      lng: 77.1025 + (Math.cos(baseTime) * 0.01)
    };
  };

  const updateDeliveryMarker = (location) => {
    if (!map || !window.google) return;

    if (deliveryMarkerRef.current) {
      deliveryMarkerRef.current.setPosition(location);
    } else {
      const marker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: 'Delivery Partner',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
              <path fill="#10B981" d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z"/>
              <circle fill="#10B981" cx="17" cy="17" r="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        },
        animation: window.google.maps.Animation.DROP
      });
      deliveryMarkerRef.current = marker;
    }

    // Center map on delivery partner
    map.panTo(location);
  };

  const updateRoute = (start, end) => {
    if (!map || !window.google) return;

    // Remove old route
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }

    // Draw new route
    const routePath = new window.google.maps.Polyline({
      path: [start, end],
      geodesic: true,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      icons: [{
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        },
        offset: '50%'
      }]
    });

    routePath.setMap(map);
    routePolylineRef.current = routePath;

    // Fit bounds to show both markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);
  };

  const calculateETA = (start, end) => {
    if (!window.google) return;

    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(start.lat, start.lng),
      new window.google.maps.LatLng(end.lat, end.lng)
    );

    const distanceKm = (distance / 1000).toFixed(1);
    setDistance(`${distanceKm} km`);

    // Assume average speed of 30 km/h
    const timeMinutes = Math.ceil((distance / 1000) / 30 * 60);
    setEta(`${timeMinutes} minutes`);
  };

  if (order.status === 'pending' || order.status === 'confirmed') {
    return (
      <div className="tracking-unavailable">
        <FiMapPin className="tracking-icon" />
        <h3>Tracking Not Available Yet</h3>
        <p>Live tracking will be available once a delivery partner is assigned.</p>
      </div>
    );
  }

  if (order.status === 'delivered') {
    return (
      <div className="tracking-completed">
        <div className="completion-icon">✓</div>
        <h3>Order Delivered Successfully!</h3>
        <p>Your order was delivered on {new Date(order.updatedAt).toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div className="live-tracking-container">
      <div className="tracking-header">
        <h3>
          <FiTruck /> Live Tracking
        </h3>
        <div className="tracking-status">
          <span className={`status-dot ${order.status}`}></span>
          <span>{order.status.replace(/_/g, ' ').toUpperCase()}</span>
        </div>
      </div>

      {error && (
        <div className="tracking-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Map Container */}
      <div className="map-container">
        {isLoading && (
          <div className="map-loading">
            <div className="spinner"></div>
            <p>Loading map...</p>
          </div>
        )}
        <div ref={mapRef} className="google-map" />
        
        {!window.google && !isLoading && (
          <div className="demo-map">
            <div className="demo-marker customer">
              <FiMapPin size={32} />
              <span>You</span>
            </div>
            <div className="demo-marker delivery">
              <FiTruck size={32} />
              <span>Delivery Partner</span>
            </div>
            <div className="demo-route"></div>
          </div>
        )}
      </div>

      {/* Tracking Info */}
      <div className="tracking-info-grid">
        {deliveryLocation && (
          <>
            <div className="tracking-info-card">
              <div className="info-icon">
                <FiNavigation />
              </div>
              <div className="info-content">
                <span className="info-label">Distance</span>
                <span className="info-value">{distance || 'Calculating...'}</span>
              </div>
            </div>

            <div className="tracking-info-card">
              <div className="info-icon">
                <FiClock />
              </div>
              <div className="info-content">
                <span className="info-label">ETA</span>
                <span className="info-value">{eta || 'Calculating...'}</span>
              </div>
            </div>

            <div className="tracking-info-card">
              <div className="info-icon">
                <FiTruck />
              </div>
              <div className="info-content">
                <span className="info-label">Delivery Partner</span>
                <span className="info-value">{order.deliveryPartner?.name}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Live Update Indicator */}
      <div className="tracking-live-indicator">
        <span className="pulse-dot"></span>
        <span>Live tracking • Updates every 5 seconds</span>
      </div>
    </div>
  );
};

export default LiveTrackingMap;