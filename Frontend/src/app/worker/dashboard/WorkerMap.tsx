"use client";

import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './dashboard.module.css'; // We will use the dashboard's CSS
import { useEffect } from 'react';

// Using the same marker fixes and custom icons from your ClientMap
let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// This is the worker's own live location marker
const liveWorkerIcon = new L.DivIcon({ 
  className: styles.liveWorkerMarker, 
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

// A marker for the client's location
const clientIcon = new L.DivIcon({ 
  className: styles.userLocationMarker, 
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Map Controller to handle camera movement
const MapController = ({ workerPosition, clientPosition, route }: { 
    workerPosition: LatLngTuple; 
    clientPosition: LatLngTuple | null;
    route: LatLngExpression[] | null;
}) => {
  const map = useMap();
  useEffect(() => {
    if (clientPosition && route && route.length > 0) {
      const bounds = L.latLngBounds([workerPosition, clientPosition]);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
    } else {
      map.flyTo(workerPosition, 15, { animate: true, duration: 1 });
    }
  }, [workerPosition, clientPosition, route, map]);
  
  return null;
};

// Props for our new map component
interface WorkerMapProps {
  workerPosition: LatLngTuple;
  jobRequest: { clientLocation: LatLngTuple; route: LatLngExpression[] } | null;
}

export default function WorkerMap({ workerPosition, jobRequest }: WorkerMapProps) {
  return (
    <MapContainer 
      center={workerPosition} 
      zoom={15} 
      className={styles.mapView} // Using a generic map style class
      zoomControl={false}
    >
      <MapController 
        workerPosition={workerPosition}
        clientPosition={jobRequest?.clientLocation || null}
        route={jobRequest?.route || null}
      />
      
      {/* Using the same stylish CARTO map tiles from your ClientMap */}
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        attribution='&copy; CARTO'
      />

      {/* Worker's own live position marker */}
      <Marker 
        position={workerPosition} 
        icon={liveWorkerIcon} 
      />
      
        {/* If there's a job request, show the client's location and route */}
      {jobRequest && (
        <>
          <Marker 
            position={jobRequest.clientLocation} 
            icon={clientIcon} 
          />
          <Polyline 
            positions={jobRequest.route} 
            color="#007aff" 
            weight={5}
            opacity={0.9} 
            dashArray="2, 8"
          />
        </>
      )}
    </MapContainer>
  );
}