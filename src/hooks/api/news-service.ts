import { useQuery } from "@tanstack/react-query";

import env from "../../config/env";
import {
  TGetNewsParams,
  TNewsDetailResponse,
  TNewsResponse,
} from "../../types/types";

// Get all news query
export const useGetNews = (params: TGetNewsParams) => {
  const { page = 1, limit = 10 } = params;

  return useQuery<TNewsResponse, Error>({
    queryKey: ["news", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${env.backendUrl}/api/v1/news/?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get single news by ID
export const useGetNewsById = (
  news_id: string | null,
  user_id: string | null
) => {
  return useQuery<TNewsDetailResponse, Error>({
    queryKey: ["news", news_id],
    queryFn: async () => {
      if (!news_id) {
        throw new Error("News ID is required");
      }

      const response = await fetch(
        `${env.backendUrl}/api/v1/news/${news_id}/?user_id=${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!news_id && !!user_id,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
