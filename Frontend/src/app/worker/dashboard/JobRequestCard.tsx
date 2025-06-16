"use client";

import styles from './dashboard.module.css';

interface JobRequest {
  distance: number;
  fare: number;
  bonus: number;
  clientLocationName: string; // e.g., "Kolkata City Center"
}

interface JobRequestCardProps {
  job: JobRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export default function JobRequestCard({ job, onAccept, onDecline }: JobRequestCardProps) {
  return (
    <div className={styles.jobRequestOverlay}>
      <div className={styles.jobRequestCard}>
        <h3>New Job Request!</h3>
        <p className={styles.jobLocation}>Pickup from: {job.clientLocationName}</p>
        <div className={styles.jobDetailsGrid}>
          <div>
            <p>Trip Fare</p>
            <p className={styles.value}>₹{job.fare}</p>
          </div>
          <div>
            <p>Distance</p>
            <p className={styles.value}>{job.distance} km</p>
          </div>
          <div>
            <p>Bonus</p>
            <p className={styles.valueBonus}>+ ₹{job.bonus}</p>
          </div>
        </div>
        <div className={styles.jobActions}>
          <button className={styles.declineButton} onClick={onDecline}>Decline</button>
          <button className={styles.acceptButton} onClick={onAccept}>Accept</button>
        </div>
      </div>
    </div>
  );
}