"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import {
  THelpArticle,
  THelpArticleDetailResponse,
} from "@/types/component-types/help-types";

interface ArticleNavigationContextType {
  // State for article details navigation from home page
  selectedArticleId: string | null;
  selectedArticle: THelpArticle | null;
  isArticleDetailsOpen: boolean;
  articleDetailsData: THelpArticleDetailResponse | undefined;
  isLoadingArticle: boolean;
  articleError: Error | null;

  // Actions
  openArticleDetails: (article: THelpArticle) => void;
  closeArticleDetails: () => void;
  resetArticleNavigation: () => void;
  setArticleDetailsData: (data: THelpArticleDetailResponse | undefined) => void;
  setLoadingArticle: (loading: boolean) => void;
  setArticleError: (error: Error | null) => void;
}

const ArticleNavigationContext = createContext<
  ArticleNavigationContextType | undefined
>(undefined);

interface ArticleNavigationProviderProps {
  children: ReactNode;
}

export const ArticleNavigationProvider = ({
  children,
}: ArticleNavigationProviderProps) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [selectedArticle, setSelectedArticle] = useState<THelpArticle | null>(
    null
  );
  const [isArticleDetailsOpen, setIsArticleDetailsOpen] = useState(false);
  const [articleDetailsData, setArticleDetailsData] = useState<
    THelpArticleDetailResponse | undefined
  >(undefined);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [articleError, setArticleError] = useState<Error | null>(null);

  const openArticleDetails = (article: THelpArticle) => {
    setSelectedArticle(article);
    setSelectedArticleId(article.id);
    setIsArticleDetailsOpen(true);
  };

  const closeArticleDetails = () => {
    setSelectedArticle(null);
    setSelectedArticleId(null);
    setIsArticleDetailsOpen(false);
    setArticleDetailsData(undefined);
    setIsLoadingArticle(false);
    setArticleError(null);
  };

  const resetArticleNavigation = () => {
    setSelectedArticle(null);
    setSelectedArticleId(null);
    setIsArticleDetailsOpen(false);
    setArticleDetailsData(undefined);
    setIsLoadingArticle(false);
    setArticleError(null);
  };

  return (
    <ArticleNavigationContext.Provider
      value={{
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
        setArticleError,
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
