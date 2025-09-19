import type { TApiPromise, TQueryOpts } from "@/types/api";
import type {
  TGetCollectionsParams,
  TGetHelpParams,
  THelpArticleDetailResponse,
  THelpCollectionDetailResponse,
  THelpCollectionsResponse,
  THelpDetailResponse,
  THelpResponse,
  TTopArticlesResponse,
} from "@/types/component-types/help-types";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/collection/...

// Help Types
type TGetCollectionDetailsQParams = {
  collection_id: string;
};

type TGetArticleDetailsQParams = {
  article_id: string;
};

type TGetHelpQParams = {
  collection_id: string;
  page?: number;
  limit?: number;
};

type TGetHelpByIdQParams = {
  help_id: string;
};

// Help Services
const getCollections = (
  params: TGetCollectionsParams = { page: 1, limit: 10 }
): TApiPromise<THelpCollectionsResponse> => {
  const { page = 1, limit = 10 } = params;
  return api.get("/collection", { params: { page, limit } });
};

const getCollectionDetails = ({
  collection_id,
  ...params
}: TGetCollectionDetailsQParams): TApiPromise<THelpCollectionDetailResponse> => {
  return api.get(`/collection/${collection_id}`, { params });
};

const getArticleDetails = ({
  article_id,
  ...params
}: TGetArticleDetailsQParams): TApiPromise<THelpArticleDetailResponse> => {
  return api.get(`/article/${article_id}`, { params });
};

const getHelp = ({
  collection_id,
  ...params
}: TGetHelpQParams): TApiPromise<THelpResponse> => {
  const { page = 1, limit = 10 } = params;
  return api.get(`/collection/${collection_id}`, {
    params: { page, limit },
  });
};

const getHelpById = ({
  help_id,
  ...params
}: TGetHelpByIdQParams): TApiPromise<THelpDetailResponse> => {
  return api.get(`/help/${help_id}`, { params });
};

const getTopArticles = (): TApiPromise<TTopArticlesResponse> => {
  return api.get("/article/top");
};

// Help Hooks
export const useGetCollections = (
  params: TGetCollectionsParams = { page: 1, limit: 10 },
  options?: TQueryOpts<THelpCollectionsResponse>
) => {
  return useQuery({
    queryKey: ["useGetCollections", params],
    queryFn: () => getCollections(params),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetCollectionDetails = (
  params: TGetCollectionDetailsQParams,
  options?: TQueryOpts<THelpCollectionDetailResponse>
) => {
  return useQuery({
    queryKey: ["useGetCollectionDetails", params],
    queryFn: () => getCollectionDetails(params),
    enabled: !!params.collection_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
    enabled: !!params.article_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetHelp = (
  params: TGetHelpQParams,
  options?: TQueryOpts<THelpResponse>
) => {
  return useQuery({
    queryKey: ["useGetHelp", params],
    queryFn: () => getHelp(params),
    enabled: !!params.collection_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetHelpById = (
  params: TGetHelpByIdQParams,
  options?: TQueryOpts<THelpDetailResponse>
) => {
  return useQuery({
    queryKey: ["useGetHelpById", params],
    queryFn: () => getHelpById(params),
    enabled: !!params.help_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetTopArticles = (
  options?: TQueryOpts<TTopArticlesResponse>
) => {
  return useQuery({
    queryKey: ["useGetTopArticles"],
    queryFn: getTopArticles,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
