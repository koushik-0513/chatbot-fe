import { useEffect, useState } from "react";

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
};

export const Helppage = ({
  onShowBackButton,
  backButtonTrigger,
  activePage,
  onShowDetails,
  onBackFromDetails,
  onMinimizeOnly,
  onAutoMaximize,
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

  // State for selected article ID
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );

  // State for parent collection ID to track navigation
  const [parentCollectionId, setParentCollectionId] = useState<string | null>(
    null
  );

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

  // Reset internal navigation state when component mounts or when switching away from help
  useEffect(() => {
    if (activePage === "help") {
      setPageState({
        currentView: "list",
        selectedCollection: null,
        selectedArticle: null,
      });
      setSelectedCollectionId(null);
      setSelectedArticleId(null);
      setParentCollectionId(null);
      onShowBackButton(false);

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
      onShowBackButton(false);
    }
  }, [activePage, resetAllScroll, resetAllScrollWithDelay]);

  // Handle back button trigger from navbar
  useEffect(() => {
    if (backButtonTrigger > 0) {
      if (pageState.currentView === "article") {
        handle_back_to_collection();
      } else if (pageState.currentView === "collection") {
        handle_back_to_list();
      }
    }
  }, [backButtonTrigger]);

  const handle_collection_click = (collection: THelpCollection) => {
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
  };

  const handle_article_click = (article: THelpArticle) => {
    setSelectedArticleId(article.id);
    setPageState({
      currentView: "article",
      selectedCollection: pageState.selectedCollection,
      selectedArticle: article,
    });
    onShowDetails?.(true);

    // Reset scroll when navigating to article
    resetAllScrollWithDelay(100);
  };

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
      onShowBackButton(false);
      onShowDetails?.(false);
      onBackFromDetails?.(); // Call the callback to auto-minimize
    }

    // Reset scroll when going back
    resetAllScrollWithDelay(100);
  };

  const handle_back_to_collection = () => {
    setSelectedArticleId(null);
    setPageState({
      currentView: "collection",
      selectedCollection: pageState.selectedCollection,
      selectedArticle: null,
    });
    // Don't hide navbar for collection view
    onShowDetails?.(false);
    // Call onMinimizeOnly to trigger minimize without affecting back button state
    onMinimizeOnly?.();

    // Reset scroll when going back to collection
    resetAllScrollWithDelay(100);
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
              onBack={handle_back_to_collection}
              onAutoMaximize={onAutoMaximize}
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
