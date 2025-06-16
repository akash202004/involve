"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@civic/auth/react';
import { CivicAuthButton } from '@/app/components/ui/CivicAuthButton';
import styles from './worker.module.css';

export default function WorkerGatewayPage() {
  const router = useRouter();
  const { user, isInitializing } = useUser();

  // handles  login flow for workers
  useEffect(() => {
    
    if (user) {
     
      localStorage.setItem('workerSessionActive', 'true');

      // 2. Check if this specific user already has a profile saved.
      const workerProfile = localStorage.getItem(`workerProfile_${user.did}`);
      
      if (workerProfile) {
        
        console.log("Existing worker found. Redirecting to dashboard...");
        router.push('/worker/dashboard');
      } else {
        // If not, they are a new worker.
        console.log("New worker. Redirecting to onboarding...");
        // We pass their email to the onboarding form to be auto-filled.
        router.push(`/worker/onboarding?email=${encodeURIComponent(user.email || '')}`);
      }
    }
  }, [user, router]); 
  
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Worker Portal</h1>
        <p className={styles.subtitle}>
          Sign in or create an account to manage your profile and jobs.
        </p>

        <div className={styles.buttonContainer}>
          {isInitializing || user ? (
            <div className={styles.spinner}></div>
          ) : (
            <CivicAuthButton signInMethods={['google', 'apple']} />
          )}
        </div>
      </div>
    </div>
  );
}