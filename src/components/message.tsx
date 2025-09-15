import { useMutation, useQuery } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { motion } from "framer-motion";

import { getChatHistory } from "../hooks/api/chat-service";
import { useUserId } from "../hooks/use-user-id";
import { ChatHistory } from "./sub-components/chat-related/chat-history";

interface TMessageProps {
  showChatHistory: boolean;
  onChatSelected: (chatId: string | null) => void;
  onBackToHistory: () => void;
  onResetSelectedChat?: () => void;
  setShowActiveChat: (show: boolean) => void;
}

export const Message = ({
  onChatSelected,
  setShowActiveChat,
}: TMessageProps) => {
  const { user_id } = useUserId();

  // Use React Query to fetch chat history
  const {
    data: chatHistoryResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatHistory", user_id],
    queryFn: () => getChatHistory(user_id || "", 1, 5),
    enabled: !!user_id,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (no conversations found)
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: 1000,
  });

  const handleChatClick = (chatId: string) => {
    console.log("Chat clicked with ID:", chatId);
    console.log("Calling onChatSelected with:", chatId);
    onChatSelected(chatId);
    setShowActiveChat(true);
  };

  const handleNewChat = async () => {
    if (!user_id) {
      console.error("User ID is required to create a new chat");
      return;
    }
    console.log("Creating new chat for user:", user_id);
    // Generate a new conversation id for the first message
    const newConversationId = new ObjectId().toHexString();
    onChatSelected(newConversationId);
    setShowActiveChat(true);
    // createNewChatMutation.mutate({ user_id: user_id });
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        className="flex h-full flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-muted-foreground">Loading chat history...</div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="flex h-full flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-destructive">Failed to load chat history</div>
        <div className="text-muted-foreground mt-2 text-sm">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      </motion.div>
    );
  }

  // Extract the data array from the response
  const chatHistoryData = chatHistoryResponse?.data || [];

  console.log("Chat history response:", chatHistoryResponse);
  console.log("Chat history data:", chatHistoryData);
  console.log("First chat item:", chatHistoryData[0]);
  console.log("User ID:", user_id);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

  return (
    <motion.div
      className="flex h-full flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-0">
        {chatHistoryData.length > 0 ? (
          chatHistoryData.map((chat: any, index: number) => {
            // Handle different possible ID field names
            const chatId =
              chat._id ||
              chat.id ||
              chat.conversation_id ||
              chat.conversationId;

            console.log("Processing chat item:", chat, "Extracted ID:", chatId);

            return (
              <motion.div
                key={chatId || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <ChatHistory
                  id={chatId}
                  title={chat.title || chat.name || "Untitled Chat"}
                  timestamp={
                    chat.timestamp || chat.created_at || "Unknown time"
                  }
                  day={chat.day || "Unknown day"}
                  onClick={handleChatClick}
                />
              </motion.div>
            );
          })
        ) : (
          <motion.div
            className="flex h-full flex-col items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-muted-foreground mb-4">
              No chat history found
            </div>

            {/* New Chat Button - only show when no chat history */}
            <motion.button
              onClick={handleNewChat}
              disabled={!user_id}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start New Chat
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* New Chat Button - only show when there is chat history */}
      {chatHistoryData.length > 0 && (
        <motion.div
          className="mt-auto flex items-center justify-center p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.button
            onClick={handleNewChat}
            disabled={!user_id}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            New Chat
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};
