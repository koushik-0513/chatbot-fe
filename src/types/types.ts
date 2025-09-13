export type THelpArticle = {
  id: string;
  title: string;
  description?: string;
  author?: string;
  readTime?: string;
  content?: string;
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
  profile_image?: string;
  slug: string;
  icon: string;
  article_count: number;
  articles?: THelpArticle[];
  author?: string;
  authorCount?: number;
};

export type THelpPageState = {
  currentView: "list" | "collection" | "article";
  selectedCollection: THelpCollection | null;
  selectedArticle: THelpArticle | null;
};

export type TChatMessage = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
};

export type TNews = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  author?: {
    name: string;
    profileImage: string;
    _id: string;
  };
  lastUpdated?: string;
  publishedAt?: string;
  content?: string;
  bulletPoints?: string[];
  category?: string;
  readTime?: number;
  slug?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
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

export type THelpAuthor = {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  bio: string;
  role: string;
};

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

export type THelpCollectionDetailResponse = {
  message: string;
  data: {
    collection: THelpCollectionDetail;
    authors: THelpAuthor[];
    articles: Array<{
      id: string;
      title: string;
    }>;
    child_collections: THelpCollection[];
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
  read_time: number;
  created_at: string;
  updated_at: string;
  related_articles?: Array<{
    id: string;
    title: string;
  }>;
};

export type THelpArticleDetailResponse = {
  message: string;
  data: {
    article: THelpArticleDetail;
    author: THelpAuthor;
    co_authors: THelpAuthor[];
  };
};

export type TChatHistoryItem = {
  id?: number;
  conversation_id?: number;
  _id?: number;
  conversationId?: number;
  title?: string;
  name?: string;
  timestamp?: string;
  created_at?: string;
  day?: string;
};

export type TChatHistoryRequest = {
  user_id: string;
  page?: number;
  limit?: number;
};

export type TChatHistoryResponse = {
  success: boolean;
  message: string;
  data: TChatHistoryItem[];
  pagination?: {
    page: number;
    limit: number;
    total_pages: number;
    total_conversations: number;
  };
};

export type TArticleSearchResult = {
  id: string;
  title: string;
  matched_snippet?: string;
  slug?: string;
  collection_id?: string;
  read_time?: number;
  created_at?: string;
  updated_at?: string;
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
