"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@civic/auth/react'; // Import Civic's hook
import { CivicAuthButton } from '@/app/components/ui/CivicAuthButton'; // Import your Civic button
import styles from './worker.module.css';

export default function WorkerGatewayPage() {
  const router = useRouter();
  // Get the user and loading status from the Civic hook
  const { user, isInitializing } = useUser();

  // This function handles the redirect after a successful login
  const handleLoginRedirect = () => {
    // --- SIMULATION CONTROL ---
    // Change this to `true` to test the login flow for an EXISTING user
    const IS_EXISTING_USER = false;
    
    console.log("Civic login successful. Simulating backend check...");
    setTimeout(() => {
      if (IS_EXISTING_USER) {
        console.log("Redirecting existing user to dashboard...");
        router.push('/worker/dashboard');
      } else {
        console.log("Redirecting new user to onboarding...");
        router.push('/worker/onboarding');
      }
    }, 1500); // 1.5 second delay
  };

  // This useEffect hook is the key. It "listens" for when the `user` object
  // is populated by Civic after a successful authentication.
  useEffect(() => {
    if (user) {
      // Once we have a user, trigger the redirect logic.
      handleLoginRedirect();
    }
  }, [user]); // This hook runs only when the user object changes.

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Worker Portal</h1>
        <p className={styles.subtitle}>
          Sign in or create an account to manage your profile and jobs.
        </p>

        <div className={styles.buttonContainer}>
          {/* While Civic is loading or redirecting, show a spinner */}
          {isInitializing || user ? (
            <div className={styles.spinner}></div>
          ) : (
            // Otherwise, show the Civic button with Google and Apple options
            <CivicAuthButton signInMethods={['google', 'apple']} />
          )}
        </div>
      </div>
    </div>
  );
}