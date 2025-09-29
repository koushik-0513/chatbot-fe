import type { TApiPromise, TQueryOpts } from "@/types/api";
import type {
  TGetInfiniteScrollNewsParams,
  TInfiniteScrollNewsResponse,
  TNewsDetailResponse,
  TNewsResponse,
} from "@/types/component-types/news-types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

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

// News Services
const getNews = (
  params: TGetInfiniteScrollNewsParams
): TApiPromise<TNewsResponse> => {
  return api.get("/news", { params: { ...params } });
};

const getInfiniteScrollNews = (
  params: TGetInfiniteScrollNewsParams
): TApiPromise<TInfiniteScrollNewsResponse> => {
  const { limit = 5, cursor } = params;
  const queryParams: Record<string, string | number> = { limit };
  if (cursor) {
    queryParams.cursor = cursor;
  }
  return api.get("/news", { params: queryParams });
};

const getNewsById = ({
  news_id,
  user_id,
  ...params
}: TGetNewsByIdQParams): TApiPromise<TNewsDetailResponse> => {
  return api.get(`/news/${news_id}`, {
    params: { user_id, ...params },
  });
};

// News Hooks
export const useGetNews = (
  params: TGetInfiniteScrollNewsParams,
  options?: TQueryOpts<TNewsResponse>
) => {
  return useQuery({
    queryKey: ["useGetNews", params.limit],
    queryFn: () => getNews(params),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetNewsById = (
  params: TGetNewsByIdQParams,
  options?: TQueryOpts<TNewsDetailResponse>
) => {
  return useQuery({
    queryKey: ["useGetNewsById", params],
    queryFn: () => getNewsById(params),
    enabled: !!params.news_id && !!params.user_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.infinite_scroll.has_more
        ? lastPage.infinite_scroll.next_cursor
        : undefined,
    retry: options?.retry ?? 2,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    enabled: options?.enabled,
  });
};
