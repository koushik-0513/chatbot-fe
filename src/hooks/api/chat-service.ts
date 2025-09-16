import env from "@/config/env";
import { useMutation, useQuery } from "@tanstack/react-query";

// Chat history
export const useGetChatHistory = (
  user_id: string | null,
  page: number = 1,
  limit: number = 5
) => {
  return useQuery({
    queryKey: ["chatHistory", user_id, page, limit],
    enabled: !!user_id,
    retry: 2,
    queryFn: async () => {
      const response = await fetch(
        `${env.backendUrl}/api/v1/conversation?user_id=${user_id}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 404) {
        return {
          data: [],
          pagination: {
            page,
            limit,
            total_conversations: 0,
            total_pages: 0,
          },
        };
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 60_000,
  });
};

// Single conversation by ID
export const useGetConversationById = (conversationId: string | null) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    enabled: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      if (conversationId === null) {
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 50,
            total_messages: 0,
            total_pages: 0,
          },
        };
      }

      const response = await fetch(
        `${env.backendUrl}/api/v1/conversation/${conversationId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 404) {
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 50,
            total_messages: 0,
            total_pages: 0,
          },
        };
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.statusText}`);
      }
      return response.json();
    },
  });
};

// Delete a conversation
export const useDeleteConversation = () => {
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(
        `${env.backendUrl}/api/v1/conversation/${conversationId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to delete conversation: ${response.statusText}`
        );
      }
      return response.json();
    },
  });
};

// Send message with streaming support
export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (args: {
      conversationId: string | null;
      message: string;
      userId: string;
      messageId?: string;
    }) => {
      const { conversationId, message, userId, messageId } = args;
      const url = `${env.backendUrl}/api/v1/chat/stream/${conversationId}?user_id=${userId}`;
      const response = await fetch(url, {
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
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      return response;
    },
  });
};
