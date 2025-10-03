"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  THelpArticleDetail,
  THelpArticleDetailResponse,
  TNavigationItemType,
} from "@/types/help-types";

// Navigation stack item types

export type NavigationStackItem = {
  type: TNavigationItemType;
  id: string;
  title?: string;
  data?: THelpArticleDetail | unknown;
  timestamp: number;
};

type ArticleNavigationContextType = {
  // State for article details navigation
  selectedArticleId: string | null;
  selectedArticle: THelpArticleDetail | null;
  isArticleDetailsOpen: boolean;
  articleDetailsData: THelpArticleDetailResponse | undefined;
  isLoadingArticle: boolean;
  articleError: Error | null;

  // Navigation stack state
  navigationStack: NavigationStackItem[];
  canGoBack: boolean;

  // Actions
  openArticleDetails: (article: THelpArticleDetail) => void;
  openArticleDetailsById: (articleId: string) => void;
  closeArticleDetails: () => void;
  resetArticleNavigation: () => void;
  setArticleDetailsData: (data: THelpArticleDetailResponse | undefined) => void;
  setLoadingArticle: (loading: boolean) => void;
  setArticleError: (error: Error | null) => void;

  // Navigation stack actions
  goBack: () => void;
  getPreviousItem: () => NavigationStackItem | null;
};

const ArticleNavigationContext = createContext<
  ArticleNavigationContextType | undefined
>(undefined);

type ArticleNavigationProviderProps = {
  children: ReactNode;
};

export const ArticleNavigationProvider = ({
  children,
}: ArticleNavigationProviderProps) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [selectedArticle, setSelectedArticle] =
    useState<THelpArticleDetail | null>(null);
  const [isArticleDetailsOpen, setIsArticleDetailsOpen] = useState(false);
  const [articleDetailsData, setArticleDetailsData] = useState<
    THelpArticleDetailResponse | undefined
  >(undefined);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [articleError, setArticleError] = useState<Error | null>(null);

  // Navigation stack state
  const [navigationStack, setNavigationStack] = useState<NavigationStackItem[]>(
    []
  );

  // Computed values
  const canGoBack = navigationStack.length > 1;

  // Navigation stack actions
  const pushItem = useCallback(
    (item: Omit<NavigationStackItem, "timestamp">) => {
      const newItem: NavigationStackItem = {
        ...item,
        timestamp: Date.now(),
      };

      setNavigationStack((prev) => {
        // Avoid duplicate consecutive items
        const lastItem = prev[prev.length - 1];
        if (
          lastItem &&
          lastItem.type === newItem.type &&
          lastItem.id === newItem.id
        ) {
          return prev;
        }
        return [...prev, newItem];
      });
    },
    []
  );

  const popItem = useCallback((): NavigationStackItem | null => {
    let poppedItem: NavigationStackItem | null = null;

    setNavigationStack((prev) => {
      if (prev.length === 0) return prev;
      poppedItem = prev[prev.length - 1];
      return prev.slice(0, -1);
    });

    return poppedItem;
  }, []);

  const goBack = useCallback(() => {
    if (navigationStack.length <= 1) return;

    const previousItem = navigationStack[navigationStack.length - 2];
    popItem();

    // Handle navigation based on the previous item type
    if (previousItem) {
      switch (previousItem.type) {
        case "article":
          if (
            previousItem.data &&
            typeof previousItem.data === "object" &&
            "id" in previousItem.data
          ) {
            // Set article details without pushing to stack (to avoid circular dependency)
            setSelectedArticle(previousItem.data as THelpArticleDetail);
            setSelectedArticleId((previousItem.data as THelpArticleDetail).id);
            setIsArticleDetailsOpen(true);
          }
          break;
        case "collection":
          // Handle collection navigation if needed
          break;
        case "list":
          closeArticleDetails();
          break;
      }
    }
  }, [navigationStack, popItem]);

  const clearStack = useCallback(() => {
    setNavigationStack([]);
  }, []);

  const getCurrentItem = useCallback((): NavigationStackItem | null => {
    return navigationStack.length > 0
      ? navigationStack[navigationStack.length - 1]
      : null;
  }, [navigationStack]);

  const getPreviousItem = useCallback((): NavigationStackItem | null => {
    return navigationStack.length > 1
      ? navigationStack[navigationStack.length - 2]
      : null;
  }, [navigationStack]);

  const openArticleDetails = useCallback(
    (article: THelpArticleDetail) => {
      setSelectedArticle(article);
      setSelectedArticleId(article.id);
      setIsArticleDetailsOpen(true);

      // Push to navigation stack
      pushItem({
        type: "article",
        id: article.id,
        title: article.title,
        data: article,
      });
    },
    [pushItem]
  );

  const openArticleDetailsById = useCallback(
    (articleId: string) => {
      setSelectedArticle(null); // Clear the article data initially
      setSelectedArticleId(articleId);
      setIsArticleDetailsOpen(true);
      setIsLoadingArticle(true);
      setArticleError(null);

      // Push to navigation stack with minimal data
      pushItem({
        type: "article",
        id: articleId,
        title: "Loading...",
        data: null,
      });
    },
    [pushItem]
  );

  const closeArticleDetails = useCallback(() => {
    setSelectedArticle(null);
    setSelectedArticleId(null);
    setIsArticleDetailsOpen(false);
    setArticleDetailsData(undefined);
    setIsLoadingArticle(false);
    setArticleError(null);

    // Pop from navigation stack if current item is an article
    const currentItem = getCurrentItem();
    if (currentItem?.type === "article") {
      popItem();
    }
  }, [getCurrentItem, popItem]);

  const resetArticleNavigation = useCallback(() => {
    setSelectedArticle(null);
    setSelectedArticleId(null);
    setIsArticleDetailsOpen(false);
    setArticleDetailsData(undefined);
    setIsLoadingArticle(false);
    setArticleError(null);
    clearStack();
  }, [clearStack]);

  return (
    <ArticleNavigationContext.Provider
      value={{
        selectedArticleId,
        selectedArticle,
        isArticleDetailsOpen,
        articleDetailsData,
        isLoadingArticle,
        articleError,
        navigationStack,
        canGoBack,
        openArticleDetails,
        openArticleDetailsById,
        closeArticleDetails,
        resetArticleNavigation,
        setArticleDetailsData,
        setLoadingArticle: setIsLoadingArticle,
        setArticleError,
        goBack,
        getPreviousItem,
      }}
    >
      {children}
    </ArticleNavigationContext.Provider>
  );
};

export const useArticleNavigation = () => {
  const context = useContext(ArticleNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useArticleNavigation must be used within an ArticleNavigationProvider"
    );
  }
  return context;
};
