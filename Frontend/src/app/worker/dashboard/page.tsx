"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { useUser, SignOutButton } from '@civic/auth/react';
import GoLiveToggle from './GoLiveToggle';
import WorkerMap from './WorkerMap';
import JobRequestCard from './JobRequestCard';
import ThemeToggle from './ThemeToggle';
import { FiUser, FiTrendingUp, FiLogOut, FiAlertTriangle, FiCamera, FiZap } from 'react-icons/fi';

const defaultProfile = {
  firstName: 'Worker', lastName: '', service: '', experience: '', email: '', phone: '',
};

const formatNumber = (num: number) => new Intl.NumberFormat('en-IN').format(num);

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const civicSignOutButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState('light');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [jobStatus, setJobStatus] = useState<'idle' | 'incoming' | 'accepted'>('idle');
  const [jobRequest, setJobRequest] = useState<any>(null);
  
  const [earnings, setEarnings] = useState({
    today: 1250,
    week: 8400,
    bonus: 500,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('worker-theme') || 'light';
    setTheme(savedTheme);
    const savedImage = localStorage.getItem('worker-profile-image');
    if (savedImage) setProfileImage(savedImage);
  }, []);

  useEffect(() => {
    const isWorkerSession = localStorage.getItem('workerSessionActive');
    if (isWorkerSession !== 'true') router.push('/worker');
    if (user) {
      const savedProfileJSON = localStorage.getItem(`workerProfile_${user.did}`);
      if (savedProfileJSON) setProfile(JSON.parse(savedProfileJSON));
    }
  }, [router, user]);

  useEffect(() => {
    if (isLive) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => {
          console.error("Error getting location:", error);
          setIsLive(false);
        }, { enableHighAccuracy: true }
      );
    } else {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      setLocation(null);
    }
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isLive]);
  
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('worker-profile-image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('worker-theme', newTheme);
  };

  const handleSimulateJob = async () => {
    if (jobStatus !== 'idle') {
        alert("Please complete the current job first.");
        return;
    }
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

  const handleAcceptJob = () => {
    setJobStatus('accepted');
    alert("Job accepted! Navigating to client. Earnings will be updated upon completion.");
    
    setTimeout(() => {
      if (jobRequest) {
        setEarnings(prev => ({
          ...prev,
          today: prev.today + jobRequest.fare,
          week: prev.week + jobRequest.fare,
        }));
         alert(`Job completed! ₹${jobRequest.fare} added to your earnings.`);
      }
      setJobStatus('idle');
      setJobRequest(null);
    }, 8000);
  };

  const handleDeclineJob = () => { setJobStatus('idle'); setJobRequest(null); };
  
  const handleLogoutConfirm = () => {
    if (user) localStorage.removeItem(`workerProfile_${user.did}`);
    localStorage.removeItem('workerSessionActive');
    localStorage.removeItem('worker-profile-image');
    if (civicSignOutButtonRef.current) civicSignOutButtonRef.current.click();
    window.location.href = '/';
  };
  
  return (
    <div className={`${styles.pageWrapper} ${theme === 'dark' ? styles.darkTheme : styles.lightTheme}`}>
      
      {showLogoutConfirm && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationCard}>
            <div className={styles.confirmationIcon}><FiAlertTriangle /></div>
            <h3>Confirm Sign Out</h3>
            <p>Are you sure you want to end your session?</p>
            <div className={styles.jobActions}>
              <button className={styles.declineButton} onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className={styles.confirmSignOutButton} onClick={handleLogoutConfirm}>
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {jobStatus === 'incoming' && jobRequest && (
        <JobRequestCard job={jobRequest} onAccept={handleAcceptJob} onDecline={handleDeclineJob} />
      )}

      <div className={styles.dashboardGrid}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <h1 className={styles.titleGradient}>WorkSphere</h1>
          </div>
          <div className={styles.headerActions}>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <GoLiveToggle isLive={isLive} onToggle={() => setIsLive(!isLive)} />
            {isLive && location && jobStatus === 'idle' && (
              <button title="Simulate Job Request" className={`${styles.iconButton} ${styles.simulateButton}`} onClick={handleSimulateJob}>
                <FiZap />
              </button>
            )}
            <button title="Edit Profile" className={styles.iconButton} onClick={() => router.push('/worker/onboarding')}><FiUser /></button>
            <button title="Logout" className={`${styles.iconButton} ${styles.logoutButton}`} onClick={() => setShowLogoutConfirm(true)}>
              <FiLogOut />
            </button>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={`${styles.card} ${styles.mapCard}`}>
            <div className={styles.cardHeader}>
              <h2>{jobStatus === 'accepted' ? 'On The Way to Client...' : 'Live Status'}</h2>
            </div>
            <div className={styles.mapContainer}>
              {location ? (
                <WorkerMap
                  workerPosition={[location.lat, location.lng]}
                  jobRequest={jobStatus === 'accepted' ? jobRequest : null}
                  theme={theme}
                />
              ) : (
                <div className={styles.mapPlaceholder}>
                  <h2>{isLive ? "Acquiring Location..." : "You are Offline"}</h2>
                  <p>Go live to see the map and receive job requests.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <aside className={styles.sidebar}>
            <div className={`${styles.card} ${styles.profileCard}`}>
                <div className={styles.profileBanner}></div>
                <div className={styles.profileContent}>
                    <div className={styles.profileAvatarContainer} onClick={handleAvatarClick} title="Click to upload a new profile picture">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className={styles.profileImage} />
                        ) : (
                            <div className={styles.avatar}>
                                <span>{profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}</span>
                            </div>
                        )}
                        <div className={styles.editAvatarOverlay}>
                            <FiCamera />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg"
                    />
                    <div className={styles.profileInfo}>
                        <h2 className={styles.profileName}>{profile.firstName} {profile.lastName}</h2>
                        <p className={styles.profileService}>{profile.service || 'Service not set'}</p>
                    </div>
                </div>
            </div>

            <div className={`${styles.card} ${styles.earningsCard}`}>
                <div className={styles.cardHeader}>
                    <FiTrendingUp />
                    <h3>Your Earnings</h3>
                </div>
                <div className={styles.earningsGrid}>
                    <div className={styles.earningItem}>
                        <span className={styles.earningLabel}>Today</span>
                        <p className={styles.earningValue}>₹{formatNumber(earnings.today)}</p>
                    </div>
                    <div className={styles.earningItem}>
                        <span className={styles.earningLabel}>This Week</span>
                        <p className={styles.earningValue}>₹{formatNumber(earnings.week)}</p>
                    </div>
                    <div className={styles.earningItem}>
                        <span className={styles.earningLabel}>Bonus</span>
                        <p className={styles.earningValueBonus}>+ ₹{formatNumber(earnings.bonus)}</p>
                    </div>
                </div>
            </div>
           
        </aside>
      </div>

      <div style={{ display: 'none' }}>
        <SignOutButton ref={civicSignOutButtonRef} />
      </div>
    </div>
  );
}