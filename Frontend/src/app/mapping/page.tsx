// app/mapping/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './mapping.module.css';
import type { Worker } from '../components/ClientMap'; // Import only the TypeScript type, which is safe.

const generateRandomWorkers = (center: [number, number], count: number): Worker[] => {
  const workers: Worker[] = [];
  const names = ["Ravi K.", "Priya S.", "Amit V.", "Sunita M."];
  const services = ["Plumber", "Electrician", "Carpenter", "Painter"];
  for (let i = 1; i <= count; i++) {
    const spread = (Math.random() * 0.135); 
    workers.push({
      id: i, name: names[i % names.length], service: services[i % services.length],
      lat: center[0] + (Math.random() - 0.5) * spread,
      lng: center[1] + (Math.random() - 0.5) * spread,
      imageUrl: `https://i.pravatar.cc/150?img=${i}`,
    });
  }
  return workers;
};

interface BookingDetails {
  distance: number; duration: number; price: number;
}

export default function MappingPage() {
  const USER_LOCATION: [number, number] = [12.9716, 77.5946];
  const [isClient, setIsClient] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [livePosition, setLivePosition] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const Map = useMemo(
    () => dynamic(() => import('../components/ClientMap'), { 
      loading: () => <div style={{height: "100%", background: "#e9ecef"}}></div>,
      ssr: false 
    }),
    []
  );

  useEffect(() => {
    setIsClient(true);
    const allWorkers = generateRandomWorkers(USER_LOCATION, 15);
    setWorkers(allWorkers);
    setFilteredWorkers(allWorkers);
  }, []);

  const handleFilterChange = (service: string) => {
    setActiveFilter(service);
    setSelectedWorker(null);
    if (service === 'All') {
        setFilteredWorkers(workers);
    } else {
        setFilteredWorkers(workers.filter(w => w.service === service));
    }
  };
  
  const handleWorkerSelect = async (worker: Worker) => {
    if (selectedWorker?.id === worker.id) {
        setSelectedWorker(null); return;
    }
    setSelectedWorker(worker);
    setBookingDetails(null);
    const url = `http://router.project-osrm.org/route/v1/driving/${worker.lng},${worker.lat};${USER_LOCATION[1]},${USER_LOCATION[0]}`;
    try {
        const res = await fetch(url); const data = await res.json();
        const info = data.routes[0];
        const dist = info.distance / 1000;
        const dur = Math.round(info.duration / 60);
        const price = Math.ceil(120 + (dist * 18) + (dur * 1.5));
        setBookingDetails({ distance: parseFloat(dist.toFixed(1)), duration: dur, price: price });
    } catch(e) { console.error(e); }
  };

  const handleBookingConfirm = async () => {
    if (!selectedWorker) return;
    setIsBooked(true);
    setLivePosition([selectedWorker.lat, selectedWorker.lng]);
    const url = `http://router.project-osrm.org/route/v1/driving/${selectedWorker.lng},${selectedWorker.lat};${USER_LOCATION[1]},${USER_LOCATION[0]}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url); const data = await res.json();
        const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
        setRoute(coords);
        let i = 0;
        intervalRef.current = setInterval(() => {
            if (i < coords.length) {
                setLivePosition(coords[i]);
                const remaining = bookingDetails!.duration * (1 - (i / coords.length));
                setBookingDetails(prev => ({...prev!, duration: Math.ceil(remaining)}));
                i += Math.floor(coords.length / 150) || 1;
            } else { if(intervalRef.current) clearInterval(intervalRef.current); }
        }, 100);
    } catch(e) { console.error(e); }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.header}>Find a Professional</header>
      
      <div className={styles.categoryFilters}>
          {['All', 'Plumber', 'Electrician', 'Painter', 'Carpenter'].map(service => (
              <button key={service} onClick={() => handleFilterChange(service)} className={`${styles.filterButton} ${activeFilter === service ? styles.active : ''}`}>
                  {service}
              </button>
          ))}
      </div>

      <div className={styles.mapBox}>
        {isClient ? (
            <Map 
                userLocation={USER_LOCATION}
                workers={filteredWorkers}
                selectedWorker={selectedWorker}
                isBooked={isBooked}
                livePosition={livePosition}
                route={route}
                onWorkerSelect={handleWorkerSelect}
                onMapClick={() => setSelectedWorker(null)}
            />
        ) : <div style={{height: "100%", background: "#e9ecef"}}></div>}
      </div>

      <div className={`${styles.bookingCard} ${selectedWorker ? styles.visible : ''}`}>
        {isBooked && selectedWorker ? (
            <div className={styles.trackingInfo}><h3>{selectedWorker.name} is on the way!</h3><p>Arriving in <span>{bookingDetails?.duration} min</span></p></div>
        ) : selectedWorker && (
            <><div className={styles.cardHeader}><img src={selectedWorker.imageUrl} alt={selectedWorker.name} className={styles.workerAvatar} /><div className={styles.workerInfo}><h3>{selectedWorker.name}</h3><p>{selectedWorker.service}</p></div></div><div className={styles.detailsGrid}><div><p>Arrival</p><p className={styles.value}>{bookingDetails ? `${bookingDetails.duration} min` : '...'}</p></div><div><p>Fare</p><p className={styles.value}>{bookingDetails ? `₹${bookingDetails.price}` : '...'}</p></div></div><button className={styles.confirmButton} onClick={handleBookingConfirm} disabled={!bookingDetails}>Confirm Booking</button></>
        )}
      </div>
    </main>
  );
}