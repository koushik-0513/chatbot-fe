import { useEffect, useRef, useState } from "react";

import { ObjectId } from "bson";

import { USER_ID_KEY } from "@/constants/storage";

export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    initialized.current = true;

    const initializeUser = () => {
      const existingId = localStorage.getItem(USER_ID_KEY);

      if (existingId) {
        setUserId(existingId);
        return;
      }
      // Generate new user ID if none exists
      const id = new ObjectId();
      const newId = id.toHexString();
      localStorage.setItem(USER_ID_KEY, newId);
      setUserId(newId);
    };

    initializeUser();
  }, []);

  return {
    userId,
  };
};
