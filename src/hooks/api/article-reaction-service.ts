import type { TApiPromise, TMutationOpts } from "@/types/api";
import type { TArticleReactionResponse } from "@/types/component-types/help-types";
import {
  ARTICLE_REACTIONS,
  ARTICLE_REACTION_EMOJI_MAP,
  TArticleReaction,
} from "@/constants";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/article/...

// Article Reaction Types
type TSubmitArticleReactionPayload = {
  articleId: string;
  reaction: string;
  userId: string;
};

// Article Reaction Services
const submitArticleReaction = (
  payload: TSubmitArticleReactionPayload
): TApiPromise<TArticleReactionResponse> => {
  const { articleId, reaction, userId } = payload;
  return api.post(
    `/article/${articleId}/reaction`,
    { reaction },
    { params: { user_id: userId } }
  );
};

// Article Reaction Hooks
export const useSubmitArticleReaction = (
  options?: TMutationOpts<TSubmitArticleReactionPayload>
) => {
  return useMutation({
    mutationKey: ["useSubmitArticleReaction"],
    mutationFn: submitArticleReaction,
    onError: (error) => {
      console.error("Error submitting article reaction:", error);
    },
    ...options,
  });
};

// Re-export utils for convenience
export { ARTICLE_REACTIONS, ARTICLE_REACTION_EMOJI_MAP };
export type { TArticleReaction };
