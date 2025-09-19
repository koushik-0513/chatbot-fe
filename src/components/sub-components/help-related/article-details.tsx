import { useEffect, useRef, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { motion } from "framer-motion";

import { useSubmitArticleReaction } from "../../../hooks/api/article-reaction-service";
import { useUserId } from "../../../hooks/use-user-id";
import { THelpArticleDetailResponse } from "../../../types/types";
import {
  ARTICLE_REACTIONS,
  ARTICLE_REACTION_EMOJI_MAP,
  TArticleReaction,
} from "../../../utils/article-reaction-utils";
import { MarkdownRenderer } from "../../ui/markdown-renderer";

interface TArticleDetailsProps {
  articleDetailsData: THelpArticleDetailResponse | undefined;
  onRelatedArticleClick?: (articleId: string) => void;
}

// Type guard to safely convert string to TArticleReaction
const isValidArticleReaction = (
  reaction: string | undefined
): TArticleReaction | null => {
  if (!reaction) return null;
  return ARTICLE_REACTIONS.includes(reaction as TArticleReaction)
    ? (reaction as TArticleReaction)
    : null;
};

export const ArticleDetails = ({
  articleDetailsData,
  onRelatedArticleClick,
}: TArticleDetailsProps) => {
  const { resetAllScrollWithDelay } = useScrollContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const { user_id } = useUserId();

  // Reaction state - initialize from article data if available
  const [selectedReaction, setSelectedReaction] =
    useState<TArticleReaction | null>(() => {
      return isValidArticleReaction(
        articleDetailsData?.data?.article?.reaction?.reaction
      );
    });

  // Article reaction mutation
  const submitReactionMutation = useSubmitArticleReaction();

  // Handle reaction submission
  const handleReactionSubmit = async (reaction: TArticleReaction) => {
    if (!user_id || submitReactionMutation.isPending) return;

    // Don't make API call if the same reaction is already selected
    if (selectedReaction === reaction) {
      return;
    }

    try {
      await submitReactionMutation.mutateAsync({
        articleId: articleDetailsData?.data?.article?.id || "",
        reaction: reaction,
        userId: user_id,
      });
      setSelectedReaction(reaction);
    } catch (error) {
      console.error("Failed to submit reaction:", error);
    }
  };

  // Handle related article click
  const handleRelatedArticleClick = (articleId: string) => {
    onRelatedArticleClick?.(articleId);
  };

  // Reset scroll when component mounts
  useEffect(() => {
    resetAllScrollWithDelay(100);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [resetAllScrollWithDelay]);

  // Auto-maximize is handled by the parent component
  // No need to call onAutoMaximize here to avoid duplicate calls

  // Update selected reaction when article data changes
  useEffect(() => {
    const existingReaction = isValidArticleReaction(
      articleDetailsData?.data?.article?.reaction?.reaction
    );
    setSelectedReaction(existingReaction);
  }, [articleDetailsData]);

  // Function to calculate relative time
  const get_relative_time = (dateString: string | undefined): string => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
          return count === 1
            ? `${count} ${interval.label} ago`
            : `${count} ${interval.label}s ago`;
        }
      }

      return "just now";
    } catch {
      return "Recently";
    }
  };

  const get_author_name = (): string => {
    if (
      articleDetailsData?.data?.author &&
      typeof articleDetailsData.data.author === "object" &&
      articleDetailsData.data.author.name
    ) {
      return articleDetailsData.data.author.name;
    }
    return "Anonymous";
  };

  const get_author_image = (): string | null => {
    if (
      articleDetailsData?.data?.author &&
      typeof articleDetailsData.data.author === "object" &&
      articleDetailsData.data.author.profile_image
    ) {
      return articleDetailsData.data.author.profile_image;
    }
    return null;
  };

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

  if (!articleDetailsData?.data?.article) {
    return (
      <motion.div
        className="flex h-full flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-muted-foreground">Article not found</div>
      </motion.div>
    );
  }

  const article = articleDetailsData.data.article;

  return (
    <motion.div
      className="flex flex-col p-4"
      variants={container_variants}
      initial="hidden"
      animate="visible"
    >
      {/* Content Container */}
      <div className="space-y-6">
        {/* Article Title */}
        <motion.h1
          className="text-card-foreground text-xl leading-tight font-bold"
          variants={item_variants}
        >
          {article.title}
        </motion.h1>

        {/* Author and Metadata */}
        <motion.div
          className="flex items-center justify-between"
          variants={item_variants}
        >
          <div className="flex items-center gap-3">
            <motion.img
              src={get_author_image()!}
              alt={get_author_name()}
              className="h-10 w-10 rounded-full object-cover"
              variants={scale_variants}
            />
            <motion.div
              className="flex flex-row items-center gap-2"
              variants={item_variants}
            >
              <p className="text-card-foreground text-sm font-medium">
                {get_author_name()}
              </p>
              <p className="text-muted-foreground text-xs">
                {get_relative_time(article.updated_at)}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        {article.content && (
          <motion.div
            variants={item_variants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MarkdownRenderer content={article.content} />
          </motion.div>
        )}

        <motion.div
          className="border-primary/20 bg-primary/5 rounded-lg border-t-2 border-b-2 p-4"
          variants={item_variants}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-semibold">Tip</h3>
          </div>
          <div className="space-y-1 text-center">
            <p>
              <span className="font-semibold">Need more help?</span> Get support
              from our{" "}
              <a href="#" className="text-primary hover:underline">
                Community Forum
              </a>
            </p>
            <p className="text-muted-foreground text-sm">
              Find answers and get help from Intercom Support and Community
              Experts
            </p>
          </div>
        </motion.div>

        {article.related_articles && article.related_articles.length > 0 && (
          <motion.div className="space-y-3" variants={item_variants}>
            <h3 className="text-card-foreground text-lg font-semibold">
              Related Articles
            </h3>
            <div className="space-y-2">
              {article.related_articles.map((relatedArticle, index) => (
                <motion.div
                  key={relatedArticle.id}
                  className="group border-border bg-card hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleRelatedArticleClick(relatedArticle.id)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                      {relatedArticle.title}
                    </p>
                    <motion.svg
                      className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reactions Section */}
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          variants={item_variants}
        >
          <motion.h3
            className="text-card-foreground text-md mb-4 font-semibold"
            variants={item_variants}
          >
            How helpful was this article?
          </motion.h3>
          <motion.div className="flex gap-3" variants={item_variants}>
            {ARTICLE_REACTIONS.map((reaction, index) => {
              const isSelected = selectedReaction === reaction;
              const isSubmitting = submitReactionMutation.isPending;

              return (
                <motion.button
                  key={reaction}
                  onClick={() => handleReactionSubmit(reaction)}
                  disabled={isSubmitting}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/10 scale-110"
                      : "border-muted bg-muted/50 hover:border-primary/50 hover:bg-primary/5"
                  } ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"} ${selectedReaction && !isSelected ? "opacity-10" : ""} `}
                  variants={scale_variants}
                  whileHover={!isSubmitting ? { scale: 1.1 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-xl">
                    {ARTICLE_REACTION_EMOJI_MAP[reaction]}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
