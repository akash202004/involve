"use client";

import { useEnsureUser } from "@/lib/useEnsureUser";

export const UserEnsurer = () => {
  const { isEnsuring, error } = useEnsureUser();

  // This component doesn't render anything visible
  // It just ensures the user exists in the database
  return null;
};
