"use client";

import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './dashboard.module.css';
import { useEffect } from 'react';

// Default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const liveWorkerIcon = new L.DivIcon({
  className: styles.liveWorkerMarker,
  html: `<div class="${styles.pulsingDot}"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const clientIcon = new L.DivIcon({
  className: styles.userLocationMarker,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const MapController = ({ workerPosition, clientPosition, route }: {
  workerPosition: LatLngTuple;
  clientPosition: LatLngTuple | null;
  route: LatLngExpression[] | null;
}) => {
  const map = useMap();
  useEffect(() => {
    if (clientPosition && route && route.length > 0) {
      const bounds = L.latLngBounds([workerPosition, clientPosition]);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else {
      map.flyTo(workerPosition, 16, { animate: true, duration: 1.5 });
    }
  }, [workerPosition, clientPosition, route, map]);
  return null;
};

interface WorkerMapProps {
  workerPosition: LatLngTuple;
  jobRequest: { clientLocation: LatLngTuple; route: LatLngExpression[] } | null;
  theme: string;
}

export default function WorkerMap({ workerPosition, jobRequest, theme }: WorkerMapProps) {
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <MapContainer
      center={workerPosition}
      zoom={13}
      className={styles.mapView}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <MapController
        workerPosition={workerPosition}
        clientPosition={jobRequest?.clientLocation || null}
        route={jobRequest?.route || null}
      />
      <TileLayer url={tileUrl} attribution={tileAttribution} key={theme} />
      
      <Marker position={workerPosition} icon={liveWorkerIcon} />
      
      {jobRequest && (
        <>
          <Marker position={jobRequest.clientLocation} icon={clientIcon} />
          <Polyline
            positions={jobRequest.route}
            className={styles.routePolyline}
            weight={5}
            opacity={0.8}
            dashArray="1, 10"
          />
        </>
      )}
    </MapContainer>
  );
}