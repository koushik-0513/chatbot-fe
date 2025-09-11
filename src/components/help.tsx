import { useCallback, useEffect, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { AnimatePresence, motion } from "framer-motion";

import { useUserId } from "@/hooks/use-user-id";

import {
  useGetArticleDetails,
  useGetCollectionDetails,
  useGetCollections,
} from "../hooks/api/help-service";
import { THelpArticle, THelpCollection, THelpPageState } from "../types/types";
import { ArticleCard } from "./sub-components/help-related/article-cards";
import { ArticleDetails } from "./sub-components/help-related/article-details";
import { CollectionDetails } from "./sub-components/help-related/collection-details";
import { SearchBar } from "./sub-components/help-related/search-bar";

type THelppageProps = {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
  activePage: string;
  onShowDetails?: (show: boolean) => void;
  onBackFromDetails?: () => void;
  onMinimizeOnly?: () => void;
  onAutoMaximize?: () => void;
  selectedArticleId?: string | null;
  onTitleChange?: (title: string) => void;
  onNavigateToHome?: () => void;
  navigatedFromHomepage?: boolean;
};

export const Help = ({
  onShowBackButton,
  backButtonTrigger,
  activePage,
  onShowDetails,
  onBackFromDetails,
  onMinimizeOnly,
  onAutoMaximize,
  selectedArticleId: propSelectedArticleId,
  onTitleChange,
  onNavigateToHome,
  navigatedFromHomepage = false,
}: THelppageProps) => {
  const [pageState, setPageState] = useState<THelpPageState>({
    currentView: "list",
    selectedCollection: null,
    selectedArticle: null,
  });
  const { resetAllScroll, resetAllScrollWithDelay } = useScrollContext();
  const { user_id } = useUserId();
  // Fetch collections from API
  const { data: collectionsData, isLoading, error } = useGetCollections();

  // State for selected collection ID
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  // State for selected article ID - use prop if provided, otherwise use state
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    propSelectedArticleId || null
  );

  // State for parent collection ID to track navigation
  const [parentCollectionId, setParentCollectionId] = useState<string | null>(
    null
  );
  const [showTitle, setShowTitle] = useState(false);

  // State for article navigation history - store only IDs for efficiency
  const [articleNavigationStack, setArticleNavigationStack] = useState<
    string[]
  >([]);

  // Fetch collection details when a collection is selected
  const {
    data: collectionDetailsData,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useGetCollectionDetails(selectedCollectionId);

  // Fetch article details when an article is selected
  const {
    data: articleDetailsData,
    isLoading: isLoadingArticle,
    error: articleError,
  } = useGetArticleDetails(selectedArticleId, user_id);

  console.log(collectionDetailsData);

  // Handle prop changes for selectedArticleId
  useEffect(() => {
    if (propSelectedArticleId && propSelectedArticleId !== selectedArticleId) {
      setSelectedArticleId(propSelectedArticleId);
    }
  }, [propSelectedArticleId, selectedArticleId]);

  // Auto-show article when selectedArticleId is provided and article data is loaded
  useEffect(() => {
    if (selectedArticleId && articleDetailsData?.data?.article) {
      const article = articleDetailsData.data.article;
      setPageState({
        currentView: "article",
        selectedCollection: null,
        selectedArticle: {
          id: article.id,
          title: article.title,
          description: article.excerpt || "",
          content: article.content || "",
          author: articleDetailsData.data.author?.name || "Anonymous",
        },
      });
      onShowDetails?.(true);
      onAutoMaximize?.();

      // If navigated from homepage, immediately set the article title
      if (navigatedFromHomepage && article.title) {
        onTitleChange?.(article.title);
      }
    }
  }, [
    selectedArticleId,
    articleDetailsData,
    onShowDetails,
    onAutoMaximize,
    navigatedFromHomepage,
    onTitleChange,
  ]);

  // Get the current title based on the view
  const getCurrentTitle = () => {
    if (pageState.currentView === "article" && pageState.selectedArticle) {
      return pageState.selectedArticle.title;
    }
    return "Help";
  };

  // Handle scroll-based title visibility
  useEffect(() => {
    const handleScroll = () => {
      // Don't handle scroll-based title if we navigated from homepage
      if (navigatedFromHomepage) return;

      // Find the scroll container in the parent
      const scrollContainer = document.querySelector(".scroll-container");
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        // Show title when scrolled up more than 50px
        setShowTitle(scrollTop > 50);
      }
    };

    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [pageState.currentView, navigatedFromHomepage]);

  // Notify parent component when title changes
  useEffect(() => {
    const currentTitle = getCurrentTitle();

    // If navigated from homepage and viewing an article, always show article title
    if (navigatedFromHomepage && pageState.currentView === "article") {
      onTitleChange?.(currentTitle);
    } else if (pageState.currentView === "article" && showTitle) {
      // Otherwise, only show title if scrolled up
      onTitleChange?.(currentTitle);
    } else if (!navigatedFromHomepage) {
      onTitleChange?.("Help");
    }
  }, [
    pageState.currentView,
    pageState.selectedArticle,
    showTitle,
    onTitleChange,
    navigatedFromHomepage,
  ]);

  // Reset internal navigation state when component mounts or when switching away from help
  useEffect(() => {
    if (activePage === "help") {
      // Don't reset everything if we're navigating from homepage with an article
      if (!navigatedFromHomepage) {
        setPageState({
          currentView: "list",
          selectedCollection: null,
          selectedArticle: null,
        });
        setSelectedCollectionId(null);
        setSelectedArticleId(propSelectedArticleId || null);
        setParentCollectionId(null);
        setArticleNavigationStack([]); // Clear navigation stack
        onShowBackButton(false);
      }

      // Force scroll reset for this component
      resetAllScrollWithDelay(100);
    } else {
      // Reset state when switching away from help
      setPageState({
        currentView: "list",
        selectedCollection: null,
        selectedArticle: null,
      });
      setSelectedCollectionId(null);
      setSelectedArticleId(null);
      setParentCollectionId(null);
      setArticleNavigationStack([]); // Clear navigation stack
      onShowBackButton(false);
    }
  }, [
    activePage,
    resetAllScroll,
    resetAllScrollWithDelay,
    propSelectedArticleId,
    navigatedFromHomepage,
  ]);

  // Handle back button trigger from navbar
  useEffect(() => {
    if (backButtonTrigger > 0 && !navigatedFromHomepage) {
      if (pageState.currentView === "article") {
        handle_back_to_collection();
      } else if (pageState.currentView === "collection") {
        handle_back_to_list();
      }
    }
  }, [backButtonTrigger, navigatedFromHomepage]);

  const handle_collection_click = useCallback(
    (collection: THelpCollection) => {
      setSelectedCollectionId(collection.id);
      setPageState({
        currentView: "collection",
        selectedCollection: collection,
        selectedArticle: null,
      });
      onShowBackButton(true);
      // Don't hide navbar for collection details
      onShowDetails?.(false);

      // Reset scroll when navigating to collection
      resetAllScrollWithDelay(100);
    },
    [onShowBackButton, onShowDetails, resetAllScrollWithDelay]
  );

  const handle_article_click = useCallback(
    (article: THelpArticle) => {
      setSelectedArticleId(article.id);
      setPageState({
        currentView: "article",
        selectedCollection: pageState.selectedCollection,
        selectedArticle: article,
      });

      // Don't add to navigation stack when coming from collection
      // Navigation stack is only for related article navigation

      onShowDetails?.(true);

      // Reset scroll when navigating to article
      resetAllScrollWithDelay(100);
    },
    [pageState.selectedCollection, onShowDetails, resetAllScrollWithDelay]
  );

  // Handle related article navigation
  const handle_related_article_click = useCallback(
    (articleId: string) => {
      // Add current article ID to navigation stack before navigating to related article
      if (selectedArticleId) {
        setArticleNavigationStack((prev) => [...prev, selectedArticleId]);
      }

      // Directly set the new article ID without clearing first
      setSelectedArticleId(articleId);
      setPageState({
        currentView: "article",
        selectedCollection: pageState.selectedCollection,
        selectedArticle: null, // Will be populated by the useEffect when article loads
      });

      // Reset scroll position for new article
      resetAllScrollWithDelay(100);
    },
    [selectedArticleId, pageState.selectedCollection, resetAllScrollWithDelay]
  );

  const handle_back_to_list = (parentId?: string) => {
    if (parentCollectionId) {
      // If we have a parent collection, navigate back to it
      setSelectedCollectionId(parentCollectionId);
      setParentCollectionId(null); // Clear the parent since we're going back
      setPageState({
        currentView: "collection",
        selectedCollection: null, // This will be updated by the API call
        selectedArticle: null,
      });
    } else {
      // Go back to the main list
      setSelectedCollectionId(null);
      setParentCollectionId(null);
      setPageState({
        currentView: "list",
        selectedCollection: null,
        selectedArticle: null,
      });
      setArticleNavigationStack([]); // Clear navigation stack
      onShowBackButton(false);
      onShowDetails?.(false);
      onBackFromDetails?.(); // Call the callback to auto-minimize
    }

    // Reset scroll when going back
    resetAllScrollWithDelay(100);
  };

  const handle_back_to_collection = useCallback(() => {
    // Check if we have articles in the navigation stack (related article navigation)
    if (articleNavigationStack.length > 0) {
      // Go back to the previous article in the stack
      const previousArticleId =
        articleNavigationStack[articleNavigationStack.length - 1];
      setArticleNavigationStack((prev) => prev.slice(0, -1)); // Remove the last article

      setSelectedArticleId(previousArticleId);
      setPageState({
        currentView: "article",
        selectedCollection: pageState.selectedCollection,
        selectedArticle: null, // Will be populated by the useEffect when article loads
      });

      // Reset scroll when going back to previous article
      resetAllScrollWithDelay(100);
    } else {
      // No previous articles in stack, go back to collection
      setSelectedArticleId(null);
      setPageState({
        currentView: "collection",
        selectedCollection: pageState.selectedCollection,
        selectedArticle: null,
      });
      // Clear navigation stack when going back to collection
      setArticleNavigationStack([]);
      // Don't hide navbar for collection view
      onShowDetails?.(false);
      // Call onMinimizeOnly to trigger minimize without affecting back button state
      onMinimizeOnly?.();

      // Reset scroll when going back to collection
      resetAllScrollWithDelay(100);
    }
  }, [
    articleNavigationStack,
    pageState.selectedCollection,
    onShowDetails,
    onMinimizeOnly,
    resetAllScrollWithDelay,
  ]);

  // Custom back handler for when coming from home page
  const handle_back_from_home = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      // Fallback to normal back behavior
      handle_back_to_collection();
    }
  };

  const handle_child_collection_click = (
    collection: THelpCollection,
    parentId: string
  ) => {
    setSelectedCollectionId(collection.id);
    setParentCollectionId(parentId); // Store the parent collection ID
    setPageState({
      currentView: "collection",
      selectedCollection: collection,
      selectedArticle: null,
    });
    setArticleNavigationStack([]); // Clear navigation stack when navigating to child collection
    // Ensure back button is visible for collection view
    onShowBackButton(true);
    // Don't hide navbar for collection view
    onShowDetails?.(false);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {pageState.currentView === "article" && pageState.selectedArticle && (
          <motion.div
            key="article"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleDetails
              initialArticle={pageState.selectedArticle}
              articleDetailsData={articleDetailsData}
              isLoading={isLoadingArticle}
              error={articleError}
              onBack={
                navigatedFromHomepage
                  ? handle_back_from_home
                  : handle_back_to_collection
              }
              onAutoMaximize={onAutoMaximize}
              navigatedFromHomepage={navigatedFromHomepage}
              onRelatedArticleClick={handle_related_article_click}
            />
          </motion.div>
        )}

        {pageState.currentView === "collection" && (
          <motion.div
            key="collection"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CollectionDetails
              collectionDetailsData={collectionDetailsData}
              isLoading={isLoadingDetails}
              error={detailsError}
              onArticleClick={handle_article_click}
              onChildCollectionClick={handle_child_collection_click}
            />
          </motion.div>
        )}

        {pageState.currentView === "list" && (
          <motion.div
            key="list"
            className="flex w-full flex-col space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-4 w-full px-5"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              className="mb-4 px-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p className="text-muted-foreground text-sm">
                {isLoading
                  ? "Loading..."
                  : error
                    ? "Error loading collections"
                    : `${collectionsData?.pagination.total_collections || 0} collections`}
              </p>
            </motion.div>

            {isLoading ? (
              <motion.div
                className="flex items-center justify-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="text-muted-foreground text-sm">
                  Loading collections...
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                className="flex items-center justify-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="text-destructive text-sm">
                  Failed to load collections
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="flex w-full flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {collectionsData?.data.map(
                  (collection: THelpCollection, index: number) => (
                    <motion.div
                      key={collection.id}
                      className="w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <ArticleCard
                        collection={collection}
                        onClick={handle_collection_click}
                      />
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
