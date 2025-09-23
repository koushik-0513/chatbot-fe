var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/providers/chatbot-with-providers.tsx
import { useState as useState14 } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// src/contexts/article-navigation-context.tsx
import { createContext, useContext, useState } from "react";
import { jsx } from "react/jsx-runtime";
var ArticleNavigationContext = createContext(void 0);
var ArticleNavigationProvider = ({
  children
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState(
    null
  );
  const [selectedArticle, setSelectedArticle] = useState(
    null
  );
  const [isArticleDetailsOpen, setIsArticleDetailsOpen] = useState(false);
  const [articleDetailsData, setArticleDetailsData] = useState(void 0);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [articleError, setArticleError] = useState(null);
  const openArticleDetails = (article) => {
    setSelectedArticle(article);
    setSelectedArticleId(article.id);
    setIsArticleDetailsOpen(true);
  };
  const closeArticleDetails = () => {
    setSelectedArticle(null);
    setSelectedArticleId(null);
    setIsArticleDetailsOpen(false);
    setArticleDetailsData(void 0);
    setIsLoadingArticle(false);
    setArticleError(null);
  };
  const resetArticleNavigation = () => {
    setSelectedArticle(null);
    setSelectedArticleId(null);
    setIsArticleDetailsOpen(false);
    setArticleDetailsData(void 0);
    setIsLoadingArticle(false);
    setArticleError(null);
  };
  return /* @__PURE__ */ jsx(
    ArticleNavigationContext.Provider,
    {
      value: {
        selectedArticleId,
        selectedArticle,
        isArticleDetailsOpen,
        articleDetailsData,
        isLoadingArticle,
        articleError,
        openArticleDetails,
        closeArticleDetails,
        resetArticleNavigation,
        setArticleDetailsData,
        setLoadingArticle: setIsLoadingArticle,
        setArticleError
      },
      children
    }
  );
};
var useArticleNavigation = () => {
  const context = useContext(ArticleNavigationContext);
  if (context === void 0) {
    throw new Error(
      "useArticleNavigation must be used within an ArticleNavigationProvider"
    );
  }
  return context;
};

// src/contexts/scroll-context.tsx
import { createContext as createContext2, useCallback, useContext as useContext2, useRef } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var ScrollContext = createContext2(void 0);
var useScrollContext = () => {
  const context = useContext2(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};
var ScrollProvider = ({ children }) => {
  const scrollableElementsRef = useRef(/* @__PURE__ */ new Set());
  const resetAllScroll = useCallback(() => {
    window.scrollTo(0, 0);
    scrollableElementsRef.current.forEach((element) => {
      if (element && element.scrollTop !== void 0) {
        element.scrollTop = 0;
      }
      if (element && element.scrollLeft !== void 0) {
        element.scrollLeft = 0;
      }
    });
    const scrollableElements = document.querySelectorAll(
      '[class*="overflow-y-auto"], [class*="overflow-y-scroll"], [class*="overflow-auto"], [class*="scrollbar"], .scroll-container, .scrollable-content, .flex-1.overflow-y-auto'
    );
    scrollableElements.forEach((element) => {
      const htmlElement = element;
      if (htmlElement && htmlElement.scrollTop !== void 0) {
        htmlElement.scrollTop = 0;
      }
      if (htmlElement && htmlElement.scrollLeft !== void 0) {
        htmlElement.scrollLeft = 0;
      }
    });
    const chatbotContent = document.querySelector(".flex-1.overflow-y-auto");
    if (chatbotContent) {
      chatbotContent.scrollTop = 0;
    }
  }, []);
  const resetScrollToElement = useCallback(
    (elementRef) => {
      if (elementRef.current) {
        elementRef.current.scrollTop = 0;
        elementRef.current.scrollLeft = 0;
      }
    },
    []
  );
  const registerScrollableElement = useCallback((element) => {
    scrollableElementsRef.current.add(element);
  }, []);
  const unregisterScrollableElement = useCallback((element) => {
    scrollableElementsRef.current.delete(element);
  }, []);
  const resetAllScrollWithDelay = useCallback(
    (delay = 100) => {
      resetAllScroll();
      setTimeout(() => {
        resetAllScroll();
      }, delay);
      setTimeout(() => {
        resetAllScroll();
      }, delay * 2);
      setTimeout(() => {
        resetAllScroll();
      }, delay * 3);
    },
    [resetAllScroll]
  );
  const value = {
    resetAllScroll,
    resetScrollToElement,
    registerScrollableElement,
    unregisterScrollableElement,
    resetAllScrollWithDelay
  };
  return /* @__PURE__ */ jsx2(ScrollContext.Provider, { value, children });
};

// src/components/chat-bot-launcher.tsx
import { useState as useState13 } from "react";
import { AnimatePresence as AnimatePresence4, motion as motion14 } from "framer-motion";
import { Bot, ChevronDown } from "lucide-react";

// src/components/chatbot.tsx
import { useEffect as useEffect9, useRef as useRef8, useState as useState12 } from "react";
import { AnimatePresence as AnimatePresence3, motion as motion13 } from "framer-motion";
import {
  ArrowLeft as ArrowLeft2,
  CircleQuestionMark,
  House,
  Maximize2,
  Megaphone,
  MessageSquareText,
  Minimize2,
  X as X4
} from "lucide-react";

// src/hooks/use-auto-maximize.ts
import { useCallback as useCallback2, useRef as useRef2 } from "react";

// src/constants/constants.ts
var NEWS_REACTIONS = [
  "sleeping",
  "heart",
  "thumbsdown",
  "tada"
];
var NEWS_REACTION_EMOJI_MAP = {
  sleeping: "\u{1F634}",
  heart: "\u2764\uFE0F",
  thumbsdown: "\u{1F44E}",
  tada: "\u{1F389}"
};
var ARTICLE_REACTIONS = ["sad", "middle", "happy"];
var ARTICLE_REACTION_EMOJI_MAP = {
  sad: "\u{1F622}",
  middle: "\u{1F610}",
  happy: "\u{1F60A}"
};
var USER_ID_KEY = "chatbot_user_id";
var USER_CREATED_KEY = "chatbot_user_created";
var UI_MESSAGES = {
  LOADING: {
    CHAT: "Loading chat...",
    ARTICLES: "Loading articles...",
    NEWS_DETAILS: "Loading news details...",
    GENERAL: "Loading..."
  },
  ERROR: {
    CHAT_LOAD_FAILED: "Failed to load chat",
    ARTICLES_LOAD_FAILED: "Failed to load articles",
    NEWS_LOAD_FAILED: "Failed to load content. Please try again later.",
    REACTION_SUBMIT_FAILED: "Failed to submit reaction:",
    USER_ID_REQUIRED: "User ID is required to create a new chat",
    UPLOAD_FAILED: "Upload failed",
    UPLOAD_ABORTED: "Upload was aborted",
    PARSE_RESPONSE_FAILED: "Failed to parse response"
  },
  SUCCESS: {
    USER_CREATED: "User created successfully:",
    REACTION_SUBMITTED: "Reaction submitted successfully"
  },
  WELCOME: {
    CHAT: "Welcome! \u{1F44B}",
    SUBTITLE: "Start a conversation by typing a message below."
  },
  PLACEHOLDERS: {
    MESSAGE_INPUT: "Type your message...",
    SEARCH: "Search..."
  },
  ARIA_LABELS: {
    GO_BACK: "Go back",
    CLOSE_CHAT: "Close chat",
    SEND_MESSAGE: "Send message",
    ATTACH_FILE: "Attach file",
    EMOJI_PICKER: "Open emoji picker"
  },
  BUTTONS: {
    GO_BACK: "Go back",
    CLOSE: "Close",
    SEND: "Send",
    RETRY: "Try again",
    LOAD_MORE: "Load more"
  },
  STATUS: {
    UPLOAD_SUCCESS: "\u2713 Uploaded",
    UPLOAD_ERROR: "\u2717 Failed",
    UPLOAD_UPLOADING: "Uploading..."
  }
};
var DEFAULT_TITLES = {
  CHAT: "Chat",
  RECENT_CHAT: "Recent Chat",
  NEWS: "News",
  HELP: "Help",
  HOME: "Home"
};
var API_HEADERS = {
  CONTENT_TYPE: "application/json",
  NGROK_SKIP_WARNING: "ngrok-skip-browser-warning"
};
var TIMING = {
  MAXIMIZE_DEBOUNCE_MS: 500,
  // Prevent rapid successive maximize calls
  DEBOUNCE_DELAY: 300
  // Default debounce delay
};
var ANIMATION_DELAYS = {
  DOT_1: "-0.3s",
  DOT_2: "-0.15s",
  DOT_3: "0s"
};
var LAYOUT = {
  MESSAGE_MAX_WIDTH: "max-w-[70%]",
  PROSE_SIZE: "prose-sm"
};
var FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024,
  // 10MB
  ALLOWED_TYPES: ["image/*", "application/pdf", "text/*"]
};

// src/hooks/use-auto-maximize.ts
var useAutoMaximize = ({
  onMaximizeChange,
  externalIsMaximized,
  setInternalIsMaximized
}) => {
  const lastMaximizeTime = useRef2(0);
  const triggerAutoMaximize = useCallback2(() => {
    const now = Date.now();
    if (now - lastMaximizeTime.current < TIMING.MAXIMIZE_DEBOUNCE_MS) {
      return;
    }
    lastMaximizeTime.current = now;
    const newMaximized = true;
    if (externalIsMaximized !== void 0) {
      onMaximizeChange == null ? void 0 : onMaximizeChange(newMaximized);
    } else if (setInternalIsMaximized) {
      setInternalIsMaximized(newMaximized);
    }
  }, [onMaximizeChange, externalIsMaximized, setInternalIsMaximized]);
  const shouldAutoMaximize = useCallback2(
    (context) => {
      return context.isDetailsView && (context.navigatedFromHomepage || context.cameFromSearch);
    },
    []
  );
  return {
    triggerAutoMaximize,
    shouldAutoMaximize
  };
};

// src/components/help.tsx
import { useCallback as useCallback5, useEffect as useEffect4, useState as useState6 } from "react";
import { AnimatePresence, motion as motion4 } from "framer-motion";

// src/hooks/use-debounce.ts
import { useEffect, useState as useState2 } from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState2(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// src/hooks/use-navigation-stack.ts
import { useCallback as useCallback3, useState as useState3 } from "react";
var useNavigationStack = (options = {}) => {
  const { maxSize = 50 } = options;
  const [stack, setStack] = useState3([]);
  const push = useCallback3(
    (item) => {
      setStack((prev) => {
        const newStack = [...prev, item];
        if (newStack.length > maxSize) {
          return newStack.slice(-maxSize);
        }
        return newStack;
      });
    },
    [maxSize]
  );
  const pop = useCallback3(() => {
    let poppedItem = null;
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      poppedItem = newStack.pop() || null;
      return newStack;
    });
    return poppedItem;
  }, []);
  const peek = useCallback3(() => {
    return stack.length > 0 ? stack[stack.length - 1] : null;
  }, [stack]);
  const getAll = useCallback3(() => {
    return [...stack];
  }, [stack]);
  const clear = useCallback3(() => {
    setStack([]);
  }, []);
  const size = stack.length;
  const isEmpty = stack.length === 0;
  const hasItems = stack.length > 0;
  const navigateBack = useCallback3(() => {
    return pop();
  }, [pop]);
  const navigateTo = useCallback3(
    (currentItem, newItem) => {
      if (currentItem) {
        push(currentItem);
      }
      return newItem;
    },
    [push]
  );
  const replaceStack = useCallback3(
    (newStack) => {
      setStack(newStack.slice(-maxSize));
    },
    [maxSize]
  );
  const getHistory = useCallback3(() => {
    return stack.map((item, index) => __spreadProps(__spreadValues({}, item), {
      position: index,
      isLast: index === stack.length - 1
    }));
  }, [stack]);
  return {
    // State
    stack,
    size,
    isEmpty,
    hasItems,
    // Actions
    push,
    pop,
    peek,
    getAll,
    clear,
    navigateBack,
    navigateTo,
    replaceStack,
    // Utilities
    getHistory
  };
};

// src/hooks/use-user-id.ts
import { useEffect as useEffect2, useRef as useRef3, useState as useState4 } from "react";

// src/utils/user-id.ts
import { ObjectId } from "bson";
var generateUserId = () => {
  const id = new ObjectId();
  return id.toHexString();
};
var getUserId = () => {
  const existing_id = localStorage.getItem(USER_ID_KEY);
  if (existing_id) {
    return existing_id;
  }
  const new_id = generateUserId();
  localStorage.setItem(USER_ID_KEY, new_id);
  return new_id;
};
var isValidUserId = (id) => {
  try {
    return ObjectId.isValid(id);
  } catch (e) {
    return false;
  }
};
var isUserCreatedOnBackend = () => {
  const created = localStorage.getItem(USER_CREATED_KEY);
  return created === "true";
};
var setUserCreatedOnBackend = () => {
  localStorage.setItem(USER_CREATED_KEY, "true");
};

// src/hooks/api/user-service.ts
import { useMutation } from "@tanstack/react-query";

// src/config/env.ts
var env = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1"
};
var env_default = env;

// src/lib/api.ts
import axios from "axios";
var api = axios.create({
  baseURL: env_default.backendUrl,
  headers: {
    "Content-Type": API_HEADERS.CONTENT_TYPE,
    [API_HEADERS.NGROK_SKIP_WARNING]: "true"
  }
});
api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    var _a;
    return Promise.reject((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data);
  }
);

// src/hooks/api/user-service.ts
var createUser = (payload) => {
  console.log("Creating user with payload:", payload);
  const _a = payload, { userId } = _a, preferences = __objRest(_a, ["userId"]);
  return api.post("/user", preferences, {
    params: { user_id: userId }
  });
};
var useCreateUser = (options) => {
  return useMutation(__spreadValues({
    mutationKey: ["useCreateUser"],
    mutationFn: createUser,
    onError: (error) => {
    },
    onSuccess: (data) => {
      console.log(UI_MESSAGES.SUCCESS.USER_CREATED, data);
    }
  }, options));
};

// src/hooks/use-user-id.ts
var useUserId = () => {
  const [user_id, set_user_id] = useState4(null);
  const [is_loading, set_is_loading] = useState4(true);
  const [is_new_user, set_is_new_user] = useState4(false);
  const initialized = useRef3(false);
  const createUserMutation = useCreateUser();
  useEffect2(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initialize_user = async () => {
      try {
        const id = getUserId();
        let final_id = id;
        let should_create_user = false;
        let is_newly_created = false;
        const user_created_on_backend = isUserCreatedOnBackend();
        if (!user_created_on_backend) {
          should_create_user = true;
          if (!isValidUserId(id)) {
            final_id = generateUserId();
            localStorage.setItem("chatbot_user_id", final_id);
            is_newly_created = true;
          } else {
            is_newly_created = true;
          }
        }
        set_user_id(final_id);
        set_is_new_user(is_newly_created);
        if (final_id && should_create_user) {
          try {
            const result = await createUserMutation.mutateAsync({
              userId: final_id,
              preferences: { theme: "light", language: "en" }
            });
            setUserCreatedOnBackend();
            console.log(UI_MESSAGES.SUCCESS.USER_CREATED, result);
          } catch (error) {
            console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, error);
          }
        }
      } catch (error) {
        console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, error);
        const fallback_id = generateUserId();
        localStorage.setItem("chatbot_user_id", fallback_id);
        set_user_id(fallback_id);
        set_is_new_user(true);
        try {
          await createUserMutation.mutateAsync({
            userId: fallback_id,
            preferences: { theme: "light", language: "en" }
          });
          setUserCreatedOnBackend();
        } catch (backendError) {
          console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, backendError);
        }
      } finally {
        set_is_loading(false);
      }
    };
    initialize_user();
  }, [createUserMutation]);
  return {
    user_id,
    is_loading,
    is_new_user,
    is_creating_user: createUserMutation.isPending,
    create_user_error: createUserMutation.error
  };
};

// src/hooks/api/article-search-service.ts
import { useQuery } from "@tanstack/react-query";
var searchArticles = (params) => {
  const { query, page = 1, limit = 10 } = params;
  return api.get("/article", {
    params: { search: query, page, limit }
  });
};
var useSearchArticles = (params, options) => {
  var _a;
  return useQuery(__spreadValues({
    queryKey: ["useSearchArticles", params],
    queryFn: () => searchArticles(params),
    enabled: !!((_a = params.query) == null ? void 0 : _a.trim()),
    retry: 2,
    staleTime: 2 * 60 * 1e3,
    // 2 minutes
    refetchOnWindowFocus: false
  }, options));
};

