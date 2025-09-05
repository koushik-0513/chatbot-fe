import { useQuery } from "@tanstack/react-query";

import { TNews } from "../types/types";

export type TNewsResponse = {
  message: string;
  data: TNews[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TNewsDetailResponse = {
  message: string;
  data: TNews;
};

export type TGetNewsParams = {
  page?: number;
  limit?: number;
};

// Get all news query
export const useGetNews = (params: TGetNewsParams) => {
  const { page = 1, limit = 10 } = params;

  return useQuery<TNewsResponse, Error>({
    queryKey: ["news", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/news/?page=${page}&limit=${limit}`,
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
export const useGetNewsById = (news_id: string | null) => {
  return useQuery<TNewsDetailResponse, Error>({
    queryKey: ["news", news_id],
    queryFn: async () => {
      if (!news_id) {
        throw new Error("News ID is required");
      }

      const response = await fetch(`http://localhost:5000/news/${news_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!news_id,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
