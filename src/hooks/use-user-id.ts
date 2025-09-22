import { useEffect, useRef, useState } from "react";

import { UI_MESSAGES } from "@/constants/constants";

import {
  generateUserId,
  getUserId,
  isUserCreatedOnBackend,
  isValidUserId,
  setUserCreatedOnBackend,
} from "../utils/user-id";
import { useCreateUser } from "./api/user-service";

export const useUserId = () => {
  const [user_id, set_user_id] = useState<string | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [is_new_user, set_is_new_user] = useState(false);
  const initialized = useRef(false);

  const createUserMutation = useCreateUser();

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    initialized.current = true;
    const initialize_user = async () => {
      try {
        // Get or generate user ID
        const id = getUserId();
        let final_id = id;
        let should_create_user = false;
        let is_newly_created = false;

        // Check if user was already created on backend
        const user_created_on_backend = isUserCreatedOnBackend();

        if (!user_created_on_backend) {
          // User hasn't been created on backend yet
          should_create_user = true;
          
          // Check if we have a valid ID
          if (!isValidUserId(id)) {
            // Generate a new ID if current one is invalid
            final_id = generateUserId();
            localStorage.setItem("chatbot_user_id", final_id);
            is_newly_created = true;
          } else {
            // ID is valid but user not created on backend yet
            is_newly_created = true;
          }
        }

        set_user_id(final_id);
        set_is_new_user(is_newly_created);

        // Send user ID to backend only if needed
        if (final_id && should_create_user) {
          try {
            const result = await createUserMutation.mutateAsync({
              userId: final_id,
              preferences: { theme: "light", language: "en" },
            });
            // Mark user as created on backend
            setUserCreatedOnBackend();
            console.log(UI_MESSAGES.SUCCESS.USER_CREATED, result);
          } catch (error) {
            console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, error);
            // Continue with local user ID even if backend fails
          }
        }
      } catch (error) {
        console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, error);
        // Fallback: generate a new ID
        const fallback_id = generateUserId();
        localStorage.setItem("chatbot_user_id", fallback_id);
        set_user_id(fallback_id);
        set_is_new_user(true);

        // Try to send to backend
        try {
          await createUserMutation.mutateAsync({
            userId: fallback_id,
            preferences: { theme: "light", language: "en" },
          });
          setUserCreatedOnBackend();
        } catch (backendError) {
          console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, backendError);
        }
      } finally {
        set_is_loading(false);
      }
    };

    initialize_user();
  }, [createUserMutation]); // Include createUserMutation in dependencies

  return {
    user_id,
    is_loading,
    is_new_user,
    is_creating_user: createUserMutation.isPending,
    create_user_error: createUserMutation.error,
  };
};
