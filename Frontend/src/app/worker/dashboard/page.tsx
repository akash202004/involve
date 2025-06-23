"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./dashboard.module.css";
import { useUser } from "@civic/auth/react";
import { useJobTracking } from "@/lib/jobTracking";
import { PageLoadAnimation, PulsingDots } from "@/components/LoadingAnimations";
import "leaflet/dist/leaflet.css";
import {
  FiUser,
  FiLogOut,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiBell,
  FiTrendingUp,
  FiList,
  FiTarget,
  FiNavigation,
  FiBriefcase,
  FiX,
  FiRadio,
  FiAlertTriangle,
  FiEdit,
  FiSave,
  FiActivity,
  FiPower,
  FiArchive,
  FiXCircle,
} from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

// --- Chart.js Imports for the Line Chart ---
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WorkerMap = dynamic(() => import("./WorkerMap"), {
  ssr: false,
  loading: () => <div className={styles.mapPlaceholder}>Loading Map...</div>,
});

const WeeklyLineChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 20, padding: 20, font: { size: 12 } },
      },
      title: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "rgba(200, 200, 200, 0.1)", borderDash: [5, 5] },
        beginAtZero: true,
      },
    },
    interaction: { mode: "index" as const, intersect: false },
  };
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Earnings ($)",
        data: [180, 400, 290, 350, 80, 500, 270],
        borderColor: "rgb(22, 163, 74)",
        backgroundColor: "rgba(22, 163, 74, 0.2)",
        tension: 0.3,
      },
      {
        fill: true,
        label: "Jobs Completed",
        data: [3, 8, 5, 6, 2, 9, 5],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
    ],
  };
  return (
    <div className={styles.lineChartContainer}>
      <Line options={options} data={data} />
    </div>
  );
};

// Updated types for job tracking
type JobStatus = "idle" | "incoming" | "accepted" | "in_progress" | "completed";
type LatLngTuple = [number, number];

interface JobRequest {
  id: string;
  distance: string;
  fare: number;
  title: string;
  clientLocation: LatLngTuple;
  description: string;
  location: string;
  lat: number;
  lng: number;
  userId: string;
  durationMinutes?: number;
}