// src/hooks/api/help-service.ts
import { useQuery as useQuery2 } from "@tanstack/react-query";
var getCollections = (params = { page: 1, limit: 10 }) => {
  const { page = 1, limit = 10 } = params;
  return api.get("/collection", { params: { page, limit } });
};
var getCollectionDetails = (_a) => {
  var _b = _a, {
    collection_id,
    user_id
  } = _b, params = __objRest(_b, [
    "collection_id",
    "user_id"
  ]);
  return api.get(`/collection/${collection_id}`, {
    params: __spreadValues({ user_id }, params)
  });
};
var getArticleDetails = (_a) => {
  var _b = _a, {
    article_id,
    user_id
  } = _b, params = __objRest(_b, [
    "article_id",
    "user_id"
  ]);
  return api.get(`/article/${article_id}`, {
    params: __spreadValues({ user_id }, params)
  });
};
var getTopArticles = () => {
  return api.get("/article/top");
};
var useGetCollections = (params = { page: 1, limit: 10 }, options) => {
  return useQuery2(__spreadValues({
    queryKey: ["useGetCollections", params],
    queryFn: () => getCollections(params),
    retry: 2,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  }, options));
};
var useGetCollectionDetails = (params, options) => {
  return useQuery2(__spreadValues({
    queryKey: ["useGetCollectionDetails", params],
    queryFn: () => getCollectionDetails(params),
    enabled: !!params.collection_id,
    retry: 2,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  }, options));
};
var useGetArticleDetails = (params, options) => {
  return useQuery2(__spreadValues({
    queryKey: ["useGetArticleDetails", params],
    queryFn: () => getArticleDetails(params),
    enabled: !!params.article_id,
    retry: 2,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  }, options));
};
var useGetTopArticles = (options) => {
  return useQuery2(__spreadValues({
    queryKey: ["useGetTopArticles"],
    queryFn: getTopArticles,
    retry: 2,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  }, options));
};

// src/components/sub-components/help-related/article-cards.tsx
import { ChevronRight } from "lucide-react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var ArticleCard = ({ collection, onClick }) => {
  const handle_click = () => {
    onClick(collection);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "border-border hover:bg-muted flex w-full cursor-pointer items-center justify-between border-b px-3 py-4 transition-colors",
      onClick: handle_click,
      children: [
        /* @__PURE__ */ jsx3("div", { className: "flex flex-1 items-start gap-3 px-3", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx3("h3", { className: "text-card-foreground mb-1 text-sm font-medium", children: collection.title }),
          /* @__PURE__ */ jsx3("p", { className: "text-muted-foreground mb-2 text-xs leading-relaxed", children: collection.description }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
            collection.article_count,
            " articles"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx3("div", { children: /* @__PURE__ */ jsx3(ChevronRight, { className: "text-muted-foreground h-4 w-4" }) })
      ]
    }
  );
};

// src/components/sub-components/help-related/article-details.tsx
import { useEffect as useEffect3, useRef as useRef4, useState as useState5 } from "react";
import { motion } from "framer-motion";

// src/hooks/api/article-reaction-service.ts
import { useMutation as useMutation2 } from "@tanstack/react-query";
var submitArticleReaction = (payload) => {
  const { articleId, reaction, userId } = payload;
  return api.post(
    `/article/${articleId}/reaction`,
    { reaction },
    { params: { user_id: userId } }
  );
};
var useSubmitArticleReaction = (options) => {
  return useMutation2(__spreadValues({
    mutationKey: ["useSubmitArticleReaction"],
    mutationFn: submitArticleReaction,
    onError: (error) => {
      console.error("Error submitting article reaction:", error);
    }
  }, options));
};

// src/components/ui/markdown-renderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsx as jsx4 } from "react/jsx-runtime";
var MarkdownRenderer = ({
  content,
  className = "",
  invert = false
}) => {
  const stringContent = typeof content === "string" ? content : String(content || "");
  const isSmallText = className.includes("prose-p:text-xs") || className.includes("text-xs");
  return /* @__PURE__ */ jsx4("div", { className: `prose prose-lg text-foreground max-w-none ${className}`, children: /* @__PURE__ */ jsx4(
    ReactMarkdown,
    {
      remarkPlugins: [remarkGfm],
      components: {
        // Custom styling for markdown elements
        h1: ({ children }) => /* @__PURE__ */ jsx4(
          "h1",
          {
            className: isSmallText ? "text-card-foreground mb-1 text-xs font-normal" : "text-card-foreground mb-4 text-2xl font-bold",
            children
          }
        ),
        h2: ({ children }) => /* @__PURE__ */ jsx4(
          "h2",
          {
            className: isSmallText ? "text-card-foreground mb-1 text-xs font-normal" : "text-card-foreground mb-3 text-xl font-semibold",
            children
          }
        ),
        h3: ({ children }) => /* @__PURE__ */ jsx4(
          "h3",
          {
            className: isSmallText ? "text-card-foreground mb-1 text-xs font-normal" : "text-card-foreground mb-2 text-lg font-semibold",
            children
          }
        ),
        p: ({ children }) => /* @__PURE__ */ jsx4(
          "p",
          {
            className: isSmallText ? "text-muted-foreground mb-0.5 text-xs leading-relaxed" : "text-foreground mb-4 leading-relaxed",
            children
          }
        ),
        ul: ({ children }) => /* @__PURE__ */ jsx4(
          "ul",
          {
            className: isSmallText ? "text-muted-foreground mb-1 ml-4 list-disc text-xs" : "text-foreground mb-4 ml-6 list-disc",
            children
          }
        ),
        ol: ({ children }) => /* @__PURE__ */ jsx4(
          "ol",
          {
            className: isSmallText ? "text-muted-foreground mb-1 ml-4 list-decimal text-xs" : "text-foreground mb-4 ml-6 list-decimal",
            children
          }
        ),
        li: ({ children }) => /* @__PURE__ */ jsx4(
          "li",
          {
            className: isSmallText ? "text-muted-foreground mb-0.5 text-xs" : "text-foreground mb-1",
            children
          }
        ),
        blockquote: ({ children }) => /* @__PURE__ */ jsx4(
          "blockquote",
          {
            className: isSmallText ? "border-primary text-muted-foreground mb-1 border-l-2 pl-2 text-xs italic" : "border-primary text-muted-foreground mb-4 border-l-4 pl-4 italic",
            children
          }
        ),
        code: ({ children, className: codeClassName }) => {
          const isInline = !codeClassName;
          return isInline ? /* @__PURE__ */ jsx4(
            "code",
            {
              className: isSmallText ? "bg-muted text-muted-foreground rounded px-1 py-0.5 text-xs" : "bg-muted text-primary rounded px-2 py-1 text-sm",
              children
            }
          ) : /* @__PURE__ */ jsx4(
            "pre",
            {
              className: isSmallText ? "bg-muted text-muted-foreground mb-1 overflow-x-auto rounded p-2 text-xs" : "bg-muted text-foreground mb-4 overflow-x-auto rounded-lg p-4",
              children: /* @__PURE__ */ jsx4("code", { children })
            }
          );
        },
        a: ({ href, children }) => {
          const base = isSmallText ? "text-xs underline" : "underline";
          const color = invert ? "text-primary-foreground hover:opacity-90" : isSmallText ? "text-muted-foreground hover:text-muted-foreground/80" : "text-primary hover:text-primary/80";
          return /* @__PURE__ */ jsx4(
            "a",
            {
              href,
              className: `${base} ${color}`,
              target: "_blank",
              rel: "noopener noreferrer",
              children
            }
          );
        },
        strong: ({ children }) => /* @__PURE__ */ jsx4(
          "strong",
          {
            className: isSmallText ? "text-muted-foreground text-xs font-normal" : "text-card-foreground font-semibold",
            children
          }
        ),
        em: ({ children }) => /* @__PURE__ */ jsx4(
          "em",
          {
            className: isSmallText ? "text-muted-foreground text-xs italic" : "text-foreground italic",
            children
          }
        ),
        table: ({ children }) => /* @__PURE__ */ jsx4(
          "div",
          {
            className: isSmallText ? "mb-1 overflow-x-auto" : "mb-4 overflow-x-auto",
            children: /* @__PURE__ */ jsx4(
              "table",
              {
                className: isSmallText ? "border-border min-w-full rounded border text-xs" : "border-border min-w-full rounded-lg border",
                children
              }
            )
          }
        ),
        th: ({ children }) => /* @__PURE__ */ jsx4(
          "th",
          {
            className: isSmallText ? "border-border bg-muted text-muted-foreground border px-2 py-1 text-left text-xs font-normal" : "border-border bg-muted text-card-foreground border px-4 py-2 text-left font-semibold",
            children
          }
        ),
        td: ({ children }) => /* @__PURE__ */ jsx4(
          "td",
          {
            className: isSmallText ? "border-border text-muted-foreground border px-2 py-1 text-xs" : "border-border text-foreground border px-4 py-2",
            children
          }
        )
      },
      children: stringContent
    }
  ) });
};

// src/components/sub-components/help-related/article-details.tsx
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
var isValidArticleReaction = (reaction) => {
  if (!reaction) return null;
  return ARTICLE_REACTIONS.includes(reaction) ? reaction : null;
};
var ArticleDetails = ({
  articleDetailsData,
  onRelatedArticleClick
}) => {
  var _a;
  const { resetAllScrollWithDelay } = useScrollContext();
  const contentRef = useRef4(null);
  const { user_id } = useUserId();
  const [selectedReaction, setSelectedReaction] = useState5(() => {
    var _a2, _b, _c;
    return isValidArticleReaction(
      (_c = (_b = (_a2 = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a2.article) == null ? void 0 : _b.reaction) == null ? void 0 : _c.reaction
    );
  });
  const submitReactionMutation = useSubmitArticleReaction();
  const handleReactionSubmit = async (reaction) => {
    var _a2, _b;
    if (!user_id || submitReactionMutation.isPending) return;
    if (selectedReaction === reaction) {
      return;
    }
    try {
      await submitReactionMutation.mutateAsync({
        articleId: ((_b = (_a2 = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a2.article) == null ? void 0 : _b.id) || "",
        reaction,
        userId: user_id
      });
      setSelectedReaction(reaction);
    } catch (error) {
      console.error(UI_MESSAGES.ERROR.REACTION_SUBMIT_FAILED, error);
    }
  };
  const handleRelatedArticleClick = (articleId) => {
    onRelatedArticleClick == null ? void 0 : onRelatedArticleClick(articleId);
  };
  useEffect3(() => {
    resetAllScrollWithDelay(100);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [resetAllScrollWithDelay]);
  useEffect3(() => {
    var _a2, _b, _c;
    const existingReaction = isValidArticleReaction(
      (_c = (_b = (_a2 = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a2.article) == null ? void 0 : _b.reaction) == null ? void 0 : _c.reaction
    );
    setSelectedReaction(existingReaction);
  }, [articleDetailsData]);
  const get_relative_time = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const now = /* @__PURE__ */ new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
      const intervals = [
        { label: "year", seconds: 31536e3 },
        { label: "month", seconds: 2592e3 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
      ];
      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
          return count === 1 ? `${count} ${interval.label} ago` : `${count} ${interval.label}s ago`;
        }
      }
      return "just now";
    } catch (e) {
      return "Recently";
    }
  };
  const get_author_name = () => {
    var _a2;
    if (((_a2 = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a2.author) && typeof articleDetailsData.data.author === "object" && articleDetailsData.data.author.name) {
      return articleDetailsData.data.author.name;
    }
    return "Anonymous";
  };
  const get_author_image = () => {
    var _a2;
    if (((_a2 = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a2.author) && typeof articleDetailsData.data.author === "object" && articleDetailsData.data.author.profile_image) {
      return articleDetailsData.data.author.profile_image;
    }
    return null;
  };
  const container_variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  const item_variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
  const scale_variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  };
  if (!((_a = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a.article)) {
    return /* @__PURE__ */ jsx5(
      motion.div,
      {
        className: "flex h-full flex-col items-center justify-center",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 },
        children: /* @__PURE__ */ jsx5("div", { className: "text-muted-foreground", children: "Article not found" })
      }
    );
  }
  const article = articleDetailsData.data.article;
  return /* @__PURE__ */ jsx5(
    motion.div,
    {
      className: "flex flex-col p-4",
      variants: container_variants,
      initial: "hidden",
      animate: "visible",
      children: /* @__PURE__ */ jsxs2("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx5(
          motion.h1,
          {
            className: "text-card-foreground text-xl leading-tight font-bold",
            variants: item_variants,
            children: article.title
          }
        ),
        /* @__PURE__ */ jsx5(
          motion.div,
          {
            className: "flex items-center justify-between",
            variants: item_variants,
            children: /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx5(
                motion.img,
                {
                  src: get_author_image(),
                  alt: get_author_name(),
                  className: "h-10 w-10 rounded-full object-cover",
                  variants: scale_variants
                }
              ),
              /* @__PURE__ */ jsxs2(
                motion.div,
                {
                  className: "flex flex-row items-center gap-2",
                  variants: item_variants,
                  children: [
                    /* @__PURE__ */ jsx5("p", { className: "text-card-foreground text-sm font-medium", children: get_author_name() }),
                    /* @__PURE__ */ jsx5("p", { className: "text-muted-foreground text-xs", children: get_relative_time(article.updated_at) })
                  ]
                }
              )
            ] })
          }
        ),
        article.content && /* @__PURE__ */ jsx5(
          motion.div,
          {
            variants: item_variants,
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay: 0.2 },
            children: /* @__PURE__ */ jsx5(MarkdownRenderer, { content: article.content })
          }
        ),
        /* @__PURE__ */ jsxs2(
          motion.div,
          {
            className: "border-primary/20 bg-primary/5 rounded-lg border-t-2 border-b-2 p-4",
            variants: item_variants,
            children: [
              /* @__PURE__ */ jsxs2("div", { className: "mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx5("span", { className: "text-2xl", children: "\u{1F4A1}" }),
                /* @__PURE__ */ jsx5("h3", { className: "text-lg font-semibold", children: "Tip" })
              ] }),
              /* @__PURE__ */ jsxs2("div", { className: "space-y-1 text-center", children: [
                /* @__PURE__ */ jsxs2("p", { children: [
                  /* @__PURE__ */ jsx5("span", { className: "font-semibold", children: "Need more help?" }),
                  " Get support from our",
                  " ",
                  /* @__PURE__ */ jsx5("a", { href: "#", className: "text-primary hover:underline", children: "Community Forum" })
                ] }),
                /* @__PURE__ */ jsx5("p", { className: "text-muted-foreground text-sm", children: "Find answers and get help from Intercom Support and Community Experts" })
              ] })
            ]
          }
        ),
        article.related_articles && article.related_articles.length > 0 && /* @__PURE__ */ jsxs2(motion.div, { className: "space-y-3", variants: item_variants, children: [
          /* @__PURE__ */ jsx5("h3", { className: "text-card-foreground text-lg font-semibold", children: "Related Articles" }),
          /* @__PURE__ */ jsx5("div", { className: "space-y-2", children: article.related_articles.map((relatedArticle, index) => /* @__PURE__ */ jsx5(
            motion.div,
            {
              className: "group border-border bg-card hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm",
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.1 },
              onClick: () => handleRelatedArticleClick(relatedArticle.id),
              whileHover: { x: 4 },
              children: /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx5("p", { className: "text-foreground group-hover:text-primary text-sm font-medium transition-colors", children: relatedArticle.title }),
                /* @__PURE__ */ jsx5(
                  motion.svg,
                  {
                    className: "text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    initial: { x: 0 },
                    whileHover: { x: 2 },
                    children: /* @__PURE__ */ jsx5(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M9 5l7 7-7 7"
                      }
                    )
                  }
                )
              ] })
            },
            relatedArticle.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs2(
          motion.div,
          {
            className: "flex flex-col items-center justify-center text-center",
            variants: item_variants,
            children: [
              /* @__PURE__ */ jsx5(
                motion.h3,
                {
                  className: "text-card-foreground text-md mb-4 font-semibold",
                  variants: item_variants,
                  children: "How helpful was this article?"
                }
              ),
              /* @__PURE__ */ jsx5(motion.div, { className: "flex gap-3", variants: item_variants, children: ARTICLE_REACTIONS.map((reaction, index) => {
                const isSelected = selectedReaction === reaction;
                const isSubmitting = submitReactionMutation.isPending;
                return /* @__PURE__ */ jsx5(
                  motion.button,
                  {
                    onClick: () => handleReactionSubmit(reaction),
                    disabled: isSubmitting,
                    className: `flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${isSelected ? "border-primary bg-primary/10 scale-110" : "border-muted bg-muted/50 hover:border-primary/50 hover:bg-primary/5"} ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"} ${selectedReaction && !isSelected ? "opacity-10" : ""} `,
                    variants: scale_variants,
                    whileHover: !isSubmitting ? { scale: 1.1 } : {},
                    whileTap: !isSubmitting ? { scale: 0.95 } : {},
                    transition: { delay: index * 0.05 },
                    children: /* @__PURE__ */ jsx5("span", { className: "text-xl", children: ARTICLE_REACTION_EMOJI_MAP[reaction] })
                  },
                  reaction
                );
              }) })
            ]
          }
        )
      ] })
    }
  );
};

