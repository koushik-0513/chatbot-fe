import type { TApiPromise, TQueryOpts } from "@/types/api";
import type {
  TGetInfiniteScrollPostsParams,
  TPostsResponse,
} from "@/types/home-types";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/post/...

// Posts Services
const getPosts = (
  params: TGetInfiniteScrollPostsParams
): TApiPromise<TPostsResponse> => {
  return api.get("/post", { params: { ...params } });
};

// Posts Hooks
export const useGetPosts = (
  params: TGetInfiniteScrollPostsParams,
  options?: TQueryOpts<TPostsResponse>
) => {
  return useQuery({
    queryKey: ["useGetPosts", params.limit],
    queryFn: () => getPosts(params),
    ...options,
  });
};
