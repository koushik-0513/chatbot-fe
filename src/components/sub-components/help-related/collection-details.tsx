import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

import {
  THelpArticle,
  THelpCollection,
  THelpCollectionDetailResponse,
} from "../../../types/types";

interface TCollectionDetailsProps {
  collectionDetailsData: THelpCollectionDetailResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  parentCollectionId?: string; // Add this to track parent
  onBack: (parentId?: string) => void; // Modified to accept parent ID
  onArticleClick: (article: THelpArticle) => void;
  onChildCollectionClick: (collection: THelpCollection, parentId: string) => void; // Modified
}

export const CollectionDetails = ({
  collectionDetailsData,
  isLoading,
  error,
  parentCollectionId,
  onBack,
  onArticleClick,
  onChildCollectionClick,
}: TCollectionDetailsProps) => {
  // Animation variants for better performance
  const container_variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const item_variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const scale_variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring" as const,
        stiffness: 200,
      },
    },
  };

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex items-center justify-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-destructive text-sm">
          Failed to load collection details
        </div>
      </motion.div>
    );
  }

  if (!collectionDetailsData) {
    return null;
  }

  const { collection, authors, articles, child_collections } =
    collectionDetailsData.data;

  // Handle child collection click with parent tracking
  const handleChildCollectionClick = (childCollection: THelpCollection) => {
    onChildCollectionClick(childCollection, collection.id);
  };

  // Handle back with parent ID
  const handleBack = () => {
    onBack(parentCollectionId);
  };

  return (
    <motion.div
      className="space-y-4"
      variants={container_variants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button if we have a parent */}
      {parentCollectionId && (
        <motion.button
          onClick={handleBack}
          className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
          variants={item_variants}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </motion.button>
      )}

      {/* Header */}
      <motion.div variants={item_variants} className="flex items-center gap-3">
        <h1 className="text-card-foreground text-lg font-semibold">
          {collection.title}
        </h1>
      </motion.div>

      {/* Collection description */}
      <motion.div className="space-y-3" variants={item_variants}>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {collection.description}
        </p>

        {/* Article count and author info */}
        <motion.div
          className="text-muted-foreground flex items-center justify-between gap-4 text-xs"
          variants={item_variants}
        >
          <div className="flex flex-col items-start gap-2">
            <span>{collection.total_articles} articles</span>
            <span>
              By {authors[0].name}
              {authors.length > 1 && ` and ${authors.length - 1} others`}
            </span>
          </div>
          {authors.length > 0 && (
            <div className="flex items-center gap-2">
              {authors.length > 1 && (
                <motion.div
                  className="flex -space-x-1"
                  variants={scale_variants}
                >
                  {authors.slice(0, 3).map((author, index) => (
                    <motion.div
                      key={author.id}
                      className="bg-primary/20 text-primary flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-xs font-medium"
                      variants={scale_variants}
                      transition={{ delay: index * 0.1 }}
                    >
                      {author.name.charAt(0)}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Articles list */}
      {articles.length > 0 && (
        <motion.div className="space-y-3" variants={item_variants}>
          <div className="space-y-0">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                className="border-border hover:bg-muted flex cursor-pointer items-center justify-between border-b p-4 transition-colors"
                onClick={() => onArticleClick(article as THelpArticle)}
                variants={item_variants}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1">
                  <h3 className="text-card-foreground mb-1 text-sm font-medium">
                    {article.title}
                  </h3>
                </div>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Child Collections */}
      {child_collections.length > 0 && (
        <motion.div className="space-y-3" variants={item_variants}>
          <div className="space-y-0">
            {child_collections.map((childCollection, index) => (
              <motion.div
                key={childCollection.id}
                className="border-border hover:bg-muted flex cursor-pointer items-center justify-between border-b p-3 transition-colors"
                onClick={() => handleChildCollectionClick(childCollection)}
                variants={item_variants}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-1 text-sm font-medium">
                      {childCollection.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {childCollection.description}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {childCollection.article_count} articles
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
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