// src/components/sub-components/help-related/collection-details.tsx
import Image from "next/image";
import { motion as motion2 } from "framer-motion";
import { ChevronRight as ChevronRight2 } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var CollectionDetails = ({
  collectionDetailsData,
  isLoading,
  error,
  onArticleClick,
  onChildCollectionClick
}) => {
  const container_variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  const item_variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
  const scale_variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx6("div", { className: "w-full", children: /* @__PURE__ */ jsx6(
      motion2.div,
      {
        className: "flex items-center justify-center py-8",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx6("div", { className: "text-muted-foreground text-sm", children: "Loading collection details..." })
      }
    ) });
  }
  if (error) {
    return /* @__PURE__ */ jsx6("div", { className: "w-full", children: /* @__PURE__ */ jsx6(
      motion2.div,
      {
        className: "flex items-center justify-center py-8",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx6("div", { className: "text-destructive text-sm", children: "Failed to load collection details" })
      }
    ) });
  }
  if (!collectionDetailsData) {
    return null;
  }
  const { collection, authors, articles, child_collections } = collectionDetailsData.data;
  const handleChildCollectionClick = (childCollection) => {
    onChildCollectionClick(childCollection, collection.id);
  };
  return /* @__PURE__ */ jsx6("div", { className: "w-full", children: /* @__PURE__ */ jsxs3(
    motion2.div,
    {
      className: "w-full",
      variants: container_variants,
      initial: "hidden",
      animate: "visible",
      children: [
        /* @__PURE__ */ jsxs3("div", { className: "space-y-4 px-3", children: [
          /* @__PURE__ */ jsx6(
            motion2.div,
            {
              variants: item_variants,
              className: "flex items-center gap-3 px-2 pt-3",
              children: /* @__PURE__ */ jsx6("h1", { className: "text-card-foreground text-lg font-semibold", children: collection.title })
            }
          ),
          /* @__PURE__ */ jsxs3(motion2.div, { className: "space-y-3", variants: item_variants, children: [
            /* @__PURE__ */ jsx6("p", { className: "text-muted-foreground px-2 text-sm leading-relaxed", children: collection.description }),
            /* @__PURE__ */ jsxs3(
              motion2.div,
              {
                className: "text-muted-foreground flex items-center justify-between gap-4 px-2 text-xs",
                variants: item_variants,
                children: [
                  /* @__PURE__ */ jsxs3("div", { className: "flex flex-col items-start gap-2", children: [
                    /* @__PURE__ */ jsxs3("span", { children: [
                      collection.total_articles,
                      " articles"
                    ] }),
                    /* @__PURE__ */ jsxs3("span", { children: [
                      "By ",
                      authors[0].name,
                      authors.length > 1 && ` and ${authors.length - 1} others`
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx6("div", { className: "flex items-center gap-2", children: authors.length > 0 && /* @__PURE__ */ jsx6(
                    motion2.div,
                    {
                      className: "flex -space-x-1",
                      variants: scale_variants,
                      children: authors.slice(0, 3).map((author, index) => /* @__PURE__ */ jsx6(
                        motion2.div,
                        {
                          className: "bg-primary/20 text-primary flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border-2 border-white text-xs font-medium",
                          variants: scale_variants,
                          transition: { delay: index * 0.1 },
                          children: /* @__PURE__ */ jsx6(
                            Image,
                            {
                              src: author.profile_image || "",
                              alt: author.name,
                              width: 20,
                              height: 20,
                              className: "rounded-full"
                            }
                          )
                        },
                        author.id
                      ))
                    }
                  ) })
                ]
              }
            )
          ] })
        ] }),
        articles.length > 0 && /* @__PURE__ */ jsx6(motion2.div, { className: "mt-4 w-full", variants: item_variants, children: /* @__PURE__ */ jsx6("div", { className: "space-y-0", children: articles.map((article, index) => /* @__PURE__ */ jsxs3(
          motion2.div,
          {
            className: "border-border hover:bg-muted flex w-full cursor-pointer items-center justify-between border-b px-3 py-4 transition-colors",
            onClick: () => onArticleClick(article),
            variants: item_variants,
            transition: { delay: index * 0.05 },
            whileTap: { scale: 0.98 },
            children: [
              /* @__PURE__ */ jsx6("div", { className: "flex-1 px-2", children: /* @__PURE__ */ jsx6("h3", { className: "text-card-foreground mb-1 text-sm font-medium", children: article.title }) }),
              /* @__PURE__ */ jsx6(
                motion2.div,
                {
                  whileHover: { x: 2 },
                  transition: { duration: 0.2 },
                  className: "px-2",
                  children: /* @__PURE__ */ jsx6(ChevronRight2, { className: "text-muted-foreground h-4 w-4" })
                }
              )
            ]
          },
          article.id
        )) }) }),
        child_collections.length > 0 && /* @__PURE__ */ jsx6(motion2.div, { className: "mt-4 w-full", variants: item_variants, children: /* @__PURE__ */ jsx6("div", { className: "space-y-0", children: child_collections.map((childCollection, index) => /* @__PURE__ */ jsxs3(
          motion2.div,
          {
            className: "border-border hover:bg-muted flex w-full cursor-pointer items-center justify-between border-b px-3 py-4 transition-colors",
            onClick: () => handleChildCollectionClick(childCollection),
            variants: item_variants,
            transition: { delay: index * 0.05 },
            whileTap: { scale: 0.98 },
            children: [
              /* @__PURE__ */ jsxs3("div", { className: "flex flex-1 items-center gap-3", children: [
                /* @__PURE__ */ jsx6("div", {}),
                /* @__PURE__ */ jsxs3("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx6("h3", { className: "text-card-foreground mb-1 text-sm font-medium", children: childCollection.title }),
                  /* @__PURE__ */ jsx6("p", { className: "text-muted-foreground text-xs leading-relaxed", children: childCollection.description }),
                  /* @__PURE__ */ jsxs3("p", { className: "text-muted-foreground text-xs", children: [
                    childCollection.article_count,
                    " articles"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx6(
                motion2.div,
                {
                  whileHover: { x: 2 },
                  transition: { duration: 0.2 },
                  className: "px-2",
                  children: /* @__PURE__ */ jsx6(ChevronRight2, { className: "text-muted-foreground h-4 w-4" })
                }
              )
            ]
          },
          childCollection.id
        )) }) })
      ]
    }
  ) });
};

// src/components/sub-components/help-related/search-bar.tsx
import { Search, X } from "lucide-react";

// src/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/button.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "asChild"
  ]);
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx7(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/input.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ jsx8(
    "input",
    __spreadValues({
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )
    }, props)
  );
}

// src/components/sub-components/help-related/search-bar.tsx
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
var SearchBar = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  isSearching
}) => {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };
  const handleClearClick = () => {
    onClearSearch();
  };
  return /* @__PURE__ */ jsxs4("div", { className: "relative mb-4", children: [
    /* @__PURE__ */ jsx9(
      Input,
      {
        type: "text",
        placeholder: "Search for help",
        value: searchQuery,
        onChange: handleInputChange,
        className: "border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border py-3 pr-12 pl-4 text-sm focus:ring-2 focus:outline-none"
      }
    ),
    isSearching && searchQuery ? /* @__PURE__ */ jsx9(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: handleClearClick,
        className: "hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0",
        children: /* @__PURE__ */ jsx9(X, { className: "h-4 w-4" })
      }
    ) : /* @__PURE__ */ jsx9(Search, { className: "text-muted-foreground absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" })
  ] });
};

// src/components/sub-components/help-related/search-results.tsx
import { useCallback as useCallback4 } from "react";
import { motion as motion3 } from "framer-motion";
import { ChevronRight as ChevronRight3 } from "lucide-react";
import { jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
var SearchResults = ({
  searchResults,
  isLoading,
  error,
  searchQuery,
  onArticleClick,
  onClearSearch
}) => {
  const handleArticleClick = useCallback4(
    (article) => {
      onArticleClick(article.id);
    },
    [onArticleClick]
  );
  if (isLoading) {
    return /* @__PURE__ */ jsx10(
      motion3.div,
      {
        className: "flex items-center justify-center py-12",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxs5("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx10(
            motion3.div,
            {
              className: "border-primary mx-auto h-8 w-8 rounded-full border-2 border-t-transparent",
              animate: { rotate: 360 },
              transition: { duration: 1, repeat: Infinity, ease: "linear" }
            }
          ),
          /* @__PURE__ */ jsx10("p", { className: "text-muted-foreground mt-4 text-sm", children: "Searching articles..." })
        ] })
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ jsx10(
      motion3.div,
      {
        className: "flex items-center justify-center py-12",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxs5("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx10("p", { className: "text-destructive text-sm", children: "Failed to search articles. Please try again." }),
          /* @__PURE__ */ jsx10(
            "button",
            {
              onClick: onClearSearch,
              className: "text-primary mt-2 text-sm hover:underline",
              children: "Clear search"
            }
          )
        ] })
      }
    );
  }
  const safeSearchResults = Array.isArray(searchResults) ? searchResults : [];
  if (safeSearchResults.length === 0) {
    return /* @__PURE__ */ jsx10(
      motion3.div,
      {
        className: "flex items-center justify-center py-12",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxs5("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxs5("p", { className: "text-muted-foreground text-sm", children: [
            'No articles found for "',
            searchQuery,
            '"'
          ] }),
          /* @__PURE__ */ jsx10(
            "button",
            {
              onClick: onClearSearch,
              className: "text-primary mt-2 text-sm hover:underline",
              children: "Clear search"
            }
          )
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsx10(
    motion3.div,
    {
      className: "space-y-4",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      children: /* @__PURE__ */ jsx10(
        motion3.div,
        {
          className: "space-y-3 px-3",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4, delay: 0.2 },
          children: safeSearchResults.map((article, index) => /* @__PURE__ */ jsx10(
            motion3.div,
            {
              className: "group border-border bg-card hover:border-primary/50 cursor-pointer rounded-lg border p-4 transition-all hover:shadow-sm",
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.1 },
              onClick: () => handleArticleClick(article),
              whileHover: { x: 4 },
              children: /* @__PURE__ */ jsxs5("div", { className: "mx-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs5("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx10("h4", { className: "text-foreground group-hover:text-primary line-clamp-2 text-base font-medium transition-colors", children: article.title }),
                  article.matched_snippet && /* @__PURE__ */ jsx10("p", { className: "text-muted-foreground mt-2 line-clamp-2 text-sm", children: article.matched_snippet })
                ] }),
                /* @__PURE__ */ jsx10("div", { children: /* @__PURE__ */ jsx10(ChevronRight3, { className: "text-muted-foreground size-6" }) })
              ] })
            },
            article.id
          ))
        }
      )
    }
  );
};

