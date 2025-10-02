import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import type {
  TGetInfiniteScrollNewsParams,
  TInfiniteScrollNewsResponse,
  TNewsDetailResponse,
  TNewsReaction,
  TNewsReactionResponse,
} from "@/types/news-types";

// News Types
type TGetNewsByIdQParams = {
  news_id: string;
  user_id?: string;
};

type TInfiniteScrollNewsOptions = {
  retry?: number;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
};

// News Reaction Types
type TSubmitNewsReactionPayload = {
  newsId: string;
  reaction: string;
  userId: string;
};

// write it like get news by id
const getInfiniteScrollNews = (
  params: TGetInfiniteScrollNewsParams
): TApiPromise<TInfiniteScrollNewsResponse> => {
  return api.get("/news", { params: { ...params } });
};

const getNewsById = ({
  news_id,
  ...params
}: TGetNewsByIdQParams): TApiPromise<TNewsDetailResponse> => {
  return api.get(`/news/${news_id}`, {
    params: { ...params },
  });
};

// News Reaction Services
const submitNewsReaction = ({
  newsId,
  reaction,
  userId,
}: TSubmitNewsReactionPayload): TApiPromise<TNewsReactionResponse> => {
  return api.post(
    `/news/${newsId}/reaction`,
    { reaction },
    { params: { user_id: userId } }
  );
};

export const useGetNewsById = (
  params: TGetNewsByIdQParams,
  options?: TQueryOpts<TNewsDetailResponse>
) => {
  return useQuery({
    queryKey: ["useGetNewsById", params],
    queryFn: () => getNewsById(params),
    ...options,
  });
};

// Infinite scroll news hook
export const useGetInfiniteScrollNews = (
  params: TGetInfiniteScrollNewsParams,
  options?: TInfiniteScrollNewsOptions
) => {
  return useInfiniteQuery({
    queryKey: ["useGetInfiniteScrollNews", params.limit],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getInfiniteScrollNews({ ...params, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.infinite_scroll.has_more
        ? lastPage.infinite_scroll.next_cursor
        : undefined,
    enabled: options?.enabled,
  });
};

// News Reaction Hooks
export const useSubmitNewsReaction = (
  options?: TMutationOpts<TSubmitNewsReactionPayload, TNewsReactionResponse>
) => {
  return useMutation({
    mutationKey: ["useSubmitNewsReaction"],
    mutationFn: submitNewsReaction,
    ...options,
  });
};

export type { TNewsReaction };
