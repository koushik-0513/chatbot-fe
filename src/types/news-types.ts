import { NEWS_REACTIONS } from "@/constants/reaction";

import { TAuthor } from "./types";

export type TNews = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  image_url: string;
  thumbnail_url: string;
  author: TAuthor;
  category: string;
  tags: string[];
  published_at: string;
  is_published: boolean;
  is_featured: boolean;
  reaction: {
    reaction: TNewsReaction;
    user_id: string;
    _id: string;
  };
};

export type TInfiniteScrollNewsResponse = {
  message: string;
  data: TNews[];
  infinite_scroll: {
    has_more: boolean;
    next_cursor: string | null;
    limit: number;
  };
};

// News detail API response - matches the exact structure from your API
export type TNewsDetailResponse = {
  message: string;
  data: TNews;
};

// News API types
export type TNewsResponse = {
  message: string;
  data: TNews[];
  total: number;
};

// Infinite scroll news params
export type TGetInfiniteScrollNewsParams = {
  limit: number;
  cursor?: string | null;
};

export type TNewsReactionResponse = {
  message: string;
};

export type TNewsReaction = (typeof NEWS_REACTIONS)[number];
