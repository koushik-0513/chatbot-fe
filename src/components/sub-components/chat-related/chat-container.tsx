import { useEffect, useRef, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  X,
} from "lucide-react";

import {
  useChatHistoryById,
  useSendMessage,
} from "../../../hooks/api/chat-service";
import { useUserId } from "../../../hooks/use-user-id";
import { TChatMessage } from "../../../types/types";
import { EmojiPicker } from "./emoji-picker";

type TChatContainerProps = {
  chatId: number;
  chatTitle: string;
  onBack: () => void;
};

export const ChatContainer = ({
  chatId,
  chatTitle,
  onBack,
}: TChatContainerProps) => {
  console.log(
    "ChatContainer rendered with chatId:",
    chatId,
    "chatTitle:",
    chatTitle
  );

  const { user_id } = useUserId();
  const {
    data: chatHistoryResponse,
    isLoading,
    error,
  } = useChatHistoryById(chatId);
  const sendMessageMutation = useSendMessage();
  const { resetAllScroll, resetAllScrollWithDelay } = useScrollContext();
  const messagesRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Reset scroll when component mounts or chatId changes
  useEffect(() => {
    resetAllScrollWithDelay(100);
    if (messagesRef.current) {
      messagesRef.current.scrollTop = 0;
    }
  }, [chatId, resetAllScrollWithDelay]);

  // Get messages from API or use empty array as fallback
  const messages = chatHistoryResponse?.data || [];

  const handleSendMessage = async () => {
    if (newMessage.trim() && user_id) {
      try {
        await sendMessageMutation.mutateAsync({
          conversationId: chatId,
          message: newMessage,
          user_id,
        });
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleBack = () => {
    // Reset scroll before going back
    resetAllScrollWithDelay(100);
    onBack();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
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
        <div className="text-muted-foreground">Loading chat...</div>
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
        <div className="text-destructive">Failed to load chat</div>
        <div className="text-muted-foreground mt-2 text-sm">
          {error.message}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex h-full flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Chat Header */}
      <motion.div
        className="border-border bg-background flex items-center justify-between border-b p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleBack}
            className="hover:bg-muted rounded-full p-1 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="text-muted-foreground h-5 w-5" />
          </motion.button>
          <motion.div
            className="bg-primary flex h-8 w-8 items-center justify-center rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
          >
            <div className="bg-primary-foreground h-4 w-4 rounded-full"></div>
          </motion.div>
          <motion.span
            className="text-foreground font-bold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {chatTitle}
          </motion.span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            className="hover:bg-muted rounded-full p-1 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="text-muted-foreground h-5 w-5" />
          </motion.button>
          <motion.button
            className="hover:bg-muted rounded-full p-1 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="text-muted-foreground h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <motion.div
        ref={messagesRef}
        className="flex-1 space-y-3 overflow-y-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              layout
            >
              <motion.div
                className={`max-w-xs rounded-lg p-3 ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border-border border"
                }`}
                initial={{
                  opacity: 0,
                  x: message.isUser ? 20 : -20,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.02 }}
                layout
              >
                <motion.p
                  className="text-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.1 }}
                >
                  {message.text}
                </motion.p>
                <motion.p
                  className={`mt-1 text-xs ${
                    message.isUser
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.1 }}
                >
                  {message.timestamp}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Message Input */}
      <motion.div
        className="border-border bg-background relative border-t p-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {/* Selected files display */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              className="mb-2 flex flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-muted-foreground">{file.name}</span>
                  <motion.button
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="text-muted-foreground hover:text-foreground"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="hover:bg-muted rounded-full p-2 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Smile className="text-muted-foreground h-4 w-4" />
            </motion.button>
            <motion.label
              className="hover:bg-muted cursor-pointer rounded-full p-2 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Paperclip className="text-muted-foreground h-4 w-4" />
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.label>
            <motion.button
              className="hover:bg-muted rounded-full p-2 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mic className="text-muted-foreground h-4 w-4" />
            </motion.button>
          </div>
          <motion.input
            type="text"
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-input bg-background text-foreground focus:ring-ring flex-1 rounded-full border p-3 text-sm focus:ring-2 focus:outline-none"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={
              sendMessageMutation.isPending || !newMessage.trim() || !user_id
            }
            className="bg-secondary hover:bg-muted/80 rounded-full p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            whileHover={{ scale: sendMessageMutation.isPending ? 1 : 1.1 }}
            whileTap={{ scale: sendMessageMutation.isPending ? 1 : 0.9 }}
          >
            <Send className="text-secondary-foreground h-4 w-4" />
          </motion.button>
        </div>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
