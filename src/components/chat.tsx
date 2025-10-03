import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";

// ✅ correct icon

import { useGetConversationList } from "@/hooks/api/chat";
import { useUserId } from "@/hooks/custom/use-user-id";

import { TApiError } from "@/types/api";
import { TConversationItem } from "@/types/chat-types";

import { Conversation } from "./sub-components/chat-related/conversations";

type TMessageProps = {
  showChatHistory: boolean;
  onChatSelected: (chatId: string | null) => void;
  onBackToHistory: () => void;
  onResetSelectedChat?: () => void;
  setShowActiveChat: (show: boolean) => void;
  title: (title: string) => void;
};

export const Chat = ({
  onChatSelected,
  setShowActiveChat,
  title,
}: TMessageProps) => {
  const { userId } = useUserId();

  const {
    data: chatHistoryResponse,
    isLoading,
    isError, // ✅ destructure this
    error,
  } = useGetConversationList(
    { user_id: userId || "", page: 1, limit: 5 },
    { enabled: !!userId }
  );

  const handleChatClick = (chatId: string, chatTitle: string) => {
    onChatSelected(chatId);
    setShowActiveChat(true);
    title(chatTitle || "Untitled Chat");
  };

  const handleNewChat = async () => {
    if (!userId) {
      console.error(error);
      return;
    }
    onChatSelected(null);
    setShowActiveChat(true);
    title("New Chat");
  };

  // Treat 404 as empty state
  const isNotFound = (error as TApiError)?.status_code === 404;

  // Data (404 => empty)
  const chatHistoryDataRaw: TConversationItem[] = isNotFound
    ? []
    : chatHistoryResponse?.data || [];
  const chatHistoryData = [...chatHistoryDataRaw].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <motion.div
      className="flex h-full min-h-0 w-full flex-col space-y-3 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        <div className="min-h-0 w-full flex-1 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            // ✅ loading
            <motion.div
              key="loading"
              className="flex h-full flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-muted-foreground">
                Loading chat history...
              </div>
            </motion.div>
          ) : isError && !isNotFound ? (
            // ✅ defensive: should be caught above, but safe to keep
            <motion.div
              key="error"
              className="flex h-full flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-muted-foreground">
                Error loading chat history...
              </div>
            </motion.div>
          ) : chatHistoryData.length === 0 ? (
            // ✅ empty
            <motion.div
              key="no-chats"
              className="flex h-full flex-col items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-muted-foreground">No chat history found</div>
            </motion.div>
          ) : (
            // ✅ list
            chatHistoryData.map((chat, index) => {
              const chatId = chat._id;
              const safeTitle = (chat.title || "Untitled Chat").toString();
              return (
                <motion.div
                  key={chatId || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Conversation
                    id={chatId || String(index)}
                    title={safeTitle}
                    onClick={(id: string) => handleChatClick(id, safeTitle)}
                  />
                </motion.div>
              );
            })
          )}
        </div>
      </AnimatePresence>

      {/* New Chat Button */}
      <div className="flex-shrink-0">
        <AnimatePresence>
          {chatHistoryData.length < 5 && (
            <motion.div
              key="new-chat-button"
              className="flex items-center justify-center p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.button
                onClick={handleNewChat}
                disabled={!userId}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="flex items-center gap-2">
                  New Chat
                  <MessageCircleQuestion className="h-4 w-4" />
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
