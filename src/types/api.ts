import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

// Generic API response type
export type TApiPromise<T = unknown> = Promise<T>;

// API Success response type - matches existing API response structure
export type TApiSuccess<T = unknown> = {
  message: string;
  data: T;
};

// API Error type
export type TApiError = {
  status_code?: number;
  message?: string;
  error?: string;
};

// Query options type
export type TQueryOpts<TData = unknown> = Omit<
  UseQueryOptions<TData, Error, TData>,
  "queryKey" | "queryFn"
>;

// Mutation options type
export type TMutationOpts<TVariables = unknown, TData = unknown> = Omit<
  UseMutationOptions<TData, Error, TVariables, unknown>,
  "mutationKey" | "mutationFn"
>;
