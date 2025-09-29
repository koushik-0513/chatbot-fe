import { useEffect, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { TNews } from "@/types/component-types/news-types";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { useGetInfiniteScrollNews } from "@/hooks/api/news-service";
import { useInfiniteScroll } from "@/hooks/custom/use-infinite-scroll";

import { NewsCard } from "./sub-components/news-related/news-cards";
import { NewsDetails } from "./sub-components/news-related/news-details";

type TNewsProps = {
  onShowBackButton: (show: boolean) => void;
  backButtonTrigger: number;
  activePage: string;
  onShowDetails?: (show: boolean) => void;
  onAutoMaximize?: () => void;
  onAutoMinimize?: () => void;
};

export const News = ({
  onShowBackButton,
  backButtonTrigger,
  activePage,
  onShowDetails,
  onAutoMaximize,
  onAutoMinimize,
}: TNewsProps) => {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const { resetAllScroll } = useScrollContext();
  const {
    data: infiniteNewsData,
    isLoading: isNewsLoading,
    error: newsError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetInfiniteScrollNews({ limit: 5 });

  // Flatten all pages of news data
  const allNews = infiniteNewsData?.pages.flatMap((page) => page.data) || [];

  // Infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // Reset internal navigation state when component mounts or when switching away from news
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (activePage === "news") {
      setSelectedNewsId(null);
      onShowBackButton(false);

      // Force scroll reset for this component
      resetAllScroll();
    } else {
      // Reset state when switching away from news
      setSelectedNewsId(null);
      onShowBackButton(false);
    }
  }, [activePage, resetAllScroll]); // Remove navigationStack from dependencies

  // Handle back button trigger from navbar
  useEffect(() => {
    if (backButtonTrigger > 0 && selectedNewsId) {
      handleBackClick();
    }
  }, [backButtonTrigger]);

  const handleNewsClick = (news: TNews) => {
    setSelectedNewsId(news.id.toString());
    onShowBackButton(true);
    onShowDetails?.(true);
    // Ensure the widget is maximized when opening a news item
    onAutoMaximize?.();
    // Reset scroll when navigating to news details
    resetAllScroll();
  };

  const handleBackClick = () => {
    // No previous items in stack, go back to news list
    setSelectedNewsId(null);
    onShowBackButton(false);
    onShowDetails?.(false);
    onAutoMinimize?.();
    // Reset scroll when going back to news list
    resetAllScroll();
  };

  return (
    <div className={"h-full w-full"}>
      <AnimatePresence mode="wait">
        {selectedNewsId && (
          <motion.div
            key="news-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn("h-full w-full")}
          >
            <NewsDetails
              newsId={selectedNewsId}
              onBack={handleBackClick}
              onAutoMaximize={onAutoMaximize}
            />
          </motion.div>
        )}

        {!selectedNewsId && isNewsLoading && (
          <motion.div
            key="loading-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "text-muted-foreground flex w-full items-center justify-center py-8 text-sm"
            )}
          >
            Loading news...
          </motion.div>
        )}

        {!selectedNewsId && newsError && (
          <motion.div
            key="error-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("bg-destructive/10 w-full rounded-lg p-4")}
          >
            <p className={cn("text-destructive text-sm")}>
              Failed to load news. Please try again later.
            </p>
          </motion.div>
        )}

        {!selectedNewsId &&
          !isNewsLoading &&
          !newsError &&
          allNews &&
          allNews.length > 0 && (
            <motion.div
              key="news-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn("w-full")}
            >
              <div className={cn("mb-4 px-1")}>
                <h1 className={cn("text-card-foreground text-xl font-bold")}>
                  Latest
                </h1>
                <p className={cn("text-muted-foreground text-sm")}>
                  From Team Prodgain
                </p>
              </div>
              <div className={cn("space-y-4")}>
                {allNews.map((news, index) => (
                  <div
                    key={news.id}
                    ref={index === allNews.length - 1 ? lastElementRef : null}
                  >
                    <NewsCard news={news as TNews} onClick={handleNewsClick} />
                  </div>
                ))}
                {isFetchingNextPage && (
                  <div
                    className={cn(
                      "text-muted-foreground flex w-full items-center justify-center py-4 text-sm"
                    )}
                  >
                    Loading more news...
                  </div>
                )}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
