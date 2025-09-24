import { useCallback, useEffect, useRef, useState } from "react";

import {
  ANIMATION_DELAYS,
  DEFAULT_TITLES,
  LAYOUT,
  UI_MESSAGES,
} from "@/constants/constants";
import {
  TChatMessage,
  TChatMessageSender,
  TUploadStatus,
} from "@/types/component-types/chat-types";
import { useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { ArrowDown, ArrowLeft, Paperclip, Send, Smile, X } from "lucide-react";

import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

import {
  useGetConversationById,
  useSendMessage,
} from "@/hooks/api/chat-service";
import { uploadFile } from "@/hooks/api/file-service";

import { useUserId } from "../../../hooks/use-user-id";
import { EmojiPicker } from "./emoji-picker";

type TChatContainerProps = {
  chatId: string | null;
  chatTitle: string;
  onBack: () => void;
  onClose?: () => void;
};

type UploadItem = {
  id: string;
  name: string;
  status: TUploadStatus;
  error?: string;
};
export const ChatContainer = ({
  chatId,
  chatTitle,
  onBack,
  onClose,
}: TChatContainerProps) => {
  const { user_id } = useUserId();

  // State - initialize before hooks
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const {
    data: chatHistoryResponse,
    isLoading,
    error,
  } = useGetConversationById(
    { conversationId: currentChatId || "" },
    { enabled: !!currentChatId }
  );
  const queryClient = useQueryClient();
  const sendMessageMutation = useSendMessage();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);

  const previousChatIdRef = useRef<string | null>(null);
  const lastSyncedMessageIdRef = useRef<string | null>(null);

  // Update currentChatId when chatId prop changes
  useEffect(() => {
    setCurrentChatId(chatId);
  }, [chatId]);

  const areMessagesEqual = useCallback(
    (incoming: TChatMessage[], current: TChatMessage[]) => {
      if (incoming.length !== current.length) return false;
      for (let index = 0; index < incoming.length; index += 1) {
        const incomingMessage = incoming[index];
        const currentMessage = current[index];
        if (
          incomingMessage._id !== currentMessage._id ||
          incomingMessage.updatedAt !== currentMessage.updatedAt
        ) {
          return false;
        }
      }
      return true;
    },
    []
  );

  // Smooth scroll to bottom function
  const scrollToBottom = useCallback((smooth = true) => {
    if (!messagesEndRef.current) return;

    isAutoScrollingRef.current = true;
    messagesEndRef.current.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "end",
    });

    // Reset auto-scrolling flag after animation
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 500);
  }, []);

  // Check if user is near bottom of chat
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Initialize or sync messages from API response without disrupting manual scroll
  useEffect(() => {
    const fetchedMessages = chatHistoryResponse?.data?.messages ?? [];
    const isNewChat = previousChatIdRef.current !== currentChatId;

    setMessages((currentMessages) => {
      if (!isNewChat && areMessagesEqual(fetchedMessages, currentMessages)) {
        return currentMessages;
      }
      return fetchedMessages;
    });

    const latestFetchedMessageId =
      fetchedMessages.length > 0
        ? fetchedMessages[fetchedMessages.length - 1]._id
        : null;
    const hasNewMessages =
      !!latestFetchedMessageId &&
      latestFetchedMessageId !== lastSyncedMessageIdRef.current;

    // Always scroll to bottom when opening a new chat or when there are new messages
    if (isNewChat || hasNewMessages) {
      // For new chats use an instant jump to avoid visible flicker
      // For existing chats with new messages, scroll smoothly if user was near bottom
      const shouldScrollSmoothly = !isNewChat && isNearBottom();
      scrollToBottom(!shouldScrollSmoothly);
    }

    lastSyncedMessageIdRef.current = latestFetchedMessageId;
    previousChatIdRef.current = currentChatId;
  }, [
    currentChatId,
    chatHistoryResponse?.data?.messages,
    areMessagesEqual,
    isNearBottom,
    scrollToBottom,
  ]);

  // Handle scroll to show/hide scroll button
  const handleScroll = useCallback(() => {
    // Don't update during auto-scrolling to prevent button flicker
    if (isAutoScrollingRef.current) return;

    const nearBottom = isNearBottom();
    setShowScrollButton(!nearBottom);
  }, [isNearBottom]);

  // Auto-scroll during streaming if user is near bottom
  useEffect(() => {
    if (streamingContent && isNearBottom()) {
      scrollToBottom();
    }
  }, [streamingContent, isNearBottom, scrollToBottom]);

  // Ensure chat scrolls to bottom when first loaded
  useEffect(() => {
    if (chatHistoryResponse && !isLoading) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToBottom(false);
      }, 100);
    }
  }, [chatHistoryResponse, isLoading, scrollToBottom]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user_id || isStreaming) return;

    const messageText = newMessage.trim();
    const userMessageId = new ObjectId().toHexString();
    const aiMessageId = new ObjectId().toHexString();

    // Generate conversation ID if this is a new chat (no currentChatId)
    let conversationId = currentChatId;
    if (!conversationId) {
      conversationId = new ObjectId().toHexString();
      setCurrentChatId(conversationId);
    }

    // Create and add user message
    const userMessage: TChatMessage = {
      _id: userMessageId,
      message: messageText,
      sender: TChatMessageSender.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update UI optimistically
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsStreaming(true);
    setStreamingContent("");

    // Scroll to show new user message
    setTimeout(() => scrollToBottom(), 50);

    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId: conversationId,
        message: messageText,
        userId: user_id,
        messageId: userMessageId,
      });

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedContent = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim() || !line.startsWith("data: ")) continue;

            try {
              const jsonPart = line.slice(6);
              if (jsonPart === "[DONE]") break;

              const data = JSON.parse(jsonPart);
              const delta = data.delta || data.content || data.token || "";

              if (typeof delta === "string" && delta) {
                accumulatedContent += delta;
                setStreamingContent(accumulatedContent);
              }
            } catch (e) {
              console.warn("SSE parse error:", e);
            }
          }
        }

        // Create AI message from streamed content
        const aiMessage: TChatMessage = {
          _id: aiMessageId,
          message: accumulatedContent,
          sender: TChatMessageSender.ASSISTANT,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Add AI message to messages
        setMessages((prev) => [...prev, aiMessage]);

        // Clean up streaming state
        setStreamingContent("");
        setIsStreaming(false);

        // Update sidebar only (not current conversation to avoid re-render)
        queryClient.invalidateQueries({
          queryKey: ["useGetChatHistory", { user_id }],
        });

        // Final scroll to bottom
        setTimeout(() => scrollToBottom(), 50);
      }
    } catch (error) {
      console.error("Send message error:", error);
      setStreamingContent("");
      setIsStreaming(false);

      // Optionally show error message
      // You could add a toast notification here
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle file selection
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || !user_id) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const id = new ObjectId().toHexString();
      const newItem: UploadItem = {
        id,
        name: file.name,
        status: TUploadStatus.UPLOADING,
      };
      setUploads((prev) => [...prev, newItem]);

      try {
        const formData = new FormData();
        formData.append("file", file, file.name);

        // use the service file
        const response = await uploadFile({
          file,
          userId: user_id,
        });

        if (response.success) {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === id ? { ...u, status: TUploadStatus.SUCCESS } : u
            )
          );
        } else {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === id
                ? { ...u, status: TUploadStatus.ERROR, error: "Upload failed" }
                : u
            )
          );
        }
      } catch {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, status: TUploadStatus.ERROR, error: "Upload failed" }
              : u
          )
        );
      }

      // Remove upload item after 2 seconds
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.id !== id));
      }, 2000);
    }

    event.currentTarget.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">{UI_MESSAGES.LOADING.CHAT}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-destructive">
          {UI_MESSAGES.ERROR.CHAT_LOAD_FAILED}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border bg-background flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
            aria-label={UI_MESSAGES.ARIA_LABELS.GO_BACK}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-semibold">
            {chatTitle ||
              chatHistoryResponse?.data?.title ||
              DEFAULT_TITLES.CHAT}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
            aria-label={UI_MESSAGES.ARIA_LABELS.CLOSE_CHAT}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3"
        onScroll={handleScroll}
      >
        {/* Welcome message if no messages */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium">
                {UI_MESSAGES.WELCOME.CHAT}
              </p>
              <p className="text-muted-foreground">
                {UI_MESSAGES.WELCOME.SUBTITLE}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.sender === "user";
            return (
              <div
                key={message._id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <MarkdownRenderer
                    content={message.message}
                    className={LAYOUT.PROSE_SIZE}
                  />
                </div>
              </div>
            );
          })}

          {/* Streaming Message */}
          {isStreaming && (
            <div className="flex justify-start">
              <div
                className={`bg-muted ${LAYOUT.MESSAGE_MAX_WIDTH} rounded-lg px-4 py-2`}
              >
                {streamingContent ? (
                  <>
                    <MarkdownRenderer
                      content={streamingContent}
                      className={LAYOUT.PROSE_SIZE}
                    />
                    <span className="bg-foreground ml-1 inline-block h-4 w-2 animate-pulse" />
                  </>
                ) : (
                  <div className="flex items-center gap-1">
                    <span
                      className={`bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:${ANIMATION_DELAYS.DOT_1}]`}
                    />
                    <span
                      className={`bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:${ANIMATION_DELAYS.DOT_2}]`}
                    />
                    <span
                      className={`bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:${ANIMATION_DELAYS.DOT_3}]`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="bg-primary text-primary-foreground absolute right-4 bottom-20 rounded-full p-2 shadow-lg transition-opacity hover:opacity-90"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}

      {/* Input Area */}
      <div className="border-border bg-background border-t p-4">
        {/* File uploads display */}
        {uploads.length > 0 && (
          <div className="mb-3 flex flex-col gap-2">
            {uploads.map((u) => (
              <div
                key={u.id}
                className="border-border bg-card text-card-foreground rounded-md border p-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate pr-2" title={u.name}>
                    {u.name}
                  </span>
                  <span className="text-muted-foreground">
                    {u.status === "uploading" &&
                      UI_MESSAGES.STATUS.UPLOAD_UPLOADING}
                    {u.status === "success" &&
                      UI_MESSAGES.STATUS.UPLOAD_SUCCESS}
                    {u.status === "error" && UI_MESSAGES.STATUS.UPLOAD_ERROR}
                  </span>
                </div>
                {u.status === "error" && u.error && (
                  <div className="text-destructive mt-1 text-xs">{u.error}</div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Emoji picker button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="hover:bg-muted rounded-lg p-2 transition-colors"
            disabled={isStreaming}
          >
            <Smile className="h-5 w-5" />
          </button>

          {/* File upload button */}
          <label className="hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
            <Paperclip className="h-5 w-5" />
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              disabled={!user_id || isStreaming}
              className="hidden"
            />
          </label>

          {/* Message input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={UI_MESSAGES.PLACEHOLDERS.MESSAGE_INPUT}
            disabled={isStreaming}
            className="border-input bg-background focus:ring-ring flex-1 rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
          />

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !user_id || isStreaming}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-50">
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