// src/components/help.tsx
import { Fragment, jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
var Help = ({
  onShowBackButton,
  backButtonTrigger,
  activePage,
  onShowDetails,
  onBackFromDetails,
  onMinimizeOnly,
  onAutoMaximize,
  selectedArticleId: propSelectedArticleId,
  onTitleChange,
  navigatedFromHomepage = false
}) => {
  var _a;
  const { shouldAutoMaximize } = useAutoMaximize({});
  const [pageState, setPageState] = useState6({
    currentView: "list" /* LIST */,
    selectedCollection: null,
    selectedArticle: null
  });
  const { resetAllScroll, resetAllScrollWithDelay } = useScrollContext();
  const { user_id } = useUserId();
  const [searchQuery, setSearchQuery] = useState6("");
  const [isSearching, setIsSearching] = useState6(false);
  const [cameFromSearch, setCameFromSearch] = useState6(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const {
    selectedArticleId,
    articleDetailsData,
    openArticleDetails,
    setArticleDetailsData,
    setLoadingArticle,
    setArticleError
  } = useArticleNavigation();
  useEffect4(() => {
    if (propSelectedArticleId && propSelectedArticleId !== selectedArticleId) {
      const article = {
        id: propSelectedArticleId,
        title: "Loading...",
        description: "",
        content: "",
        author: "Anonymous",
        related_articles: []
      };
      openArticleDetails(article);
    }
  }, [propSelectedArticleId, selectedArticleId, openArticleDetails]);
  const {
    data: fetchedArticleDetailsData,
    isLoading: isFetchingArticle,
    error: fetchArticleError
  } = useGetArticleDetails(
    {
      article_id: selectedArticleId || "",
      user_id: user_id || ""
    },
    { enabled: !!selectedArticleId && !!user_id }
  );
  const { data: collectionsData, isLoading, error } = useGetCollections();
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError
  } = useSearchArticles({
    query: debouncedSearchQuery,
    page: 1,
    limit: 10
  });
  const [selectedCollectionId, setSelectedCollectionId] = useState6(null);
  const [parentCollectionId, setParentCollectionId] = useState6(
    null
  );
  const [showTitle, setShowTitle] = useState6(false);
  const {
    push: pushNavigationItem,
    pop: popNavigationItem,
    clear: clearNavigationStack,
    hasItems: navigationStackHasItems
  } = useNavigationStack({ maxSize: 20 });
  const {
    data: collectionDetailsData,
    isLoading: isLoadingDetails,
    error: detailsError
  } = useGetCollectionDetails(
    {
      collection_id: selectedCollectionId || "",
      user_id: user_id || ""
    },
    { enabled: !!selectedCollectionId && !!user_id }
  );
  console.log(collectionDetailsData);
  useEffect4(() => {
    setIsSearching(debouncedSearchQuery.length > 0);
  }, [debouncedSearchQuery]);
  useEffect4(() => {
    if (fetchedArticleDetailsData) {
      console.log("Fetched article details data:", fetchedArticleDetailsData);
      setArticleDetailsData(fetchedArticleDetailsData);
    }
  }, [fetchedArticleDetailsData, setArticleDetailsData]);
  useEffect4(() => {
    console.log("isFetchingArticle:", isFetchingArticle);
    setLoadingArticle(isFetchingArticle);
  }, [isFetchingArticle, setLoadingArticle]);
  useEffect4(() => {
    setArticleError(fetchArticleError);
  }, [fetchArticleError, setArticleError]);
  useEffect4(() => {
    var _a2;
    if (((_a2 = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a2.article) && selectedArticleId) {
      const article = articleDetailsData.data.article;
      setPageState((prev) => {
        var _a3;
        return __spreadProps(__spreadValues({}, prev), {
          selectedArticle: {
            id: article.id,
            title: article.title,
            description: article.excerpt || "",
            content: article.content || "",
            author: ((_a3 = articleDetailsData.data.author) == null ? void 0 : _a3.name) || "Anonymous",
            related_articles: article.related_articles || []
          }
        });
      });
    }
  }, [articleDetailsData, selectedArticleId]);
  useEffect4(() => {
    var _a2, _b;
    if (selectedArticleId && ((_a2 = articleDetailsData == null ? void 0 : articleDetailsData.data) == null ? void 0 : _a2.article)) {
      const article = articleDetailsData.data.article;
      setPageState({
        currentView: "article" /* ARTICLE */,
        selectedCollection: null,
        selectedArticle: {
          id: article.id,
          title: article.title,
          description: article.excerpt || "",
          content: article.content || "",
          author: ((_b = articleDetailsData.data.author) == null ? void 0 : _b.name) || "Anonymous"
        }
      });
      onShowDetails == null ? void 0 : onShowDetails(true);
      if (shouldAutoMaximize({
        navigatedFromHomepage,
        cameFromSearch,
        isDetailsView: true
      })) {
        onAutoMaximize == null ? void 0 : onAutoMaximize();
      }
      if (navigatedFromHomepage && article.title) {
        onTitleChange == null ? void 0 : onTitleChange(article.title);
      }
    }
  }, [
    selectedArticleId,
    articleDetailsData,
    onShowDetails,
    onAutoMaximize,
    navigatedFromHomepage,
    cameFromSearch,
    onTitleChange,
    shouldAutoMaximize
  ]);
  const getCurrentTitle = () => {
    if (pageState.currentView === "article" && pageState.selectedArticle) {
      return pageState.selectedArticle.title;
    }
    return "Help";
  };
  useEffect4(() => {
    const handleScroll = () => {
      if (navigatedFromHomepage) return;
      const scrollContainer2 = document.querySelector(".scroll-container");
      if (scrollContainer2) {
        const scrollTop = scrollContainer2.scrollTop;
        setShowTitle(scrollTop > 50);
      }
    };
    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [pageState.currentView, navigatedFromHomepage]);
  useEffect4(() => {
    const currentTitle = getCurrentTitle();
    if (navigatedFromHomepage && pageState.currentView === "article") {
      onTitleChange == null ? void 0 : onTitleChange(currentTitle);
    } else if (pageState.currentView === "article" && showTitle) {
      onTitleChange == null ? void 0 : onTitleChange(currentTitle);
    } else if (pageState.currentView === "list" || pageState.currentView === "collection") {
      onTitleChange == null ? void 0 : onTitleChange("Help");
    }
  }, [
    pageState.currentView,
    pageState.selectedArticle,
    showTitle,
    onTitleChange,
    navigatedFromHomepage
  ]);
  useEffect4(() => {
    if (activePage === "help") {
      if (!navigatedFromHomepage) {
        setPageState({
          currentView: "list" /* LIST */,
          selectedCollection: null,
          selectedArticle: null
        });
        setSelectedCollectionId(null);
        setParentCollectionId(null);
        clearNavigationStack();
        onShowBackButton(false);
        onShowDetails == null ? void 0 : onShowDetails(false);
      }
      resetAllScrollWithDelay(100);
    } else {
      setPageState({
        currentView: "list" /* LIST */,
        selectedCollection: null,
        selectedArticle: null
      });
      setSelectedCollectionId(null);
      setParentCollectionId(null);
      clearNavigationStack();
      onShowBackButton(false);
    }
  }, [
    activePage,
    resetAllScroll,
    resetAllScrollWithDelay,
    propSelectedArticleId,
    navigatedFromHomepage,
    clearNavigationStack
  ]);
  useEffect4(() => {
    if (backButtonTrigger > 0 && !navigatedFromHomepage) {
      if (pageState.currentView === "article") {
        handle_back_to_collection();
      } else if (pageState.currentView === "collection") {
        handle_back_to_list();
      }
    }
  }, [backButtonTrigger, navigatedFromHomepage]);
  const handle_collection_click = useCallback5(
    (collection) => {
      setSelectedCollectionId(collection.id);
      setPageState({
        currentView: "collection" /* COLLECTION */,
        selectedCollection: collection,
        selectedArticle: null
      });
      onShowBackButton(true);
      onShowDetails == null ? void 0 : onShowDetails(false);
      resetAllScrollWithDelay(100);
    },
    [onShowBackButton, onShowDetails, resetAllScrollWithDelay]
  );
  const handle_article_click = useCallback5(
    (article) => {
      openArticleDetails(article);
      setPageState((prev) => __spreadProps(__spreadValues({}, prev), {
        currentView: "article" /* ARTICLE */,
        selectedCollection: prev.selectedCollection,
        selectedArticle: article
      }));
      onShowDetails == null ? void 0 : onShowDetails(true);
      onAutoMaximize == null ? void 0 : onAutoMaximize();
      resetAllScrollWithDelay(100);
    },
    [onShowDetails, resetAllScrollWithDelay, openArticleDetails]
  );
  const handle_related_article_click = useCallback5(
    (articleId) => {
      var _a2;
      if (selectedArticleId) {
        pushNavigationItem({
          id: selectedArticleId,
          type: "article",
          data: { collectionId: (_a2 = pageState.selectedCollection) == null ? void 0 : _a2.id }
        });
      }
      const article = {
        id: articleId,
        title: "Loading...",
        description: "",
        content: "",
        author: "Anonymous",
        related_articles: []
      };
      openArticleDetails(article);
      setPageState({
        currentView: "article" /* ARTICLE */,
        selectedCollection: pageState.selectedCollection,
        selectedArticle: null
        // Will be populated by the useEffect when article loads
      });
      resetAllScrollWithDelay(100);
    },
    [
      selectedArticleId,
      pageState.selectedCollection,
      resetAllScrollWithDelay,
      pushNavigationItem,
      openArticleDetails
    ]
  );
  const handleSearchChange = useCallback5((query) => {
    setSearchQuery(query);
  }, []);
  const handleClearSearch = useCallback5(() => {
    setSearchQuery("");
    setIsSearching(false);
    setCameFromSearch(false);
  }, []);
  const handle_article_click_from_search = useCallback5(
    (articleId) => {
      const article = {
        id: articleId,
        title: "Loading...",
        description: "",
        content: "",
        author: "Anonymous",
        related_articles: []
      };
      openArticleDetails(article);
      setCameFromSearch(true);
      setPageState((prev) => __spreadProps(__spreadValues({}, prev), {
        currentView: "article" /* ARTICLE */,
        selectedCollection: null,
        selectedArticle: {
          id: articleId,
          title: "Loading...",
          description: "",
          content: "",
          author: "Anonymous",
          related_articles: []
        }
      }));
      onShowBackButton(true);
      onShowDetails == null ? void 0 : onShowDetails(true);
      if (shouldAutoMaximize({
        cameFromSearch: true,
        isDetailsView: true
      })) {
        onAutoMaximize == null ? void 0 : onAutoMaximize();
      }
      resetAllScrollWithDelay(100);
    },
    [
      onShowBackButton,
      onShowDetails,
      onAutoMaximize,
      resetAllScrollWithDelay,
      openArticleDetails,
      shouldAutoMaximize
    ]
  );
  const handle_back_to_list = () => {
    if (cameFromSearch) {
      setCameFromSearch(false);
      setPageState({
        currentView: "list" /* LIST */,
        selectedCollection: null,
        selectedArticle: null
      });
      clearNavigationStack();
      setIsSearching(true);
      onShowBackButton(false);
      onShowDetails == null ? void 0 : onShowDetails(false);
      onBackFromDetails == null ? void 0 : onBackFromDetails();
      onTitleChange == null ? void 0 : onTitleChange("Help");
      resetAllScrollWithDelay(100);
      return;
    }
    if (parentCollectionId) {
      setSelectedCollectionId(parentCollectionId);
      setParentCollectionId(null);
      setPageState({
        currentView: "collection" /* COLLECTION */,
        selectedCollection: null,
        // This will be updated by the API call
        selectedArticle: null
      });
    } else {
      setSelectedCollectionId(null);
      setParentCollectionId(null);
      setPageState({
        currentView: "list" /* LIST */,
        selectedCollection: null,
        selectedArticle: null
      });
      clearNavigationStack();
      onShowBackButton(false);
      onShowDetails == null ? void 0 : onShowDetails(false);
      onBackFromDetails == null ? void 0 : onBackFromDetails();
      onTitleChange == null ? void 0 : onTitleChange("Help");
    }
    resetAllScrollWithDelay(100);
  };
  const handle_back_to_collection = useCallback5(() => {
    if (cameFromSearch) {
      setCameFromSearch(false);
      setPageState({
        currentView: "list" /* LIST */,
        selectedCollection: null,
        selectedArticle: null
      });
      clearNavigationStack();
      onShowDetails == null ? void 0 : onShowDetails(false);
      onMinimizeOnly == null ? void 0 : onMinimizeOnly();
      setIsSearching(true);
      resetAllScrollWithDelay(100);
      return;
    }
    if (navigationStackHasItems) {
      const previousItem = popNavigationItem();
      if (previousItem && previousItem.type === "article") {
        const previousArticle = {
          id: previousItem.id,
          title: "Loading...",
          description: "",
          content: "",
          author: "Anonymous",
          related_articles: []
        };
        openArticleDetails(previousArticle);
        setPageState({
          currentView: "article" /* ARTICLE */,
          selectedCollection: pageState.selectedCollection,
          selectedArticle: null
          // Will be populated by the useEffect when article loads
        });
        resetAllScrollWithDelay(100);
        return;
      }
    }
    setPageState({
      currentView: "collection" /* COLLECTION */,
      selectedCollection: pageState.selectedCollection,
      selectedArticle: null
    });
    clearNavigationStack();
    onShowDetails == null ? void 0 : onShowDetails(false);
    onMinimizeOnly == null ? void 0 : onMinimizeOnly();
    onTitleChange == null ? void 0 : onTitleChange("Help");
    resetAllScrollWithDelay(100);
  }, [
    cameFromSearch,
    navigationStackHasItems,
    popNavigationItem,
    clearNavigationStack,
    pageState.selectedCollection,
    onShowDetails,
    onMinimizeOnly,
    resetAllScrollWithDelay,
    openArticleDetails
  ]);
  const handle_child_collection_click = (collection, parentId) => {
    setSelectedCollectionId(collection.id);
    setParentCollectionId(parentId);
    setPageState({
      currentView: "collection" /* COLLECTION */,
      selectedCollection: collection,
      selectedArticle: null
    });
    clearNavigationStack();
    onShowBackButton(true);
    onShowDetails == null ? void 0 : onShowDetails(false);
  };
  return /* @__PURE__ */ jsx11("div", { className: "w-full", children: /* @__PURE__ */ jsxs6(AnimatePresence, { mode: "wait", children: [
    pageState.currentView === "article" && pageState.selectedArticle && /* @__PURE__ */ jsx11(
      motion4.div,
      {
        className: "w-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx11(
          ArticleDetails,
          {
            articleDetailsData,
            onRelatedArticleClick: handle_related_article_click
          }
        )
      },
      "article"
    ),
    pageState.currentView === "collection" && /* @__PURE__ */ jsx11(
      motion4.div,
      {
        className: "w-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx11(
          CollectionDetails,
          {
            collectionDetailsData,
            isLoading: isLoadingDetails,
            error: detailsError,
            onArticleClick: handle_article_click,
            onChildCollectionClick: handle_child_collection_click
          }
        )
      },
      "collection"
    ),
    pageState.currentView === "list" && /* @__PURE__ */ jsxs6(
      motion4.div,
      {
        className: "flex w-full flex-col space-y-4",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsx11(
            motion4.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: 0.1 },
              className: "mt-4 w-full px-5",
              children: /* @__PURE__ */ jsx11(
                SearchBar,
                {
                  searchQuery,
                  onSearchChange: handleSearchChange,
                  onClearSearch: handleClearSearch,
                  isSearching
                }
              )
            }
          ),
          isSearching ? /* @__PURE__ */ jsx11(
            SearchResults,
            {
              searchResults: ((_a = searchResults == null ? void 0 : searchResults.data) == null ? void 0 : _a.articles) || [],
              isLoading: isSearchLoading,
              error: searchError,
              searchQuery,
              onArticleClick: handle_article_click_from_search,
              onClearSearch: handleClearSearch
            }
          ) : /* @__PURE__ */ jsxs6(Fragment, { children: [
            /* @__PURE__ */ jsx11(
              motion4.div,
              {
                className: "mb-4 px-5",
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.2 },
                children: /* @__PURE__ */ jsx11("p", { className: "text-muted-foreground text-sm", children: isLoading ? "Loading..." : error ? "Error loading collections" : `${(collectionsData == null ? void 0 : collectionsData.pagination.total_collections) || 0} collections` })
              }
            ),
            isLoading ? /* @__PURE__ */ jsx11(
              motion4.div,
              {
                className: "flex items-center justify-center py-8",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.4, delay: 0.3 },
                children: /* @__PURE__ */ jsx11("div", { className: "text-muted-foreground text-sm", children: "Loading collections..." })
              }
            ) : error ? /* @__PURE__ */ jsx11(
              motion4.div,
              {
                className: "flex items-center justify-center py-8",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.4, delay: 0.3 },
                children: /* @__PURE__ */ jsx11("div", { className: "text-destructive text-sm", children: "Failed to load collections" })
              }
            ) : /* @__PURE__ */ jsx11(
              motion4.div,
              {
                className: "flex w-full flex-col",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.4, delay: 0.3 },
                children: collectionsData == null ? void 0 : collectionsData.data.map(
                  (collection, index) => /* @__PURE__ */ jsx11(
                    motion4.div,
                    {
                      className: "w-full",
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 },
                      transition: {
                        duration: 0.4,
                        delay: 0.4 + index * 0.1
                      },
                      children: /* @__PURE__ */ jsx11(
                        ArticleCard,
                        {
                          collection,
                          onClick: handle_collection_click
                        }
                      )
                    },
                    collection.id
                  )
                )
              }
            )
          ] })
        ]
      },
      "list"
    )
  ] }) });
};

// src/components/home.tsx
import { motion as motion7 } from "framer-motion";
import { X as X2 } from "lucide-react";

// src/hooks/api/posts-service.ts
import { useQuery as useQuery3 } from "@tanstack/react-query";
var getPosts = (params) => {
  const { page = 1, limit = 5 } = params;
  return api.get("/post", { params: { page, limit } });
};
var useGetPosts = (params, options) => {
  return useQuery3(__spreadValues({
    queryKey: ["useGetPosts", params],
    queryFn: () => getPosts(params),
    retry: 2,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  }, options));
};

// src/components/ui/card.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
function Card(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "div",
    __spreadValues({
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )
    }, props)
  );
}
function CardHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "div",
    __spreadValues({
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )
    }, props)
  );
}
function CardTitle(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "div",
    __spreadValues({
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className)
    }, props)
  );
}
function CardContent(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "div",
    __spreadValues({
      "data-slot": "card-content",
      className: cn("px-6", className)
    }, props)
  );
}

// src/components/sub-components/home-related/ask-question.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
var AskQuestion = ({ onAsk }) => {
  return /* @__PURE__ */ jsx13("div", { children: /* @__PURE__ */ jsx13(Card, { className: "cursor-pointer", children: /* @__PURE__ */ jsx13(CardHeader, { className: "cursor-pointer", children: /* @__PURE__ */ jsx13("button", { onClick: onAsk, className: "w-full cursor-pointer text-left", children: /* @__PURE__ */ jsx13(CardTitle, { children: "Ask Question" }) }) }) }) });
};

