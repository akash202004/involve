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
            <div className={styles.launchWrapper}>
                {/* Add some stars for effect */}
                <div className={styles.star} style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
                <div className={styles.star} style={{ top: '50%', left: '30%', animationDelay: '1s' }}></div>
                <div className={styles.star} style={{ top: '30%', left: '80%', animationDelay: '2s' }}></div>
                <div className={styles.star} style={{ top: '80%', left: '90%', animationDelay: '0.5s' }}></div>
                <div className={styles.star} style={{ top: '60%', left: '50%', animationDelay: '1.5s' }}></div>

                <div className={styles.rocket} style={{ bottom: `${progress}%` }}>
                    <div className={styles.rocketFlame}></div>
                    <svg className={styles.rocketSvg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M9.5 14.5C9.5 15.0523 9.94772 15.5 10.5 15.5C11.0523 15.5 11.5 15.0523 11.5 14.5V9.5C11.5 8.94772 11.0523 8.5 10.5 8.5C9.94772 8.5 9.5 8.94772 9.5 9.5V14.5Z" />
                        <path d="M12.5 14.5C12.5 15.0523 12.9477 15.5 13.5 15.5C14.0523 15.5 14.5 15.0523 14.5 14.5V9.5C14.5 8.94772 14.0523 8.5 13.5 8.5C12.9477 8.5 12.5 8.94772 12.5 9.5V14.5Z" />
                        <path d="M7.5 14.5C7.5 15.3284 8.17157 16 9 16H15C15.8284 16 16.5 15.3284 16.5 14.5V8.5L14.5 4.5H9.5L7.5 8.5V14.5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 20.5C10 21.3284 9.32843 22 8.5 22H7.5C6.67157 22 6 21.3284 6 20.5V19.5H10V20.5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 20.5C14 21.3284 14.6716 22 15.5 22H16.5C17.3284 22 18 21.3284 18 20.5V19.5H14V20.5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 4.5L12 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
            <div className={styles.progressText}>
                {loadingText} ({progress}%)
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