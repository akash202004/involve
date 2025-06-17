"use client";

import { useEffect } from 'react';
import L, { LatLngExpression, LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../mapping/mapping.module.css';

// Fix for default Leaflet markers
let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const userIcon = new L.DivIcon({ 
  className: styles.userLocationMarker, 
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createWorkerIcon = (imageUrl: string, isSelected = false) => new L.DivIcon({
  html: `<img src="${imageUrl}" alt="worker" />`,
  className: `${styles.workerMarker} ${isSelected ? styles.selected : ''}`,
  iconSize: [50, 50], 
  iconAnchor: [25, 50]
});

const liveWorkerIcon = new L.DivIcon({ 
  className: styles.liveWorkerMarker, 
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

export interface Worker { 
  id: number; 
  name: string; 
  service: string; 
  lat: number; 
  lng: number; 
  imageUrl: string; 
}

// MapController component for handling map interactions
const MapController = ({ 
  selectedWorker, 
  userLocation, 
  isBooked, 
  livePosition 
}: { 
  selectedWorker: Worker | null; 
  userLocation: LatLngTuple; 
  isBooked: boolean; 
  livePosition: LatLngTuple | null; 
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (isBooked && livePosition) {
      map.flyTo(livePosition, 16, { animate: true, duration: 1 });
    } else if (selectedWorker) {
      const bounds = L.latLngBounds([userLocation, [selectedWorker.lat, selectedWorker.lng]]);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else {
      map.flyTo(userLocation, 13, { duration: 1.5 });
    }
  }, [selectedWorker, isBooked, livePosition, map, userLocation]);
  
  return null;
};

interface MapProps {
  userLocation: LatLngTuple;
  workers: Worker[];
  selectedWorker: Worker | null;
  isBooked: boolean;
  livePosition: LatLngTuple | null;
  route: LatLngExpression[];
  onWorkerSelect: (worker: Worker) => void;
  onMapClick: () => void;
}

export default function ClientMap({ 
  userLocation, 
  workers, 
  selectedWorker, 
  isBooked, 
  livePosition, 
  route, 
  onWorkerSelect, 
  onMapClick 
}: MapProps) {
  
  const MapEvents = () => {
    const map = useMap();
    
    useEffect(() => {
      const handleClick = () => {
        onMapClick();
      };
      
      map.on('click', handleClick);
      return () => { 
        map.off('click', handleClick); 
      };
    }, [map, onMapClick]);
    
    return null;
  };

  return (
    <MapContainer 
      center={userLocation} 
      zoom={13} 
      className={styles.mapView} 
      zoomControl={false}
      style={{ 
        height: '100%', 
        width: '100%',
        zIndex: 1 // Ensure map stays below navbar
      }}
    >
      <MapEvents />
      <MapController 
        selectedWorker={selectedWorker} 
        userLocation={userLocation} 
        isBooked={isBooked} 
        livePosition={livePosition} 
      />
      
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        attribution='&copy; CARTO'
      />

      {/* User location marker */}
      <Marker 
        position={userLocation} 
        icon={userIcon}
      />

      {/* Worker markers - only show when not booked */}
      {!isBooked && workers.map(worker => (
        <Marker 
          key={worker.id} 
          position={[worker.lat, worker.lng]} 
          icon={createWorkerIcon(worker.imageUrl, selectedWorker?.id === worker.id)}
          eventHandlers={{ 
            click: (e: LeafletMouseEvent) => { 
              L.DomEvent.stopPropagation(e); 
              onWorkerSelect(worker); 
            }
          }}
        />
      ))}
      
      {/* Live worker position marker - only show when booked */}
      {isBooked && livePosition && (
        <Marker 
          position={livePosition} 
          icon={liveWorkerIcon} 
        />
      )}
      
      {/* Route polyline */}
      {route.length > 0 && (
        <Polyline 
          positions={route} 
          color="#007aff" 
          weight={5}
          opacity={0.9} 
          dashArray="2, 8"
        />
      )}
    </MapContainer>
  );
}