// src/components/sub-components/home-related/blog-card.tsx
import Link from "next/link";
import Image2 from "next/image";
import { motion as motion5 } from "framer-motion";
import { jsx as jsx14, jsxs as jsxs7 } from "react/jsx-runtime";
var BlogCard = ({
  title,
  description = "No description available",
  // Default values
  imageurl,
  link
}) => {
  if (!link) {
    return /* @__PURE__ */ jsx14(motion5.div, { whileHover: { y: -5 }, transition: { duration: 0.2 }, children: /* @__PURE__ */ jsxs7(Card, { className: "mb-4 overflow-hidden p-0", children: [
      /* @__PURE__ */ jsx14("div", { className: "px-3 pt-4", children: /* @__PURE__ */ jsx14(
        Image2,
        {
          src: imageurl || "",
          alt: title,
          width: 400,
          height: 192,
          className: "h-48 w-full object-cover"
        }
      ) }),
      /* @__PURE__ */ jsx14("div", { children: /* @__PURE__ */ jsxs7(CardHeader, { className: "border-border hover:bg-muted border-t p-4 transition-colors", children: [
        /* @__PURE__ */ jsx14(CardTitle, { className: "text-card-foreground mb-2 text-lg font-bold", children: title }),
        /* @__PURE__ */ jsx14("p", { className: "text-muted-foreground text-sm leading-relaxed", children: description })
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsx14(motion5.div, { whileHover: { y: -5 }, transition: { duration: 0.2 }, children: /* @__PURE__ */ jsxs7(Card, { className: "mb-4 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsx14("div", { className: "px-3 pt-4", children: /* @__PURE__ */ jsx14(
      Image2,
      {
        src: imageurl || "",
        alt: title,
        width: 400,
        height: 192,
        className: "h-48 w-full object-cover"
      }
    ) }),
    /* @__PURE__ */ jsx14(Link, { href: link, children: /* @__PURE__ */ jsx14("div", { children: /* @__PURE__ */ jsxs7(CardHeader, { className: "border-border hover:bg-muted border-t p-4 transition-colors", children: [
      /* @__PURE__ */ jsx14(CardTitle, { className: "text-card-foreground mb-2 text-lg font-bold", children: title }),
      /* @__PURE__ */ jsx14("p", { className: "text-muted-foreground text-sm leading-relaxed", children: description })
    ] }) }) })
  ] }) });
};

// src/components/sub-components/home-related/resent-message.tsx
import { useMemo } from "react";

// src/utils/date-time.ts
var parseToDate = (input) => {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
};
var isToday = (d) => {
  const now = /* @__PURE__ */ new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};
var isYesterday = (d) => {
  const y = /* @__PURE__ */ new Date();
  y.setDate(y.getDate() - 1);
  return d.getFullYear() === y.getFullYear() && d.getMonth() === y.getMonth() && d.getDate() === y.getDate();
};
var formatChatTime = (input) => {
  const d = parseToDate(input);
  if (!d) return "";
  return new Intl.DateTimeFormat(void 0, {
    hour: "numeric",
    minute: "2-digit"
  }).format(d);
};
var formatDayOrDate = (input) => {
  const d = parseToDate(input);
  if (!d) return "";
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return new Intl.DateTimeFormat(void 0, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(d);
};

// src/hooks/api/chat-service.ts
import { useMutation as useMutation3, useQuery as useQuery4 } from "@tanstack/react-query";
var getChatHistory = (params) => {
  const { user_id, page = 1, limit = 5 } = params;
  return api.get("/conversation", {
    params: { user_id, page, limit }
  });
};
var getConversationById = (_a) => {
  var _b = _a, {
    conversationId
  } = _b, params = __objRest(_b, [
    "conversationId"
  ]);
  return api.get(`/conversation/${conversationId}`, { params });
};
var sendMessage = (payload) => {
  const { conversationId, message, userId, messageId } = payload;
  const url = `/chat/stream/${conversationId}?user_id=${userId}`;
  return fetch(`${api.defaults.baseURL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream"
    },
    cache: "no-store",
    body: JSON.stringify({
      message,
      user_id: userId,
      conversation_id: conversationId,
      message_id: messageId
    })
  });
};
var useGetChatHistory = (params, options) => {
  return useQuery4(__spreadValues({
    queryKey: ["useGetChatHistory", params],
    queryFn: () => getChatHistory(params),
    enabled: !!params.user_id,
    retry: 2,
    staleTime: 6e4
  }, options));
};
var useGetConversationById = (params, options) => {
  return useQuery4(__spreadValues({
    queryKey: ["useGetConversationById", params],
    queryFn: () => getConversationById(params),
    enabled: !!params.conversationId
  }, options));
};
var useSendMessage = (options) => {
  return useMutation3(__spreadValues({
    mutationKey: ["useSendMessage"],
    mutationFn: sendMessage
  }, options));
};

// src/components/sub-components/home-related/resent-message.tsx
import { jsx as jsx15, jsxs as jsxs8 } from "react/jsx-runtime";
var ResentMessage = ({ onOpenChat }) => {
  var _a;
  const { user_id, is_new_user } = useUserId();
  const { data: history, isLoading: isHistoryLoading, error: historyError } = useGetChatHistory(
    { user_id: user_id || "", page: 1, limit: 1 },
    { enabled: !!user_id }
  );
  const recent = (_a = history == null ? void 0 : history.data) == null ? void 0 : _a[0];
  const conversationId = useMemo(() => {
    return (recent == null ? void 0 : recent._id) || null;
  }, [recent]);
  const title = (recent == null ? void 0 : recent.title) || DEFAULT_TITLES.RECENT_CHAT;
  const tsRaw = (recent == null ? void 0 : recent.updatedAt) || "";
  const day = formatDayOrDate(tsRaw);
  const time = formatChatTime(tsRaw);
  const { data: conv } = useGetConversationById(
    { conversationId: conversationId || "" },
    { enabled: !!conversationId }
  );
  const convData = conv == null ? void 0 : conv.data;
  const messages = (convData == null ? void 0 : convData.messages) || [];
  const last = messages[messages.length - 1];
  const preview = (last == null ? void 0 : last.message) || "Tap to continue your last chat";
  const handleOpen = () => {
    if (onOpenChat) onOpenChat(conversationId, title);
  };
  const handleNewChat = () => {
    if (onOpenChat) onOpenChat(null, "New Chat");
  };
  return /* @__PURE__ */ jsx15("div", { children: /* @__PURE__ */ jsxs8(Card, { onClick: is_new_user ? handleNewChat : handleOpen, className: "cursor-pointer", children: [
    /* @__PURE__ */ jsx15(CardHeader, { children: /* @__PURE__ */ jsx15(CardTitle, { children: is_new_user ? "Start New Chat" : "Recent Message" }) }),
    /* @__PURE__ */ jsx15(CardContent, { className: "-mt-6", children: isHistoryLoading ? /* @__PURE__ */ jsx15("div", { className: "text-muted-foreground text-sm", children: UI_MESSAGES.LOADING.GENERAL }) : is_new_user ? /* @__PURE__ */ jsxs8("div", { children: [
      /* @__PURE__ */ jsx15("div", { className: "text-foreground my-2 text-sm", children: "Welcome! Start a new conversation to get help with your questions." }),
      /* @__PURE__ */ jsx15("div", { className: "text-muted-foreground mb-2 text-xs", children: "Click to begin chatting" })
    ] }) : conversationId ? /* @__PURE__ */ jsxs8("div", { children: [
      /* @__PURE__ */ jsx15("div", { className: "text-foreground my-2 line-clamp-2 text-sm", children: preview }),
      /* @__PURE__ */ jsxs8("div", { className: "text-muted-foreground mb-2 text-xs", children: [
        day,
        " \u2022 ",
        time
      ] })
    ] }) : /* @__PURE__ */ jsx15("div", { className: "text-muted-foreground text-sm", children: "No recent chat" }) })
  ] }) });
};

// src/components/sub-components/home-related/search-component.tsx
import { useState as useState7 } from "react";
import { motion as motion6 } from "framer-motion";
import { ChevronRight as ChevronRight4, Search as Search2 } from "lucide-react";
import { jsx as jsx16, jsxs as jsxs9 } from "react/jsx-runtime";
var SearchComponent = ({
  onNavigateToHelp
}) => {
  var _a;
  const [searchQuery, setSearchQuery] = useState7("");
  const { data: topArticlesData, isLoading, error } = useGetTopArticles();
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNavigateToHelp == null ? void 0 : onNavigateToHelp();
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleArticleClick = (article) => {
    onNavigateToHelp == null ? void 0 : onNavigateToHelp(article.id);
  };
  const handleInputClick = () => {
    onNavigateToHelp == null ? void 0 : onNavigateToHelp();
  };
  return /* @__PURE__ */ jsxs9(
    motion6.div,
    {
      className: "bg-card border-border rounded-lg border p-6",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.1 },
      children: [
        /* @__PURE__ */ jsxs9("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsx16(
            Input,
            {
              type: "text",
              placeholder: UI_MESSAGES.PLACEHOLDERS.SEARCH,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              onKeyDown: handleKeyPress,
              onClick: handleInputClick,
              className: "border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border py-3 pr-12 pl-4 text-sm focus:ring-2 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsx16(
            Button,
            {
              onClick: handleSearch,
              className: "absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-md p-0",
              size: "sm",
              children: /* @__PURE__ */ jsx16(Search2, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx16("div", { className: "space-y-3", children: isLoading ? /* @__PURE__ */ jsx16("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsx16(
          motion6.div,
          {
            className: "text-muted-foreground text-sm",
            animate: { opacity: [0.5, 1, 0.5] },
            transition: { duration: 1.5, repeat: Infinity },
            children: UI_MESSAGES.LOADING.ARTICLES
          }
        ) }) : error ? /* @__PURE__ */ jsx16("div", { className: "text-destructive py-4 text-center text-sm", children: UI_MESSAGES.ERROR.ARTICLES_LOAD_FAILED }) : ((_a = topArticlesData == null ? void 0 : topArticlesData.data) == null ? void 0 : _a.articles) && topArticlesData.data.articles.length > 0 ? topArticlesData.data.articles.slice(0, 4).map((article, index) => /* @__PURE__ */ jsxs9(
          motion6.button,
          {
            onClick: () => handleArticleClick(article),
            className: "hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-md p-3 text-left transition-colors",
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.3, delay: 0.2 + index * 0.1 },
            whileHover: { x: 4 },
            children: [
              /* @__PURE__ */ jsx16("div", { className: "flex-1", children: /* @__PURE__ */ jsx16("h3", { className: "text-foreground text-sm font-medium", children: article.title }) }),
              /* @__PURE__ */ jsx16(ChevronRight4, { className: "text-muted-foreground h-4 w-4" })
            ]
          },
          article.id
        )) : /* @__PURE__ */ jsx16("div", { className: "text-muted-foreground py-4 text-center text-sm", children: "No articles available" }) })
      ]
    }
  );
};

// src/components/home.tsx
import { jsx as jsx17, jsxs as jsxs10 } from "react/jsx-runtime";
var Home = ({
  onNavigateToHelp,
  onOpenChat,
  onAskQuestion,
  onClose
}) => {
  var _a, _b;
  const {
    data: topArticlesData,
    isLoading: isLoadingArticles,
    error: articlesError
  } = useGetTopArticles();
  const {
    data: posts_data,
    isLoading: isLoadingPosts,
    error: postsError
  } = useGetPosts({ page: 1, limit: 5 });
  const display_articles = ((_a = topArticlesData == null ? void 0 : topArticlesData.data) == null ? void 0 : _a.articles) || [];
  const display_posts = ((_b = posts_data == null ? void 0 : posts_data.data) == null ? void 0 : _b.map((post) => __spreadProps(__spreadValues({}, post), {
    id: post._id
  }))) || [];
  const isLoading = isLoadingArticles || isLoadingPosts;
  const hasError = articlesError || postsError;
  return /* @__PURE__ */ jsxs10(
    motion7.div,
    {
      className: "dark space-y-4 pt-40",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.27 },
      children: [
        /* @__PURE__ */ jsxs10("div", { className: "text-foreground p-2", children: [
          /* @__PURE__ */ jsx17("h2", { className: "text-tertiary text-2xl font-bold", children: "Hello" }),
          /* @__PURE__ */ jsx17("h3", { className: "text-tertiary text-2xl font-bold", children: "How can I help you today?" })
        ] }),
        onClose && /* @__PURE__ */ jsx17(
          motion7.button,
          {
            onClick: onClose,
            className: "fixed top-25 right-11 z-50 cursor-pointer transition-colors",
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4, delay: 0.8 },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.95 },
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx17(X2, { className: "text-muted-foreground h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx17(
          motion7.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.1 },
            children: /* @__PURE__ */ jsx17(AskQuestion, { onAsk: onAskQuestion })
          }
        ),
        /* @__PURE__ */ jsx17(
          motion7.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.2 },
            children: /* @__PURE__ */ jsx17(ResentMessage, { onOpenChat })
          }
        ),
        isLoading && /* @__PURE__ */ jsx17(
          motion7.div,
          {
            className: "flex items-center justify-center py-8",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.3 },
            children: /* @__PURE__ */ jsx17(
              motion7.div,
              {
                className: "text-muted-foreground text-sm",
                animate: { opacity: [0.5, 1, 0.5] },
                transition: { duration: 1.5, repeat: Infinity },
                children: UI_MESSAGES.LOADING.ARTICLES
              }
            )
          }
        ),
        hasError && /* @__PURE__ */ jsx17(
          motion7.div,
          {
            className: "bg-destructive/10 rounded-lg p-4",
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.3 },
            children: /* @__PURE__ */ jsx17("p", { className: "text-destructive text-sm", children: UI_MESSAGES.ERROR.NEWS_LOAD_FAILED })
          }
        ),
        !isLoadingPosts && !postsError && display_posts.length > 0 && /* @__PURE__ */ jsx17(
          motion7.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.5 },
            children: /* @__PURE__ */ jsx17("div", { className: "space-y-4", children: display_posts.map((post, index) => /* @__PURE__ */ jsx17(
              motion7.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.6 + index * 0.1 },
                children: /* @__PURE__ */ jsx17(
                  BlogCard,
                  {
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    imageurl: post.image_url,
                    link: post.link_url
                  }
                )
              },
              post.id
            )) })
          }
        ),
        /* @__PURE__ */ jsx17(
          motion7.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.3 + 0.1 },
            children: /* @__PURE__ */ jsx17(SearchComponent, { onNavigateToHelp })
          }
        ),
        !isLoading && !hasError && display_articles.length === 0 && display_posts.length === 0 && /* @__PURE__ */ jsx17(
          motion7.div,
          {
            className: "flex items-center justify-center py-8",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.3 },
            children: /* @__PURE__ */ jsx17("div", { className: "text-muted-foreground text-sm", children: "No content available" })
          }
        )
      ]
    }
  );
};

// src/components/message.tsx
import { motion as motion9 } from "framer-motion";
import { MessageCircleQuestionMark } from "lucide-react";

// src/components/sub-components/chat-related/chat-history.tsx
import { motion as motion8 } from "framer-motion";
import { ChevronRight as ChevronRight5 } from "lucide-react";
import { jsx as jsx18, jsxs as jsxs11 } from "react/jsx-runtime";
var ChatHistory = ({
  id,
  title,
  timestamp,
  day,
  onClick
}) => {
  const handleClick = () => {
    onClick(id);
  };
  return /* @__PURE__ */ jsxs11(
    motion8.div,
    {
      className: "border-border hover:bg-muted flex cursor-pointer items-center justify-between border-b p-3 transition-colors",
      onClick: handleClick,
      whileHover: { x: 5, backgroundColor: "rgba(0, 0, 0, 0.05)" },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2 },
      children: [
        /* @__PURE__ */ jsxs11("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx18("h4", { className: "text-card-foreground mb-1 text-sm font-medium", children: title }),
          /* @__PURE__ */ jsxs11("p", { className: "text-muted-foreground text-xs", children: [
            day,
            " \u2022 ",
            timestamp
          ] })
        ] }),
        /* @__PURE__ */ jsx18(motion8.div, { whileHover: { x: 2 }, transition: { duration: 0.2 }, children: /* @__PURE__ */ jsx18(ChevronRight5, { className: "text-muted-foreground h-4 w-4" }) })
      ]
    }
  );
};

// src/components/message.tsx
import { jsx as jsx19, jsxs as jsxs12 } from "react/jsx-runtime";
var Message = ({
  onChatSelected,
  setShowActiveChat,
  title
}) => {
  const { user_id } = useUserId();
  const {
    data: chatHistoryResponse,
    isLoading,
    error
  } = useGetChatHistory(
    { user_id: user_id || "", page: 1, limit: 5 },
    { enabled: !!user_id }
  );
  const handleChatClick = (chatId, chatTitle) => {
    onChatSelected(chatId);
    setShowActiveChat(true);
    title(chatTitle || "Untitled Chat");
  };
  const handleNewChat = async () => {
    if (!user_id) {
      console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED);
      return;
    }
    onChatSelected(null);
    setShowActiveChat(true);
    title("New Chat");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx19(
      motion9.div,
      {
        className: "flex h-full flex-col items-center justify-center",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 },
        children: /* @__PURE__ */ jsx19("div", { className: "text-muted-foreground", children: "Loading chat history..." })
      }
    );
  }
  if (error && (error == null ? void 0 : error.status_code) !== 404) {
    return /* @__PURE__ */ jsxs12(
      motion9.div,
      {
        className: "flex h-full flex-col items-center justify-center",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsx19("div", { className: "text-destructive", children: "Failed to load chat history" }),
          /* @__PURE__ */ jsx19("div", { className: "text-muted-foreground mt-2 text-sm", children: error instanceof Error ? error.message : "An error occurred" })
        ]
      }
    );
  }
  const chatHistoryDataRaw = (error == null ? void 0 : error.status_code) === 404 ? [] : (chatHistoryResponse == null ? void 0 : chatHistoryResponse.data) || [];
  const chatHistoryData = [...chatHistoryDataRaw].sort(
    (a, b) => {
      const getTs = (x) => new Date(x.updatedAt).getTime();
      return getTs(b) - getTs(a);
    }
  );
  return /* @__PURE__ */ jsxs12(
    motion9.div,
    {
      className: "flex h-full flex-col justify-between space-y-50",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      children: [
        /* @__PURE__ */ jsx19("div", { className: "space-y-0", children: chatHistoryData.length > 0 ? chatHistoryData.map((chat, index) => {
          const chatId = chat._id;
          console.log("Processing chat item:", chat, "Extracted ID:", chatId);
          const rawTs = chat.updatedAt;
          const prettyDay = formatDayOrDate(rawTs) || "";
          const prettyTime = formatChatTime(rawTs) || "";
          const safeTitle = (chat.title || "Untitled Chat").toString();
          return /* @__PURE__ */ jsx19(
            motion9.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.3, delay: 0.4 + index * 0.1 },
              children: /* @__PURE__ */ jsx19(
                ChatHistory,
                {
                  id: chatId || String(index),
                  title: safeTitle,
                  timestamp: prettyTime,
                  day: prettyDay,
                  onClick: (id) => handleChatClick(id, safeTitle)
                }
              )
            },
            chatId || index
          );
        }) : /* @__PURE__ */ jsx19(
          motion9.div,
          {
            className: "flex h-full flex-col items-center justify-center py-8",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.4 },
            children: /* @__PURE__ */ jsx19("div", { className: "text-muted-foreground", children: "No chat history found" })
          }
        ) }),
        /* @__PURE__ */ jsx19("div", { children: chatHistoryData.length < 5 && /* @__PURE__ */ jsx19(
          motion9.div,
          {
            className: "mt-auto flex items-center justify-center p-3",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.2 },
            children: /* @__PURE__ */ jsx19(
              motion9.button,
              {
                onClick: handleNewChat,
                disabled: !user_id,
                className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                whileHover: { scale: 1.01 },
                whileTap: { scale: 0.99 },
                children: /* @__PURE__ */ jsxs12("span", { className: "flex items-center gap-2", children: [
                  "New Chat",
                  /* @__PURE__ */ jsx19(MessageCircleQuestionMark, { className: "h-4 w-4" })
                ] })
              }
            )
          }
        ) })
      ]
    }
  );
};

// src/components/news.tsx
import { useEffect as useEffect6, useState as useState9 } from "react";
import { AnimatePresence as AnimatePresence2, motion as motion12 } from "framer-motion";

// src/hooks/api/news-service.ts
import { useQuery as useQuery5 } from "@tanstack/react-query";
var getNews = (params) => {
  const { page = 1, limit = 10 } = params;
  return api.get("/news", { params: { page, limit } });
};
var getNewsById = (_a) => {
  var _b = _a, {
    news_id,
    user_id
  } = _b, params = __objRest(_b, [
    "news_id",
    "user_id"
  ]);
  return api.get(`/news/${news_id}`, {
    params: __spreadValues({ user_id }, params)
  });
};
var useGetNews = (params, options) => {
  return useQuery5(__spreadValues({
    queryKey: ["useGetNews", params],
    queryFn: () => getNews(params),
    retry: 2,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  }, options));
};
var useGetNewsById = (params, options) => {
  return useQuery5(__spreadValues({
    queryKey: ["useGetNewsById", params],
    queryFn: () => getNewsById(params),
    enabled: !!params.news_id,
    retry: 2,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  }, options));
};

// src/components/sub-components/news-related/news-cards.tsx
import { motion as motion10 } from "framer-motion";
import { ChevronRight as ChevronRight6 } from "lucide-react";
import Image3 from "next/image";
import { jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";
var NewsCard = ({
  news,
  onClick,
  maxTagsToShow = 2
}) => {
  const handle_click = () => {
    onClick(news);
  };
  const visibleTags = news.tags.slice(0, maxTagsToShow);
  const remainingTagsCount = news.tags.length - maxTagsToShow;
  return /* @__PURE__ */ jsx20(motion10.div, { whileHover: { y: -5 }, transition: { duration: 0.2 }, children: /* @__PURE__ */ jsxs13(
    Card,
    {
      className: "mb-4 cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-lg",
      onClick: handle_click,
      children: [
        /* @__PURE__ */ jsx20("div", { children: /* @__PURE__ */ jsx20(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx20(
          Image3,
          {
            src: news.image || "",
            alt: news.title,
            width: 400,
            height: 192,
            className: "h-48 w-full object-cover"
          }
        ) }) }),
        /* @__PURE__ */ jsxs13(CardHeader, { className: "pb-4", children: [
          /* @__PURE__ */ jsxs13("div", { className: "mb-3 flex flex-wrap items-center gap-2", children: [
            visibleTags.map((tag) => /* @__PURE__ */ jsx20(
              "span",
              {
                className: "bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium",
                children: tag
              },
              tag
            )),
            remainingTagsCount > 0 && /* @__PURE__ */ jsxs13("span", { className: "bg-muted/50 text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium", children: [
              "+",
              remainingTagsCount,
              " more"
            ] })
          ] }),
          /* @__PURE__ */ jsx20("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxs13("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx20(CardTitle, { className: "text-card-foreground text-md mb-2 line-clamp-2 font-bold", children: news.title }),
            /* @__PURE__ */ jsxs13("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx20("div", { className: "text-muted-foreground flex-1 text-xs leading-relaxed", children: /* @__PURE__ */ jsx20("div", { className: "line-clamp-2", children: /* @__PURE__ */ jsx20(
                MarkdownRenderer,
                {
                  content: news.description,
                  className: "prose-p:text-xs prose-p:mb-0.5 prose-p:text-muted-foreground prose-headings:text-xs prose-headings:font-normal prose-headings:text-muted-foreground prose-strong:text-muted-foreground prose-em:text-muted-foreground prose-code:text-xs text-xs"
                }
              ) }) }),
              /* @__PURE__ */ jsx20(
                motion10.div,
                {
                  whileHover: { x: 2 },
                  transition: { duration: 0.2 },
                  children: /* @__PURE__ */ jsx20(ChevronRight6, { className: "text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" })
                }
              )
            ] })
          ] }) })
        ] })
      ]
    }
  ) });
};

// src/components/sub-components/news-related/news-details.tsx
import { useEffect as useEffect5, useRef as useRef5, useState as useState8 } from "react";
import Image4 from "next/image";
import { motion as motion11 } from "framer-motion";

// src/hooks/api/news-reaction-service.ts
import { useMutation as useMutation4 } from "@tanstack/react-query";
var submitNewsReaction = (payload) => {
  const { newsId, reaction, userId } = payload;
  return api.post(
    `/news/${newsId}/reaction`,
    { reaction },
    { params: { user_id: userId } }
  );
};
var useSubmitNewsReaction = (options) => {
  return useMutation4(__spreadValues({
    mutationKey: ["useSubmitNewsReaction"],
    mutationFn: submitNewsReaction,
    onError: (error) => {
      console.error("Error submitting news reaction:", error);
    }
  }, options));
};

// src/components/sub-components/news-related/news-details.tsx
import { jsx as jsx21, jsxs as jsxs14 } from "react/jsx-runtime";
var isValidNewsReaction = (reaction) => {
  if (!reaction) return null;
  return NEWS_REACTIONS.includes(reaction) ? reaction : null;
};
var NewsDetails = ({ news }) => {
  const { resetAllScrollWithDelay } = useScrollContext();
  const contentRef = useRef5(null);
  const { user_id } = useUserId();
  const [selectedReaction, setSelectedReaction] = useState8(() => {
    var _a;
    return isValidNewsReaction((_a = news == null ? void 0 : news.reaction) == null ? void 0 : _a.reaction);
  });
  const submitReactionMutation = useSubmitNewsReaction();
  const handleReactionSubmit = async (reaction) => {
    if (!user_id || submitReactionMutation.isPending) return;
    if (selectedReaction === reaction) {
      return;
    }
    try {
      await submitReactionMutation.mutateAsync({
        newsId: news.id,
        reaction,
        userId: user_id
      });
      setSelectedReaction(reaction);
    } catch (error) {
      console.error(UI_MESSAGES.ERROR.REACTION_SUBMIT_FAILED, error);
    }
  };
  useEffect5(() => {
    resetAllScrollWithDelay(100);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [resetAllScrollWithDelay]);
  useEffect5(() => {
    var _a;
    const existingReaction = isValidNewsReaction((_a = news == null ? void 0 : news.reaction) == null ? void 0 : _a.reaction);
    setSelectedReaction(existingReaction);
  }, [news]);
  const get_relative_time = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const now = /* @__PURE__ */ new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
      const intervals = [
        { label: "year", seconds: 31536e3 },
        { label: "month", seconds: 2592e3 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
      ];
      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
          return count === 1 ? `${count} ${interval.label} ago` : `${count} ${interval.label}s ago`;
        }
      }
      return "just now";
    } catch (e) {
      return "Recently";
    }
  };
  const get_author_name = () => {
    if (news.author && typeof news.author === "object" && news.author.name) {
      return news.author.name;
    }
    return "Anonymous";
  };
  const get_author_initial = () => {
    const name = get_author_name();
    return name.charAt(0).toUpperCase();
  };
  const get_author_image = () => {
    if (news.author && typeof news.author === "object" && news.author.profile_image) {
      return news.author.profile_image;
    }
    return null;
  };
  const container_variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  const item_variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
  const scale_variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  };
  return /* @__PURE__ */ jsxs14(
    motion11.div,
    {
      className: "flex flex-col",
      variants: container_variants,
      initial: "hidden",
      animate: "visible",
      children: [
        news.image_url && /* @__PURE__ */ jsx21("div", { className: "-mx-4 -my-4 mb-6 w-[calc(100%+2rem)]", children: /* @__PURE__ */ jsx21(
          Image4,
          {
            src: news.image_url,
            alt: news.title,
            width: 800,
            height: 400,
            className: "h-auto w-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs14("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx21("div", { className: "flex flex-wrap gap-2", children: news.tags.map((tag, index) => /* @__PURE__ */ jsx21(
            "span",
            {
              className: "bg-muted text-muted-foreground cursor-pointer rounded-full px-3 py-1 text-sm",
              children: tag
            },
            index
          )) }),
          /* @__PURE__ */ jsx21(
            motion11.h1,
            {
              className: "text-card-foreground text-xl leading-tight font-bold",
              variants: item_variants,
              children: news.title
            }
          ),
          /* @__PURE__ */ jsx21(
            motion11.div,
            {
              className: "flex items-center justify-between",
              variants: item_variants,
              children: /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-3", children: [
                get_author_image() ? /* @__PURE__ */ jsx21(
                  motion11.img,
                  {
                    src: get_author_image(),
                    alt: get_author_name(),
                    className: "h-10 w-10 rounded-full object-cover",
                    variants: scale_variants
                  }
                ) : /* @__PURE__ */ jsx21(
                  motion11.div,
                  {
                    className: "bg-muted flex h-10 w-10 items-center justify-center rounded-full",
                    variants: scale_variants,
                    children: /* @__PURE__ */ jsx21("span", { className: "text-primary text-sm font-medium", children: get_author_initial() })
                  }
                ),
                /* @__PURE__ */ jsxs14(
                  motion11.div,
                  {
                    className: "flex flex-row items-center gap-2",
                    variants: item_variants,
                    children: [
                      /* @__PURE__ */ jsx21("p", { className: "text-card-foreground text-sm font-medium", children: get_author_name() }),
                      /* @__PURE__ */ jsx21("p", { className: "text-muted-foreground text-xs", children: get_relative_time(news.published_at) })
                    ]
                  }
                )
              ] })
            }
          ),
          news.content && /* @__PURE__ */ jsx21(
            motion11.div,
            {
              variants: item_variants,
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.5, delay: 0.2 },
              children: /* @__PURE__ */ jsx21(MarkdownRenderer, { content: news.content })
            }
          ),
          /* @__PURE__ */ jsxs14(
            motion11.div,
            {
              className: "flex flex-col items-center justify-center text-center",
              variants: item_variants,
              children: [
                /* @__PURE__ */ jsx21(
                  motion11.h3,
                  {
                    className: "text-card-foreground text-md mb-4 font-semibold",
                    variants: item_variants,
                    children: "How do you feel about this news?"
                  }
                ),
                /* @__PURE__ */ jsx21(motion11.div, { className: "flex gap-3", variants: item_variants, children: NEWS_REACTIONS.map((reaction, index) => {
                  const isSelected = selectedReaction === reaction;
                  const isSubmitting = submitReactionMutation.isPending;
                  return /* @__PURE__ */ jsx21(
                    motion11.button,
                    {
                      onClick: () => handleReactionSubmit(reaction),
                      disabled: isSubmitting,
                      className: `flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${isSelected ? "border-primary bg-primary/10 scale-110" : "border-muted bg-muted/50 hover:border-primary/50 hover:bg-primary/5"} ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"} ${selectedReaction && !isSelected ? "opacity-10" : ""} `,
                      variants: scale_variants,
                      whileHover: !isSubmitting ? { scale: 1.1 } : {},
                      whileTap: !isSubmitting ? { scale: 0.95 } : {},
                      transition: { delay: index * 0.05 },
                      children: /* @__PURE__ */ jsx21("span", { className: "text-xl", children: NEWS_REACTION_EMOJI_MAP[reaction] })
                    },
                    reaction
                  );
                }) })
              ]
            }
          )
        ] })
      ]
    }
  );
};

