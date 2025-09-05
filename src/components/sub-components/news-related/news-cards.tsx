import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TNews } from "../../../types/types";

type TNewsCardProps = {
  news: TNews;
  onClick: (news: TNews) => void;
  maxTagsToShow?: number; // Optional prop to customize how many tags to show
};

export const NewsCard = ({ news, onClick, maxTagsToShow = 2 }: TNewsCardProps) => {
  const handle_click = () => {
    onClick(news);
  };

  // Calculate visible tags and remaining count
  const visibleTags = news.tags.slice(0, maxTagsToShow);
  const remainingTagsCount = news.tags.length - maxTagsToShow;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card
        className="mb-4 cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-lg"
        onClick={handle_click}
      >
        <div>
          <CardContent className="p-0">
            <img
              src={news.imageUrl || news.image}
              alt={news.title}
              className="h-48 w-full object-cover"
            />
          </CardContent>
        </div>

        <CardHeader className="pb-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {visibleTags.map((tag: string) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium "
              >
                {tag}
              </span>
            ))}
            {remainingTagsCount > 0 && (
              <span className="bg-muted/50 text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                +{remainingTagsCount} more
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-card-foreground mb-2 line-clamp-2 text-lg font-bold">
                {news.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {news.description}
              </CardDescription>

              {/* Metadata */}
              <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
                {news.author &&
                  typeof news.author === "object" &&
                  news.author.name && <span>By {news.author.name}</span>}
                {news.readTime && <span>⏱️ {news.readTime} min read</span>}
                {news.isFeatured && (
                  <motion.span
                    className="text-primary font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⭐ Featured
                  </motion.span>
                )}
              </div>
            </div>

            <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" />
            </motion.div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};