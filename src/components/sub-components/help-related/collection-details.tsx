import Image from "next/image";

import {
  CONTAINER_VARIANTS,
  ITEM_VARIANTS,
  SCALE_VARIANTS,
} from "@/constants/animations";
import {
  THelpArticleDetail,
  THelpCollectionDetail,
} from "@/types/component-types/help-types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { useGetCollectionDetails } from "@/hooks/api/help-service";
import { useUserId } from "@/hooks/custom/use-user-id";

type TCollectionDetailsProps = {
  collectionId: string | null;
  onArticleClick: (article: THelpArticleDetail) => void;
  onChildCollectionClick: (
    collection: THelpCollectionDetail,
    parentId: string
  ) => void;
};

export const CollectionDetails = ({
  collectionId,
  onArticleClick,
  onChildCollectionClick,
}: TCollectionDetailsProps) => {
  const { userId: user_id } = useUserId();

  // Fetch collection details when a collection is selected
  const { data: collectionDetailsData, isLoading } = useGetCollectionDetails(
    {
      collection_id: collectionId || "",
      user_id: user_id || "",
    },
    { enabled: !!collectionId && !!user_id }
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <motion.div
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-muted-foreground text-sm">
            Loading collection details...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!collectionDetailsData) {
    return null;
  }

  const { collection, authors, articles, child_collections } =
    collectionDetailsData.data;

  // Handle child collection click with parent tracking
  const handleChildCollectionClick = (
    childCollection: THelpCollectionDetail
  ) => {
    onChildCollectionClick(childCollection, collection.id);
  };

  return (
    <motion.div
      className="w-full"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {/* Header section with padding */}
      <div className="space-y-4 px-3">
        {/* Header */}
        <motion.div
          variants={ITEM_VARIANTS}
          className="flex items-center gap-3 px-2 pt-3"
        >
          <h1 className="text-card-foreground text-lg font-semibold">
            {collection.title}
          </h1>
        </motion.div>

        {/* Collection description */}
        <motion.div className="space-y-3" variants={ITEM_VARIANTS}>
          <p className="text-muted-foreground px-2 text-sm leading-relaxed">
            {collection.description}
          </p>

          {/* Article count and author info */}
          <motion.div
            className="text-muted-foreground flex items-center justify-between gap-4 px-2 text-xs"
            variants={ITEM_VARIANTS}
          >
            <div className="flex flex-col items-start gap-2">
              <span>{collection.articles_count} articles</span>
              <span>
                By {authors[0].name}
                {authors.length > 1 && ` and ${authors.length - 1} others`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {authors.length > 0 && (
                <motion.div
                  className="flex -space-x-1"
                  variants={SCALE_VARIANTS}
                >
                  {authors.slice(0, 3).map((author, index) => (
                    <motion.div
                      key={author.id}
                      className="bg-primary/20 text-primary flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border-2 border-white text-xs font-medium"
                      variants={SCALE_VARIANTS}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Image
                        src={author.profile_image || ""}
                        alt={author.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Articles list - full width */}
      {articles.length > 0 && (
        <motion.div className="mt-4 w-full" variants={ITEM_VARIANTS}>
          <div className="space-y-0">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                className="border-border hover:bg-muted flex w-full cursor-pointer items-center justify-between border-b px-3 py-4 transition-colors"
                onClick={() => onArticleClick(article as THelpArticleDetail)}
                variants={ITEM_VARIANTS}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1 px-2">
                  <h3 className="text-card-foreground mb-1 text-sm font-medium">
                    {article.title}
                  </h3>
                </div>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                  className="px-2"
                >
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Child Collections - full width */}

      {child_collections.length > 0 && (
        <motion.div className="mt-4 w-full" variants={ITEM_VARIANTS}>
          <div className="space-y-0">
            {child_collections.map((childCollection, index) => (
              <motion.div
                key={childCollection.id}
                className="border-border hover:bg-muted flex w-full cursor-pointer items-center justify-between border-b px-3 py-4 transition-colors"
                onClick={() => handleChildCollectionClick(childCollection)}
                variants={ITEM_VARIANTS}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-1 items-center gap-3">
                  <div></div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-1 text-sm font-medium">
                      {childCollection.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {childCollection.description}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {childCollection.articles_count} articles
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                  className="px-2"
                >
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