// src/components/news.tsx
import { jsx as jsx22, jsxs as jsxs15 } from "react/jsx-runtime";
var News = ({
  onShowBackButton,
  backButtonTrigger,
  activePage,
  onShowDetails,
  onBackFromDetails,
  onAutoMaximize
}) => {
  const [selectedNewsId, setSelectedNewsId] = useState9(null);
  const { resetAllScroll, resetAllScrollWithDelay } = useScrollContext();
  const { user_id } = useUserId();
  const navigationStack = useNavigationStack({ maxSize: 10 });
  const {
    data: news_data,
    isLoading,
    error
  } = useGetNews({ page: 1, limit: 10 });
  const {
    data: detailed_news,
    isLoading: isDetailedLoading,
    error: detailedError
  } = useGetNewsById(
    { news_id: selectedNewsId || "", user_id: user_id || "" },
    { enabled: !!selectedNewsId && !!user_id }
  );
  useEffect6(() => {
    if (activePage === "news") {
      setSelectedNewsId(null);
      onShowBackButton(false);
      navigationStack.clear();
      resetAllScrollWithDelay(100);
    } else {
      setSelectedNewsId(null);
      onShowBackButton(false);
      navigationStack.clear();
    }
  }, [activePage, resetAllScroll, resetAllScrollWithDelay]);
  useEffect6(() => {
    if (backButtonTrigger > 0 && selectedNewsId) {
      handle_back_click();
    }
  }, [backButtonTrigger]);
  const handle_news_click = (news) => {
    if (selectedNewsId) {
      navigationStack.push({
        id: selectedNewsId,
        type: "article",
        // Using article type for news items
        data: { newsId: selectedNewsId }
      });
    }
    setSelectedNewsId(news.id.toString());
    onShowBackButton(true);
    onShowDetails == null ? void 0 : onShowDetails(true);
    onAutoMaximize == null ? void 0 : onAutoMaximize();
    resetAllScrollWithDelay(100);
  };
  const handle_back_click = () => {
    if (navigationStack.hasItems) {
      const previousItem = navigationStack.navigateBack();
      if (previousItem && previousItem.type === "article") {
        setSelectedNewsId(previousItem.id);
        onShowBackButton(true);
        onShowDetails == null ? void 0 : onShowDetails(true);
        onAutoMaximize == null ? void 0 : onAutoMaximize();
        resetAllScrollWithDelay(100);
        return;
      }
    }
    setSelectedNewsId(null);
    onShowBackButton(false);
    onShowDetails == null ? void 0 : onShowDetails(false);
    onBackFromDetails == null ? void 0 : onBackFromDetails();
    resetAllScrollWithDelay(100);
  };
  return /* @__PURE__ */ jsx22("div", { className: "w-full", children: /* @__PURE__ */ jsxs15(AnimatePresence2, { mode: "wait", children: [
    selectedNewsId && isDetailedLoading && /* @__PURE__ */ jsx22(
      motion12.div,
      {
        className: "w-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx22("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx22(
          motion12.div,
          {
            className: "text-muted-foreground text-sm",
            animate: { opacity: [0.5, 1, 0.5] },
            transition: { duration: 1.5, repeat: Infinity },
            children: UI_MESSAGES.LOADING.NEWS_DETAILS
          }
        ) })
      },
      "loading"
    ),
    selectedNewsId && detailedError && /* @__PURE__ */ jsx22(
      motion12.div,
      {
        className: "w-full",
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxs15("div", { className: "bg-destructive/10 rounded-lg p-4", children: [
          /* @__PURE__ */ jsx22("p", { className: "text-destructive text-sm", children: "Failed to load news details. Please try again later." }),
          /* @__PURE__ */ jsx22(
            motion12.button,
            {
              onClick: handle_back_click,
              className: "text-destructive mt-2 text-sm underline",
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: "Go back"
            }
          )
        ] })
      },
      "error"
    ),
    selectedNewsId && (detailed_news == null ? void 0 : detailed_news.data) && /* @__PURE__ */ jsx22(
      motion12.div,
      {
        className: "w-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx22(
          NewsDetails,
          {
            news: detailed_news.data,
            onBack: handle_back_click,
            onAutoMaximize
          }
        )
      },
      "news-details"
    ),
    !selectedNewsId && isLoading && /* @__PURE__ */ jsx22(
      motion12.div,
      {
        className: "w-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx22("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx22(
          motion12.div,
          {
            className: "text-muted-foreground text-sm",
            animate: { opacity: [0.5, 1, 0.5] },
            transition: { duration: 1.5, repeat: Infinity },
            children: "Loading news..."
          }
        ) })
      },
      "loading-list"
    ),
    !selectedNewsId && error && /* @__PURE__ */ jsx22(
      motion12.div,
      {
        className: "w-full",
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx22("div", { className: "bg-destructive/10 rounded-lg p-4", children: /* @__PURE__ */ jsx22("p", { className: "text-destructive text-sm", children: "Failed to load news. Please try again later." }) })
      },
      "error-list"
    ),
    !selectedNewsId && !isLoading && !error && (!news_data || !news_data.data || news_data.data.length === 0) && /* @__PURE__ */ jsx22(
      motion12.div,
      {
        className: "w-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx22("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx22("div", { className: "text-muted-foreground text-sm", children: "No news available" }) })
      },
      "no-news"
    ),
    !selectedNewsId && !isLoading && !error && news_data && news_data.data && news_data.data.length > 0 && /* @__PURE__ */ jsxs15(
      motion12.div,
      {
        className: "w-full",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsx22("div", { className: "mb-4 px-1", children: /* @__PURE__ */ jsxs15(
            motion12.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4 },
              children: [
                /* @__PURE__ */ jsx22("h1", { className: "text-card-foreground text-xl font-bold", children: "Latest" }),
                /* @__PURE__ */ jsx22("p", { className: "text-muted-foreground text-sm", children: "From Team Prodgain" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx22("div", { className: "space-y-4", children: news_data.data.map((news, index) => /* @__PURE__ */ jsx22(
            motion12.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: index * 0.1 },
              children: /* @__PURE__ */ jsx22(NewsCard, { news, onClick: handle_news_click })
            },
            news.id
          )) })
        ]
      },
      "news-list"
    )
  ] }) });
};

