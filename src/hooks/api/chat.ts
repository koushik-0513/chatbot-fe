import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import type {
  TConversationAPIResponse,
  TConversationListAPIResponse,
} from "@/types/chat-types";

// Chat Types
type TGetConversationListQParams = {
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
const getConversationList = (
  params: TGetConversationListQParams
): TApiPromise<TConversationListAPIResponse> => {
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
}: TDeleteConversationPayload): TApiPromise<void> => {
  return api.delete(`/conversation/${conversationId}`, payload);
};

const sendMessage = ({ conversationId, message, userId, messageId }: TSendMessagePayload): TApiPromise<Response> => {
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
export const useGetConversationList = (
  params: TGetConversationListQParams,
  options?: TQueryOpts<TConversationListAPIResponse>
) => {
  return useQuery({
    queryKey: ["useGetConversationList", params],
    queryFn: () => getConversationList(params),
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
    ...options,
  });
};

export const useDeleteConversation = (
  options?: TMutationOpts<TDeleteConversationPayload, void>
) => {
  return useMutation({
    mutationKey: ["useDeleteConversation"],
    mutationFn: deleteConversation,
    ...options,
  });
};

export const useSendMessage = (
  options?: TMutationOpts<TSendMessagePayload, Response>
) => {
  return useMutation({
    mutationKey: ["useSendMessage"],
    mutationFn: sendMessage,
    ...options,
  });
};
