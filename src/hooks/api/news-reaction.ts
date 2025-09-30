import { NEWS_REACTIONS, NEWS_REACTION_EMOJI_MAP } from "@/constants/reaction";
import type { TApiPromise, TMutationOpts } from "@/types/api";
import type { TNewsReaction, TNewsReactionResponse } from "@/types/news-types";
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
  options?: TMutationOpts<TSubmitNewsReactionPayload, TNewsReactionResponse>
) => {
  return useMutation({
    mutationKey: ["useSubmitNewsReaction"],
    mutationFn: submitNewsReaction,
    ...options,
  });
};

// Re-export utils for convenience
export { NEWS_REACTIONS, NEWS_REACTION_EMOJI_MAP };
export type { TNewsReaction };