// src/components/sub-components/chat-related/chat-container.tsx
import { useCallback as useCallback6, useEffect as useEffect8, useRef as useRef7, useState as useState11 } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ObjectId as ObjectId2 } from "bson";
import { ArrowDown, ArrowLeft, Paperclip, Send, Smile, X as X3 } from "lucide-react";

// src/hooks/api/file-service.ts
function uploadFile({
  file,
  userId,
  onProgress,
  signal
}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    const xhr = new XMLHttpRequest();
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = event.loaded / event.total * 100;
          onProgress(percentComplete);
        }
      });
    }
    if (signal) {
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error(UI_MESSAGES.ERROR.UPLOAD_ABORTED));
      });
    }
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            data: response
          });
        } catch (e) {
          resolve({
            success: false,
            error: UI_MESSAGES.ERROR.PARSE_RESPONSE_FAILED
          });
        }
      } else {
        resolve({
          success: false,
          error: `Upload failed with status: ${xhr.status}`
        });
      }
    });
    xhr.addEventListener("error", () => {
      resolve({
        success: false,
        error: "Network error occurred during upload"
      });
    });
    xhr.addEventListener("abort", () => {
      reject(new Error(UI_MESSAGES.ERROR.UPLOAD_ABORTED));
    });
    xhr.open("POST", "/api/v1/upload");
    xhr.send(formData);
  });
}

// src/components/sub-components/chat-related/emoji-picker.tsx
import { useEffect as useEffect7, useRef as useRef6, useState as useState10 } from "react";
import { createElement } from "react";
import dynamic from "next/dynamic";
import { jsx as jsx23, jsxs as jsxs16 } from "react/jsx-runtime";
var EmojiPickerComponent = ({
  onEmojiSelect,
  onClose
}) => {
  const pickerRef = useRef6(null);
  const [isLoaded, setIsLoaded] = useState10(false);
  const [isClient, setIsClient] = useState10(false);
  useEffect7(() => {
    setIsClient(true);
  }, []);
  useEffect7(() => {
    if (!isClient) return;
    const loadEmojiPicker = async () => {
      try {
        await import("emoji-picker-element");
        setIsLoaded(true);
      } catch (error) {
        console.error(UI_MESSAGES.ERROR.USER_ID_REQUIRED, error);
      }
    };
    loadEmojiPicker();
  }, [isClient]);
  useEffect7(() => {
    if (!isLoaded || !isClient) return;
    const picker = pickerRef.current;
    if (picker) {
      const handleEmojiSelect = (event) => {
        const customEvent = event;
        onEmojiSelect(customEvent.detail.unicode);
        onClose();
      };
      picker.addEventListener("emoji-click", handleEmojiSelect);
      return () => {
        picker.removeEventListener("emoji-click", handleEmojiSelect);
      };
    }
  }, [isLoaded, isClient, onEmojiSelect, onClose]);
  if (!isClient || !isLoaded) {
    return /* @__PURE__ */ jsx23("div", { className: "absolute bottom-16 left-0 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-lg", children: /* @__PURE__ */ jsx23("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx23("div", { className: "text-sm text-gray-500", children: "Loading emoji picker..." }) }) });
  }
  return /* @__PURE__ */ jsx23("div", { className: "absolute bottom-16 left-0 z-50", children: /* @__PURE__ */ jsxs16("div", { className: "relative", children: [
    createElement("emoji-picker", {
      ref: pickerRef,
      class: "emoji-picker-custom",
      style: {
        "--border-radius": "0.625rem",
        "--border-color": "var(--border)",
        "--background-color": "var(--card)",
        "--text-color": "var(--foreground)",
        "--category-emoji-padding": "8px",
        "--emoji-size": "20px",
        "--emoji-padding": "4px",
        "--category-icon-size": "16px",
        "--search-background-color": "var(--input)",
        "--search-border-color": "var(--border)",
        "--search-text-color": "var(--foreground)",
        "--search-placeholder-color": "var(--muted-foreground)",
        "--preview-background-color": "var(--muted)",
        "--preview-text-color": "var(--foreground)",
        "--category-background-color": "var(--card)",
        "--category-text-color": "var(--muted-foreground)",
        "--category-text-color-hover": "var(--foreground)",
        "--category-text-color-active": "var(--primary)",
        "--emoji-background-color-hover": "var(--muted)",
        "--emoji-background-color-active": "var(--primary)",
        "--emoji-background-color-active-opacity": "0.2"
      }
    }),
    /* @__PURE__ */ jsx23(
      "button",
      {
        onClick: onClose,
        className: "absolute top-2 right-2 z-10 rounded-full bg-gray-800 p-1 text-white transition-colors hover:bg-gray-700",
        children: /* @__PURE__ */ jsx23("span", { className: "text-sm", children: "\xD7" })
      }
    )
  ] }) });
};
var EmojiPicker = dynamic(
  () => Promise.resolve(EmojiPickerComponent),
  {
    ssr: false,
    loading: () => /* @__PURE__ */ jsx23("div", { className: "absolute bottom-16 left-0 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-lg", children: /* @__PURE__ */ jsx23("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx23("div", { className: "text-sm text-gray-500", children: "Loading emoji picker..." }) }) })
  }
);

// src/components/sub-components/chat-related/chat-container.tsx
import { Fragment as Fragment2, jsx as jsx24, jsxs as jsxs17 } from "react/jsx-runtime";
var ChatContainer = ({
  chatId,
  chatTitle,
  onBack,
  onClose
}) => {
  var _a, _b;
  const { user_id } = useUserId();
  const [currentChatId, setCurrentChatId] = useState11(chatId);
  const [newMessage, setNewMessage] = useState11("");
  const [messages, setMessages] = useState11([]);
  const [streamingContent, setStreamingContent] = useState11("");
  const [isStreaming, setIsStreaming] = useState11(false);
  const [showScrollButton, setShowScrollButton] = useState11(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState11(false);
  const [uploads, setUploads] = useState11([]);
  const {
    data: chatHistoryResponse,
    isLoading,
    error
  } = useGetConversationById(
    { conversationId: currentChatId || "" },
    { enabled: !!currentChatId }
  );
  const queryClient = useQueryClient();
  const sendMessageMutation = useSendMessage();
  const messagesEndRef = useRef7(null);
  const messagesContainerRef = useRef7(null);
  const isAutoScrollingRef = useRef7(false);
  const previousChatIdRef = useRef7(null);
  const lastSyncedMessageIdRef = useRef7(null);
  useEffect8(() => {
    setCurrentChatId(chatId);
  }, [chatId]);
  const areMessagesEqual = useCallback6(
    (incoming, current) => {
      if (incoming.length !== current.length) return false;
      for (let index = 0; index < incoming.length; index += 1) {
        const incomingMessage = incoming[index];
        const currentMessage = current[index];
        if (incomingMessage._id !== currentMessage._id || incomingMessage.updatedAt !== currentMessage.updatedAt) {
          return false;
        }
      }
      return true;
    },
    []
  );
  const scrollToBottom = useCallback6((smooth = true) => {
    if (!messagesEndRef.current) return;
    isAutoScrollingRef.current = true;
    messagesEndRef.current.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "end"
    });
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 500);
  }, []);
  const isNearBottom = useCallback6(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);
  useEffect8(() => {
    var _a2, _b2;
    const fetchedMessages = (_b2 = (_a2 = chatHistoryResponse == null ? void 0 : chatHistoryResponse.data) == null ? void 0 : _a2.messages) != null ? _b2 : [];
    const isNewChat = previousChatIdRef.current !== currentChatId;
    setMessages((currentMessages) => {
      if (!isNewChat && areMessagesEqual(fetchedMessages, currentMessages)) {
        return currentMessages;
      }
      return fetchedMessages;
    });
    const latestFetchedMessageId = fetchedMessages.length > 0 ? fetchedMessages[fetchedMessages.length - 1]._id : null;
    const hasNewMessages = !!latestFetchedMessageId && latestFetchedMessageId !== lastSyncedMessageIdRef.current;
    if (isNewChat || hasNewMessages) {
      const shouldScrollSmoothly = !isNewChat && isNearBottom();
      scrollToBottom(!shouldScrollSmoothly);
    }
    lastSyncedMessageIdRef.current = latestFetchedMessageId;
    previousChatIdRef.current = currentChatId;
  }, [
    currentChatId,
    (_a = chatHistoryResponse == null ? void 0 : chatHistoryResponse.data) == null ? void 0 : _a.messages,
    areMessagesEqual,
    isNearBottom,
    scrollToBottom
  ]);
  const handleScroll = useCallback6(() => {
    if (isAutoScrollingRef.current) return;
    const nearBottom = isNearBottom();
    setShowScrollButton(!nearBottom);
  }, [isNearBottom]);
  useEffect8(() => {
    if (streamingContent && isNearBottom()) {
      scrollToBottom();
    }
  }, [streamingContent, isNearBottom, scrollToBottom]);
  useEffect8(() => {
    if (chatHistoryResponse && !isLoading) {
      setTimeout(() => {
        scrollToBottom(false);
      }, 100);
    }
  }, [chatHistoryResponse, isLoading, scrollToBottom]);
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user_id || isStreaming) return;
    const messageText = newMessage.trim();
    const userMessageId = new ObjectId2().toHexString();
    const aiMessageId = new ObjectId2().toHexString();
    let conversationId = currentChatId;
    if (!conversationId) {
      conversationId = new ObjectId2().toHexString();
      setCurrentChatId(conversationId);
    }
    const userMessage = {
      _id: userMessageId,
      message: messageText,
      sender: "user" /* USER */,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsStreaming(true);
    setStreamingContent("");
    setTimeout(() => scrollToBottom(), 50);
    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId,
        message: messageText,
        userId: user_id,
        messageId: userMessageId
      });
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedContent = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.trim() || !line.startsWith("data: ")) continue;
            try {
              const jsonPart = line.slice(6);
              if (jsonPart === "[DONE]") break;
              const data = JSON.parse(jsonPart);
              const delta = data.delta || data.content || data.token || "";
              if (typeof delta === "string" && delta) {
                accumulatedContent += delta;
                setStreamingContent(accumulatedContent);
              }
            } catch (e) {
              console.warn("SSE parse error:", e);
            }
          }
        }
        const aiMessage = {
          _id: aiMessageId,
          message: accumulatedContent,
          sender: "assistant" /* ASSISTANT */,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        setMessages((prev) => [...prev, aiMessage]);
        setStreamingContent("");
        setIsStreaming(false);
        queryClient.invalidateQueries({ queryKey: ["useGetChatHistory", { user_id }] });
        setTimeout(() => scrollToBottom(), 50);
      }
    } catch (error2) {
      console.error("Send message error:", error2);
      setStreamingContent("");
      setIsStreaming(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || !user_id) return;
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const id = new ObjectId2().toHexString();
      const newItem = {
        id,
        name: file.name,
        status: "uploading" /* UPLOADING */
      };
      setUploads((prev) => [...prev, newItem]);
      try {
        const formData = new FormData();
        formData.append("file", file, file.name);
        const response = await uploadFile({
          file,
          userId: user_id
        });
        if (response.success) {
          setUploads(
            (prev) => prev.map(
              (u) => u.id === id ? __spreadProps(__spreadValues({}, u), { status: "success" /* SUCCESS */ }) : u
            )
          );
        } else {
          setUploads(
            (prev) => prev.map(
              (u) => u.id === id ? __spreadProps(__spreadValues({}, u), { status: "error" /* ERROR */, error: "Upload failed" }) : u
            )
          );
        }
      } catch (e) {
        setUploads(
          (prev) => prev.map(
            (u) => u.id === id ? __spreadProps(__spreadValues({}, u), { status: "error" /* ERROR */, error: "Upload failed" }) : u
          )
        );
      }
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.id !== id));
      }, 2e3);
    }
    event.currentTarget.value = "";
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx24("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsx24("div", { className: "text-muted-foreground", children: UI_MESSAGES.LOADING.CHAT }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx24("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsx24("div", { className: "text-destructive", children: UI_MESSAGES.ERROR.CHAT_LOAD_FAILED }) });
  }
  return /* @__PURE__ */ jsxs17("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxs17("div", { className: "border-border bg-background flex items-center justify-between border-b p-3", children: [
      /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx24(
          "button",
          {
            onClick: onBack,
            className: "hover:bg-muted rounded-lg p-1.5 transition-colors",
            "aria-label": UI_MESSAGES.ARIA_LABELS.GO_BACK,
            children: /* @__PURE__ */ jsx24(ArrowLeft, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx24("h2", { className: "font-semibold", children: chatTitle || ((_b = chatHistoryResponse == null ? void 0 : chatHistoryResponse.data) == null ? void 0 : _b.title) || DEFAULT_TITLES.CHAT })
      ] }),
      onClose && /* @__PURE__ */ jsx24(
        "button",
        {
          onClick: onClose,
          className: "hover:bg-muted rounded-lg p-1.5 transition-colors",
          "aria-label": UI_MESSAGES.ARIA_LABELS.CLOSE_CHAT,
          children: /* @__PURE__ */ jsx24(X3, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs17(
      "div",
      {
        ref: messagesContainerRef,
        className: "flex-1 overflow-y-auto px-4 py-3",
        onScroll: handleScroll,
        children: [
          messages.length === 0 && !isStreaming && /* @__PURE__ */ jsx24("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxs17("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx24("p", { className: "mb-2 text-lg font-medium", children: UI_MESSAGES.WELCOME.CHAT }),
            /* @__PURE__ */ jsx24("p", { className: "text-muted-foreground", children: UI_MESSAGES.WELCOME.SUBTITLE })
          ] }) }),
          /* @__PURE__ */ jsxs17("div", { className: "space-y-4", children: [
            messages.map((message) => {
              const isUser = message.sender === "user";
              return /* @__PURE__ */ jsx24(
                "div",
                {
                  className: `flex ${isUser ? "justify-end" : "justify-start"}`,
                  children: /* @__PURE__ */ jsx24(
                    "div",
                    {
                      className: `max-w-[70%] rounded-lg px-4 py-2 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`,
                      children: /* @__PURE__ */ jsx24(
                        MarkdownRenderer,
                        {
                          content: message.message,
                          className: LAYOUT.PROSE_SIZE
                        }
                      )
                    }
                  )
                },
                message._id
              );
            }),
            isStreaming && /* @__PURE__ */ jsx24("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx24(
              "div",
              {
                className: `bg-muted ${LAYOUT.MESSAGE_MAX_WIDTH} rounded-lg px-4 py-2`,
                children: streamingContent ? /* @__PURE__ */ jsxs17(Fragment2, { children: [
                  /* @__PURE__ */ jsx24(
                    MarkdownRenderer,
                    {
                      content: streamingContent,
                      className: LAYOUT.PROSE_SIZE
                    }
                  ),
                  /* @__PURE__ */ jsx24("span", { className: "bg-foreground ml-1 inline-block h-4 w-2 animate-pulse" })
                ] }) : /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx24(
                    "span",
                    {
                      className: `bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:${ANIMATION_DELAYS.DOT_1}]`
                    }
                  ),
                  /* @__PURE__ */ jsx24(
                    "span",
                    {
                      className: `bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:${ANIMATION_DELAYS.DOT_2}]`
                    }
                  ),
                  /* @__PURE__ */ jsx24(
                    "span",
                    {
                      className: `bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:${ANIMATION_DELAYS.DOT_3}]`
                    }
                  )
                ] })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx24("div", { ref: messagesEndRef })
        ]
      }
    ),
    showScrollButton && /* @__PURE__ */ jsx24(
      "button",
      {
        onClick: () => scrollToBottom(),
        className: "bg-primary text-primary-foreground absolute right-4 bottom-20 rounded-full p-2 shadow-lg transition-opacity hover:opacity-90",
        "aria-label": "Scroll to bottom",
        children: /* @__PURE__ */ jsx24(ArrowDown, { className: "h-5 w-5" })
      }
    ),
    /* @__PURE__ */ jsxs17("div", { className: "border-border bg-background border-t p-4", children: [
      uploads.length > 0 && /* @__PURE__ */ jsx24("div", { className: "mb-3 flex flex-col gap-2", children: uploads.map((u) => /* @__PURE__ */ jsxs17(
        "div",
        {
          className: "border-border bg-card text-card-foreground rounded-md border p-2",
          children: [
            /* @__PURE__ */ jsxs17("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsx24("span", { className: "truncate pr-2", title: u.name, children: u.name }),
              /* @__PURE__ */ jsxs17("span", { className: "text-muted-foreground", children: [
                u.status === "uploading" && UI_MESSAGES.STATUS.UPLOAD_UPLOADING,
                u.status === "success" && UI_MESSAGES.STATUS.UPLOAD_SUCCESS,
                u.status === "error" && UI_MESSAGES.STATUS.UPLOAD_ERROR
              ] })
            ] }),
            u.status === "error" && u.error && /* @__PURE__ */ jsx24("div", { className: "text-destructive mt-1 text-xs", children: u.error })
          ]
        },
        u.id
      )) }),
      /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx24(
          "button",
          {
            onClick: () => setShowEmojiPicker(!showEmojiPicker),
            className: "hover:bg-muted rounded-lg p-2 transition-colors",
            disabled: isStreaming,
            children: /* @__PURE__ */ jsx24(Smile, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxs17("label", { className: "hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsx24(Paperclip, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsx24(
            "input",
            {
              type: "file",
              multiple: true,
              onChange: handleFileSelect,
              disabled: !user_id || isStreaming,
              className: "hidden"
            }
          )
        ] }),
        /* @__PURE__ */ jsx24(
          "input",
          {
            type: "text",
            value: newMessage,
            onChange: (e) => setNewMessage(e.target.value),
            onKeyDown: handleKeyPress,
            placeholder: UI_MESSAGES.PLACEHOLDERS.MESSAGE_INPUT,
            disabled: isStreaming,
            className: "border-input bg-background focus:ring-ring flex-1 rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
          }
        ),
        /* @__PURE__ */ jsx24(
          "button",
          {
            onClick: handleSendMessage,
            disabled: !newMessage.trim() || !user_id || isStreaming,
            className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            children: /* @__PURE__ */ jsx24(Send, { className: "h-5 w-5" })
          }
        )
      ] }),
      showEmojiPicker && /* @__PURE__ */ jsx24("div", { className: "absolute bottom-20 left-4 z-50", children: /* @__PURE__ */ jsx24(
        EmojiPicker,
        {
          onEmojiSelect: handleEmojiSelect,
          onClose: () => setShowEmojiPicker(false)
        }
      ) })
    ] })
  ] });
};

