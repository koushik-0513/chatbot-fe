import { useQuery } from "@tanstack/react-query";

import env from "../../config/env";
import {
  TArticleSearchParams,
  TArticleSearchResponse,
} from "../../types/types";

// Search articles query
export const useSearchArticles = (params: TArticleSearchParams) => {
  const { query, page = 1, limit = 10 } = params;

  return useQuery<TArticleSearchResponse, Error>({
    queryKey: ["article-search", query, page, limit],
    queryFn: async () => {
      if (!query.trim()) {
        throw new Error("Search query is required");
      }

      const searchParams = new URLSearchParams({
        search: query,
      });

      const response = await fetch(
        `${env.backendUrl}/api/v1/article/?${searchParams}`,
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
    enabled: !!query.trim(),
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
