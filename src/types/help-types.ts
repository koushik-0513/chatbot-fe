import { CURRENT_VIEW } from "@/constants/enums";
import { ARTICLE_REACTIONS } from "@/constants/reaction";

import { TAuthor } from "./types";

export type TInfiniteScrollCollectionsResponse = {
  message: string;
  data: THelpCollectionDetail[];
  infinite_scroll: {
    has_more: boolean;
    next_cursor: string | null;
    limit: number;
  };
};

export type THelpCollectionDetailResponse = {
  message: string;
  data: {
    collection: THelpCollectionDetail;
    authors: TAuthor[];
    articles: Array<{
      id: string;
      title: string;
    }>;
    child_collections: THelpCollectionDetail[];
  };
};

export type THelpArticleDetailResponse = {
  message: string;
  data: {
    article: THelpArticleDetail;
    author: TAuthor;
    co_authors: TAuthor[];
  };
};

export type THelpArticleDetail = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  collection_id: string;
  tags: string[];
  updated_at: string;
  related_articles?: Array<{
    id: string;
    title: string;
  }>;
  reaction: {
    reaction: TArticleReaction;
    user_id: string;
    _id: string;
  };
};

export type TCurrentView = (typeof CURRENT_VIEW)[number];

export type THelpPageState = {
  currentView: TCurrentView;
  selectedCollection: THelpCollectionDetail | null;
  selectedArticle: THelpArticleDetail | null;
};

export type THelpCollectionDetail = {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  level: number;
  parent_collection: string | null;
  articles_count: number;
};

export type TArticleSearchResult = {
  id: string;
  title: string;
  matched_snippet?: string;
  slug: string;
  collection_id: string;
  read_time: number;
  created_at: string;
  updated_at: string;
};

export type TArticleSearchResponse = {
  message: string;
  data: {
    articles: TArticleSearchResult[];
    total_count: number;
    search_query: string;
  };
};

// Infinite scroll types for help
export type TGetInfiniteScrollCollectionsParams = {
  limit: number;
  cursor?: string | null;
};

export type TTopArticlesResponse = {
  message: string;
  data: {
    articles: Array<{
      id: string;
      title: string;
      read_time: number;
      created_at: string;
    }>;
  };
};

// Article reaction types
export type TArticleReactionRequest = {
  reaction: string;
  user_id: string;
};

export type TArticleReactionResponse = {
  message: string;
  data?: {
    reaction: string;
    user_id: string;
  };
};

export type TArticleSearchParams = {
  query: string;
};

export type TArticleReaction = (typeof ARTICLE_REACTIONS)[number];
