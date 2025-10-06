import { useEffect, useState } from "react";

import Image from "next/image";

import { getRelativeTime } from "@/utils/date-time";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import {
  CONTAINER_VARIANTS,
  ITEM_VARIANTS,
  SCALE_VARIANTS,
} from "@/constants/animations";
import { NEWS_REACTIONS, NEWS_REACTION_EMOJI_MAP } from "@/constants/reaction";

import { useScrollContext } from "@/providers/scroll-provider";

import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

import { cn } from "@/lib/utils";

import { useGetNewsById, useSubmitNewsReaction } from "@/hooks/api/news";
import { useUserId } from "@/hooks/custom/use-user-id";

import { TNewsReaction } from "@/types/news-types";

type TNewsDetailsProps = {
  newsId: string;
  onBack: () => void;
};

export const NewsDetails = ({ newsId, onBack }: TNewsDetailsProps) => {
  const { resetAllScroll } = useScrollContext();
  const { userId } = useUserId();
  const queryClient = useQueryClient();

  // Fetch news details
  const {
    data: newsData,
    isLoading,
    error,
  } = useGetNewsById(
    { news_id: newsId, user_id: userId || "" },
    { enabled: !!newsId && !!userId }
  );

  const news = newsData?.data;

  // Reaction state - initialize from news data if available
  const [selectedReaction, setSelectedReaction] =
    useState<TNewsReaction | null>();

  // News reaction mutation
  const submitReactionMutation = useSubmitNewsReaction();

  // Initialize reaction state when news data is loaded
  useEffect(() => {
    setSelectedReaction(news?.reaction?.reaction ?? null);
  }, [news?.reaction?.reaction]);

  // Handle reaction submission
  const handleReactionSubmit = async (reaction: TNewsReaction) => {
    if (!userId || submitReactionMutation.isPending) return;

    // Don't make API call if the same reaction is already selected
    if (selectedReaction === reaction) {
      return;
    }

    try {
      await submitReactionMutation.mutateAsync({
        newsId: news?.id || "",
        reaction: reaction,
        userId: userId,
      });
      setSelectedReaction(reaction);
      await queryClient.invalidateQueries({ queryKey: ["useGetNewsById"] });
    } catch (error) {
      console.error(error);
    }
  };

  // Reset scroll when component mounts
  useEffect(() => {
    resetAllScroll();
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-90px)] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading news details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !news) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load news details</p>
          <button
            onClick={onBack}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper functions (only called after loading/error checks)
  const getAuthorName = (): string => {
    return news.author.name || "Anonymous";
  };

  const getAuthorInitial = (): string => {
    const name = getAuthorName();
    return name.charAt(0).toUpperCase();
  };

  const getAuthorImage = (): string => {
    return news.author.profile_image || "";
  };

  return (
    <motion.div
      className="flex flex-col"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {/* Main Image - Full Width */}
      {news.image_url && (
        <div className="-mx-4 -my-4 mb-6 w-[calc(100%+2rem)]">
          <Image
            src={news.image_url}
            alt={news.title}
            width={800}
            height={400}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="space-y-6 px-4">
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
          variants={ITEM_VARIANTS}
        >
          {news.title}
        </motion.h1>

        {/* Author and Metadata */}
        <motion.div
          className="flex items-center justify-between"
          variants={ITEM_VARIANTS}
        >
          <div className="flex items-center gap-3">
            {getAuthorImage() ? (
              <motion.img
                src={getAuthorImage()!}
                alt={getAuthorName()}
                className="h-10 w-10 rounded-full object-cover"
                variants={SCALE_VARIANTS}
              />
            ) : (
              <motion.div
                className="bg-muted flex h-10 w-10 items-center justify-center rounded-full"
                variants={SCALE_VARIANTS}
              >
                <span className="text-primary text-sm font-medium">
                  {getAuthorInitial()}
                </span>
              </motion.div>
            )}
            <motion.div
              className="flex flex-row items-center gap-2"
              variants={ITEM_VARIANTS}
            >
              <p className="text-card-foreground text-sm font-medium">
                {getAuthorName()}
              </p>
              <p className="text-muted-foreground text-xs">
                {getRelativeTime(news.published_at)}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        {news.content && (
          <motion.div
            variants={ITEM_VARIANTS}
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
          variants={ITEM_VARIANTS}
        >
          <motion.h3
            className="text-card-foreground text-md mb-4 font-semibold"
            variants={ITEM_VARIANTS}
          >
            How do you feel about this news?
          </motion.h3>
          <motion.div className="flex gap-3" variants={ITEM_VARIANTS}>
            {NEWS_REACTIONS.map((reaction, index) => {
              const isSelected = selectedReaction === reaction;
              const isSubmitting = submitReactionMutation.isPending;

              return (
                <motion.button
                  key={reaction}
                  onClick={() => handleReactionSubmit(reaction)}
                  disabled={isSubmitting}
                  className={cn(
                    `flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 scale-110"
                        : "border-muted bg-muted/50 hover:border-primary/50 hover:bg-primary/5"
                    } ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"} ${selectedReaction && !isSelected ? "opacity-10" : ""} `
                  )}
                  variants={SCALE_VARIANTS}
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
