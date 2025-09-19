import type { TApiPromise, TMutationOpts } from "@/types/api";
import type { TNewsReactionResponse } from "@/types/component-types/news-types";
import {
  NEWS_REACTIONS,
  REACTION_EMOJI_MAP,
  TNewsReaction,
} from "@/utils/news-reaction-utils";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/news/...

// News Reaction Types
type TSubmitNewsReactionPayload = {
  newsId: string;
  reaction: string;
  userId: string;
};

// News Reaction Services
const submitNewsReaction = (
  payload: TSubmitNewsReactionPayload
): TApiPromise<TNewsReactionResponse> => {
  const { newsId, reaction, userId } = payload;
  return api.post(
    `/news/${newsId}/reaction`,
    { reaction },
    { params: { user_id: userId } }
  );
};

// News Reaction Hooks
export const useSubmitNewsReaction = (
  options?: TMutationOpts<TSubmitNewsReactionPayload>
) => {
  return useMutation({
    mutationKey: ["useSubmitNewsReaction"],
    mutationFn: submitNewsReaction,
    onError: (error) => {
      console.error("Error submitting news reaction:", error);
    },
    ...options,
  });
};

// Re-export utils for convenience
export { NEWS_REACTIONS, REACTION_EMOJI_MAP };
export type { TNewsReaction };
