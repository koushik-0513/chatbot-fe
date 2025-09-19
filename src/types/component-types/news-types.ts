import { TAuthor } from "../types";

export type TNews = {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  image: string;
  image_url: string;
  thumbnail_url: string;
  author: TAuthor;
  category: string;
  tags: string[];
  published_at: string;
  is_published: boolean;
  is_featured: boolean;
  readTime: number;
  reaction: {
    reaction: string;
    user_id: string;
    _id: string;
  };
};

export type TNewsItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  tags: string[];
  description: string;
};

// News list API response - matches the exact structure from your API
export type TNewsListResponse = {
  message: string;
  data: TNewsItem[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_news: number;
  };
};

// News detail API response - matches the exact structure from your API
export type TNewsDetailResponse = {
  message: string;
  data: TNews;
};

// ============================================================================
// UNIFIED AUTHOR TYPE - Used across Help and News
// ============================================================================

// Unified Author type for both Help and News (supports both API formats)

// ============================================================================
// API SERVICE TYPES - Consolidated from various service files
// ============================================================================

// News API types
export type TNewsResponse = {
  message: string;
  data: TNews[];
  total: number;
};

export type TGetNewsParams = {
  page: number;
  limit: number;
};

// News reaction types
export type TNewsReactionRequest = {
  reaction: string;
  user_id: string;
};

export type TNewsReactionResponse = {
  success: boolean;
  message: string;
  data?: {
    reaction: string;
    user_id: string;
    _id: string;
  };
};
