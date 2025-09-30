import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { TApiPromise, TMutationOpts } from "@/types/api";
import { TArticleReaction } from "@/types/help-types";

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
): TApiPromise<TArticleReaction> => {
  const { articleId, reaction, userId } = payload;
  return api.post(
    `/article/${articleId}/reaction`,
    { reaction },
    { params: { user_id: userId } }
  );
};

// Article Reaction Hooks
export const useSubmitArticleReaction = (
  options?: TMutationOpts<TSubmitArticleReactionPayload, TArticleReaction>
) => {
  return useMutation({
    mutationKey: ["useSubmitArticleReaction"],
    mutationFn: submitArticleReaction,
    ...options,
  });
};

// Re-export utils for convenience
export type { TArticleReaction };
