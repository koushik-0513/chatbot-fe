import Image from "next/image";

import { TNews } from "@/types/news-types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

type TNewsCardProps = {
  news: TNews;
  onClick: (news: TNews) => void;
  maxTagsToShow?: number; // Optional prop to customize how many tags to show
};

export const NewsCard = ({
  news,
  onClick,
  maxTagsToShow = 2,
}: TNewsCardProps) => {
  const handleClick = () => {
    onClick(news);
  };

  // Calculate visible tags and remaining count
  const visibleTags = news.tags.slice(0, maxTagsToShow);
  const remainingTagsCount = news.tags.length - maxTagsToShow;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card
        className="mb-4 cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-lg"
        onClick={handleClick}
      >
        <CardContent className="p-0">
          <Image
            src={news.image || ""}
            alt={news.title}
            width={400}
            height={192}
            className="h-48 w-full object-cover"
          />
        </CardContent>

        <CardHeader className="pb-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {visibleTags.map((tag: string) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
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
              <CardTitle className="text-card-foreground text-md mb-2 line-clamp-2 font-bold">
                {news.title}
              </CardTitle>
              <div className="flex justify-between">
                <div className="text-muted-foreground line-clamp-2 flex-1 text-xs leading-relaxed">
                  <MarkdownRenderer
                    content={news.content}
                    className="prose-p:text-xs prose-p:mb-0.5 prose-p:text-muted-foreground prose-headings:text-xs prose-headings:font-normal prose-headings:text-muted-foreground prose-strong:text-muted-foreground prose-em:text-muted-foreground prose-code:text-xs text-xs"
                  />
                </div>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" />
                </motion.div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};
