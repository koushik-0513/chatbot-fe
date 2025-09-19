import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import type {
  TChatHistoryAPIResponse,
  TConversationAPIResponse,
} from "@/types/component-types/chat-types";
import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Base URL: /api/v1/conversation/...

// Chat Types
type TGetChatHistoryQParams = {
  user_id: string;
  page?: number;
  limit?: number;
};

type TGetConversationByIdQParams = {
  conversationId: string;
};

type TDeleteConversationPayload = {
  conversationId: string;
};

type TSendMessagePayload = {
  conversationId: string | null;
  message: string;
  userId: string;
  messageId?: string;
};

// Chat Services
const getChatHistory = (
  params: TGetChatHistoryQParams
): TApiPromise<TChatHistoryAPIResponse> => {
  const { user_id, page = 1, limit = 5 } = params;
  return api.get("/conversation", {
    params: { user_id, page, limit },
  });
};

const getConversationById = ({
  conversationId,
  ...params
}: TGetConversationByIdQParams): TApiPromise<TConversationAPIResponse> => {
  return api.get(`/conversation/${conversationId}`, { params });
};

const deleteConversation = ({
  conversationId,
  ...payload
}: TDeleteConversationPayload): TApiPromise => {
  return api.delete(`/conversation/${conversationId}`, payload);
};

const sendMessage = (payload: TSendMessagePayload): Promise<Response> => {
  const { conversationId, message, userId, messageId } = payload;
  const url = `/chat/stream/${conversationId}?user_id=${userId}`;

  return fetch(`${api.defaults.baseURL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    cache: "no-store",
    body: JSON.stringify({
      message,
      user_id: userId,
      conversation_id: conversationId,
      message_id: messageId,
    }),
  });
};

// Chat Hooks
export const useGetChatHistory = (
  params: TGetChatHistoryQParams,
  options?: TQueryOpts<TChatHistoryAPIResponse>
) => {
  return useQuery({
    queryKey: ["useGetChatHistory", params],
    queryFn: () => getChatHistory(params),
    enabled: !!params.user_id,
    retry: 2,
    staleTime: 60_000,
    ...options,
  });
};

export const useGetConversationById = (
  params: TGetConversationByIdQParams,
  options?: TQueryOpts<TConversationAPIResponse>
) => {
  return useQuery({
    queryKey: ["useGetConversationById", params],
    queryFn: () => getConversationById(params),
    enabled: !!params.conversationId,
    ...options,
  });
};

export const useDeleteConversation = (
  options?: TMutationOpts<TDeleteConversationPayload>
) => {
  return useMutation({
    mutationKey: ["useDeleteConversation"],
    mutationFn: deleteConversation,
    ...options,
  });
};

export const useSendMessage = (
  options?: TMutationOpts<TSendMessagePayload>
) => {
  return useMutation({
    mutationKey: ["useSendMessage"],
    mutationFn: sendMessage,
    ...options,
  });
};
