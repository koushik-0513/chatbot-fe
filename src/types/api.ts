import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

// Generic API response type
export type TApiPromise<T = unknown> = Promise<T>;

// Query options type
export type TQueryOpts<TData = unknown> = Omit<
  UseQueryOptions<TData, Error, TData>,
  "queryKey" | "queryFn"
>;

// Mutation options type
export type TMutationOpts<TVariables = unknown> = Omit<
  UseMutationOptions<unknown, Error, TVariables, unknown>,
  "mutationKey" | "mutationFn"
>;

// Pagination query parameters
export type TPaginationQParams = {
  page?: number;
  limit?: number;
};
