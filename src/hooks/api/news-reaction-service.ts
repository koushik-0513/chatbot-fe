import { useMutation } from "@tanstack/react-query";

import env from "../../config/env";
import { TNewsReactionResponse } from "../../types/types";
import {
  NEWS_REACTIONS,
  REACTION_EMOJI_MAP,
  TNewsReaction,
} from "../../utils/news-reaction-utils";

// Submit news reaction
export const useSubmitNewsReaction = () => {
  return useMutation<
    TNewsReactionResponse,
    Error,
    { newsId: string; reaction: string; userId: string }
  >({
    mutationFn: async ({ newsId, reaction, userId }) => {
      const response = await fetch(
        `${env.backendUrl}/api/v1/news/${newsId}/reaction?user_id=${userId}`,
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
      console.error("Error submitting news reaction:", error);
    },
  });
};

// Re-export utils for convenience
export { NEWS_REACTIONS, REACTION_EMOJI_MAP };
export type { TNewsReaction };
