import type { TApiPromise, TQueryOpts } from "@/types/api";
import type {
  TArticleSearchParams,
  TArticleSearchResponse,
} from "@/types/help-types";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Article Search Services
const searchArticles = (
  params: TArticleSearchParams
): TApiPromise<TArticleSearchResponse> => {
  const { query } = params;
  return api.get("/article", {
    params: { search: query },
  });
};

// Article Search Hooks
export const useSearchArticles = (
  params: TArticleSearchParams,
  options?: TQueryOpts<TArticleSearchResponse>
) => {
  return useQuery({
    queryKey: ["useSearchArticles", params],
    queryFn: () => searchArticles(params),
    ...options,
  });
};
