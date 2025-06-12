// app/components/ClientMap.tsx
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
    iconSize: [50, 50],
    iconAnchor: [25, 50],
});
const liveWorkerIcon = new L.DivIcon({
    className: styles.liveWorkerMarker,
    iconSize: [26, 26],
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
    onMapClick: () => void;
}
export default function ClientMap({ userLocation, workers, selectedWorker, isBooked, livePosition, route, onWorkerSelect, onMapClick }: MapProps) {
    const MapEvents = () => {
        useMap().on('click', onMapClick);
        return null;
    }

    return (
        <MapContainer center={userLocation} zoom={12} className={styles.mapContainer} zoomControl={false}>
            <MapEvents />
            <MapController selectedWorker={selectedWorker} userLocation={userLocation} />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            <Marker position={userLocation} icon={userIcon} />
            {!isBooked && workers.map(worker => (
                <Marker key={worker.id} position={[worker.lat, worker.lng]} icon={createWorkerIcon(worker.imageUrl, selectedWorker?.id === worker.id)} eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); onWorkerSelect(worker); }}} />
            ))}
            {isBooked && livePosition && <Marker position={livePosition} icon={liveWorkerIcon} />}
            {route.length > 0 && <Polyline positions={route} color="#007aff" weight={7} opacity={0.7}/>}
        </MapContainer>
    );
}