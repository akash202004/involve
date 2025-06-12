"use client";

import { useState, useEffect, useRef } from 'react';
import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import styles from './mapping.module.css';

// --- ICONS & INTERFACES (Defined outside the component but are safe) ---

const userIcon = new L.DivIcon({
  className: styles.userLocationMarker,
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
    iconSize: [24, 24],
});

interface Worker {
  id: number;
  name: string;
  service: string;
  lat: number;
  lng: number;
  imageUrl: string;
}

interface BookingDetails {
  distance: number;
  duration: number;
  price: number;
}

// --- HELPER FUNCTIONS & COMPONENTS ---

const generateRandomWorkers = (center: LatLngTuple, count: number): Worker[] => {
  const workers: Worker[] = [];
  const names = ["Ravi K.", "Priya S.", "Amit V.", "Sunita M."];
  const services = ["Plumber", "Electrician", "Carpenter", "Painter"];
  for (let i = 1; i <= count; i++) {
    workers.push({
      id: i,
      name: names[i % names.length],
      service: services[i % services.length],
      lat: center[0] + (Math.random() - 0.5) * 0.08,
      lng: center[1] + (Math.random() - 0.5) * 0.08,
      imageUrl: `https://i.pravatar.cc/150?img=${i}`,
    });
  }
  return workers;
};

const ChangeView = ({ center, zoom }: { center: LatLngTuple; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

// --- MAIN PAGE COMPONENT ---

export default function MappingPage() {
  const USER_LOCATION: LatLngTuple = [12.9716, 77.5946];
  const [isMounted, setIsMounted] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [livePosition, setLivePosition] = useState<LatLngTuple | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setWorkers(generateRandomWorkers(USER_LOCATION, 4));
  }, []);

  const handleWorkerSelect = async (worker: Worker) => {
    setSelectedWorker(worker);
    setBookingDetails(null);
    const url = `http://router.project-osrm.org/route/v1/driving/${worker.lng},${worker.lat};${USER_LOCATION[1]},${USER_LOCATION[0]}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
            const routeInfo = data.routes[0];
            const distanceInKm = routeInfo.distance / 1000;
            const durationInMin = Math.round(routeInfo.duration / 60);
            const price = Math.ceil(100 + (distanceInKm * 15) + (durationInMin * 2));
            setBookingDetails({ distance: parseFloat(distanceInKm.toFixed(1)), duration: durationInMin, price: price });
        }
    } catch(e) { console.error("Failed to fetch route details", e); }
  };

  const handleBookingConfirm = async () => {
    if (!selectedWorker) return;
    setIsBooking(true);
    const url = `http://router.project-osrm.org/route/v1/driving/${selectedWorker.lng},${selectedWorker.lat};${USER_LOCATION[1]},${USER_LOCATION[0]}?overview=full&geometries=geojson`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const routeCoords = data.routes[0].geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple
        );
        setRoute(routeCoords);
        setIsBooking(false);
        setIsBooked(true);
        setLivePosition([selectedWorker.lat, selectedWorker.lng]);
        
        let routeIndex = 0;
        intervalRef.current = setInterval(() => {
            if(routeIndex < routeCoords.length) {
                setLivePosition(routeCoords[routeIndex]);
                const remainingDuration = bookingDetails!.duration * (1 - (routeIndex / routeCoords.length));
                setBookingDetails(prev => ({...prev!, duration: Math.ceil(remainingDuration)}));
                routeIndex += Math.floor(routeCoords.length / 150) || 1;
            } else {
                if(intervalRef.current) clearInterval(intervalRef.current);
            }
        }, 100);
    } catch(e) { console.error("Failed to fetch route", e); }
  };
  
  const cancelBooking = () => {
    if(intervalRef.current) clearInterval(intervalRef.current);
    setIsBooked(false);
    setSelectedWorker(null);
    setBookingDetails(null);
    setRoute([]);
  };

  if (!isMounted) {
    // This is the guaranteed fix: render NOTHING on the server.
    return null;
  }

  return (
    <main className={styles.pageContainer}>
      <header className={styles.header}>Find a Professional</header>
      
      <div className={styles.mapBox}>
        <MapContainer center={USER_LOCATION} zoom={13} className={styles.mapContainer} zoomControl={false}>
            {selectedWorker && <ChangeView center={USER_LOCATION} zoom={14.5}/>}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
            />
            <Marker position={USER_LOCATION} icon={userIcon} />

            {!isBooked ? (
                workers.map(worker => (
                    <Marker key={worker.id} position={[worker.lat, worker.lng]} icon={createWorkerIcon(worker.imageUrl, selectedWorker?.id === worker.id)} eventHandlers={{ click: () => handleWorkerSelect(worker) }} />
                ))
            ) : (
                livePosition && <Marker position={livePosition} icon={liveWorkerIcon} />
            )}
            {route.length > 0 && <Polyline positions={route} color="#000" weight={4} opacity={0.75} dashArray="10, 10"/>}
        </MapContainer>
      </div>

      <div className={`${styles.bookingCard} ${selectedWorker ? styles.visible : ''}`}>
        {isBooked && selectedWorker ? (
            <div className={styles.trackingInfo}>
                <h3>{selectedWorker.name} is on the way!</h3>
                <p>Arriving in <span>{bookingDetails?.duration} min</span> • {bookingDetails?.distance.toFixed(1)} km</p>
                <button className={styles.cancelButton} onClick={cancelBooking}>Cancel Service</button>
            </div>
        ) : selectedWorker && (
            <>
                <div className={styles.cardHeader}>
                    <img src={selectedWorker.imageUrl} alt={selectedWorker.name} className={styles.workerAvatar} />
                    <div className={styles.workerInfo}>
                        <h3>{selectedWorker.name}</h3>
                        <p>{selectedWorker.service}</p>
                    </div>
                </div>
                <div className={styles.detailsGrid}>
                    <div><p>Arrival</p><p className={styles.value}>{bookingDetails ? `${bookingDetails.duration} min` : '...'}</p></div>
                    <div><p>Fare</p><p className={styles.value}>{bookingDetails ? `₹${bookingDetails.price}` : '...'}</p></div>
                </div>
                <button className={styles.confirmButton} onClick={handleBookingConfirm} disabled={!bookingDetails || isBooking}>
                    {isBooking ? "Booking..." : "Confirm Booking"}
                    {isBooking && <div className={styles.loadingBar} style={{width: '100%', transitionDuration: '2s'}}></div>}
                </button>
            </>
        )}
      </div>
    </main>
  );
}