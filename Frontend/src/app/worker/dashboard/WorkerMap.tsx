"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds } from 'leaflet';
import { useEffect, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapEvent } from 'react-leaflet';

// Memoize icons to prevent unnecessary recreations
const useWorkerIcon = () => useMemo(() => L.divIcon({
  className: 'worker-location-icon',
  html: renderToStaticMarkup(
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: '24px', 
      height: '24px' 
    }}>
      <div style={{ 
        position: 'absolute', 
        width: '24px', 
        height: '24px', 
        borderRadius: '50%', 
        background: 'rgba(59, 130, 246, 0.25)', 
        animation: 'pulse-ring 2s ease-out infinite' 
      }}></div>
      <div style={{ 
        width: '12px', 
        height: '12px', 
        borderRadius: '50%', 
        background: '#3b82f6', 
        border: '2px solid #fff' 
      }}></div>
    </div>
  ),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
}), []);

interface WorkerMapProps {
  workerPosition: LatLngExpression;
  clientPosition: LatLngExpression | null;
  route: LatLngExpression[] | null;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

export default function WorkerMap({ 
  workerPosition, 
  clientPosition, 
  route,
  onMapClick
}: WorkerMapProps) {
  const workerIcon = useWorkerIcon();
  const clientIcon = useMemo(() => new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }), []);

  // Debug route data
  console.log('🗺️ WorkerMap received route:', route);
  console.log('🗺️ Route type:', typeof route);
  console.log('🗺️ Route length:', route?.length);
  if (route && route.length > 0) {
    console.log('🗺️ First route coordinate:', route[0]);
    console.log('🗺️ Last route coordinate:', route[route.length - 1]);
  }

  // Add this component to handle map clicks
  function MapClickHandler({ onMapClick }: { onMapClick: (latlng: { lat: number; lng: number }) => void }) {
    useMapEvent('click', (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    return null;
  }

  // Guard against undefined workerPosition
  if (!workerPosition || !Array.isArray(workerPosition) || workerPosition.length !== 2) {
    return <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <p>Loading map...</p>
    </div>;
  }

  // Create a unique key for the map to prevent reuse errors
  const workerPosStr = Array.isArray(workerPosition) ? `${workerPosition[0]}-${workerPosition[1]}` : 'unknown';
  const clientPosStr = clientPosition && Array.isArray(clientPosition) ? `${clientPosition[0]}-${clientPosition[1]}` : 'no-client';
  const routeStr = route ? route.length.toString() : '0';
  const mapKey = `${workerPosStr}-${clientPosStr}-${routeStr}`;

  return (
    <MapContainer 
      center={workerPosition} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
    >
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={workerPosition} icon={workerIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      {clientPosition && (
        <Marker position={clientPosition} icon={clientIcon}>
          <Popup>Client Location</Popup>
        </Marker>
      )}
      {route && <Polyline positions={route} color="#3b82f6" weight={5} />}
    </MapContainer>
  );
}