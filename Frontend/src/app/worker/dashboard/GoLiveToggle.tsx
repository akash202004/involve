// GoLiveToggle.tsx
"use client";

import styles from './dashboard.module.css';

interface GoLiveToggleProps {
  isLive: boolean;
  onToggle: () => void;
}

export default function GoLiveToggle({ isLive, onToggle }: GoLiveToggleProps) {
  return (
    <div className={styles.toggleContainer} onClick={onToggle}>
      <span className={styles.toggleLabel}>{isLive ? 'Online' : 'Offline'}</span>
      <div className={`${styles.toggleTrack} ${isLive ? styles.live : ''}`}>
        <div className={styles.toggleThumb} />
      </div>
    </div>
  );
}