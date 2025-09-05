import { AnimatePresence, motion } from "framer-motion";

import { chatHistoryData } from "../data/data";
import { ChatHistory } from "./sub-components/chat-related/chat-history";

interface TMessageProps {
  showChatHistory: boolean;
  onChatSelected: (chatId: number) => void;
  onBackToHistory: () => void;
  onResetSelectedChat?: () => void;
}

export const Message = ({
  showChatHistory,
  onChatSelected,
  onBackToHistory,
  onResetSelectedChat,
}: TMessageProps) => {
  const handleChatClick = (chatId: number) => {
    onChatSelected(chatId); // Notify parent that chat was selected with chatId
  };

  // Show chat history (either when showChatHistory is true or when no chat is selected)
  return (
    <motion.div
      className="flex h-full flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          className="mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Chat History
          </h3>
          <p className="text-muted-foreground text-sm">
            Select a conversation to continue
          </p>
        </motion.div>

        <motion.div
          className="space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {chatHistoryData.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <ChatHistory
                id={chat.id}
                title={chat.title}
                timestamp={chat.timestamp}
                day={chat.day}
                onClick={handleChatClick}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* New Chat Button */}
      <motion.div
        className="mt-auto p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.button
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-3 font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          New Chat
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
