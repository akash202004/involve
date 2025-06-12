// app/components/Map.tsx
"use client";

import { useEffect } from 'react';
import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import styles from '../mapping/mapping.module.css';

const userIcon = new L.DivIcon({
  className: styles.userLocationMarker,
  html: `<div style="--color: #007aff"></div>`,
  iconSize: [24, 24],
});
const createWorkerIcon = (imageUrl: string, isSelected = false) => new L.DivIcon({
    html: `<img src="${imageUrl}" alt="worker" />`,
    className: `${styles.workerMarker} ${isSelected ? styles.selected : ''}`,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
});
const liveWorkerIcon = new L.DivIcon({
    className: styles.liveWorkerMarker,
    html: `<div style="--color: #ff9500"></div>`,
    iconSize: [24, 24],
});

export interface Worker {
  id: number; name: string; service: string;
  lat: number; lng: number; imageUrl: string;
}

const MapController = ({ selectedWorker, userLocation }: { selectedWorker: Worker | null, userLocation: LatLngTuple }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedWorker) {
      map.flyTo([selectedWorker.lat, selectedWorker.lng], 14, { duration: 1.5 });
    } else {
      map.flyTo(userLocation, 12, { duration: 1.5 });
    }
  }, [selectedWorker, map, userLocation]);
  return null;
};

interface MapProps {
    userLocation: LatLngTuple; workers: Worker[]; selectedWorker: Worker | null;
    isBooked: boolean; livePosition: LatLngTuple | null; route: LatLngExpression[];
    onWorkerSelect: (worker: Worker) => void;
}

export default function Map({ userLocation, workers, selectedWorker, isBooked, livePosition, route, onWorkerSelect }: MapProps) {
    const initialBounds = L.circle(userLocation, { radius: 20000 }).getBounds();

    return (
        <MapContainer bounds={initialBounds} className={styles.mapContainer} zoomControl={false}>
            <MapController selectedWorker={selectedWorker} userLocation={userLocation} />
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
            />
            <Marker position={userLocation} icon={userIcon} />
            {!isBooked && workers.map(worker => (
                <Marker key={worker.id} position={[worker.lat, worker.lng]} icon={createWorkerIcon(worker.imageUrl, selectedWorker?.id === worker.id)} eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); onWorkerSelect(worker); }}} />
            ))}
            {isBooked && livePosition && <Marker position={livePosition} icon={liveWorkerIcon} />}
            {route.length > 0 && <Polyline positions={route} color="#000000" weight={5} opacity={0.75}/>}
        </MapContainer>
    );
}