import { UI_MESSAGES } from "@/constants/constants";
import type { TApiPromise, TMutationOpts } from "@/types/api";
import type { TCreateUserRequest, TCreateUserResponse } from "@/types/types";
import { setUserCreatedOnBackend } from "@/utils/user-id";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/user/...

// User Services
const createUser = (
  payload: TCreateUserRequest
): TApiPromise<TCreateUserResponse> => {
  return api.post("/user", payload);
};

// User Hooks
export const useCreateUser = (options?: TMutationOpts<TCreateUserRequest>) => {
  return useMutation({
    mutationKey: ["useCreateUser"],
    mutationFn: createUser,
    onError: (error) => {
      console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, error);
    },
    onSuccess: (data) => {
      console.log(UI_MESSAGES.SUCCESS.USER_CREATED, data);
      // Store the creation status in localStorage
      setUserCreatedOnBackend();
    },
    ...options,
  });
};
