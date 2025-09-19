import type { TApiPromise, TQueryOpts } from "@/types/api";
import type {
  TGetNewsParams,
  TNewsDetailResponse,
  TNewsResponse,
} from "@/types/component-types/news-types";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/news/...

// News Types
type TGetNewsByIdQParams = {
  news_id: string;
  user_id?: string;
};

// News Services
const getNews = (params: TGetNewsParams): TApiPromise<TNewsResponse> => {
  const { page = 1, limit = 10 } = params;
  return api.get("/news", { params: { page, limit } });
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
  params: TGetNewsParams,
  options?: TQueryOpts<TNewsResponse>
) => {
  return useQuery({
    queryKey: ["useGetNews", params],
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
    enabled: !!params.news_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