type HistoryJob = JobRequest & { status: "completed" | "declined" };

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const {
    currentJob,
    assignedWorker,
    isJobAccepted,
    isTrackingActive,
    workerLocation,
    acceptJob,
    updateLocation,
    completeJob,
    isSocketConnected,
    connectSocket,
    error,
    clearError,
  } = useJobTracking();

  const [theme, setTheme] = useState("light");
  const [isLive, setIsLive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [jobStatus, setJobStatus] = useState<JobStatus>("idle");
  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
  const [jobHistory, setJobHistory] = useState<HistoryJob[]>([]);
  const [route, setRoute] = useState<LatLngTuple[] | null>(null);

  // Profile state
  const [profile, setProfile] = useState<{
    firstName: string;
    imageUrl: string | null;
  }>({ firstName: "Worker", imageUrl: null });

  const [earnings, setEarnings] = useState(0);
  const [timeWorked, setTimeWorked] = useState(0);
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [performance] = useState({ rating: 4.8, successRate: 96 });
  const [weeklyGoal, setWeeklyGoal] = useState({ target: 2000 });
  const [goalInput, setGoalInput] = useState("2000");
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Connect to socket when component mounts
  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  // Handle incoming job notifications
  useEffect(() => {
    if (currentJob && !isJobAccepted) {
      // Convert current job to job request format
      const newJobRequest: JobRequest = {
        id: currentJob.id,
        distance: "2.5 km", // You can calculate this
        fare: 500, // You can calculate this based on distance
        title: currentJob.description,
        clientLocation: [currentJob.lat, currentJob.lng] as LatLngTuple,
        description: currentJob.description,
        location: currentJob.location,
        lat: currentJob.lat,
        lng: currentJob.lng,
        userId: currentJob.userId,
        durationMinutes: currentJob.durationMinutes,
      };

      setJobRequest(newJobRequest);
      setJobStatus("incoming");
    }
  }, [currentJob, isJobAccepted]);

  // Handle job acceptance
  useEffect(() => {
    if (isJobAccepted && currentJob) {
      setJobStatus("accepted");
      setJobRequest(null);

      // Start location tracking if worker is live
      if (isLive && location) {
        startLocationTracking();
      }
    }
  }, [isJobAccepted, currentJob, isLive, location]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("worker-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className =
      savedTheme === "dark" ? styles.darkTheme : "";
  }, []);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | undefined = undefined;
    if (isLive) {
      timerInterval = setInterval(() => {
        setTimeWorked((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timerInterval);
    };
  }, [isLive]);

  useEffect(() => {
    if (isLive) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(
            "Could not get location. Please enable location services."
          );
          setIsLive(false);
        },
        { enableHighAccuracy: true }
      );
      watchIdRef.current = navigator.geolocation.watchPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
      setLocation(null);
    }
    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isLive]);

  const fetchRoute = async (
    start: { lat: number; lng: number },
    end: LatLngTuple
  ) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const routeCoords = data.routes[0].geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] as LatLngTuple
        );
        setRoute(routeCoords);
      }
    } catch (e) {
      console.error("Failed to fetch route:", e);
    }
  };

  const handleSimulateJob = () => {
    if (!isLive || !location) {
      alert("You must be 'Online' to receive jobs.");
      return;
    }
    if (jobStatus !== "idle") {
      alert("You already have an active job offer.");
      return;
    }

    const clientLat = location.lat + (Math.random() - 0.5) * 0.1;
    const clientLng = location.lng + (Math.random() - 0.5) * 0.1;

    setJobRequest({
      id: Date.now().toString(),
      title: "New Delivery Request",
      distance: (Math.random() * 8 + 1).toFixed(1),
      fare: Math.floor(Math.random() * 25 + 15),
      clientLocation: [clientLat, clientLng] as LatLngTuple,
      description: "New Delivery Request",
      location: "New Delivery Request",
      lat: clientLat,
      lng: clientLng,
      userId: user?.id || "",
    });
    setJobStatus("incoming");
  };

  const handleAcceptJob = () => {
    setJobStatus("accepted");
    if (location && jobRequest) {
      fetchRoute(location, jobRequest.clientLocation);
    }
  };

  const resetJobState = () => {
    setJobStatus("idle");
    setJobRequest(null);
    setRoute(null);
  };

  const handleDeclineJob = () => {
    if (jobRequest) {
      setJobHistory((prev) => [{ ...jobRequest, status: "declined" }, ...prev]);
    }
    resetJobState();
  };

  const handleCompleteJob = () => {
    if (jobRequest) {
      setEarnings((prevEarnings) => prevEarnings + jobRequest.fare);
      setJobsCompleted((prevCount) => prevCount + 1);
      setJobHistory((prev) => [
        { ...jobRequest, status: "completed" },
        ...prev,
      ]);
    }
    resetJobState();
  };

  const handleSetGoal = () => {
    const newTarget = parseInt(goalInput, 10);
    if (!isNaN(newTarget) && newTarget > 0) {
      setWeeklyGoal({ target: newTarget });
      setIsEditingGoal(false);
    } else {
      alert("Please enter a valid positive number for your goal.");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("worker-theme", newTheme);
    document.documentElement.className =
      newTheme === "dark" ? styles.darkTheme : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    router.push("/");
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isJobIncoming = jobStatus === "incoming" && jobRequest;
  const isJobAcceptedWorker = jobStatus === "accepted" && jobRequest;

  // Start location tracking for accepted job
  const startLocationTracking = () => {
    if (!currentJob || !user?.id || !isLive) return;

    const locationInterval = setInterval(() => {
      if (location && isTrackingActive) {
        updateLocation(currentJob.id, user.id, location.lat, location.lng);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(locationInterval);
  };

  return (
    <>
      {isJobIncoming && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>New Job Offer!</h3>
              <button
                onClick={handleDeclineJob}
                className={styles.closeModalButton}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.jobDetails}>
                <FiNavigation className={styles.jobIcon} />
                <div className={styles.jobInfoText}>
                  <span className={styles.title}>{jobRequest.title}</span>
                  <span className={styles.detail}>
                    <FiMapPin size={14} /> {jobRequest.distance} km away
                  </span>
                  <span className={styles.detail}>
                    <FiDollarSign size={14} /> Est. Fare: ${jobRequest.fare}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={`${styles.jobButton} ${styles.declineButton}`}
                onClick={handleDeclineJob}
              >
                Decline
              </button>
              <button
                className={`${styles.jobButton} ${styles.acceptButton}`}
                onClick={handleAcceptJob}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.pageWrapper}>
        <div className={styles.dashboardContainer}>
          <header className={styles.header}>
            <div className={styles.logo}>
              <h1>WorkerPro</h1>
            </div>
            <div className={styles.headerActions}>
              <button
                className={`${styles.iconButton} ${styles.goLiveButton} ${
                  isLive ? styles.live : ""
                }`}
                onClick={() => setIsLive(!isLive)}
                title={isLive ? "Go Offline" : "Go Live"}
              >
                <FiRadio />
              </button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                className={styles.iconButton}
                title="Check for new jobs"
                onClick={handleSimulateJob}
                disabled={!isLive || jobStatus !== "idle"}
              >
                <FiBell />
                {isLive && jobStatus === "idle" && (
                  <div className={styles.notificationIndicator}></div>
                )}
              </button>
              <div className={styles.profileBlock}>
                <button
                  className={styles.iconButton}
                  onClick={() => router.push("/worker/onboarding")}
                >
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt="Profile"
                      className={styles.profilePicture}
                    />
                  ) : (
                    <FiUser />
                  )}
                </button>
                <span className={styles.profileName}>{profile.firstName}</span>
              </div>
              <button
                className={styles.iconButton}
                onClick={handleLogout}
                title="Logout"
              >
                <FiLogOut />
              </button>
            </div>
          </header>

          <main className={styles.contentGrid}>
            <div className={`${styles.card} ${styles.mapCard}`}>
              <h3 className={styles.cardHeader}>
                <FiMapPin /> Live Map
              </h3>
              <div className={styles.mapContainer}>
                {isLive && location ? (
                  <WorkerMap
                    workerPosition={[location.lat, location.lng]}
                    clientPosition={
                      jobRequest ? jobRequest.clientLocation : null
                    }
                    route={route}
                  />
                ) : (
                  <div className={styles.mapPlaceholder}>
                    {locationError ? (
                      <>
                        <FiAlertTriangle size={48} color="var(--accent-red)" />
                        <p
                          style={{
                            color: "var(--accent-red)",
                            maxWidth: "80%",
                            textAlign: "center",
                          }}
                        >
                          {locationError}
                        </p>
                      </>
                    ) : (
                      <>
                        <FiNavigation size={48} />
                        <p>Go Live to see your position on the map.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.rightSidebar}>
              <div className={styles.statCardRow}>
                <div className={`${styles.card} ${styles.statCard}`}>
                  <div
                    className={styles.statIconContainer}
                    style={{
                      "--icon-bg-color": "rgba(16, 185, 129, 0.1)",
                      "--icon-color": "var(--accent-green)",
                    }}
                  >
                    <FiDollarSign className={styles.statIcon} />
                  </div>
                  <div className={styles.statTextContainer}>
                    <div className={styles.statValue}>
                      ${earnings.toFixed(2)}
                    </div>
                    <div className={styles.subtleHeader}>Earnings</div>
                  </div>
                </div>
                <div className={`${styles.card} ${styles.statCard}`}>
                  <div
                    className={styles.statIconContainer}
                    style={{
                      "--icon-bg-color": "rgba(59, 130, 246, 0.1)",
                      "--icon-color": "var(--accent-blue)",
                    }}
                  >
                    <FiClock className={styles.statIcon} />
                  </div>
                  <div className={styles.statTextContainer}>
                    <div className={styles.statValue}>
                      {formatTime(timeWorked)}
                    </div>
                    <div className={styles.subtleHeader}>Time</div>
                  </div>
                </div>
                <div className={`${styles.card} ${styles.statCard}`}>
                  <div
                    className={styles.statIconContainer}
                    style={{
                      "--icon-bg-color": "rgba(139, 92, 246, 0.1)",
                      "--icon-color": "var(--accent-purple)",
                    }}
                  >
                    <FiCheckCircle className={styles.statIcon} />
                  </div>
                  <div className={styles.statTextContainer}>
                    <div className={styles.statValue}>{jobsCompleted}</div>
                    <div className={styles.subtleHeader}>Jobs</div>
                  </div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.chartCard}`}>
                <h3 className={styles.cardHeader}>
                  <FiActivity /> Weekly Activity
                </h3>
                <WeeklyLineChart />
              </div>
            </div>

            <div
              className={`${styles.card} ${styles.opportunitiesCard} ${
                isJobAccepted ? styles.highlight : ""
              }`}
            >
              <h3 className={styles.cardHeader}>
                <FiBriefcase /> Active Job
              </h3>
              {isJobAccepted && jobRequest ? (
                <div className={styles.activeJobContent}>
                  <div className={styles.activeJobRow}>
                    <span className={styles.activeJobLabel}>Status</span>
                    <span
                      className={`${styles.statusBadge} ${styles.statusInProgress}`}
                    >
                      In Progress
                    </span>
                  </div>
                  <div className={styles.activeJobRow}>
                    <span className={styles.activeJobLabel}>Task</span>
                    <span className={styles.activeJobValue}>
                      {jobRequest.title}
                    </span>
                  </div>
                  <div className={styles.activeJobRow}>
                    <span className={styles.activeJobLabel}>Est. Fare</span>
                    <span className={styles.activeJobValue}>
                      ${jobRequest.fare.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className={`${styles.jobButton} ${styles.completeButton}`}
                    onClick={handleCompleteJob}
                  >
                    Complete Job
                  </button>
                </div>
              ) : (
                <div className={styles.emptyStateContainer}>
                  <FiPower size={48} className={styles.emptyStateIcon} />
                  <h4 className={styles.emptyStateTitle}>
                    {isLive ? "Ready for Jobs" : "You Are Offline"}
                  </h4>
                  <p className={styles.emptyStateText}>
                    {isLive
                      ? "Waiting for the next available job in your area."
                      : "Go live to start receiving job alerts from clients."}
                  </p>
                  {!isLive && (
                    <button
                      className={`${styles.jobButton} ${styles.goLiveCardButton}`}
                      onClick={() => setIsLive(true)}
                    >
                      <FiRadio /> Go Live
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className={`${styles.card} ${styles.recentJobsCard}`}>
              <h3 className={styles.cardHeader}>
                <FiList /> Job History
              </h3>
              {jobHistory.length > 0 ? (
                <div className={styles.jobList}>
                  {jobHistory.map((job) => (
                    <div className={styles.jobItem} key={job.id}>
                      <div className={styles.jobItemIcon}>
                        {job.status === "completed" ? (
                          <FiCheckCircle
                            style={{ color: "var(--accent-green)" }}
                          />
                        ) : (
                          <FiXCircle style={{ color: "var(--accent-red)" }} />
                        )}
                      </div>
                      <div className={styles.jobItemInfo}>
                        <span className={styles.jobItemTitle}>{job.title}</span>
                        <span className={styles.jobItemCompany}>
                          Distance: {job.distance} km
                        </span>
                      </div>
                      <div className={styles.jobItemFare}>
                        ${job.fare.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyStateContainer}>
                  <FiArchive size={48} className={styles.emptyStateIcon} />
                  <h4 className={styles.emptyStateTitle}>No Job History</h4>
                  <p className={styles.emptyStateText}>
                    Your completed and declined jobs will appear here.
                  </p>
                </div>
              )}
            </div>

            <div className={`${styles.card} ${styles.performanceCard}`}>
              <h3 className={styles.cardHeader}>
                <FiTrendingUp /> Performance
              </h3>
              <div className={styles.performanceContent}>
                <div>
                  <div
                    className={styles.circularProgress}
                    style={
                      {
                        "--v": `${(performance.rating / 5) * 100}%`,
                      } as React.CSSProperties
                    }
                  >
                    <span className={styles.progressValue}>
                      {performance.rating}
                    </span>
                  </div>
                  <p className={styles.performanceLabel}>Avg. Rating</p>
                </div>
                <div>
                  <div
                    className={`${styles.circularProgress} ${styles.green}`}
                    style={
                      {
                        "--v": `${performance.successRate}%`,
                      } as React.CSSProperties
                    }
                  >
                    <span className={styles.progressValue}>
                      {performance.successRate}%
                    </span>
                  </div>
                  <p className={styles.performanceLabel}>Success Rate</p>
                </div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.goalCard}`}>
              <div className={styles.goalHeader}>
                <h3 className={styles.cardHeader}>
                  <FiTarget /> Weekly Goal
                </h3>
                <button
                  className={styles.editGoalButton}
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                >
                  {isEditingGoal ? <FiX /> : <FiEdit />}
                </button>
              </div>
              {isEditingGoal ? (
                <div className={styles.goalEditContainer}>
                  <input
                    type="number"
                    className={styles.goalInput}
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Enter new goal"
                  />
                  <button
                    className={styles.goalSetButton}
                    onClick={handleSetGoal}
                  >
                    <FiSave /> Set
                  </button>
                </div>
              ) : (
                <div className={styles.goalDisplay}>
                  <div
                    className={styles.goalCircularProgress}
                    style={
                      {
                        "--progress": `${Math.min(
                          100,
                          (earnings / weeklyGoal.target) * 100
                        )}%`,
                      } as React.CSSProperties
                    }
                  >
                    <div className={styles.goalInnerCircle}>
                      <span className={styles.goalCurrentValue}>
                        ${earnings.toFixed(2)}
                      </span>
                      <span className={styles.goalPercentage}>
                        {Math.round((earnings / weeklyGoal.target) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className={styles.goalTargetText}>
                    Target:{" "}
                    <span className={styles.goalTargetValue}>
                      ${weeklyGoal.target.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
