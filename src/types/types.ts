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

export type TAttachment = {
  url?: string;
  name?: string;
};

// Chat message type (matches the exact API response structure)
export type TChatMessage = {
  _id: string;
  message: string;
  sender: "user" | "assistant";
  createdAt: string;
  updatedAt: string;
};

// Display message type for UI components
export type TDisplayMessage = TChatMessage & { isNew?: boolean };

// Chat history item - matches actual API response
export type TChatHistoryItem = {
  _id: string;
  title: string;
  userId: string;
  status: string;
  updatedAt: string;
};

// Chat history API response - matches actual API response
export type TChatHistoryAPIResponse = {
  message: string;
  data: TChatHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_conversations: number;
  };
};

// Conversation type (matches the exact API response structure)
export type TConversation = {
  _id: string;
  title: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  messages: TChatMessage[];
};

// Conversation API response (matches the exact API response structure)
export type TConversationAPIResponse = {
  data: TConversation;
  message: string;
};

// Alias for backward compatibility
export type TConversationMessage = TChatMessage;

export type TUploadItem = {
  id: string;
  file: File;
  name: string;
  progress: number; // 0-100
  status: "uploading" | "success" | "error";
  error?: string;
};

// ============================================================================
// NEWS TYPES - Matches exact API response structure
// ============================================================================

// News item type for list view (matches news list API response)
export type TNewsItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  tags: string[];
  description: string;
};

// News detail type for individual news page (matches news detail API response)
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

// ============================================================================
// UNIFIED AUTHOR TYPE - Used across Help and News
// ============================================================================

// Unified Author type for both Help and News (supports both API formats)
export type TAuthor = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  profile_image?: string; // Help API format
  profileImage?: string; // News API format
  bio: string;
  role: string;
  isActive?: boolean;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  social_links?: {
    // Help API format
    linkedin?: string;
    twitter?: string;
  };
  socialLinks?: {
    // News API format
    linkedin?: string;
    twitter?: string;
  };
};

// Alias for backward compatibility
export type THelpAuthor = TAuthor;

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
    authors: TAuthor[];
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
  page?: number;
  limit?: number;
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

export type TGetHelpParams = {
  page?: number;
  limit?: number;
};

export type TGetCollectionsParams = {
  page?: number;
  limit?: number;
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

// Posts API types
export type TPost = {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string;
  is_active: boolean;
  link_text: string;
  link_url: string;
  linkText: string;
  isActive: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
};

export type TPostsResponse = {
  data: TPost[];
  total_posts: number;
  current_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
};

export type TGetPostsParams = {
  page?: number;
  limit?: number;
};

// Article search types
export type TArticleSearchParams = {
  query: string;
  page?: number;
  limit?: number;
};

// User service types
export type TCreateUserRequest = {
  user_id: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
};

export type TCreateUserResponse = {
  success: boolean;
  message: string;
  user_id?: string;
};

// File service types
export type TUploadOptions = {
  file: File;
  userId: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
};

// ============================================================================
// COMPONENT PROPS TYPES - Consolidated from various component files
// ============================================================================

// Chatbot component types
export type TChatbotProps = {
  user_id: string;
  onClose?: () => void;
  isMaximized?: boolean;
  onMaximizeChange?: (isMaximized: boolean) => void;
};

export type TNavigationItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

// Chat container types
export type TChatContainerProps = {
  chatId: string | null;
  chatTitle: string;
  onBack: () => void;
  onClose?: () => void;
};

// Chat history types
export type TChatHistoryProps = {
  id: string;
  title: string;
  timestamp: string;
  onClick: (id: string, title: string) => void;
};

// Help component types
export type THelpPageProps = {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
  activePage: string;
  onShowDetails: (show: boolean) => void;
  onBackFromDetails: () => void;
  onMinimizeOnly: () => void;
  onAutoMaximize: () => void;
  selectedArticleId?: string | null;
  onTitleChange?: (title: string) => void;
  onNavigateToHome?: () => void;
  navigatedFromHomepage?: boolean;
};

// News component types
export type TNewsProps = {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
  activePage: string;
  onShowDetails: (show: boolean) => void;
  onBackFromDetails: () => void;
  onAutoMaximize: () => void;
};

// Article card types
export type TArticleCardProps = {
  collection: THelpCollection;
  onClick: (collection: THelpCollection) => void;
};

// Collection details types
export type TCollectionDetailsProps = {
  collectionDetailsData: THelpCollectionDetailResponse | undefined;
  isLoading: boolean;
  error: Error | null;
};

// Search bar types
export type TSearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
};

// Search results types
export type TSearchResultsProps = {
  searchResults: TArticleSearchResult[];
  isLoading: boolean;
  error: Error | null;
};

// Blog card types
export type TBlogCardProps = {
  id: string;
  title: string;
  description?: string;
  author?: string;
  readTime?: string;
  publishedAt?: string;
  imageUrl?: string;
  tags?: string[];
  onClick?: () => void;
};

// News card types
export type TNewsCardProps = {
  news: TNews;
  onClick: (news: TNews) => void;
  maxTagsToShow?: number;
};

// Recent message types
export type TRecentMessageProps = {
  onOpenChat?: (conversationId: string | null, title?: string) => void;
};

// Emoji picker types
export type TEmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
};

// ============================================================================
// CONTEXT TYPES
// ============================================================================

// Scroll context types
export type TScrollContextType = {
  resetAllScroll: () => void;
  resetAllScrollWithDelay: (delay: number) => void;
  resetScrollToElement: (elementRef: React.RefObject<HTMLElement>) => void;
  registerScrollElement: (
    id: string,
    elementRef: React.RefObject<HTMLElement>
  ) => void;
  unregisterScrollElement: (id: string) => void;
};

// Environment types
export type TEnv = {
  backendUrl: string;
};
