"use client";

import { useCallback } from "react";

import { TArticleSearchResult } from "@/types/component-types/help-types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type TSearchResultsProps = {
  searchResults: TArticleSearchResult[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  onArticleClick: (articleId: string) => void;
  onClearSearch: () => void;
};

export const SearchResults = ({
  searchResults,
  isLoading,
  error,
  searchQuery,
  onArticleClick,
  onClearSearch,
}: TSearchResultsProps) => {
  // Handle article click
  const handleArticleClick = useCallback(
    (article: TArticleSearchResult) => {
      onArticleClick(article.id);
    },
    [onArticleClick]
  );

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div
            className="border-primary mx-auto h-8 w-8 rounded-full border-2 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-muted-foreground mt-4 text-sm">
            Searching articles...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex items-center justify-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <p className="text-destructive text-sm">
            Failed to search articles. Please try again.
          </p>
          <button
            onClick={onClearSearch}
            className="text-primary mt-2 text-sm hover:underline"
          >
            Clear search
          </button>
        </div>
      </motion.div>
    );
  }

  // Ensure searchResults is an array
  const safeSearchResults = Array.isArray(searchResults) ? searchResults : [];

  if (safeSearchResults.length === 0) {
    return (
      <motion.div
        className="flex items-center justify-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            No articles found for &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={onClearSearch}
            className="text-primary mt-2 text-sm hover:underline"
          >
            Clear search
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search Results List */}
      <motion.div
        className="space-y-3 px-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {safeSearchResults.map((article, index) => (
          <motion.div
            key={article.id}
            className="group border-border bg-card hover:border-primary/50 cursor-pointer rounded-lg border p-4 transition-all hover:shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleArticleClick(article)}
            whileHover={{ x: 4 }}
          >
            <div className="mx-3 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground group-hover:text-primary line-clamp-2 text-base font-medium transition-colors">
                  {article.title}
                </h4>
                {article.matched_snippet && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {article.matched_snippet}
                  </p>
                )}
              </div>
              <div>
                <ChevronRight className="text-muted-foreground size-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
