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
        `${env.backendUrl}/post/get-posts?page=${page}&limit=${limit}`,
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

// Get single post by ID
export const useGetPost = (post_id: string | null) => {
  return useQuery<TPost, Error>({
    queryKey: ["post", post_id],
    queryFn: async () => {
      if (!post_id) {
        throw new Error("Post ID is required");
      }

      const response = await fetch(
        `${env.backendUrl}/post/get-post/${post_id}`,
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
    enabled: !!post_id,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
