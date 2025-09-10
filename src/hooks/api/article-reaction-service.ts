import { useMutation } from "@tanstack/react-query";

import env from "../../config/env";
import {
  ARTICLE_REACTIONS,
  ARTICLE_REACTION_EMOJI_MAP,
  TArticleReaction,
} from "../../utils/article-reaction-utils";

export type TArticleReactionRequest = {
  reaction: string;
  user_id: string;
};

export type TArticleReactionResponse = {
  success: boolean;
  message: string;
  data?: {
    reaction: string;
    user_id: string;
    article_id: string;
  };
};

// Submit article reaction
export const useSubmitArticleReaction = () => {
  return useMutation<
    TArticleReactionResponse,
    Error,
    { articleId: string; reaction: string; userId: string }
  >({
    mutationFn: async ({ articleId, reaction, userId }) => {
      const response = await fetch(
        `${env.backendUrl}/help/articles/${articleId}/reaction`,
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
      console.error("Error submitting article reaction:", error);
    },
  });
};

// Re-export utils for convenience
export { ARTICLE_REACTIONS, ARTICLE_REACTION_EMOJI_MAP };
export type { TArticleReaction };
