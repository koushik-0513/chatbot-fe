import { useMutation } from "@tanstack/react-query";

import env from "../../config/env";
import {
  NEWS_REACTIONS,
  REACTION_EMOJI_MAP,
  TNewsReaction,
} from "../../utils/news-reaction-utils";

export type TNewsReactionRequest = {
  reaction: string;
  user_id: string;
};

export type TNewsReactionResponse = {
  success: boolean;
  message: string;
  data?: {
    reaction: string;
    user_id: string;
    news_id: string;
  };
};

// Submit news reaction
export const useSubmitNewsReaction = () => {
  return useMutation<
    TNewsReactionResponse,
    Error,
    { newsId: string; reaction: string; userId: string }
  >({
    mutationFn: async ({ newsId, reaction, userId }) => {
      const response = await fetch(
        `${env.backendUrl}/news/${newsId}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reaction: reaction,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error submitting news reaction:", error);
    },
  });
};

// Re-export utils for convenience
export { NEWS_REACTIONS, REACTION_EMOJI_MAP };
export type { TNewsReaction };
