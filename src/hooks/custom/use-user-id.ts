import { useEffect, useRef, useState } from "react";

import { USER_ID_KEY } from "@/constants/storage";
import { getUserId } from "@/utils/user-id";

export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    initialized.current = true;

    const initializeUser = () => {
      try {
        // Check if user ID already exists before calling getUserId
        const existingId = localStorage.getItem(USER_ID_KEY);
        const wasUserCreated = existingId !== null;

        // Get or generate user ID
        const id = getUserId();

        setUserId(id);
        setIsNewUser(!wasUserCreated);
      } catch (error) {
        console.error("Error initializing user:", error);
        // Fallback: generate a new ID
        const fallbackId = getUserId();
        setUserId(fallbackId);
        setIsNewUser(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  return {
    userId,
    isLoading,
    isNewUser,
  };
};
