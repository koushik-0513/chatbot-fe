import { motion } from "framer-motion";

import { useGetInfiniteScrollCollections } from "@/hooks/api/help";
import { useInfiniteScroll } from "@/hooks/custom/use-infinite-scroll";

import { THelpCollectionDetail } from "@/types/help-types";

import { ArticleCard } from "./collection-cards";

type TCollectionsListProps = {
  onCollectionClick: (collection: THelpCollectionDetail) => void;
};

export const CollectionsList = ({
  onCollectionClick,
}: TCollectionsListProps) => {
  // Fetch collections from API with infinite scroll
  const {
    data: infiniteCollectionsData,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetInfiniteScrollCollections(
    { limit: 5 },
    {
      enabled: true,
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Flatten all pages of collections data
  const allCollections =
    infiniteCollectionsData?.pages.flatMap((page) => page.data) || [];

  // Infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <>
      <motion.div
        className="mb-4 px-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p className="text-muted-foreground text-sm">
          {allCollections.length} collections
        </p>
      </motion.div>

      <motion.div
        className="flex w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {allCollections.map(
          (collection: THelpCollectionDetail, index: number) => (
            <div
              key={collection.id}
              ref={index === allCollections.length - 1 ? lastElementRef : null}
            >
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + index * 0.1,
                }}
              >
                <ArticleCard
                  collection={collection}
                  onClick={onCollectionClick}
                />
              </motion.div>
            </div>
          )
        )}
        {isFetchingNextPage && (
          <motion.div
            className="flex items-center justify-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-muted-foreground text-sm">
              Loading more collections...
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
