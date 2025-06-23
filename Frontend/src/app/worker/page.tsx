"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@civic/auth/react';

import styles from './worker.module.css';

const WorkerIntroAnimation = () => (
    <div className={styles.introContainer}>
        <div className={styles.introLogo}>
            <span className={styles.introLogoLetter}>W</span>
        </div>
    </div>
);

interface ThemedLoadingAnimationProps {
    loadingText: string;
    onAnimationComplete: () => void;
}

const ThemedLoadingAnimation = ({ loadingText, onAnimationComplete }: ThemedLoadingAnimationProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                    return 100;
                }
                return prev + 1;
            });
        }, 35); // Timed for a smooth launch

        return () => clearInterval(interval);
    }, [onAnimationComplete]);

    return (
        <div className={styles.loadingContainer}>
            <div className={styles.circularLoaderWrapper}>
                {/* Circular Progress Ring */}
                <div className={styles.circularProgress}>
                    <svg className={styles.progressRing} viewBox="0 0 120 120">
                        <circle
                            className={styles.progressRingTrack}
                            cx="60"
                            cy="60"
                            r="54"
                            strokeWidth="8"
                        />
                        <circle
                            className={styles.progressRingFill}
                            cx="60"
                            cy="60"
                            r="54"
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 54}`}
                            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                        />
                    </svg>
                    
                    {/* Center Content */}
                    <div className={styles.centerContent}>
                        <div className={styles.loadingIcon}>
                            <div className={styles.rotatingCircle}></div>
                        </div>
                        <div className={styles.progressNumber}>{progress}%</div>
                    </div>
                </div>
                
                {/* Orbiting dots */}
                <div className={styles.orbitingDots}>
                    <div className={styles.orbitDot} style={{ animationDelay: '0s' }}></div>
                    <div className={styles.orbitDot} style={{ animationDelay: '0.5s' }}></div>
                    <div className={styles.orbitDot} style={{ animationDelay: '1s' }}></div>
                    <div className={styles.orbitDot} style={{ animationDelay: '1.5s' }}></div>
                </div>
            </div>
            
            <div className={styles.progressText}>
                {loadingText} {progress === 100 ? 'Complete!' : 'Loading...'}
            </div>
        </div>
    );
};

export default function WorkerGatewayPage() {
    const router = useRouter();
    const { user, isLoading } = useUser();

    const [hasIntroPlayed, setHasIntroPlayed] = useState(
        () => typeof window !== 'undefined' && sessionStorage.getItem('introPlayed') === 'true'
    );

    useEffect(() => {
        const handleFocus = () => window.location.reload();
        if (hasIntroPlayed) window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [hasIntroPlayed]);

    useEffect(() => {
        if (!hasIntroPlayed) {
            const introTimer = setTimeout(() => {
                sessionStorage.setItem('introPlayed', 'true');
                setHasIntroPlayed(true);
            }, 2500);
            return () => clearTimeout(introTimer);
        }
    }, [hasIntroPlayed]);

    const handleRedirect = useCallback(() => {
        if (!user) return;
        console.log("Animation complete. Redirecting now...");
        localStorage.setItem('workerSessionActive', 'true');
        const workerProfile = localStorage.getItem(`workerProfile_${user.id}`);
        
        if (workerProfile) {
            router.push('/worker/dashboard');
        } else {
            router.push(`/worker/onboarding?email=${encodeURIComponent(user.email || '')}`);
        }
    }, [user, router]);

    
    if (!hasIntroPlayed) {
        return <WorkerIntroAnimation />;
    }

    if (isLoading || user) {
        const text = user ? "Launching " : "";
        // Using the new ThemedLoadingAnimation component
        return <ThemedLoadingAnimation loadingText={text} onAnimationComplete={handleRedirect} />;
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.logo}>W</div>
                <h1 className={styles.title}>Worker Portal</h1>
                <p className={styles.subtitle}>
                    Sign in or create an account to manage your profile and jobs.
                </p>
                <div className={styles.buttonContainer}>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}