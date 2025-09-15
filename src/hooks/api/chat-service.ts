// hooks/api/chat-service.ts

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export const getChatHistory = async (
  user_id: string,
  page: number,
  limit: number
) => {
  const response = await fetch(
    `${backendUrl}/api/v1/conversation?user_id=${user_id}&page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Handle 404 as empty result instead of error
  if (response.status === 404) {
    return {
      data: [],
      pagination: {
        page: page,
        limit: limit,
        total_conversations: 0,
        total_pages: 0,
      },
    };
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch chat history: ${response.statusText}`);
  }

  return response.json();
};
// Optional: Add other chat-related API functions
export const getConversationById = async (conversationId: string | null) => {
  // For new chats (null conversationId), return empty data
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
    `${backendUrl}/api/v1/conversation/${conversationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
};

export const deleteConversation = async (conversationId: string) => {
  const response = await fetch(
    `${backendUrl}/api/v1/conversation/${conversationId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete conversation: ${response.statusText}`);
  }

  return response.json();
};
// Send message with streaming support
export const sendMessage = async (
  conversationId: string | null,
  message: string,
  userId: string,
  messageId?: string
) => {
  const url = `${backendUrl}/api/v1/chat/stream/${conversationId}?user_id=${userId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    cache: "no-store",
    body: JSON.stringify({
      message: message,
      user_id: userId,
      conversation_id: conversationId,
      message_id: messageId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
  return response;
};
