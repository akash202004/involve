// src/app/worker/dashboard/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './dashboard.module.css';
import { useUser, SignOutButton } from '@civic/auth/react';
import 'leaflet/dist/leaflet.css';
import { FiUser, FiLogOut, FiDollarSign, FiClock, FiCheckCircle, FiMapPin, FiBell, FiTrendingUp, FiList, FiTarget, FiNavigation, FiBriefcase, FiX, FiRadio, FiAlertTriangle } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const WorkerMap = dynamic(() => import('./WorkerMap'), { 
  ssr: false,
  loading: () => <div className={styles.mapPlaceholder}>Loading Map...</div>
});

// Type Definitions
type Profile = { firstName: string; };
type JobStatus = 'idle' | 'incoming' | 'accepted';
// ADDED: Type for LatLng coordinates
type LatLngTuple = [number, number]; 
type JobRequest = {
  id: number;
  distance: string; 
  fare: number; 
  title: string; 
  // ADDED: clientLocation to store destination
  clientLocation: LatLngTuple; 
};
type HistoryJob = JobRequest & { status: 'completed' | 'declined' };

const defaultProfile: Profile = { firstName: 'Worker' };

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const civicSignOutButtonRef = useRef<HTMLButtonElement>(null);

  const [theme, setTheme] = useState('light');
  const [isLive, setIsLive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  
  const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
  const [jobHistory, setJobHistory] = useState<HistoryJob[]>([]);
  // ADDED: State to hold the blue navigation route
  const [route, setRoute] = useState<LatLngTuple[] | null>(null); 

  const [profile] = useState<Profile>(defaultProfile);
  const [earnings, setEarnings] = useState({ week: 4875.5 });
  const [hoursWorked] = useState(156);
  const [jobsCompleted, setJobsCompleted] = useState(23);
  const [performance] = useState({ rating: 4.8, successRate: 96 });
  const [weeklyGoal] = useState({ current: 1250, target: 2000 });

  useEffect(() => {
    const savedTheme = localStorage.getItem('worker-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme === 'dark' ? styles.darkTheme : '';
  }, []);

  useEffect(() => {
    if (isLive) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => { setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }); },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Could not get location. Please enable location services.");
          setIsLive(false);
        },
        { enableHighAccuracy: true }
      );
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => { setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }); }
      );
    } else {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      setLocation(null);
    }
    return () => { if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [isLive]);

  // ADDED: Function to fetch route data
  const fetchRoute = async (start: {lat: number, lng: number}, end: LatLngTuple) => {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();
        if(data.routes && data.routes.length > 0) {
            const routeCoords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as LatLngTuple);
            setRoute(routeCoords);
        }
    } catch (e) {
        console.error("Failed to fetch route:", e);
    }
  };

  const handleSimulateJob = () => {
    if (!isLive || !location) { alert("You must be 'Online' to receive jobs."); return; }
    if (jobStatus !== 'idle') { alert("You already have an active job offer."); return; }
    
    // Simulate a client location near you
    const clientLat = location.lat + (Math.random() - 0.5) * 0.1;
    const clientLng = location.lng + (Math.random() - 0.5) * 0.1;
    
    setJobRequest({ 
        id: Date.now(),
        title: "New Delivery Request", 
        distance: (Math.random() * 8 + 1).toFixed(1), 
        fare: Math.floor(Math.random() * 25 + 15), 
        clientLocation: [clientLat, clientLng] // Store client location
    });
    setJobStatus('incoming');
  };
  
  const handleAcceptJob = () => {
      setJobStatus('accepted');
      // Fetch the route when the job is accepted
      if (location && jobRequest) {
          fetchRoute(location, jobRequest.clientLocation);
      }
  };
  
  // ADDED: Helper to reset job state
  const resetJobState = () => {
    setJobStatus('idle'); 
    setJobRequest(null);
    setRoute(null); // Clear the route from the map
  }

  const handleDeclineJob = () => {
    if (jobRequest) { setJobHistory(prev => [{ ...jobRequest, status: 'declined' }, ...prev]); }
    resetJobState();
  };
  
  const handleCompleteJob = () => {
    setJobsCompleted(prev => prev + 1);
    if (jobRequest) { 
        setEarnings(prev => ({ week: prev.week + jobRequest.fare }));
        setJobHistory(prev => [{ ...jobRequest, status: 'completed' }, ...prev]);
    }
    resetJobState();
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('worker-theme', newTheme);
    document.documentElement.className = newTheme === 'dark' ? styles.darkTheme : '';
  };
  
  const handleLogout = () => { console.log("Logout initiated"); };
  
  const isJobIncoming = jobStatus === 'incoming' && jobRequest;
  const isJobAccepted = jobStatus === 'accepted' && jobRequest;

  return (
    <>
      {isJobIncoming && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}><h3>New Job Offer!</h3><button onClick={handleDeclineJob} className={styles.closeModalButton}><FiX /></button></div>
                <div className={styles.modalBody}>
                    <div className={styles.jobDetails}>
                        <FiNavigation className={styles.jobIcon} />
                        <div className={styles.jobInfoText}>
                            <span className={styles.title}>{jobRequest.title}</span>
                            <span className={styles.detail}><FiMapPin size={14}/> {jobRequest.distance} km away</span>
                            <span className={styles.detail}><FiDollarSign size={14}/> Est. Fare: ${jobRequest.fare}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <button className={`${styles.jobButton} ${styles.declineButton}`} onClick={handleDeclineJob}>Decline</button>
                    <button className={`${styles.jobButton} ${styles.acceptButton}`} onClick={handleAcceptJob}>Accept</button>
                </div>
            </div>
        </div>
      )}

      <div className={styles.pageWrapper}>
        <div className={styles.dashboardContainer}>
          <header className={styles.header}>
            <div className={styles.logo}><h1>WorkerPro</h1></div>
            <div className={styles.headerActions}>
              <button className={`${styles.iconButton} ${styles.goLiveButton} ${isLive ? styles.live : ''}`} onClick={() => setIsLive(!isLive)} title={isLive ? 'Go Offline' : 'Go Live'}>
                  <FiRadio />
              </button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button className={styles.iconButton} title="Check for new jobs" onClick={handleSimulateJob} disabled={!isLive || jobStatus !== 'idle'}>
                  <FiBell />
                  {isLive && jobStatus === 'idle' && <div className={styles.notificationIndicator}></div>}
              </button>
              <div className={styles.profileBlock}>
                <button className={styles.iconButton}><FiUser /></button>
                <span className={styles.profileName}>{profile.firstName}</span>
              </div>
              <button className={styles.iconButton} onClick={handleLogout} title="Logout"><FiLogOut /></button>
            </div>
          </header>

          <main className={styles.contentGrid}>
            <div className={`${styles.card} ${styles.mapCard}`}>
              <h3 className={styles.cardHeader}><FiMapPin /> Live Map</h3>
              <div className={styles.mapContainer}>
                {isLive && location ? (
                  // MODIFIED: Pass all necessary props to the map
                  <WorkerMap 
                    workerPosition={[location.lat, location.lng]} 
                    clientPosition={jobRequest ? jobRequest.clientLocation : null}
                    route={route}
                  />
                ) : (
                  <div className={styles.mapPlaceholder}>
                     {locationError ? (<><FiAlertTriangle size={48} color="var(--accent-red)" /><p style={{color: 'var(--accent-red)', maxWidth: '80%', textAlign: 'center'}}>{locationError}</p></>) : (<><FiNavigation size={48} /><p>Go Live to see your position on the map.</p></>)}
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.statsSidebar}>
                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.subtleHeader}>Total Earnings</div>
                    <div className={styles.statValue}>${earnings.week.toLocaleString('en-US', {minimumFractionDigits: 2})}<FiDollarSign className={styles.statIcon} color={'var(--accent-green)'}/></div>
                </div>
                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.subtleHeader}>Hours Worked</div>
                    <div className={styles.statValue}>{hoursWorked}h <FiClock className={styles.statIcon} color={'var(--accent-blue)'}/></div>
                </div>
                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.subtleHeader}>Jobs Completed</div>
                    <div className={styles.statValue}>{jobsCompleted}<FiCheckCircle className={styles.statIcon} color={'var(--accent-purple)'}/></div>
                </div>
            </div>
            
            <div className={`${styles.card} ${styles.opportunitiesCard} ${isJobAccepted ? styles.highlight : ''}`}>
               <h3 className={styles.cardHeader}><FiBriefcase /> Active Job</h3>
               {isJobAccepted ? (
                  <div className={styles.jobRequestItem}>
                    <div className={styles.jobDetails}><div className={styles.jobInfoText}><span className={styles.title}>{jobRequest.title}</span><div className={styles.jobProgressDetails}><span className={`${styles.statusBadge} ${styles.statusInProgress}`}>In Progress</span><span className={styles.jobItemCompany}><FiMapPin size={12}/> {jobRequest.distance} km</span></div></div></div>
                    <div className={styles.jobActions}><button className={`${styles.jobButton} ${styles.completeButton}`} onClick={handleCompleteJob}>Complete Job</button></div>
                  </div>
               ) : ( <p className={styles.secondaryText}>{isLive ? "Click the bell icon to check for jobs." : "Go live to receive jobs."}</p> )}
            </div>
            
            <div className={`${styles.card} ${styles.recentJobsCard}`}>
              <h3 className={styles.cardHeader}><FiList /> Job History</h3>
              <div className={styles.jobList}>
                {jobHistory.length > 0 ? (
                  jobHistory.map(job => (
                    <div className={styles.jobItem} key={job.id}>
                      <div className={styles.jobItemInfo}><span className={styles.jobItemTitle}>{job.title}</span><span className={styles.jobItemCompany}>Est. ${job.fare}</span></div>
                      <span className={`${styles.statusBadge} ${job.status === 'completed' ? styles.statusCompleted : styles.statusDeclined}`}>{job.status}</span>
                    </div>
                  ))
                ) : ( <p className={styles.secondaryText}>Your completed or declined jobs will appear here.</p> )}
              </div>
            </div>

            <div className={`${styles.card} ${styles.performanceCard}`}>
              <h3 className={styles.cardHeader}><FiTrendingUp/> Performance</h3>
              <div className={styles.performanceContent}>
                <div><div className={styles.circularProgress} style={{'--value': performance.rating / 5 * 100 } as React.CSSProperties}><span className={styles.progressValue}>{performance.rating}</span></div><p className={styles.performanceLabel}>Avg. Rating</p></div>
                <div><div className={`${styles.circularProgress} ${styles.green}`} style={{'--value': performance.successRate } as React.CSSProperties}><span className={styles.progressValue}>{performance.successRate}%</span></div><p className={styles.performanceLabel}>Success Rate</p></div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.goalCard}`}>
                <h3 className={styles.cardHeader}><FiTarget /> Weekly Goal</h3>
                <div className={styles.goalStats}><span className={styles.goalCurrent}>${weeklyGoal.current.toLocaleString()}</span><span className={styles.goalTarget}>/ ${weeklyGoal.target.toLocaleString()}</span></div>
                <div className={styles.goalProgress}><div className={styles.goalProgressBar} style={{width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%`}}></div></div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}