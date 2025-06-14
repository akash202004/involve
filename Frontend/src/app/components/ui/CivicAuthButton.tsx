"use client";

import { useUser } from '@civic/auth/react';
import { NavbarButton } from './resizable-navbar';
import { useRouter } from 'next/navigation';

export function CivicAuthButton() {
  const { user, signIn, signOut } = useUser();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      console.log("Starting sign-in process");
      await signIn();
      console.log("Sign-in completed successfully");
    } catch (error) {
      console.error("Sign-in failed:", error);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Starting sign-out process");
      await signOut();
      console.log("Sign-out completed successfully");
      router.push('/');
    } catch (error) {
      console.error("Sign-out failed:", error);
      alert(`Sign-out failed: ${error.message}`);
    }
  };

  if (user) {
    return (
      <NavbarButton 
        variant="transparent"
        onClick={handleSignOut}
      >
        Logout
      </NavbarButton>
    );
  }

  return (
    <NavbarButton 
      variant="primary" 
      onClick={handleSignIn}
    >
      Login
    </NavbarButton>
  );
} 