import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useGetNews, useGetNewsById } from "../services/news-service";
import { TNews } from "../types/types";
import { NewsCard } from "./sub-components/news-related/news-cards";
import { NewsDetails } from "./sub-components/news-related/news-details";

interface TNewsProps {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
}

export const News = ({ onShowBackButton, backButtonTrigger }: TNewsProps) => {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
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

  // Handle back button trigger from navbar
  useEffect(() => {
    if (backButtonTrigger > 0 && selectedNewsId) {
      handle_back_click();
    }
  }, [backButtonTrigger]);

  const handle_news_click = (news: TNews) => {
    setSelectedNewsId(news.id.toString());
    onShowBackButton(true);
  };

  const handle_back_click = () => {
    setSelectedNewsId(null);
    onShowBackButton(false);
  };

  return (
    <AnimatePresence mode="wait">
      {selectedNewsId && isDetailedLoading && (
        <motion.div
          key="loading"
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-muted-foreground text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading news details...
          </motion.div>
        </motion.div>
      )}

      {selectedNewsId && detailedError && (
        <motion.div
          key="error"
          className="bg-destructive/10 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
      )}

      {selectedNewsId && detailed_news?.data && (
        <NewsDetails
          key="news-details"
          news={detailed_news.data}
          onBack={handle_back_click}
        />
      )}

      {!selectedNewsId && isLoading && (
        <motion.div
          key="loading-list"
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-muted-foreground text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading news...
          </motion.div>
        </motion.div>
      )}

      {!selectedNewsId && error && (
        <motion.div
          key="error-list"
          className="bg-destructive/10 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-destructive text-sm">
            Failed to load news. Please try again later.
          </p>
        </motion.div>
      )}

      {!selectedNewsId &&
        !isLoading &&
        !error &&
        (!news_data || !news_data.data || news_data.data.length === 0) && (
          <motion.div
            key="no-news"
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-muted-foreground text-sm">
              No news available
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        )}
    </AnimatePresence>
  );
};
