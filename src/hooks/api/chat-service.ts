import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import env from "../../config/env";
import {
  TChatHistoryRequest,
  TChatHistoryResponse,
  TChatMessage,
} from "../../types/types";

// Fetch chat history with POST method
export const useChatHistory = (
  user_id: string | null,
  page: number = 1,
  limit: number = 5
) => {
  return useQuery<TChatHistoryResponse, Error>({
    queryKey: ["chatHistory", user_id, page, limit],
    queryFn: async () => {
      if (!user_id) {
        throw new Error("User ID is required");
      }

      console.log(
        "Fetching chat history with user_id:",
        user_id,
        "page:",
        page,
        "limit:",
        limit
      );

      const response = await fetch(
        `${env.backendUrl}/conversation/all?page=${page}&limit=${limit}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Chat history API response:", data);
      console.log("Chat history data array:", data.data);
      if (data.data && data.data.length > 0) {
        console.log("First chat item structure:", data.data[0]);
        console.log(
          "Available fields in first item:",
          Object.keys(data.data[0])
        );
      }

      return data;
    },
    enabled: !!user_id, // Only run query when user_id is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Create new chat mutation
export const useCreateNewChat = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; conversation_id?: number },
    Error,
    { user_id: string }
  >({
    mutationFn: async ({ user_id }) => {
      const response = await fetch(`${env.backendUrl}/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("New chat created successfully:", data);
      // Invalidate and refetch chat history to show the new chat
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
    onError: (error) => {
      console.error("Error creating new chat:", error);
    },
  });
};

// Get chat history by conversation ID
export const useChatHistoryById = (conversationId: number | null) => {
  return useQuery<
    { success: boolean; message: string; data: TChatMessage[] },
    Error
  >({
    queryKey: ["chatHistoryById", conversationId],
    queryFn: async () => {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      console.log("Fetching chat history for conversation ID:", conversationId);
      console.log(
        "API URL:",
        `${env.backendUrl}/conversation/${conversationId}`
      );

      const response = await fetch(
        `${env.backendUrl}/conversation/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation_id: conversationId,
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Chat history response:", data);
      return data;
    },
    enabled: !!conversationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// Send message and get streaming response
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    {
      conversationId: number;
      message: string;
      user_id: string;
    }
  >({
    mutationFn: async ({ conversationId, message, user_id }) => {
      const response = await fetch(
        `${env.backendUrl}/chat/stream/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            user_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      console.log("Message sent successfully:", data);
      // Invalidate chat history to refresh the conversation
      queryClient.invalidateQueries({
        queryKey: ["chatHistoryById", variables.conversationId],
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });
};
