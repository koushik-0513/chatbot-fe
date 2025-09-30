import { TArticleReaction } from "@/types/help-types";
import { TNewsReaction } from "@/types/news-types";

// Available news reactions
export const NEWS_REACTIONS = [
  "sleeping",
  "heart",
  "thumbsdown",
  "tada",
] as const;

// Emoji mapping for news reactions
export const NEWS_REACTION_EMOJI_MAP: Record<TNewsReaction, string> = {
  sleeping: "😴",
  heart: "❤️",
  thumbsdown: "👎",
  tada: "🎉",
};

// Available article reactions
export const ARTICLE_REACTIONS = ["sad", "middle", "happy"] as const;

// Emoji mapping for article reactions
export const ARTICLE_REACTION_EMOJI_MAP: Record<TArticleReaction, string> = {
  sad: "😢",
  middle: "😐",
  happy: "😊",
};
