import { ChevronRight } from "lucide-react";

import { THelpCollection } from "../../../types/types";

type TArticleCardProps = {
  collection: THelpCollection;
  onClick: (collection: THelpCollection) => void;
};

export const ArticleCard = ({ collection, onClick }: TArticleCardProps) => {
  const handle_click = () => {
    onClick(collection);
  };

  return (
    <div
      className="border-border hover:bg-muted flex w-full cursor-pointer items-center justify-between border-b px-3 py-4 transition-colors"
      onClick={handle_click}
    >
      <div className="flex flex-1 items-start gap-3 px-3">
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
      <div>
        <ChevronRight className="text-muted-foreground h-4 w-4" />
      </div>
    </div>
  );
};
