"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { useUser, SignOutButton } from '@civic/auth/react';
import GoLiveToggle from './GoLiveToggle';
import WorkerMap from './WorkerMap';
import JobRequestCard from './JobRequestCard';

const defaultProfile = {
  firstName: 'Worker', lastName: '', service: '', experience: '', email: '', phone: '',
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
};

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const civicSignOutButtonRef = useRef<HTMLButtonElement>(null);
  
  const [profile, setProfile] = useState(defaultProfile);
  const [isLive, setIsLive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [jobStatus, setJobStatus] = useState<'idle' | 'incoming' | 'accepted'>('idle');
  const [jobRequest, setJobRequest] = useState<any>(null);
  const [earnings, setEarnings] = useState({ today: '1,250', week: '8,400', bonus: '500' });

  useEffect(() => {
    const isWorkerSession = localStorage.getItem('workerSessionActive');
    if (isWorkerSession !== 'true') {
      router.push('/worker');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      const savedProfileJSON = localStorage.getItem(`workerProfile_${user.did}`);
      if (savedProfileJSON) setProfile(JSON.parse(savedProfileJSON));
    }
  }, [user]);
  
  useEffect(() => {
    if (isLive) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => {
          console.error("Error getting location:", error);
          setIsLive(false);
        }
      );
    } else {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      setLocation(null);
    }
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isLive]);

  const handleSimulateJob = async () => {
    if (!location) {
        alert("Cannot simulate job, your location is not available.");
        return;
    }
    const clientLocation = { lat: location.lat + 0.02, lng: location.lng + 0.02 };
    
    const url = `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${clientLocation.lng},${clientLocation.lat}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
            const routeInfo = data.routes[0];
            const dist = parseFloat((routeInfo.distance / 1000).toFixed(1));
            const fare = Math.ceil(100 + (dist * 15));
            const bonus = 50;
            const routeCoords = routeInfo.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            setJobRequest({
                distance: dist, fare: fare, bonus: bonus,
                clientLocationName: "Kolkata City Center",
                clientLocation: [clientLocation.lat, clientLocation.lng],
                route: routeCoords,
            });
            setJobStatus('incoming');
        }
    } catch (e) { console.error("Failed to fetch route for job simulation:", e); }
  };

  const handleAcceptJob = () => setJobStatus('accepted');
  const handleDeclineJob = () => {
    setJobStatus('idle');
    setJobRequest(null);
  };
  
  const handleLogoutClick = () => {
    if (user) {
      localStorage.removeItem(`workerProfile_${user.did}`);
    }
    localStorage.removeItem('workerSessionActive');
    if (civicSignOutButtonRef.current) {
      civicSignOutButtonRef.current.click();
    }
    router.push('/worker'); 
  };

  // The error was here. It should be "return (" not "return (>"
  return (
    <div className={styles.pageWrapper}>
      {jobStatus === 'incoming' && jobRequest && (
        <JobRequestCard job={jobRequest} onAccept={handleAcceptJob} onDecline={handleDeclineJob} />
      )}

      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <h1>Worker Dashboard</h1>
          <div className={styles.headerButtons}>
            <GoLiveToggle isLive={isLive} onToggle={() => setIsLive(!isLive)} />
            <button className={styles.editButton} onClick={() => router.push('/worker/onboarding')}>Edit Profile</button>
            <button className={styles.logoutButton} onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </header>
        
        <div className={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 className={styles.cardTitle}>{jobStatus === 'accepted' ? 'On the way to Client' : 'Live Status'}</h3>
                {isLive && jobStatus === 'idle' && (
                    <button className={styles.simulateButton} onClick={handleSimulateJob}>Simulate Job Request</button>
                )}
            </div>
            <div className={styles.mapContainer}>
              {location ? (
                  <WorkerMap
                    workerPosition={[location.lat, location.lng]}
                    jobRequest={jobStatus === 'accepted' ? jobRequest : null}
                  />
              ) : (
                <div className={styles.mapPlaceholder}>
                  {isLive ? "Getting your location..." : "Go live to see the map"}
                </div>
              )}
            </div>
        </div>
        
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Your Earnings (₹)</h3>
          <div className={styles.earningsGrid}>
            <div className={styles.earningItem}>
              <span className={styles.earningLabel}>Today's Income</span>
              <span className={styles.earningValue}>₹{earnings.today}</span>
            </div>
            <div className={styles.earningItem}>
              <span className={styles.earningLabel}>This Week</span>
              <span className={styles.earningValue}>₹{earnings.week}</span>
            </div>
            <div className={styles.earningItem}>
              <span className={styles.earningLabel}>Weekly Bonus</span>
              <span className={styles.earningValueBonus}>+ ₹{earnings.bonus}</span>
            </div>
          </div>
        </div>

        <div className={styles.profileGrid}>
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                <span>{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</span>
              </div>
              <div>
                <h2 className={styles.profileName}>{profile.firstName} {profile.lastName}</h2>
                <p className={styles.profileEmail}>{profile.email}</p>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Your Service</h3>
            <div className={styles.serviceInfo}>
              <p className={styles.serviceName}>{profile.service || 'Not specified'}</p>
              <p className={styles.serviceExperience}>
                <strong>Experience:</strong> {profile.experience || '0'} years
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'none' }}>
        <SignOutButton ref={civicSignOutButtonRef} />
      </div>
    </div>
  );
}