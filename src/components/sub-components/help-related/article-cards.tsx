import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { THelpCollection } from "../../../types/types";

interface TArticleCardProps {
  collection: THelpCollection;
  onClick: (collection: THelpCollection) => void;
}

export const ArticleCard = ({ collection, onClick }: TArticleCardProps) => {
  const handle_click = () => {
    onClick(collection);
  };

  return (
    <motion.div
      className="border-border hover:bg-muted flex cursor-pointer items-center justify-between border-b p-4 transition-colors"
      onClick={handle_click}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-1 items-start gap-3">
        <div className="flex-1">
          <h3 className="text-card-foreground mb-1 text-sm font-medium">
            {collection.title}
          </h3>
          <p className="text-muted-foreground mb-2 text-xs leading-relaxed">
            {collection.description}
          </p>
          <p className="text-muted-foreground text-xs">
            {collection.article_count} articles
          </p>
        </div>
      </div>
      <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
        <ChevronRight className="text-muted-foreground h-4 w-4" />
      </motion.div>
    </motion.div>
  );
};
