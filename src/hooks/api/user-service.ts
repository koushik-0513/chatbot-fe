import { useMutation } from "@tanstack/react-query";

import env from "../../config/env";
import { TCreateUserRequest, TCreateUserResponse } from "../../types/types";
import { setUserCreatedOnBackend } from "../../utils/user-id";

// Create user mutation
export const useCreateUser = () => {
  return useMutation<TCreateUserResponse, Error, TCreateUserRequest>({
    mutationFn: async (data: TCreateUserRequest) => {
      const response = await fetch(`${env.backendUrl}/api/v1/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
    onSuccess: (data) => {
      console.log("User created successfully:", data);
      // Store the creation status in localStorage
      setUserCreatedOnBackend();
    },
  });
};
