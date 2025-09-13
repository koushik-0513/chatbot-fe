import { useQuery } from "@tanstack/react-query";

import env from "../../config/env";

export type TPost = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  created_at: string;
  updated_at?: string;
  author?: string;
  tags?: string[];
  content?: string;
};

export type TPostsResponse = {
  data: TPost[];
  total_posts: number;
  current_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
};

export type TGetPostsParams = {
  page?: number;
  limit?: number;
};

// Get posts query
export const useGetPosts = (params: TGetPostsParams) => {
  const { page = 1, limit = 5 } = params;

  return useQuery<TPostsResponse, Error>({
    queryKey: ["posts", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${env.backendUrl}/api/v1/post/?page=${page}&limit=${limit}`,
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
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};