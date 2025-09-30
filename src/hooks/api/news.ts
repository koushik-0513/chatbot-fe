import type { TApiPromise, TQueryOpts } from "@/types/api";
import type {
  TGetInfiniteScrollNewsParams,
  TInfiniteScrollNewsResponse,
  TNewsDetailResponse,
} from "@/types/news-types";
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
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.infinite_scroll.has_more
        ? lastPage.infinite_scroll.next_cursor
        : undefined,
    enabled: options?.enabled,
  });
};
