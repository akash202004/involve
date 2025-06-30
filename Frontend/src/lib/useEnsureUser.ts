import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ensureUserExists, type User } from "./userService";

export const useEnsureUser = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isEnsuring, setIsEnsuring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ensureUser = async () => {
      if (!isLoaded) return;

      if (!isSignedIn || !user) {
        setDbUser(null);
        setError(null);
        return;
      }

      setIsEnsuring(true);
      setError(null);

      try {
        const userData = await ensureUserExists(user);
        setDbUser(userData);

        if (userData) {
          console.log("✅ User ensured in database:", userData.id);
        } else {
          console.log("⚠️ Failed to ensure user in database");
          setError("Failed to sync user data");
        }
      } catch (err) {
        console.error("Error ensuring user:", err);
        setError("Failed to sync user data");
      } finally {
        setIsEnsuring(false);
      }
    };

    ensureUser();
  }, [user, isSignedIn, isLoaded]);

  return {
    dbUser,
    isEnsuring,
    error,
    isLoaded,
    isSignedIn,
  };
};
