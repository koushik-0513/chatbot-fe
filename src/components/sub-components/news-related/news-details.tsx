import { useEffect, useRef, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { motion } from "framer-motion";

import { useSubmitNewsReaction } from "../../../hooks/api/news-reaction-service";
import { useUserId } from "../../../hooks/use-user-id";
import { TNews } from "../../../types/component-types/news-types";
import {
  NEWS_REACTIONS,
  NEWS_REACTION_EMOJI_MAP,
  TNewsReaction,
  UI_MESSAGES,
} from "@/constants";
import { MarkdownRenderer } from "../../ui/markdown-renderer";

type TNewsDetailsProps = {
  news: TNews;
  onBack: () => void;
  onAutoMaximize?: () => void;
}

// Type guard to safely convert string to TNewsReaction
const isValidNewsReaction = (reaction: string): TNewsReaction | null => {
  if (!reaction) return null;
  return NEWS_REACTIONS.includes(reaction as TNewsReaction)
    ? (reaction as TNewsReaction)
    : null;
};

export const NewsDetails = ({ news }: TNewsDetailsProps) => {
  const { resetAllScrollWithDelay } = useScrollContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const { user_id } = useUserId();

  // Reaction state - initialize from news data if available
  const [selectedReaction, setSelectedReaction] =
    useState<TNewsReaction | null>(() => {
      return isValidNewsReaction(news?.reaction?.reaction);
    });

  // News reaction mutation
  const submitReactionMutation = useSubmitNewsReaction();

  // Handle reaction submission
  const handleReactionSubmit = async (reaction: TNewsReaction) => {
    if (!user_id || submitReactionMutation.isPending) return;

    // Don't make API call if the same reaction is already selected
    if (selectedReaction === reaction) {
      return;
    }

    try {
      await submitReactionMutation.mutateAsync({
        newsId: news.id,
        reaction: reaction,
        userId: user_id,
      });
      setSelectedReaction(reaction);
    } catch (error) {
      console.error(UI_MESSAGES.ERROR.REACTION_SUBMIT_FAILED, error);
    }
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

  // Update selected reaction when news data changes
  useEffect(() => {
    const existingReaction = isValidNewsReaction(news?.reaction?.reaction);
    setSelectedReaction(existingReaction);
  }, [news]);

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
    if (news.author && typeof news.author === "object" && news.author.name) {
      return news.author.name;
    }
    return "Anonymous";
  };

  const get_author_initial = (): string => {
    const name = get_author_name();
    return name.charAt(0).toUpperCase();
  };

  const get_author_image = (): string | null => {
    if (
      news.author &&
      typeof news.author === "object" &&
      news.author.profile_image
    ) {
      return news.author.profile_image;
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

  return (
    <motion.div
      className="flex flex-col"
      variants={container_variants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Image - Full Width */}
      {news.image_url && (
        <div className="-mx-4 -my-4 mb-6 w-[calc(100%+2rem)]">
          <img
            src={news.image_url}
            alt={news.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-muted text-muted-foreground cursor-pointer rounded-full px-3 py-1 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Article Title */}
        <motion.h1
          className="text-card-foreground text-xl leading-tight font-bold"
          variants={item_variants}
        >
          {news.title}
        </motion.h1>

        {/* Author and Metadata */}
        <motion.div
          className="flex items-center justify-between"
          variants={item_variants}
        >
          <div className="flex items-center gap-3">
            {get_author_image() ? (
              <motion.img
                src={get_author_image()!}
                alt={get_author_name()}
                className="h-10 w-10 rounded-full object-cover"
                variants={scale_variants}
              />
            ) : (
              <motion.div
                className="bg-muted flex h-10 w-10 items-center justify-center rounded-full"
                variants={scale_variants}
              >
                <span className="text-primary text-sm font-medium">
                  {get_author_initial()}
                </span>
              </motion.div>
            )}
            <motion.div
              className="flex flex-row items-center gap-2"
              variants={item_variants}
            >
              <p className="text-card-foreground text-sm font-medium">
                {get_author_name()}
              </p>
              <p className="text-muted-foreground text-xs">
                {get_relative_time(news.published_at)}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        {news.content && (
          <motion.div
            variants={item_variants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MarkdownRenderer content={news.content} />
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
            How do you feel about this news?
          </motion.h3>
          <motion.div className="flex gap-3" variants={item_variants}>
            {NEWS_REACTIONS.map((reaction, index) => {
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
                    {NEWS_REACTION_EMOJI_MAP[reaction]}
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
