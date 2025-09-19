import { useEffect, useState } from "react";

import {
  generateUserId,
  getUserId,
  isUserCreatedOnBackend,
  isValidUserId,
} from "../utils/user-id";
import { useCreateUser } from "./api/user-service";
import { UI_MESSAGES } from "@/constants";

export const useUserId = () => {
  const [user_id, set_user_id] = useState<string | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [is_new_user, set_is_new_user] = useState(false);

  const createUserMutation = useCreateUser();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialize_user = async () => {
      try {
        // Get or generate user ID
        const id = getUserId();
        let final_id = id;
        let should_create_user = false;

        // Validate the ID
        if (!isValidUserId(id)) {
          // If invalid, generate a new one
          final_id = generateUserId();
          localStorage.setItem("chatbot_user_id", final_id);
          set_is_new_user(true);
          should_create_user = true;
        } else {
          // Check if user was already created on backend using localStorage
          const user_created = isUserCreatedOnBackend();
          if (!user_created) {
            // User hasn't been created on backend yet, need to create
            should_create_user = true;
            set_is_new_user(true);
          } else {
            // User already exists on backend
            console.log(UI_MESSAGES.SUCCESS.USER_CREATED);
          }
        }

        set_user_id(final_id);

        // Send user ID to backend only if needed
        if (final_id && should_create_user) {
          try {
            const result = await createUserMutation.mutateAsync({
              user_id: final_id,
              preferences: { theme: "light", language: "en" },
            });
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
            user_id: fallback_id,
            preferences: { theme: "light", language: "en" },
          });
        } catch (backendError) {
          console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, backendError);
        }
      } finally {
        set_is_loading(false);
      }
    };

    initialize_user();
  }, []); // Remove createUserMutation from dependencies

  return {
    user_id,
    is_loading,
    is_new_user,
    is_creating_user: createUserMutation.isPending,
    create_user_error: createUserMutation.error,
  };
};
