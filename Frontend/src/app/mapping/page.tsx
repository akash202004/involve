"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './mapping.module.css';
import type { Worker } from './ClientMap';

// (generateRandomWorkers function remains the same as before)
const generateRandomWorkers = (center: [number, number], count: number): Worker[] => {
  const workers: Worker[] = [];
  const names = ["Ravi K.", "Priya S.", "Amit V.", "Sunita M.", "Alok R."];
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
  distance: number;
  duration: number;
  price: number;
  initialDuration: number;
}

export default function MappingPage() {
  // (All state and handlers logic remains the same)
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
    () => dynamic(() => import('./ClientMap'), {
      loading: () => <div className={styles.mapLoading}></div>,
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleFilterChange = (service: string) => {
    setActiveFilter(service);
    setSelectedWorker(null);
    setBookingDetails(null);
    setIsBooked(false);
    setRoute([]);
    if (service === 'All') {
      setFilteredWorkers(workers);
    } else {
      setFilteredWorkers(workers.filter(w => w.service === service));
    }
  };

  const handleWorkerSelect = async (worker: Worker) => {
    if (selectedWorker?.id === worker.id) {
      setSelectedWorker(null);
      setBookingDetails(null);
      setRoute([]);
      return;
    }
    setSelectedWorker(worker);
    setBookingDetails(null);
    setRoute([]);

    const url = `https://router.project-osrm.org/route/v1/driving/${worker.lng},${worker.lat};${USER_LOCATION[1]},${USER_LOCATION[0]}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const info = data.routes[0];
        const dist = info.distance / 1000;
        const dur = Math.round(info.duration / 60);
        const price = Math.ceil(120 + (dist * 18) + (dur * 1.5));
        setBookingDetails({ distance: parseFloat(dist.toFixed(1)), duration: dur, price: price, initialDuration: dur });
        const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
        setRoute(coords);
      }
    } catch (e) {
      console.error("Failed to fetch route details:", e);
    }
  };

  const handleBookingConfirm = () => {
    if (!selectedWorker || !route.length) return;
    setIsBooked(true);
    setLivePosition([selectedWorker.lat, selectedWorker.lng]);

    if (intervalRef.current) clearInterval(intervalRef.current);
    let step = 0;
    const simulationDuration = 20000;
    const updateInterval = 100;
    const totalSteps = simulationDuration / updateInterval;
    const stepIncrement = Math.ceil(route.length / totalSteps);

    intervalRef.current = setInterval(() => {
      if (step < route.length - 1) {
        setLivePosition(route[step]);
        const progress = step / route.length;
        setBookingDetails(prev => ({ ...prev!, duration: Math.ceil(prev!.initialDuration * (1 - progress)) }));
        step += stepIncrement;
      } else {
        setLivePosition(route[route.length - 1]);
        setBookingDetails(prev => ({ ...prev!, duration: 0 }));
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, updateInterval);
  };

  const handleBookingCancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsBooked(false);
    setSelectedWorker(null);
    setLivePosition(null);
    setRoute([]);
    setBookingDetails(null);
  };

  return (
    <div className={styles.appWrapper}>
      <main className={styles.pageContainer}>
        {/* Side Panel */}
        <div className={styles.sidePanel}>
           <div className={styles.panelContent}>
              <header className={styles.header}>Find a Professional</header>
              <div className={styles.categoryFilters}>
                {['All', 'Plumber', 'Electrician', 'Painter', 'Carpenter'].map(service => (
                  <button key={service} onClick={() => handleFilterChange(service)} className={`${styles.filterButton} ${activeFilter === service ? styles.active : ''}`}>
                    {service}
                  </button>
                ))}
              </div>

              <div className={`${styles.bookingCard} ${selectedWorker ? styles.visible : ''}`}>
                {isBooked && selectedWorker ? (
                  <div className={styles.trackingInfo}>
                    <h3>{selectedWorker.name} is on the way!</h3>
                    <p>Arriving in <span>{bookingDetails?.duration} min</span></p>
                    <button className={styles.cancelButton} onClick={handleBookingCancel}>Cancel Booking</button>
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
                      <div><p>Distance</p><p className={styles.value}>{bookingDetails ? `${bookingDetails.distance} km` : '...'}</p></div>
                      <div><p>Fare</p><p className={styles.value}>{bookingDetails ? `₹${bookingDetails.price}` : '...'}</p></div>
                    </div>
                    <button className={styles.confirmButton} onClick={handleBookingConfirm} disabled={!bookingDetails}>
                      Confirm Booking
                    </button>
                  </>
                )}
              </div>
          </div>
        </div>

        {/* Map Container */}
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
              onMapClick={() => { if (!isBooked) setSelectedWorker(null); }}
            />
          ) : <div className={styles.mapLoading}></div>}
        </div>
      </main>

      <footer className={styles.footer}>
          <div>
              <span><b>BrandName</b></span>
              <span>PRODUCT</span>
              <span>COMPANY</span>
              <span>RESOURCES</span>
              <span>LEGAL</span>
          </div>
          <div>&copy; {new Date().getFullYear()} BrandName. All rights reserved.</div>
      </footer>
    </div>
  );
}