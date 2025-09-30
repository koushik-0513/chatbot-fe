import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { TApiPromise, TMutationOpts } from "@/types/api";

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
  const { userId, ...preferences } = payload;
  return api.post("/user", preferences, {
    params: { user_id: userId },
  });
};

// User Hooks
export const useCreateUser = (
  options?: TMutationOpts<TCreateUserRequest, TCreateUserResponse>
) => {
  return useMutation({
    mutationKey: ["useCreateUser"],
    mutationFn: createUser,
    ...options,
  });
};
