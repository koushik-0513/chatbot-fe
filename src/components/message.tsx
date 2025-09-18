import { TChatHistoryItem } from "@/types/types";
import { formatChatTime, formatDayOrDate } from "@/utils/datetime";
import { ObjectId } from "bson";
import { motion } from "framer-motion";
import { MessageCircleQuestionMark } from "lucide-react";

import { useGetChatHistory } from "../hooks/api/chat-service";
import { useUserId } from "../hooks/use-user-id";
import { ChatHistory } from "./sub-components/chat-related/chat-history";

type TMessageProps = {
  showChatHistory: boolean;
  onChatSelected: (chatId: string | null) => void;
  onBackToHistory: () => void;
  onResetSelectedChat?: () => void;
  setShowActiveChat: (show: boolean) => void;
  title: (title: string) => void;
};

export const Message = ({
  onChatSelected,
  setShowActiveChat,
  title,
}: TMessageProps) => {
  const { user_id } = useUserId();

  // Use React Query to fetch chat history
  const {
    data: chatHistoryResponse,
    isLoading,
    error,
  } = useGetChatHistory(user_id || "", 1, 5);

  const handleChatClick = (chatId: string, chatTitle: string) => {
    onChatSelected(chatId);
    setShowActiveChat(true);
    title(chatTitle || "Untitled Chat");
  };

  const handleNewChat = async () => {
    if (!user_id) {
      console.error("User ID is required to create a new chat");
      return;
    }
    // Generate a new conversation id for the first message
    const newConversationId = new ObjectId().toHexString();
    onChatSelected(newConversationId);
    setShowActiveChat(true);
    // Set title to undefined/empty until backend provides one
    title("");
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
  const chatHistoryDataRaw: TChatHistoryItem[] = (chatHistoryResponse?.data ||
    []) as TChatHistoryItem[];
  const chatHistoryData = [...chatHistoryDataRaw].sort(
    (a: TChatHistoryItem, b: TChatHistoryItem) => {
      const getTs = (x: TChatHistoryItem) => new Date(x.updatedAt).getTime();
      return getTs(b) - getTs(a);
    }
  );

  return (
    <motion.div
      className="flex h-full flex-col justify-between space-y-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-0">
        {chatHistoryData.length > 0 ? (
          chatHistoryData.map((chat: TChatHistoryItem, index: number) => {
            // Handle different possible ID field names
            const chatId = chat._id;

            console.log("Processing chat item:", chat, "Extracted ID:", chatId);

            const rawTs = chat.updatedAt;
            const prettyDay = formatDayOrDate(rawTs) || "";
            const prettyTime = formatChatTime(rawTs) || "";

            const safeTitle = (chat.title || "Untitled Chat").toString();

            return (
              <motion.div
                key={chatId || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <ChatHistory
                  id={chatId || String(index)}
                  title={safeTitle}
                  timestamp={prettyTime}
                  day={prettyDay}
                  onClick={(id: string) => handleChatClick(id, safeTitle)}
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
            <div className="text-muted-foreground">No chat history found</div>
          </motion.div>
        )}
      </div>

      {/* New Chat Button - show when there's no history or less than 5 chats */}
      <div>
        {chatHistoryData.length < 5 && (
          <motion.div
            className="mt-auto flex items-center justify-center p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.button
              onClick={handleNewChat}
              disabled={!user_id}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="flex items-center gap-2">
                New Chat
                <MessageCircleQuestionMark className="h-4 w-4" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
