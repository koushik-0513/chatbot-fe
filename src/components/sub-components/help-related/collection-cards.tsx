import { ChevronRight } from "lucide-react";

import { THelpCollectionDetail } from "@/types/help-types";

type TArticleCardProps = {
  collection: THelpCollectionDetail;
  onClick: (collection: THelpCollectionDetail) => void;
};

export const ArticleCard = ({ collection, onClick }: TArticleCardProps) => {
  const handleClick = () => {
    onClick(collection);
  };

  return (
    <div
      className="group border-border hover:bg-muted/50 hover:border-primary/30 flex w-full cursor-pointer items-center justify-between border-b px-3 py-4 transition-all duration-200 hover:shadow-sm"
      onClick={handleClick}
    >
      <div className="flex flex-1 items-start gap-3 px-3">
        <div className="flex-1">
          <h3 className="text-card-foreground group-hover:text-primary mb-1 text-sm font-medium transition-colors">
            {collection.title}
          </h3>
          <p className="text-muted-foreground mb-2 text-xs leading-relaxed">
            {collection.description}
          </p>
          <p className="text-muted-foreground text-xs">
            {collection.articles_count} articles
          </p>
        </div>
      </div>
      <div>
        <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
      </div>
    </div>
  );
};
