"use client";

import { useUser } from '@civic/auth/react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthRedirect() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // No automatic redirects - users can navigate freely after authentication
    // The profile page will be available when they choose to visit it
    console.log('User authenticated, but no automatic redirect');
  }, [user, isLoading, pathname, router]);

  // Don't render anything, this is just for redirect logic
  return null;
} 