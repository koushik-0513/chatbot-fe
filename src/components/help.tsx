import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  useGetArticleDetails,
  useGetCollectionDetails,
  useGetCollections,
} from "../services/help-service";
import { THelpArticle, THelpCollection, THelpPageState } from "../types/types";
import { ArticleCard } from "./sub-components/help-related/article-cards";
import { ArticleDetails } from "./sub-components/help-related/article-details";
import { CollectionDetails } from "./sub-components/help-related/collection-details";
import { SearchBar } from "./sub-components/help-related/search-bar";

interface THelppageProps {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
}

export const Helppage = ({
  onShowBackButton,
  backButtonTrigger,
}: THelppageProps) => {
  const [pageState, setPageState] = useState<THelpPageState>({
    currentView: "list",
    selectedCollection: null,
    selectedArticle: null,
  });

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
  } = useGetArticleDetails(selectedArticleId);

  console.log("articleDetailsData", articleDetailsData);

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
  };

  const handle_article_click = (article: THelpArticle) => {
    setSelectedArticleId(article.id);
    setPageState({
      currentView: "article",
      selectedCollection: pageState.selectedCollection,
      selectedArticle: article,
    });
  };

  const handle_back_to_list = () => {
    setSelectedCollectionId(null);
    setPageState({
      currentView: "list",
      selectedCollection: null,
      selectedArticle: null,
    });
    onShowBackButton(false);
  };

  const handle_back_to_collection = () => {
    setSelectedArticleId(null);
    setPageState({
      currentView: "collection",
      selectedCollection: pageState.selectedCollection,
      selectedArticle: null,
    });
  };

  const handle_child_collection_click = (collection: THelpCollection) => {
    setSelectedCollectionId(collection.id);
    setPageState({
      currentView: "collection",
      selectedCollection: collection,
      selectedArticle: null,
    });
  };

  return (
    <AnimatePresence mode="wait">
      {pageState.currentView === "article" && pageState.selectedArticle && (
        <ArticleDetails
          key="article"
          initialArticle={pageState.selectedArticle}
          articleDetailsData={articleDetailsData}
          isLoading={isLoadingArticle}
          error={articleError}
          onBack={handle_back_to_collection}
        />
      )}

      {pageState.currentView === "collection" && (
        <CollectionDetails
          key="collection"
          collectionDetailsData={collectionDetailsData}
          isLoading={isLoadingDetails}
          error={detailsError}
          onBack={handle_back_to_list}
          onArticleClick={handle_article_click}
          onChildCollectionClick={handle_child_collection_click}
        />
      )}

      {pageState.currentView === "list" && (
        <motion.div
          key="list"
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SearchBar />
          </motion.div>

          <motion.div
            className="mb-4"
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
              className="space-y-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {collectionsData?.data.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <ArticleCard
                    collection={collection}
                    onClick={handle_collection_click}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
