import { motion } from "framer-motion";

import { useChatHistory, useCreateNewChat } from "../hooks/api/chat-service";
import { useUserId } from "../hooks/use-user-id";
import { ChatHistory } from "./sub-components/chat-related/chat-history";

interface TMessageProps {
  showChatHistory: boolean;
  onChatSelected: (chatId: number) => void;
  onBackToHistory: () => void;
  onResetSelectedChat?: () => void;
}

export const Message = ({ onChatSelected }: TMessageProps) => {
  const { user_id } = useUserId();
  const {
    data: chatHistoryResponse,
    isLoading,
    error,
  } = useChatHistory(user_id, 1, 5);
  const createNewChatMutation = useCreateNewChat();

  const handleChatClick = (chatId: number) => {
    console.log("Chat clicked with ID:", chatId);
    console.log("Calling onChatSelected with:", chatId);
    onChatSelected(chatId);
  };

  const handleNewChat = async () => {
    if (!user_id) {
      console.error("User ID is required to create a new chat");
      return;
    }

    try {
      const result = await createNewChatMutation.mutateAsync({ user_id });
      console.log("New chat created:", result);

      // If the API returns a conversation_id, we can navigate to it
      if (result.conversation_id) {
        onChatSelected(result.conversation_id);
      }
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
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
          {error.message}
        </div>
      </motion.div>
    );
  }

  const chatHistoryData = chatHistoryResponse?.data || [];

  console.log("Chat history response:", chatHistoryResponse);
  console.log("Chat history data:", chatHistoryData);
  console.log("First chat item:", chatHistoryData[0]);

  return (
    <motion.div
      className="flex h-full flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-0">
        {chatHistoryData.length > 0 ? (
          chatHistoryData.map((chat, index) => {
            // Handle different possible ID field names
            const chatItem = chat as any;
            const chatId =
              chatItem.id ||
              chatItem.conversation_id ||
              chatItem._id ||
              chatItem.conversationId;
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
                  title={chatItem.title || chatItem.name || "Untitled Chat"}
                  timestamp={
                    chatItem.timestamp || chatItem.created_at || "Unknown time"
                  }
                  day={chatItem.day || "Unknown day"}
                  onClick={handleChatClick}
                />
              </motion.div>
            );
          })
        ) : (
          <motion.div
            className="flex h-full flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-muted-foreground">No chat history found</div>
          </motion.div>
        )}
      </div>

      {/* New Chat Button */}
      <motion.div
        className="mt-auto flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.button
          onClick={handleNewChat}
          disabled={createNewChatMutation.isPending || !user_id}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          whileHover={{ scale: createNewChatMutation.isPending ? 1 : 1.02 }}
          whileTap={{ scale: createNewChatMutation.isPending ? 1 : 0.98 }}
        >
          {createNewChatMutation.isPending ? "Creating..." : "New Chat"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
