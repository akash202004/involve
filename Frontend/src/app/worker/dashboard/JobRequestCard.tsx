// JobRequestCard.tsx
"use client";

import styles from './dashboard.module.css';
import { FiMapPin, FiDollarSign, FiStar } from 'react-icons/fi';

interface JobRequest {
  distance: number;
  fare: number;
  bonus: number;
  clientLocationName: string;
}

interface JobRequestCardProps {
  job: JobRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export default function JobRequestCard({ job, onAccept, onDecline }: JobRequestCardProps) {
  return (
    <div className={styles.confirmationOverlay}>
      <div className={styles.jobRequestCard}>
        <div className={styles.jobRequestHeader}>
          <h3>New Job Request</h3>
          <p>Pickup from {job.clientLocationName}</p>
        </div>
        <div className={styles.jobDetails}>
          <div className={styles.jobDetailItem}>
            <FiMapPin />
            <span>{job.distance} km</span>
          </div>
          <div className={styles.jobDetailItem}>
            <FiDollarSign />
            <span>₹{job.fare}</span>
          </div>
          <div className={styles.jobDetailItem}>
            <FiStar />
            <span className={styles.earningValueBonus}>+ ₹{job.bonus}</span>
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