import type { TApiPromise, TQueryOpts } from "@/types/api";
import type {
  TGetPostsParams,
  TPostsResponse,
} from "@/types/component-types/home-types";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/post/...

// Posts Services
const getPosts = (params: TGetPostsParams): TApiPromise<TPostsResponse> => {
  const { page = 1, limit = 5 } = params;
  return api.get("/post", { params: { page, limit } });
};

// Posts Hooks
export const useGetPosts = (
  params: TGetPostsParams,
  options?: TQueryOpts<TPostsResponse>
) => {
  return useQuery({
    queryKey: ["useGetPosts", params],
    queryFn: () => getPosts(params),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
