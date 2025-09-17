import { useMutation } from "@tanstack/react-query";

import env from "../../config/env";
import { TArticleReactionResponse } from "../../types/types";
import {
  ARTICLE_REACTIONS,
  ARTICLE_REACTION_EMOJI_MAP,
  TArticleReaction,
} from "../../utils/article-reaction-utils";

// Submit article reaction
export const useSubmitArticleReaction = () => {
  return useMutation<
    TArticleReactionResponse,
    Error,
    { articleId: string; reaction: string; userId: string }
  >({
    mutationFn: async ({ articleId, reaction, userId }) => {
      const response = await fetch(
        `${env.backendUrl}/api/v1/article/${articleId}/reaction?user_id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reaction: reaction,
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
