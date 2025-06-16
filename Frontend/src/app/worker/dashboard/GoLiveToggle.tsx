"use client";

import styles from './dashboard.module.css';

interface GoLiveToggleProps {
  isLive: boolean;
  onToggle: () => void;
}

export default function GoLiveToggle({ isLive, onToggle }: GoLiveToggleProps) {
  return (
    <div className={styles.toggleContainer}>
      <span className={styles.toggleLabel}>{isLive ? 'You are Live' : 'You are Offline'}</span>
      <button onClick={onToggle} className={`${styles.toggleButton} ${isLive ? styles.live : ''}`}>
        <div className={styles.toggleCircle}></div>
      </button>
    </div>
  );
}