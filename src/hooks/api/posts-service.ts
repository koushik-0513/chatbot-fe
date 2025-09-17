import { useQuery } from "@tanstack/react-query";

import env from "../../config/env";
import { TGetPostsParams, TPostsResponse } from "../../types/types";

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
