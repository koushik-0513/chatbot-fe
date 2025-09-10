import { useEffect, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { AnimatePresence, motion } from "framer-motion";

import { useUserId } from "@/hooks/use-user-id";

import { useGetNews, useGetNewsById } from "../hooks/api/news-service";
import { TNews } from "../types/types";
import { NewsCard } from "./sub-components/news-related/news-cards";
import { NewsDetails } from "./sub-components/news-related/news-details";

type TNewsProps = {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
  activePage: string;
  onShowDetails?: (show: boolean) => void;
  onBackFromDetails?: () => void;
  onAutoMaximize?: () => void;
};

export const News = ({
  onShowBackButton,
  backButtonTrigger,
  activePage,
  onShowDetails,
  onBackFromDetails,
  onAutoMaximize,
}: TNewsProps) => {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const { resetAllScroll, resetAllScrollWithDelay } = useScrollContext();
  const { user_id } = useUserId();
  const {
    data: news_data,
    isLoading,
    error,
  } = useGetNews({ page: 1, limit: 10 });
  const {
    data: detailed_news,
    isLoading: isDetailedLoading,
    error: detailedError,
  } = useGetNewsById(selectedNewsId);

  // Reset internal navigation state when component mounts or when switching away from news
  useEffect(() => {
    if (activePage === "news") {
      setSelectedNewsId(null);
      onShowBackButton(false);

      // Force scroll reset for this component
      resetAllScrollWithDelay(100);
    } else {
      // Reset state when switching away from news
      setSelectedNewsId(null);
      onShowBackButton(false);
    }
  }, [activePage, resetAllScroll, resetAllScrollWithDelay]);

  // Handle back button trigger from navbar
  useEffect(() => {
    if (backButtonTrigger > 0 && selectedNewsId) {
      handle_back_click();
    }
  }, [backButtonTrigger]);

  const handle_news_click = (news: TNews) => {
    setSelectedNewsId(news.id.toString());
    onShowBackButton(true);
    onShowDetails?.(true);

    // Reset scroll when navigating to news details
    resetAllScrollWithDelay(100);
  };

  const handle_back_click = () => {
    setSelectedNewsId(null);
    onShowBackButton(false);
    onShowDetails?.(false);
    onBackFromDetails?.(); // Call the callback to auto-minimize

    // Reset scroll when going back to news list
    resetAllScrollWithDelay(100);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {selectedNewsId && isDetailedLoading && (
          <motion.div
            key="loading"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center py-8">
              <motion.div
                className="text-muted-foreground text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading news details...
              </motion.div>
            </div>
          </motion.div>
        )}

        {selectedNewsId && detailedError && (
          <motion.div
            key="error"
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-destructive/10 rounded-lg p-4">
              <p className="text-destructive text-sm">
                Failed to load news details. Please try again later.
              </p>
              <motion.button
                onClick={handle_back_click}
                className="text-destructive mt-2 text-sm underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go back
              </motion.button>
            </div>
          </motion.div>
        )}

        {selectedNewsId && detailed_news?.data && (
          <motion.div
            key="news-details"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NewsDetails
              news={detailed_news.data}
              onBack={handle_back_click}
              onAutoMaximize={onAutoMaximize}
            />
          </motion.div>
        )}

        {!selectedNewsId && isLoading && (
          <motion.div
            key="loading-list"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center py-8">
              <motion.div
                className="text-muted-foreground text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading news...
              </motion.div>
            </div>
          </motion.div>
        )}

        {!selectedNewsId && error && (
          <motion.div
            key="error-list"
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-destructive/10 rounded-lg p-4">
              <p className="text-destructive text-sm">
                Failed to load news. Please try again later.
              </p>
            </div>
          </motion.div>
        )}

        {!selectedNewsId &&
          !isLoading &&
          !error &&
          (!news_data || !news_data.data || news_data.data.length === 0) && (
            <motion.div
              key="no-news"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground text-sm">
                  No news available
                </div>
              </div>
            </motion.div>
          )}

        {!selectedNewsId &&
          !isLoading &&
          !error &&
          news_data &&
          news_data.data &&
          news_data.data.length > 0 && (
            <motion.div
              key="news-list"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 px-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-card-foreground text-xl font-bold">
                    Latest
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    From Team Prodgain
                  </p>
                </motion.div>
              </div>
              <div className="space-y-4">
                {news_data.data.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <NewsCard news={news} onClick={handle_news_click} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
