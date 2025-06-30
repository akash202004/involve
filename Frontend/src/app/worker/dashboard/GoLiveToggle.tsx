import styles from './dashboard.module.css';

interface GoLiveToggleProps {
  isLive: boolean;
  onToggle: () => void;
  loading?: boolean; // Add loading state
}

export default function GoLiveToggle({ 
  isLive, 
  onToggle,
  loading = false 
}: GoLiveToggleProps) {
  return (
    <div 
      className={`${styles.toggleContainer} ${loading ? styles.disabled : ''}`} 
      onClick={!loading ? onToggle : undefined}
      aria-busy={loading}
    >
      <span className={styles.toggleLabel}>
        {loading ? 'Updating...' : isLive ? 'Online' : 'Offline'}
      </span>
      <div className={`${styles.toggleTrack} ${isLive ? styles.live : ''}`}>
        <div className={styles.toggleThumb} />
      </div>
      {loading && <span className={styles.loadingSpinner} />}
    </div>
  );
}