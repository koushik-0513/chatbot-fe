// Available news reactions
export const NEWS_REACTIONS = [
  "sleeping",
  "heart",
  "thumbsdown",
  "tada",
] as const;

export type TNewsReaction = (typeof NEWS_REACTIONS)[number];

// Emoji mapping for reactions
export const REACTION_EMOJI_MAP: Record<TNewsReaction, string> = {
  sleeping: "😴",
  heart: "❤️",
  thumbsdown: "👎",
  tada: "🎉",
};
