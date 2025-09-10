import { useQuery } from "@tanstack/react-query";

import env from "../../config/env";
import {
  THelp,
  THelpArticleDetailResponse,
  THelpCollectionDetailResponse,
  THelpCollectionsResponse,
} from "../../types/types";

export type THelpResponse = {
  message: string;
  data: THelp[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type THelpDetailResponse = {
  message: string;
  data: THelp;
};

export type TGetHelpParams = {
  page?: number;
  limit?: number;
};

export type TGetCollectionsParams = {
  page?: number;
  limit?: number;
};

// Get all collections query
export const useGetCollections = (params: TGetCollectionsParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery<THelpCollectionsResponse, Error>({
    queryKey: ["help-collections", page, limit],
    queryFn: async () => {
      const response = await fetch(`${env.backendUrl}/help/collections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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

// Get collection details by ID
export const useGetCollectionDetails = (collection_id: string | null) => {
  return useQuery<THelpCollectionDetailResponse, Error>({
    queryKey: ["help-collection-details", collection_id],
    queryFn: async () => {
      if (!collection_id) {
        throw new Error("Collection ID is required");
      }

      const response = await fetch(
        `${env.backendUrl}/help/collections/${collection_id}`,
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
    enabled: !!collection_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get article details by ID
export const useGetArticleDetails = (article_id: string | null , user_id: string | null) => {
  return useQuery<THelpArticleDetailResponse, Error>({
    queryKey: ["help-article-details", article_id, user_id],
    queryFn: async () => {
      if (!article_id) {
        throw new Error("Article ID is required");
      }

      const response = await fetch(
        `${env.backendUrl}/help/articles/${article_id}?user_id=${user_id}`,
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
    enabled: !!article_id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get all news query
export const useGetHelp = (collection_id: string, params: TGetHelpParams) => {
  const { page = 1, limit = 10 } = params;

  return useQuery<THelpResponse, Error>({
    queryKey: ["help", collection_id, page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${env.backendUrl}/help/collections/${collection_id}`,
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
export const useGetHelpById = (help_id: string | null) => {
  return useQuery<THelpDetailResponse, Error>({
    queryKey: ["help", help_id],
    queryFn: async () => {
      if (!help_id) {
        throw new Error("Help ID is required");
      }

      const response = await fetch(`${env.backendUrl}/help/${help_id}`, {
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
    enabled: !!help_id,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
