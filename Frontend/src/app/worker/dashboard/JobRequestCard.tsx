"use client";

import styles from './dashboard.module.css';
import { FiMapPin, FiDollarSign, FiStar, FiClock, FiUser, FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface JobRequest {
  id: string;
  distance: number;
  fare: number;
  bonus: number;
  clientLocationName: string;
  specialization: string;
  clientRating?: number;
  createdAt: Date;
  expiresIn: number;
}

interface JobRequestCardProps {
  job: JobRequest;
  onAccept: () => Promise<void> | void;
  onDecline: () => Promise<void> | void;
  onClose: () => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
}

export default function JobRequestCard({ 
  job, 
  onAccept, 
  onDecline,
  onClose,
  isAccepting = false,
  isDeclining = false
}: JobRequestCardProps) {
  const [timeLeft, setTimeLeft] = useState(job.expiresIn);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAccept = async () => {
    if (isExpired) return;
    await onAccept();
  };

  const handleDecline = async () => {
    if (isExpired) return;
    await onDecline();
  };

  return (
    <div className={`${styles.confirmationOverlay} ${isExpired ? styles.expired : ''}`}>
      <div className={styles.jobRequestCard}>
        <div className={styles.jobRequestHeader}>
          <div className={styles.jobBadge}>{job.specialization}</div>
          <h3>Job Request</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
          <p className={styles.locationName}>
            <FiMapPin /> {job.clientLocationName}
          </p>
        </div>

        <div className={styles.jobTimer}>
          <FiClock />
          <span>{timeLeft}s remaining</span>
          {isExpired && <span className={styles.expiredText}>Expired</span>}
        </div>

        <div className={styles.jobDetails}>
          <div className={styles.jobDetailItem}>
            <FiUser />
            <span>{job.clientRating ? `${job.clientRating}★` : 'New client'}</span>
          </div>
          <div className={styles.jobDetailItem}>
            <FiMapPin />
            <span>{job.distance.toFixed(1)} km</span>
          </div>
          <div className={styles.jobDetailItem}>
            <FiDollarSign />
            <span>₹{job.fare.toLocaleString()}</span>
          </div>
          {job.bonus > 0 && (
            <div className={styles.jobDetailItem}>
              <FiStar />
              <span className={styles.earningValueBonus}>+ ₹{job.bonus}</span>
            </div>
          )}
        </div>

        <div className={styles.jobActions}>
          <button 
            className={styles.declineButton} 
            onClick={handleDecline}
            disabled={isDeclining || isExpired || isAccepting}
          >
            {isDeclining ? 'Declining...' : 'Decline'}
          </button>
          <button 
            className={styles.acceptButton} 
            onClick={handleAccept}
            disabled={isAccepting || isExpired || isDeclining}
          >
            {isAccepting ? 'Accepting...' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}