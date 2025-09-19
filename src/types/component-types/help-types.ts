import { TAuthor } from "../types";

export type THelpArticle = {
  id: string;
  title: string;
  description: string;
  author: string;
  readTime?: string;
  content: string;
  lastUpdated?: string;
  tableOfContents?: string[];
  related_articles?: Array<{
    id: string;
    title: string;
  }>;
};

export type THelpCollection = {
  id: string;
  title: string;
  description: string;
  profile_image: string;
  slug: string;
  icon: string;
  article_count: number;
  articles: THelpArticle[];
  author: string;
  authorCount: number;
};

export enum currentView {
  LIST = "list",
  COLLECTION = "collection",
  ARTICLE = "article",
}

export type THelpPageState = {
  currentView: currentView;
  selectedCollection: THelpCollection | null;
  selectedArticle: THelpArticle | null;
};

export type THelp = {
  id: string;
  title: string;
  description: string;
  articles: THelpArticle[];
};

export type THelpCollectionsResponse = {
  message: string;
  data: THelpCollection[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_collections: number;
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
    child_collections: THelpCollection[];
  };
};

// Help API types
export type THelpResponse = {
  message: string;
  data: THelp[];
  total: number;
};

export type THelpDetailResponse = {
  message: string;
  data: THelp;
};

// Alias for backward compatibility

export type THelpCollectionDetail = {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  level: number;
  parent_collection: string | null;
  total_articles: number;
};

export type THelpArticleDetail = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  collection_id: string;
  tags: string[];
  read_time: number;
  created_at: string;
  updated_at: string;
  related_articles?: Array<{
    id: string;
    title: string;
  }>;
  reaction: {
    reaction: string;
    user_id: string;
    _id: string;
  };
};

// Article Detail API Response - matches the exact structure from the API
export type THelpArticleDetailResponse = {
  message: string;
  data: {
    article: THelpArticleDetail;
    author: TAuthor;
    co_authors: TAuthor[];
  };
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
  success: boolean;
  message: string;
  data: {
    articles: TArticleSearchResult[];
  };
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_articles: number;
  };
};

export type TGetHelpParams = {
  page: number;
  limit: number;
};

export type TGetCollectionsParams = {
  page: number;
  limit: number;
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
  success: boolean;
  message: string;
  data?: {
    reaction: string;
    user_id: string;
    _id: string;
  };
};
export type TArticleSearchParams = {
  query: string;
  page: number;
  limit: number;
};
