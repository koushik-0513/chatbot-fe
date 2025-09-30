"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import {
  CONTAINER_VARIANTS,
  ITEM_VARIANTS,
  SCALE_VARIANTS,
} from "@/constants/animations";
import {
  ARTICLE_REACTIONS,
  ARTICLE_REACTION_EMOJI_MAP,
} from "@/constants/reaction";
import { useScrollContext } from "@/providers/scroll-provider";
import { TArticleReaction } from "@/types/help-types";
import { getRelativeTime } from "@/utils/date-time";
import { motion } from "framer-motion";

import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

import { useSubmitArticleReaction } from "@/hooks/api/article-reaction";
import { useGetArticleDetails } from "@/hooks/api/help";
import { useUserId } from "@/hooks/custom/use-user-id";

type TArticleDetailsProps = {
  articleId: string | null;
  onRelatedArticleClick?: (articleId: string) => void;
  onTitleChange?: (title: string) => void;
};

// Type guard to safely convert string to TArticleReaction
const isValidArticleReaction = (reaction: TArticleReaction | undefined) => {
  if (!reaction) return null;
  return ARTICLE_REACTIONS.includes(reaction) ? reaction : null;
};

export const ArticleDetails = ({
  articleId,
  onRelatedArticleClick,
  onTitleChange,
}: TArticleDetailsProps) => {
  const { resetAllScroll } = useScrollContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const { userId: user_id } = useUserId();

  // Fetch article details when an article is selected
  const { data: articleDetailsData, isLoading: isFetchingArticle } =
    useGetArticleDetails(
      {
        article_id: articleId || "",
        user_id: user_id || "",
      },
      { enabled: !!articleId && !!user_id }
    );

  // using this i want to reduce the other code
  const article = articleDetailsData?.data.article;
  // Reaction state - initialize from article data if available
  const [selectedReaction, setSelectedReaction] = useState(() => {
    return isValidArticleReaction(article?.reaction?.reaction);
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

    await submitReactionMutation.mutateAsync({
      articleId: article?.id || "",
      reaction: reaction,
      userId: user_id,
    });
    setSelectedReaction(reaction);
  };

  // Handle related article click
  const handleRelatedArticleClick = (articleId: string) => {
    onRelatedArticleClick?.(articleId);
  };

  // Reset scroll when component mounts
  useEffect(() => {
    resetAllScroll();
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  // Notify parent of article title when data is loaded
  useEffect(() => {
    if (article?.title) {
      onTitleChange?.(article.title);
    }
  }, [articleDetailsData]);

  // Function to calculate relative time

  const getAuthorName = (): string => {
    return articleDetailsData?.data.author.name || "Anonymous";
  };

  const getAuthorImage = (): string => {
    return articleDetailsData?.data.author.profile_image || "";
  };

  if (isFetchingArticle) {
    return (
      <motion.div
        className="flex h-full flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-muted-foreground">Loading article...</div>
      </motion.div>
    );
  }

  if (!article) {
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

  return (
    <motion.div
      ref={contentRef}
      className="flex flex-col p-4"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {/* Content Container */}
      <div className="space-y-6">
        {/* Article Title */}
        <motion.h1
          className="text-card-foreground text-xl leading-tight font-bold"
          variants={ITEM_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {article?.title}
        </motion.h1>

        {/* Author and Metadata */}
        <motion.div
          className="flex items-center justify-between"
          variants={ITEM_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3">
            <Image
              src={getAuthorImage()!}
              alt={getAuthorName()}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <motion.div className="flex flex-row items-center gap-2">
              <p className="text-card-foreground text-sm font-medium">
                {getAuthorName()}
              </p>
              <p className="text-muted-foreground text-xs">
                {getRelativeTime(article?.updated_at)}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        {article?.content && (
          <motion.div
            variants={ITEM_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            <MarkdownRenderer content={article.content} />
          </motion.div>
        )}

        <motion.div
          className="border-primary/20 bg-primary/5 rounded-lg border-t-2 border-b-2 p-4"
          variants={ITEM_VARIANTS}
          initial="hidden"
          animate="visible"
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

        {article?.related_articles && article.related_articles.length > 0 && (
          <motion.div
            className="space-y-3"
            variants={ITEM_VARIANTS}
            initial="hidden"
            animate="visible"
          >
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
          variants={ITEM_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          <motion.h3
            className="text-card-foreground text-md mb-4 font-semibold"
            variants={ITEM_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            How helpful was this article?
          </motion.h3>
          <motion.div
            className="flex gap-3"
            variants={ITEM_VARIANTS}
            initial="hidden"
            animate="visible"
          >
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
                  variants={SCALE_VARIANTS}
                  initial="hidden"
                  animate="visible"
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
