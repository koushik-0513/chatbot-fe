import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import type {
  TArticleReaction,
  TArticleSearchParams,
  TArticleSearchResponse,
  TGetInfiniteScrollCollectionsParams,
  THelpArticleDetailResponse,
  THelpCollectionDetailResponse,
  TInfiniteScrollCollectionsResponse,
  TTopArticlesResponse,
} from "@/types/help-types";

// Help Types

type TGetCollectionDetailsQParams = {
  collection_id: string;
  user_id: string;
};

type TGetArticleDetailsQParams = {
  article_id: string;
  user_id: string;
};

type TGetHelpQParams = {
  collection_id: string;
};

type TInfiniteScrollCollectionsOptions = {
  retry: number;
  staleTime: number;
  refetchOnWindowFocus: boolean;
  enabled: boolean;
};

// Article Reaction Types
type TSubmitArticleReactionPayload = {
  articleId: string;
  reaction: string;
  userId: string;
};

const getCollectionDetails = ({
  collection_id,
  user_id,
  ...params
}: TGetCollectionDetailsQParams): TApiPromise<THelpCollectionDetailResponse> => {
  return api.get(`/collection/${collection_id}`, {
    params: { user_id, ...params },
  });
};

const getArticleDetails = ({
  article_id,
  user_id,
  ...params
}: TGetArticleDetailsQParams): TApiPromise<THelpArticleDetailResponse> => {
  return api.get(`/article/${article_id}`, {
    params: { user_id, ...params },
  });
};

const getHelp = ({
  collection_id,
}: TGetHelpQParams): TApiPromise<THelpCollectionDetailResponse> => {
  return api.get(`/collection/${collection_id}`, {});
};

const getTopArticles = (): TApiPromise<TTopArticlesResponse> => {
  return api.get("/article/top");
};

const getInfiniteScrollCollections = (
  params: TGetInfiniteScrollCollectionsParams
): TApiPromise<TInfiniteScrollCollectionsResponse> => {
  const { limit = 5, cursor } = params;
  const queryParams: Record<string, string | number> = { limit };
  if (cursor) {
    queryParams.cursor = cursor;
  }
  return api.get("/collection", { params: queryParams });
};

// Article Reaction Services
const submitArticleReaction = (
  payload: TSubmitArticleReactionPayload
): TApiPromise<TArticleReaction> => {
  const { articleId, reaction, userId } = payload;
  return api.post(
    `/article/${articleId}/reaction`,
    { reaction },
    { params: { user_id: userId } }
  );
};

// Article Search Services
const searchArticles = (
  params: TArticleSearchParams
): TApiPromise<TArticleSearchResponse> => {
  const { query } = params;
  return api.get("/article", {
    params: { search: query },
  });
};

export const useGetCollectionDetails = (
  params: TGetCollectionDetailsQParams,
  options?: TQueryOpts<THelpCollectionDetailResponse>
) => {
  return useQuery({
    queryKey: ["useGetCollectionDetails", params],
    queryFn: () => getCollectionDetails(params),
    ...options,
  });
};

export const useGetArticleDetails = (
  params: TGetArticleDetailsQParams,
  options?: TQueryOpts<THelpArticleDetailResponse>
) => {
  return useQuery({
    queryKey: ["useGetArticleDetails", params],
    queryFn: () => getArticleDetails(params),
    ...options,
  });
};

export const useGetHelp = (
  params: TGetHelpQParams,
  options?: TQueryOpts<THelpCollectionDetailResponse>
) => {
  return useQuery({
    queryKey: ["useGetHelp", params],
    queryFn: () => getHelp(params),
    ...options,
  });
};

export const useGetTopArticles = (
  options?: TQueryOpts<TTopArticlesResponse>
) => {
  return useQuery({
    queryKey: ["useGetTopArticles"],
    queryFn: getTopArticles,
    ...options,
  });
};

// Infinite scroll collections hook
export const useGetInfiniteScrollCollections = (
  params: TGetInfiniteScrollCollectionsParams,
  options?: TInfiniteScrollCollectionsOptions
) => {
  return useInfiniteQuery({
    queryKey: ["useGetInfiniteScrollCollections", params.limit],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getInfiniteScrollCollections({ ...params, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.infinite_scroll.has_more
        ? lastPage.infinite_scroll.next_cursor
        : undefined,
    retry: options?.retry ?? 2,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    enabled: options?.enabled,
  });
};

// Article Reaction Hooks
export const useSubmitArticleReaction = (
  options?: TMutationOpts<TSubmitArticleReactionPayload, TArticleReaction>
) => {
  return useMutation({
    mutationKey: ["useSubmitArticleReaction"],
    mutationFn: submitArticleReaction,
    ...options,
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

// Re-export utils for convenience
export type { TArticleReaction };
