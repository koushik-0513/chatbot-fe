// =============================================================================
// REACTION CONSTANTS
// =============================================================================

// Available news reactions
export const NEWS_REACTIONS = [
  "sleeping",
  "heart",
  "thumbsdown",
  "tada",
] as const;

export type TNewsReaction = (typeof NEWS_REACTIONS)[number];

// Emoji mapping for news reactions
export const NEWS_REACTION_EMOJI_MAP: Record<TNewsReaction, string> = {
  sleeping: "😴",
  heart: "❤️",
  thumbsdown: "👎",
  tada: "🎉",
};

// Available article reactions
export const ARTICLE_REACTIONS = ["sad", "middle", "happy"] as const;

export type TArticleReaction = (typeof ARTICLE_REACTIONS)[number];

// Emoji mapping for article reactions
export const ARTICLE_REACTION_EMOJI_MAP: Record<TArticleReaction, string> = {
  sad: "😢",
  middle: "😐",
  happy: "😊",
};

// =============================================================================
// USER CONSTANTS
// =============================================================================

// Local storage keys
export const USER_ID_KEY = "chatbot_user_id";
export const USER_CREATED_KEY = "chatbot_user_created";

// =============================================================================
// UI CONSTANTS
// =============================================================================

// Loading and error messages
export const UI_MESSAGES = {
  LOADING: {
    CHAT: "Loading chat...",
    ARTICLES: "Loading articles...",
    NEWS_DETAILS: "Loading news details...",
    GENERAL: "Loading...",
  },
  ERROR: {
    CHAT_LOAD_FAILED: "Failed to load chat",
    ARTICLES_LOAD_FAILED: "Failed to load articles",
    NEWS_LOAD_FAILED: "Failed to load content. Please try again later.",
    REACTION_SUBMIT_FAILED: "Failed to submit reaction:",
    USER_ID_REQUIRED: "User ID is required to create a new chat",
    UPLOAD_FAILED: "Upload failed",
    UPLOAD_ABORTED: "Upload was aborted",
    PARSE_RESPONSE_FAILED: "Failed to parse response",
  },
  SUCCESS: {
    USER_CREATED: "User created successfully:",
    REACTION_SUBMITTED: "Reaction submitted successfully",
  },
  WELCOME: {
    CHAT: "Welcome! 👋",
    SUBTITLE: "Start a conversation by typing a message below.",
  },
  PLACEHOLDERS: {
    MESSAGE_INPUT: "Type your message...",
    SEARCH: "Search...",
  },
  ARIA_LABELS: {
    GO_BACK: "Go back",
    CLOSE_CHAT: "Close chat",
    SEND_MESSAGE: "Send message",
    ATTACH_FILE: "Attach file",
    EMOJI_PICKER: "Open emoji picker",
  },
  BUTTONS: {
    GO_BACK: "Go back",
    CLOSE: "Close",
    SEND: "Send",
    RETRY: "Try again",
    LOAD_MORE: "Load more",
  },
  STATUS: {
    UPLOAD_SUCCESS: "✓ Uploaded",
    UPLOAD_ERROR: "✗ Failed",
    UPLOAD_UPLOADING: "Uploading...",
  },
} as const;

// Default titles
export const DEFAULT_TITLES = {
  CHAT: "Chat",
  RECENT_CHAT: "Recent Chat",
  NEWS: "News",
  HELP: "Help",
  HOME: "Home",
} as const;

// =============================================================================
// API CONSTANTS
// =============================================================================

// API Headers
export const API_HEADERS = {
  CONTENT_TYPE: "application/json",
  NGROK_SKIP_WARNING: "ngrok-skip-browser-warning",
} as const;

// API Error Messages
export const API_ERROR_MESSAGES = {
  REQUEST_ERROR: "[API Request error]",
  RESPONSE_ERROR: "[API Response error]",
} as const;

// Default API Configuration
export const API_DEFAULTS = {
  BACKEND_URL: "http://localhost:5000",
} as const;

// =============================================================================
// TIMING CONSTANTS
// =============================================================================

// Debounce and timing
export const TIMING = {
  MAXIMIZE_DEBOUNCE_MS: 500, // Prevent rapid successive maximize calls
  DEBOUNCE_DELAY: 300, // Default debounce delay
} as const;

// =============================================================================
// ANIMATION CONSTANTS
// =============================================================================

// Animation delays for loading dots
export const ANIMATION_DELAYS = {
  DOT_1: "-0.3s",
  DOT_2: "-0.15s",
  DOT_3: "0s",
} as const;

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

// CSS Classes and styling
export const LAYOUT = {
  MESSAGE_MAX_WIDTH: "max-w-[70%]",
  PROSE_SIZE: "prose-sm",
} as const;

// =============================================================================
// QUERY KEYS
// =============================================================================

// React Query keys
export const QUERY_KEYS = {
  CHAT_HISTORY: "chatHistory",
  USE_GET_CHAT_HISTORY: "useGetChatHistory",
  USE_SUBMIT_NEWS_REACTION: "useSubmitNewsReaction",
  USE_GET_NEWS: "useGetNews",
  USE_GET_NEWS_BY_ID: "useGetNewsById",
  USE_GET_TOP_ARTICLES: "useGetTopArticles",
  USE_GET_HELP: "useGetHelp",
  USE_GET_HELP_BY_ID: "useGetHelpById",
  USE_GET_COLLECTION_DETAILS: "useGetCollectionDetails",
  USE_GET_ARTICLE_DETAILS: "useGetArticleDetails",
} as const;

// =============================================================================
// FILE UPLOAD CONSTANTS
// =============================================================================

// File upload related
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/*", "application/pdf", "text/*"],
} as const;

// =============================================================================
// PAGINATION CONSTANTS
// =============================================================================

// Default pagination values
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  NEWS_LIMIT: 10,
} as const;

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

// Validation patterns and limits
export const VALIDATION = {
  MESSAGE_MIN_LENGTH: 1,
  MESSAGE_MAX_LENGTH: 4000,
  USER_ID_LENGTH: 24, // ObjectId length
} as const;
