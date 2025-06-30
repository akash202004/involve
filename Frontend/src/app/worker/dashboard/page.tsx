"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./dashboard.module.css";
import { useUser } from "@clerk/clerk-react";
import "leaflet/dist/leaflet.css";
import JobRequestCard from "./jobRequestCard";
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
import { useWorkerDashboard } from "./useWorkerDashboard";
import socketManager from "@/lib/socket";
import GoLiveButton from "./GoLiveButton";

const WorkerMap = dynamic(() => import("./WorkerMap"), {
  ssr: false,
  loading: () => <div className={styles.mapPlaceholder}>Loading Map...</div>,
});

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const {
    // State
    theme,
    isLive,
    location,
    locationError,
    jobStatus,
    jobRequest,
    jobHistory,
    route,
    routeLoading,
    countdownTime,
    earnings,
    timeWorked,
    jobsCompleted,
    performance,
    weeklyGoal,
    isEditingGoal,
    goalInput,
    profile,
    workerId,

    // Handlers
    toggleTheme,
    toggleLiveStatus,
    handleAcceptJob,
    handleDeclineJob,
    handleCompleteJob,
    handleSetGoal,
    setGoalInput,
    setIsEditingGoal,
    handleLogout,
    checkWorkerStatus,
    testJobBroadcast,
  } = useWorkerDashboard();

  // Active job UI state
  const isJobIncoming = jobStatus === "incoming" && jobRequest;
  const isJobAccepted = jobStatus === "accepted" && jobRequest;
  const [showJobRequests, setShowJobRequests] = useState(false);

  // Format time helper function (kept inline as requested)
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Job Request Modal */}
      {isJobIncoming && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>New Job Offer!</h3>
              <button
                onClick={handleDeclineJob}
                className={styles.closeModalButton}
                title="Close job offer"
                aria-label="Close job offer"
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
                    <FiDollarSign size={14} /> Est. Fare: ₹{jobRequest.fare}
                  </span>
                  {countdownTime > 0 && (
                    <span className={styles.countdown}>
                      <FiClock size={14} /> Time remaining:{" "}
                      {Math.floor(countdownTime / 60)}:
                      {(countdownTime % 60).toString().padStart(2, "0")}
                    </span>
                  )}
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

      {showJobRequests && jobRequest && (
        <JobRequestCard
          job={jobRequest}
          onAccept={handleAcceptJob}
          onDecline={handleDeclineJob}
          onClose={() => setShowJobRequests(false)}
        />
      )}

      {/* Debug info */}
      {showJobRequests && !jobRequest && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            background: "white",
            padding: "20px",
            border: "1px solid black",
            zIndex: 1000,
          }}
        >
          <p>Debug: showJobRequests is true but jobRequest is null</p>
          <p>jobStatus: {jobStatus}</p>
          <p>isLive: {isLive.toString()}</p>
          <button onClick={() => setShowJobRequests(false)}>Close</button>
        </div>
      )}

      {/* Main Dashboard */}
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
                onClick={toggleLiveStatus}
                title={isLive ? "Go Offline" : "Go Live"}
                disabled={!workerId}
              >
                <FiRadio />
              </button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                className={styles.iconButton}
                title="Test Job Broadcast"
                onClick={testJobBroadcast}
                style={{ backgroundColor: "#f59e0b", color: "white" }}
              >
                🧪
              </button>
              <button
                className={styles.iconButton}
                title="Check Worker Status"
                onClick={checkWorkerStatus}
                style={{ backgroundColor: "#10b981", color: "white" }}
              >
                📊
              </button>
              <button
                className={styles.iconButton}
                title="Notifications"
                onClick={() => {
                  console.log("Notification clicked, jobRequest:", jobRequest);
                  console.log("showJobRequests will be:", !showJobRequests);
                  setShowJobRequests(true);
                }}
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
                  onClick={() => router.push("/worker/profile")}
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
            {/* Map Card */}
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

            {/* Stats Cards */}
            <div className={styles.rightSidebar}>
              <div className={styles.statCardRow}>
                <div className={`${styles.card} ${styles.statCard}`}>
                  <div
                    className={styles.statIconContainer}
                    style={
                      {
                        "--icon-bg-color": "rgba(16, 185, 129, 0.1)",
                      } as React.CSSProperties
                    }
                  >
                    <FiDollarSign className={styles.statIcon} />
                  </div>
                  <div className={styles.statTextContainer}>
                    <div className={styles.statValue}>
                      ₹{earnings.toFixed(2)}
                    </div>
                    <div className={styles.subtleHeader}>Earnings</div>
                  </div>
                </div>
                <div className={`${styles.card} ${styles.statCard}`}>
                  <div
                    className={styles.statIconContainer}
                    style={
                      {
                        "--icon-bg-color": "rgba(59, 130, 246, 0.1)",
                      } as React.CSSProperties
                    }
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
                    style={
                      {
                        "--icon-bg-color": "rgba(139, 92, 246, 0.1)",
                      } as React.CSSProperties
                    }
                  >
                    <FiCheckCircle className={styles.statIcon} />
                  </div>
                  <div className={styles.statTextContainer}>
                    <div className={styles.statValue}>{jobsCompleted}</div>
                    <div className={styles.subtleHeader}>Jobs</div>
                  </div>
                </div>
              </div>

              {/* Active Job Card */}
              <div
                className={`${styles.card} ${styles.opportunitiesCard} ${
                  isJobAccepted ? styles.highlight : ""
                }`}
              >
                <h3 className={styles.cardHeader}>
                  <FiBriefcase /> Active Job
                </h3>
                {isJobAccepted ? (
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
                        ₹{jobRequest.fare.toFixed(2)}
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
                      <GoLiveButton
                        onClick={toggleLiveStatus}
                        disabled={!workerId}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Job History Card */}
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
                        ₹{job.fare.toFixed(2)}
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

            {/* Performance Card */}
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

            {/* Weekly Goal Card */}
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
                        ₹{earnings.toFixed(2)}
                      </span>
                      <span className={styles.goalPercentage}>
                        {Math.round((earnings / weeklyGoal.target) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className={styles.goalTargetText}>
                    Target:{" "}
                    <span className={styles.goalTargetValue}>
                      ₹{weeklyGoal.target.toLocaleString()}
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
