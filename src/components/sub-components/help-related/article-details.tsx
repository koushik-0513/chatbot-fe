// For GitHub Flavored Markdown support
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useScrollContext } from "@/contexts/scroll-context";
import { motion } from "framer-motion";

import { useSubmitArticleReaction } from "../../../hooks/api/article-reaction-service";
import { useUserId } from "../../../hooks/use-user-id";
import { THelpArticle, THelpArticleDetailResponse } from "../../../types/types";
import {
  ARTICLE_REACTIONS,
  ARTICLE_REACTION_EMOJI_MAP,
  TArticleReaction,
} from "../../../utils/article-reaction-utils";
import { MarkdownRenderer } from "../../ui/markdown-renderer";

interface TArticleDetailsProps {
  initialArticle: THelpArticle;
  articleDetailsData: THelpArticleDetailResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  onBack: () => void;
  onAutoMaximize?: () => void;
}

export const ArticleDetails = ({
  initialArticle,
  articleDetailsData,
  isLoading,
  error,
  onBack,
  onAutoMaximize,
}: TArticleDetailsProps) => {
  const { resetAllScroll, resetAllScrollWithDelay } = useScrollContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const { user_id } = useUserId();

  // Reaction state - initialize from article data if available
  const [selectedReaction, setSelectedReaction] =
    useState<TArticleReaction | null>((articleDetailsData as any)?.data?.article?.reaction?.reaction || null);

  // Article reaction mutation
  const submitReactionMutation = useSubmitArticleReaction();

  // Handle reaction submission
  const handleReactionSubmit = async (reaction: TArticleReaction) => {
    if (!user_id || submitReactionMutation.isPending) return;

    try {
      await submitReactionMutation.mutateAsync({
        articleId: article.id,
        reaction: reaction,
        userId: user_id,
      });
      setSelectedReaction(reaction);
    } catch (error) {
      console.error("Failed to submit reaction:", error);
    }
  };

  // Reset scroll when component mounts
  useEffect(() => {
    resetAllScrollWithDelay(100);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [resetAllScrollWithDelay]);

  // Auto-maximize when component mounts
  useEffect(() => {
    if (onAutoMaximize) {
      onAutoMaximize();
    }
  }, [onAutoMaximize]);

  // Update selected reaction when article data changes
  useEffect(() => {
    const existingReaction = (articleDetailsData as any)?.data?.article?.reaction?.reaction;
    if (existingReaction) {
      setSelectedReaction(existingReaction);
    }
  }, [articleDetailsData]);

  // Function to calculate relative time
  const getRelativeTime = (dateString: string) => {
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

  // Use API data if available, otherwise fall back to initial article data
  const article = articleDetailsData?.data.article || {
    id: initialArticle.id,
    title: initialArticle.title,
    content: initialArticle.content || "",
    excerpt: initialArticle.description || "",
    read_time: 5, // Default read time
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const author = articleDetailsData?.data.author || {
    id: "default",
    name: initialArticle.author || "Anonymous",
    role: "Author",
    profile_image: "",
    bio: "",
    email: "",
    social_links: {},
  };

  const co_authors = articleDetailsData?.data.co_authors || [];

  // Function to determine if content is HTML or Markdown
  const isHTML = (str: string) => {
    const htmlRegex = /<[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
  };

  return (
    <motion.div
      className="space-y-6 p-4"
      variants={container_variants}
      initial="hidden"
      animate="visible"
    >
      {/* Article title */}
      <motion.div variants={item_variants}>
        <div className="flex items-center gap-2">
          <h1 className="text-card-foreground mb-3 text-2xl font-bold">
            {article.title}
          </h1>
          {isLoading && (
            <motion.div
              className="border-primary h-4 w-4 rounded-full border-2 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        {article.excerpt && (
          <p className="text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </motion.div>

      {/* Author information */}
      <motion.div className="space-y-3" variants={item_variants}>
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-primary/20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
            variants={scale_variants}
          >
            <Image
              src={author.profile_image}
              alt={author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </motion.div>
          <motion.div variants={item_variants}>
            <p className="text-muted-foreground text-sm">
              Written by {author.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {getRelativeTime(article.created_at)}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Article content */}
      <motion.div
        className="prose prose-sm max-w-none"
        variants={item_variants}
      >
        {article.content ? (
          <>
            {/* Using MarkdownRenderer */}
            {!isHTML(article.content) ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MarkdownRenderer content={article.content} />
              </motion.div>
            ) : (
              // If content is already HTML, render it as before
              <motion.div
                className="article-content text-accent"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  lineHeight: "1.6",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )}
          </>
        ) : (
          <motion.div className="space-y-4" variants={item_variants}>
            <p className="leading-relaxed text-gray-700">
              {article.excerpt || "No content available for this article."}
            </p>
            {isLoading && (
              <motion.div
                className="text-muted-foreground flex items-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="border-primary h-3 w-3 rounded-full border border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Loading full content...
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

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
    </motion.div>
  );
};
