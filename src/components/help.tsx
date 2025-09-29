import { useCallback, useEffect, useRef, useState } from "react";

import {
  useArticleNavigation,
  useNavigation,
} from "@/contexts/article-navigation-context";
import { useScrollContext } from "@/contexts/scroll-context";
import {
  TArticleReaction,
  THelpArticleDetail,
  THelpCollectionDetail,
  THelpPageState,
} from "@/types/component-types/help-types";
import { AnimatePresence, motion } from "framer-motion";

import { useAutoMaximize } from "@/hooks/custom/use-auto-maximize";
import { useDebounce } from "@/hooks/custom/use-debounce";

import { ArticleDetails } from "./sub-components/help-related/article-details";
import { CollectionDetails } from "./sub-components/help-related/collection-details";
import { CollectionsList } from "./sub-components/help-related/collections-list";
import { SearchBar } from "./sub-components/help-related/search-bar";
import { SearchResults } from "./sub-components/help-related/search-results";

type THelppageProps = {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
  activePage: string;
  onShowDetails?: (show: boolean) => void;
  onBackFromDetails?: () => void;
  onMinimizeOnly?: () => void;
  selectedArticleId?: string | null;
  onTitleChange?: (title: string) => void;
  navigatedFromHomepage?: boolean;
};

export const Help = ({
  onShowBackButton,
  backButtonTrigger,
  activePage,
  onShowDetails,
  onBackFromDetails,
  onMinimizeOnly,
  selectedArticleId: propSelectedArticleId,
  onTitleChange,
  navigatedFromHomepage = false,
}: THelppageProps) => {
  const { shouldAutoMaximize } = useAutoMaximize({});
  const [pageState, setPageState] = useState<THelpPageState>({
    currentView: "list",
    selectedCollection: null,
    selectedArticle: null,
  });
  const { resetAllScroll } = useScrollContext();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cameFromSearch, setCameFromSearch] = useState(false);

  // Debounce search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Use article navigation context
  const { selectedArticleId, openArticleDetails, resetArticleNavigation } =
    useArticleNavigation();

  const lastPropArticleIdRef = useRef<string | null>(null);

  // Centralized navigation stack management
  const {
    goBack: goBackInNavigation,
    getPreviousItem,
    navigationStack,
  } = useNavigation();

  // Set selectedArticleId when propSelectedArticleId changes (from home page navigation)
  useEffect(() => {
    if (!propSelectedArticleId) {
      lastPropArticleIdRef.current = null;
      return;
    }

    if (propSelectedArticleId === lastPropArticleIdRef.current) {
      return;
    }

    lastPropArticleIdRef.current = propSelectedArticleId;

    if (propSelectedArticleId === selectedArticleId) {
      return;
    }

    const article = {
      id: propSelectedArticleId,
      title: "Loading...",
      slug: "",
      excerpt: "",
      collection_id: "",
      tags: [],
      updated_at: "",
      content: "",
      reaction: {
        reaction: "",
        user_id: "",
        _id: "",
      },
      related_articles: [],
    };

    resetArticleNavigation();
    openArticleDetails(article as THelpArticleDetail);
  }, [
    propSelectedArticleId,
    selectedArticleId,
    openArticleDetails,
    resetArticleNavigation,
  ]);

  // State for selected collection ID
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  // State for parent collection ID to track navigation
  const [parentCollectionId, setParentCollectionId] = useState<string | null>(
    null
  );
  const [showTitle, setShowTitle] = useState(false);

  // Handle search query changes
  useEffect(() => {
    setIsSearching(debouncedSearchQuery.length > 0);
  }, [debouncedSearchQuery]);

  // Helper function to create a minimal article object for loading state
  const createLoadingArticle = useCallback(
    (id: string): THelpArticleDetail => ({
      id,
      title: "Loading...",
      slug: "",
      excerpt: "",
      collection_id: "",
      tags: [],
      updated_at: "",
      content: "",
      reaction: {
        reaction: "" as TArticleReaction,
        user_id: "",
        _id: "",
      },
      related_articles: [],
    }),
    []
  );

  // Auto-show article when selectedArticleId is provided
  useEffect(() => {
    if (selectedArticleId) {
      const loadingArticle = createLoadingArticle(selectedArticleId);
      setPageState({
        currentView: "article",
        selectedCollection: null,
        selectedArticle: loadingArticle,
      });
      onShowDetails?.(true);

      // Use centralized auto-maximize logic
      if (
        shouldAutoMaximize({
          navigatedFromHomepage,
          cameFromSearch,
          isDetailsView: true,
        })
      ) {
      }
    }
  }, [
    selectedArticleId,
    onShowDetails,
    navigatedFromHomepage,
    cameFromSearch,
    shouldAutoMaximize,
    createLoadingArticle,
  ]);

  // Get the current title based on the view
  const getCurrentTitle = () => {
    if (pageState.currentView === "article" && selectedArticleId) {
      return "Article"; // Will be updated by the ArticleDetails component
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
        setParentCollectionId(null);
        resetArticleNavigation();
        onShowBackButton(false);
        // Ensure navbar is visible when entering help from other tabs
        onShowDetails?.(false);
      }

      // Force scroll reset for this component
      resetAllScroll();
    } else {
      // Reset state when switching away from help
      setPageState({
        currentView: "list",
        selectedCollection: null,
        selectedArticle: null,
      });
      setSelectedCollectionId(null);
      // Clear article context when switching away from help
      setParentCollectionId(null);
      resetArticleNavigation();
      onShowBackButton(false);
    }
  }, [
    activePage,
    resetAllScroll,
    propSelectedArticleId,
    navigatedFromHomepage,
    resetArticleNavigation,
  ]);
  // Handle back button trigger from navbar
  useEffect(() => {
    if (backButtonTrigger > 0) {
      if (pageState.currentView === "article") {
        handle_back_to_collection();
      } else if (pageState.currentView === "collection") {
        handle_back_to_list();
      }
    }
  }, [backButtonTrigger, navigatedFromHomepage]);

  const handle_collection_click = useCallback(
    (collection: THelpCollectionDetail) => {
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
      resetAllScroll();
    },
    [onShowBackButton, onShowDetails, resetAllScroll]
  );

  const handle_article_click = useCallback(
    (article: THelpArticleDetail, fromSearch: boolean = false) => {
      // Use context to open article details
      openArticleDetails(article);

      if (fromSearch) {
        setCameFromSearch(true); // Mark that we came from search
        setPageState((prev) => ({
          ...prev,
          currentView: "article",
          selectedCollection: null,
          selectedArticle: article,
        }));
        // Show back button when navigating from search
        onShowBackButton(true);
      } else {
        setPageState((prev) => ({
          ...prev,
          currentView: "article",
          selectedCollection: prev.selectedCollection,
          selectedArticle: article,
        }));
      }

      onShowDetails?.(true);
      // Reset scroll when navigating to article
      resetAllScroll();
    },
    [onShowDetails, resetAllScroll, openArticleDetails, onShowBackButton]
  );

  // Handle related article navigation
  const handle_related_article_click = useCallback(
    (articleId: string) => {
      // Create a minimal article object for loading state
      const loadingArticle = createLoadingArticle(articleId);
      openArticleDetails(loadingArticle);
      setPageState({
        currentView: "article",
        selectedCollection: pageState.selectedCollection,
        selectedArticle: null, // Will be populated by the useEffect when article loads
      });

      // Reset scroll position for new article
      resetAllScroll();
    },
    [
      pageState.selectedCollection,
      resetAllScroll,
      openArticleDetails,
      createLoadingArticle,
    ]
  );

  // Search handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    setCameFromSearch(false); // Reset search navigation state
  }, []);

  const handle_back_to_list = () => {
    // Check if we came from search results
    if (cameFromSearch) {
      // Go back to search results (list view with search active)
      setCameFromSearch(false);
      setPageState({
        currentView: "list",
        selectedCollection: null,
        selectedArticle: null,
      });
      resetArticleNavigation();
      // Keep search query active
      setIsSearching(true);
      onShowBackButton(false);
      onShowDetails?.(false);
      // Don't call onBackFromDetails here - we're going back to search, not home
      // Reset title to "Help"
      onTitleChange?.("Help");

      // Reset scroll when going back to search
      resetAllScroll();
      return;
    }

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
      resetArticleNavigation();
      onShowBackButton(false);
      onShowDetails?.(false);
      // Don't call onBackFromDetails here - we're going back to list, not home
      // Reset title to "Help"
      onTitleChange?.("Help");
    }

    // Reset scroll when going back
    resetAllScroll();
  };

  const handle_back_to_collection = useCallback(() => {
    // Check if we came from search results
    if (cameFromSearch) {
      setCameFromSearch(false);
      setPageState({
        currentView: "list",
        selectedCollection: null,
        selectedArticle: null,
      });
      resetArticleNavigation();
      // Don't hide navbar for search view
      onShowDetails?.(false);
      // Call onMinimizeOnly to trigger minimize without affecting back button state
      onMinimizeOnly?.();
      // Keep search query active
      setIsSearching(true);

      // Reset scroll when going back to search
      resetAllScroll();
      return;
    }

    // If we came from homepage directly (not through a collection), go back to homepage
    if (navigatedFromHomepage && !pageState.selectedCollection) {
      resetArticleNavigation();
      onBackFromDetails?.(); // This will trigger navigation back to home page
      return;
    }

    if (navigationStack.length > 1) {
      const previousItem = getPreviousItem();
      if (previousItem?.type === "article") {
        const previousArticle =
          (previousItem.data as THelpArticleDetail | undefined) ?? null;

        goBackInNavigation();

        setPageState({
          currentView: "article",
          selectedCollection: pageState.selectedCollection,
          selectedArticle: previousArticle,
        });

        resetAllScroll();
        return;
      }
    }

    // Otherwise go back to collection
    setPageState({
      currentView: "collection",
      selectedCollection: pageState.selectedCollection,
      selectedArticle: null,
    });
    resetArticleNavigation();
    // Don't hide navbar for collection view
    onShowDetails?.(false);
    // Call onMinimizeOnly to trigger minimize without affecting back button state
    onMinimizeOnly?.();
    // Reset title to "Help"
    onTitleChange?.("Help");

    // Reset scroll when going back to collection
    resetAllScroll();
  }, [
    cameFromSearch,
    navigationStack,
    getPreviousItem,
    goBackInNavigation,
    pageState.selectedCollection,
    navigatedFromHomepage,
    onShowDetails,
    onMinimizeOnly,
    onBackFromDetails,
    onTitleChange,
    resetAllScroll,
    resetArticleNavigation,
  ]);

  const handle_child_collection_click = (
    collection: THelpCollectionDetail,
    parentId: string
  ) => {
    setSelectedCollectionId(collection.id);
    setParentCollectionId(parentId); // Store the parent collection ID
    setPageState({
      currentView: "collection",
      selectedCollection: collection,
      selectedArticle: null,
    });
    resetArticleNavigation();
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
              articleId={selectedArticleId}
              onRelatedArticleClick={handle_related_article_click}
              onTitleChange={onTitleChange}
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
              collectionId={selectedCollectionId}
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
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onClearSearch={handleClearSearch}
                isSearching={isSearching}
              />
            </motion.div>

            {/* Show search results when searching, otherwise show collections */}
            {isSearching ? (
              <SearchResults
                searchQuery={debouncedSearchQuery}
                onArticleClick={(articleId: string) => {
                  const loadingArticle = createLoadingArticle(articleId);
                  handle_article_click(loadingArticle, true);
                }}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <CollectionsList onCollectionClick={handle_collection_click} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
