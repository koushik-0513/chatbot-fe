import { UI_MESSAGES } from "@/constants/constants";
import type { TApiPromise, TMutationOpts } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/user/...
type TCreateUserRequest = {
  userId: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
};

type TCreateUserResponse = {
  message: string;
  user_id: string;
};

// User Services
const createUser = (
  payload: TCreateUserRequest
): TApiPromise<TCreateUserResponse> => {
  console.log("Creating user with payload:", payload);
  const { userId, ...preferences } = payload;
  return api.post("/user", preferences, {
    params: { user_id: userId },
  });
};

// User Hooks
export const useCreateUser = (options?: TMutationOpts<TCreateUserRequest>) => {
  return useMutation({
    mutationKey: ["useCreateUser"],
    mutationFn: createUser,
    onError: () => {},
    onSuccess: (data) => {
      console.log(UI_MESSAGES.SUCCESS.USER_CREATED, data);
    },
    ...options,
  });
};