// src/components/chatbot.tsx
import { jsx as jsx25, jsxs as jsxs18 } from "react/jsx-runtime";
var navigationItems = [
  { id: "homepage", icon: House, label: "Home" },
  { id: "message", icon: MessageSquareText, label: "Chat" },
  { id: "help", icon: CircleQuestionMark, label: "Help" },
  { id: "news", icon: Megaphone, label: "News" }
];
var Chatbot = ({
  onClose,
  isMaximized: externalIsMaximized,
  onMaximizeChange
}) => {
  const [activePage, setActivePage] = useState12("homepage");
  const [showChatHistory, setShowChatHistory] = useState12(false);
  const [showBackButton, setShowBackButton] = useState12(false);
  const [backButtonTrigger, setBackButtonTrigger] = useState12(0);
  const [selectedChatId, setSelectedChatId] = useState12(null);
  const [pageKey, setPageKey] = useState12(Date.now());
  const [internalIsMaximized, setInternalIsMaximized] = useState12(false);
  const [selectedArticleId, setSelectedArticleId] = useState12(
    null
  );
  const [dynamicTitle, setDynamicTitle] = useState12(null);
  const [navigatedFromHomepage, setNavigatedFromHomepage] = useState12(false);
  const [showActiveChat, setShowActiveChat] = useState12(false);
  const [showDetails, setShowDetails] = useState12(false);
  const [title, setTitle] = useState12(null);
  const contentRef = useRef8(null);
  const prevMaximizedRef = useRef8(null);
  const { resetAllScroll, resetScrollToElement, resetAllScrollWithDelay } = useScrollContext();
  const isMaximized = externalIsMaximized !== void 0 ? externalIsMaximized : internalIsMaximized;
  useEffect9(() => {
    if (contentRef.current) {
      resetScrollToElement(contentRef);
    }
    resetAllScrollWithDelay(150);
  }, [
    activePage,
    resetAllScroll,
    resetScrollToElement,
    resetAllScrollWithDelay
  ]);
  useEffect9(() => {
    resetAllScrollWithDelay(100);
  }, [pageKey, resetAllScrollWithDelay]);
  const handlePageChange = (page, articleId) => {
    if (activePage === "homepage" && page === "help" && articleId) {
      setNavigatedFromHomepage(true);
      setShowBackButton(true);
    } else {
      setNavigatedFromHomepage(false);
      setShowBackButton(false);
    }
    setActivePage(page);
    setShowDetails(false);
    setSelectedArticleId(articleId || null);
    setDynamicTitle(null);
    const newMaximized = false;
    if (externalIsMaximized !== void 0) {
      onMaximizeChange == null ? void 0 : onMaximizeChange(newMaximized);
    } else {
      setInternalIsMaximized(newMaximized);
    }
    setPageKey(Date.now());
    if (page === "message") {
      setShowChatHistory(true);
    }
    if (contentRef.current) {
      resetScrollToElement(contentRef);
    }
    resetAllScrollWithDelay(100);
  };
  const handleBackToHistory = () => {
    setSelectedChatId(null);
    setShowChatHistory(true);
    setShowActiveChat(false);
    resetAllScrollWithDelay(100);
    if (prevMaximizedRef.current !== null) {
      const restore = prevMaximizedRef.current;
      if (externalIsMaximized !== void 0) {
        onMaximizeChange == null ? void 0 : onMaximizeChange(restore);
      } else {
        setInternalIsMaximized(restore);
      }
      prevMaximizedRef.current = null;
    }
  };
  const handleNavigateToHome = () => {
    setNavigatedFromHomepage(false);
    handlePageChange("homepage");
  };
  const handleChatSelected = (chatId) => {
    setSelectedChatId(chatId);
    setShowChatHistory(false);
    prevMaximizedRef.current = isMaximized;
    if (externalIsMaximized !== void 0) {
      onMaximizeChange == null ? void 0 : onMaximizeChange(true);
    } else {
      setInternalIsMaximized(true);
    }
    resetAllScrollWithDelay(100);
  };
  const handleBackClick = () => {
    if (navigatedFromHomepage) {
      handleNavigateToHome();
    } else {
      resetAllScrollWithDelay(100);
      setBackButtonTrigger((prev) => prev + 1);
    }
  };
  const handleBackFromDetails = () => {
    const newMaximized = false;
    if (externalIsMaximized !== void 0) {
      onMaximizeChange == null ? void 0 : onMaximizeChange(newMaximized);
    } else {
      setInternalIsMaximized(newMaximized);
    }
    setShowDetails(false);
    setShowBackButton(false);
    resetAllScrollWithDelay(100);
  };
  const handleMinimizeOnly = () => {
    const newMaximized = false;
    if (externalIsMaximized !== void 0) {
      onMaximizeChange == null ? void 0 : onMaximizeChange(newMaximized);
    } else {
      setInternalIsMaximized(newMaximized);
    }
    resetAllScrollWithDelay(100);
  };
  const { triggerAutoMaximize } = useAutoMaximize({
    onMaximizeChange,
    externalIsMaximized,
    setInternalIsMaximized
  });
  const shouldShowMaximizeButton = () => {
    return showDetails && (activePage === "help" || activePage === "news");
  };
  const getPageTitle = (page) => {
    if (page === "help" && dynamicTitle) {
      return dynamicTitle;
    }
    if (page === "help" && navigatedFromHomepage && selectedArticleId && !dynamicTitle) {
      return "";
    }
    switch (page) {
      case "homepage":
        return "Home";
      case "message":
        return "Chat";
      case "help":
        return "Help";
      case "news":
        return "News";
      default:
        return page;
    }
  };
  const Navigation = () => /* @__PURE__ */ jsx25(
    motion13.div,
    {
      className: "border-border bg-card flex gap-1 rounded-b-lg border-t p-3",
      layout: true,
      children: navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return /* @__PURE__ */ jsxs18(
          "button",
          {
            onClick: () => handlePageChange(item.id),
            className: `flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-md p-2 transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ jsx25(Icon, { className: `h-5 w-5 ${isActive ? "text-primary" : ""}` }),
              /* @__PURE__ */ jsx25(
                "span",
                {
                  className: `text-xs font-medium ${isActive ? "text-primary" : ""}`,
                  children: item.label
                }
              )
            ]
          },
          item.id
        );
      })
    }
  );
  const Header = ({
    title: title2,
    showBack = false
  }) => /* @__PURE__ */ jsxs18(
    motion13.div,
    {
      className: "relaborder-border bg-card flex items-center rounded-t-lg border-b p-4",
      layout: true,
      children: [
        showBack && /* @__PURE__ */ jsx25(
          "button",
          {
            onClick: handleBackClick,
            className: "hover:bg-muted mr-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors",
            children: /* @__PURE__ */ jsx25(ArrowLeft2, { className: "text-muted-foreground h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx25(
          motion13.h2,
          {
            className: `${showBack ? "" : "flex-1"} text-foreground text-center text-lg font-semibold`,
            initial: { opacity: title2 ? 1 : 0, y: title2 ? 0 : -5 },
            animate: { opacity: title2 ? 1 : 0, y: 0 },
            transition: { duration: 0.2 },
            children: title2
          },
          title2
        ),
        /* @__PURE__ */ jsxs18("div", { className: "ml-auto flex items-center gap-2", children: [
          shouldShowMaximizeButton() && /* @__PURE__ */ jsx25(
            "button",
            {
              onClick: () => {
                const newMaximized = !isMaximized;
                if (externalIsMaximized !== void 0) {
                  onMaximizeChange == null ? void 0 : onMaximizeChange(newMaximized);
                } else {
                  setInternalIsMaximized(newMaximized);
                }
              },
              className: "hover:bg-muted cursor-pointer rounded-full p-1 transition-colors",
              children: isMaximized ? /* @__PURE__ */ jsx25(Minimize2, { className: "text-muted-foreground h-4 w-4" }) : /* @__PURE__ */ jsx25(Maximize2, { className: "text-muted-foreground h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx25(
            "button",
            {
              onClick: onClose,
              className: "hover:bg-muted cursor-pointer rounded-full p-1 transition-colors",
              children: /* @__PURE__ */ jsx25(X4, { className: "text-muted-foreground h-5 w-5" })
            }
          )
        ] })
      ]
    }
  );
  if (activePage === "message" && showActiveChat) {
    return /* @__PURE__ */ jsx25(
      motion13.div,
      {
        className: `chatbot-container border-border bg-background flex flex-col rounded-lg border shadow-2xl`,
        initial: { opacity: 0, scale: 0.9 },
        animate: {
          opacity: 1,
          scale: 1,
          height: isMaximized ? "calc(95vh - 3rem)" : "700px",
          width: isMaximized ? "calc(40vw - 3rem)" : "400px"
        },
        transition: {
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 25
        },
        children: /* @__PURE__ */ jsx25(
          ChatContainer,
          {
            chatId: selectedChatId,
            chatTitle: title != null ? title : "",
            onBack: handleBackToHistory,
            onClose
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxs18(
    motion13.div,
    {
      className: `chatbot-container border-border flex flex-col border shadow-2xl ${isMaximized ? "h-[calc(95vh-3rem)] w-[calc(40vw-3rem)] rounded-lg" : "h-[800px] w-100 rounded-lg"} ${activePage === "homepage" ? "homepage-gradient" : "bg-background"}`,
      initial: { opacity: 0, scale: 0.9 },
      animate: {
        opacity: 1,
        scale: 1,
        height: isMaximized ? "calc(95vh - 3rem)" : "700px",
        width: isMaximized ? "calc(40vw - 3rem)" : "400px"
      },
      transition: {
        duration: 0.8,
        stiffness: 200,
        type: "spring",
        damping: 25,
        mass: 1.2
      },
      layout: true,
      children: [
        activePage !== "homepage" && /* @__PURE__ */ jsx25(Header, { title: getPageTitle(activePage), showBack: showBackButton }),
        /* @__PURE__ */ jsx25(
          motion13.div,
          {
            ref: contentRef,
            className: "scroll-container flex-1 overflow-y-auto",
            initial: { opacity: 0 },
            animate: { opacity: 100 },
            transition: { duration: 0.6, delay: 0.2 },
            layout: true,
            onAnimationComplete: () => {
              if (contentRef.current) {
                contentRef.current.scrollTop = 0;
              }
              resetAllScroll();
            },
            children: /* @__PURE__ */ jsxs18(AnimatePresence3, { mode: "wait", children: [
              activePage === "homepage" && /* @__PURE__ */ jsx25(
                motion13.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  transition: { duration: 0.5 },
                  className: "p-4",
                  children: /* @__PURE__ */ jsx25(
                    Home,
                    {
                      onNavigateToHelp: (articleId) => handlePageChange("help", articleId),
                      onOpenChat: (conversationId, chatTitle) => {
                        setActivePage("message");
                        setShowChatHistory(false);
                        setSelectedChatId(conversationId);
                        setShowActiveChat(true);
                        setTitle(chatTitle || "Untitled Chat");
                        resetAllScrollWithDelay(100);
                        prevMaximizedRef.current = isMaximized;
                        if (externalIsMaximized !== void 0) {
                          onMaximizeChange == null ? void 0 : onMaximizeChange(true);
                        } else {
                          setInternalIsMaximized(true);
                        }
                      },
                      onAskQuestion: () => {
                        handlePageChange("message");
                        setSelectedChatId(null);
                        setShowChatHistory(true);
                        setShowActiveChat(false);
                      },
                      onClose
                    }
                  )
                },
                "homepage"
              ),
              activePage === "message" && /* @__PURE__ */ jsx25(
                motion13.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  transition: { duration: 0.5 },
                  className: "p-4",
                  children: /* @__PURE__ */ jsx25(
                    Message,
                    {
                      showChatHistory,
                      onChatSelected: handleChatSelected,
                      onBackToHistory: handleBackToHistory,
                      setShowActiveChat,
                      title: setTitle
                    }
                  )
                },
                "message"
              ),
              activePage === "help" && /* @__PURE__ */ jsx25(
                motion13.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  transition: { duration: 0.5 },
                  children: /* @__PURE__ */ jsx25(
                    Help,
                    {
                      onShowBackButton: setShowBackButton,
                      backButtonTrigger,
                      activePage,
                      onShowDetails: setShowDetails,
                      onBackFromDetails: handleBackFromDetails,
                      onMinimizeOnly: handleMinimizeOnly,
                      onAutoMaximize: triggerAutoMaximize,
                      selectedArticleId,
                      onTitleChange: setDynamicTitle,
                      navigatedFromHomepage
                    }
                  )
                },
                `help-${pageKey}`
              ),
              activePage === "news" && /* @__PURE__ */ jsx25(
                motion13.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  transition: { duration: 0.5 },
                  className: "p-4",
                  children: /* @__PURE__ */ jsx25(
                    News,
                    {
                      onShowBackButton: setShowBackButton,
                      backButtonTrigger,
                      activePage,
                      onShowDetails: setShowDetails,
                      onBackFromDetails: handleBackFromDetails,
                      onAutoMaximize: triggerAutoMaximize
                    }
                  )
                },
                `news-${pageKey}`
              )
            ] })
          },
          activePage
        ),
        !showDetails && /* @__PURE__ */ jsx25(Navigation, {})
      ]
    }
  );
};

// src/components/chat-bot-launcher.tsx
import { Fragment as Fragment3, jsx as jsx26, jsxs as jsxs19 } from "react/jsx-runtime";
var ChatbotLauncher = ({}) => {
  const { user_id } = useUserId();
  const [isChatbotOpen, setIsChatbotOpen] = useState13(false);
  return /* @__PURE__ */ jsxs19(Fragment3, { children: [
    /* @__PURE__ */ jsx26(
      motion14.button,
      {
        onClick: () => setIsChatbotOpen(!isChatbotOpen),
        className: "bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 bottom-6 z-50 cursor-pointer rounded-lg px-4 py-3 font-medium transition-colors",
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: {
          duration: 0.4,
          delay: 0.8,
          type: "spring",
          stiffness: 200
        },
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        children: isChatbotOpen ? /* @__PURE__ */ jsx26(ChevronDown, {}) : /* @__PURE__ */ jsx26(Bot, {})
      }
    ),
    /* @__PURE__ */ jsx26(AnimatePresence4, { children: isChatbotOpen && user_id && /* @__PURE__ */ jsx26(
      motion14.div,
      {
        className: "fixed right-6 bottom-20 z-50",
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.9 },
        transition: { duration: 0.5, stiffness: 100 },
        children: /* @__PURE__ */ jsx26(Chatbot, { user_id, onClose: () => setIsChatbotOpen(false) })
      },
      "chatbot-container"
    ) })
  ] });
};

// src/providers/chatbot-with-providers.tsx
import { jsx as jsx27 } from "react/jsx-runtime";
var Chatbot2 = () => {
  const [queryClient] = useState14(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1e3,
          // 1 minute
          retry: 2,
          refetchOnWindowFocus: false
        },
        mutations: {
          retry: 1
        }
      }
    })
  );
  return /* @__PURE__ */ jsx27(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx27(ScrollProvider, { children: /* @__PURE__ */ jsx27(ArticleNavigationProvider, { children: /* @__PURE__ */ jsx27(ChatbotLauncher, {}) }) }) });
};
export {
  Chatbot2 as Chatbot
};
