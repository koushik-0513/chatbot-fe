// Available article reactions
export const ARTICLE_REACTIONS = ["sad", "middle", "happy"] as const;

export type TArticleReaction = (typeof ARTICLE_REACTIONS)[number];

// Emoji mapping for reactions
export const ARTICLE_REACTION_EMOJI_MAP: Record<TArticleReaction, string> = {
  sad: "😢",
  middle: "😐",
  happy: "😊",
};
