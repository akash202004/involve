"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import styles from "./worker.module.css";

const WorkerIntroAnimation = () => (
  <div className={styles.introContainer}>
    <div className={styles.introLogo}>
      <span className={styles.introLogoLetter}>W</span>
    </div>
  </div>
);

interface SimpleLoadingAnimationProps {
  loadingText: string;
  onAnimationComplete: () => void;
}

const SimpleLoadingAnimation = ({
  loadingText,
  onAnimationComplete,
}: SimpleLoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }, 500); // Small delay before redirect
          return 100;
        }
        return prev + 2; // Faster progress
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onAnimationComplete]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Simple spinning loader */}
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
        </div>

        {/* Progress bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mb-4 mx-auto">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading text */}
        <p className="text-gray-600 font-medium">
          {loadingText} {progress === 100 ? "Complete!" : `${progress}%`}
        </p>
      </div>
    </div>
  );
};

export default function WorkerGatewayPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isClient, setIsClient] = useState(false);

  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
  const [hover, setHover] = useState(false);

  // Set client flag and check sessionStorage
  useEffect(() => {
    setIsClient(true);
    const introPlayed = sessionStorage.getItem("introPlayed") === "true";
    setHasIntroPlayed(introPlayed);
  }, []);

  useEffect(() => {
    const handleFocus = () => window.location.reload();
    if (hasIntroPlayed) window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [hasIntroPlayed]);

  useEffect(() => {
    if (!hasIntroPlayed) {
      const introTimer = setTimeout(() => {
        sessionStorage.setItem("introPlayed", "true");
        setHasIntroPlayed(true);
      }, 2500);
      return () => clearTimeout(introTimer);
    }
  }, [hasIntroPlayed]);

  const handleRedirect = useCallback(() => {
    if (!user) return;
    console.log("Animation complete. Redirecting now...");
    localStorage.setItem("workerSessionActive", "true");
    const workerProfile = localStorage.getItem(`workerProfile_${user.id}`);

    if (workerProfile) {
      router.push("/worker/dashboard");
    } else {
      router.push(
        `/worker/onboarding?email=${encodeURIComponent(
          user.primaryEmailAddress?.emailAddress || ""
        )}`
      );
    }
  }, [user, router]);

  if (!hasIntroPlayed) {
    return <WorkerIntroAnimation />;
  }

  if (!isLoaded || user) {
    const text = user ? "Launching Worker Portal" : "Loading";
    return (
      <SimpleLoadingAnimation
        loadingText={text}
        onAnimationComplete={handleRedirect}
      />
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100vw' }}>
      <div style={{ background: '#fff', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.container} style={{ background: '#fff' }}>
          <div className={styles.logo} style={{ background: '#FACC15', color: '#fff', fontWeight: 700, fontSize: '2.2rem', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: '0 2px 8px rgba(250,204,21,0.10)' }}>W</div>
          <h1 className={styles.title} style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '2.2rem', marginBottom: 12 }}>Worker Portal</h1>
          <p className={styles.subtitle} style={{ color: '#444', fontSize: '1.1rem', marginBottom: 32 }}>
            Sign in or create an account to manage your profile and jobs.
          </p>
          <div className={styles.buttonContainer}>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                background: hover ? '#fde047' : '#FACC15',
                color: hover ? '#b45309' : '#fff',
                fontWeight: 600,
                transition: 'background 0.18s, color 0.18s',
              }}
              className="font-bold py-2 px-4 rounded"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
