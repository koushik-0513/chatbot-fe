import { useCallback, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { ArrowDown, ArrowLeft, Paperclip, Send, Smile } from "lucide-react";

import { LAYOUT } from "@/constants/styles";
import { DEFAULT_TITLES } from "@/constants/titles";

import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

import { cn } from "@/lib/utils";

import { useGetConversationById, useSendMessage } from "@/hooks/api/chat";
import { useUploadFile } from "@/hooks/api/file";
import { useUserId } from "@/hooks/custom/use-user-id";

import { TChatMessage, TStatus } from "@/types/chat-types";

import { EmojiPicker } from "./emoji-picker";

type TChatContainerProps = {
  chatId: string | null;
  chatTitle: string;
  onBack: () => void;
};

type UploadItem = {
  id: string;
  name: string;
  status: TStatus;
  error?: string;
};
export const Messages = ({
  chatId,
  chatTitle,
  onBack,
}: TChatContainerProps) => {
  const { userId } = useUserId();

  // State - initialize before hooks
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const { data: chatHistoryResponse, isLoading } = useGetConversationById(
    { conversationId: currentChatId || "" },
    { enabled: !!currentChatId }
  );
  const queryClient = useQueryClient();
  const sendMessageMutation = useSendMessage();
  const uploadFileMutation = useUploadFile();

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
          incomingMessage.updated_at !== currentMessage.updated_at
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
  }, [streamingContent]);

  // Ensure chat scrolls to bottom when first loaded
  useEffect(() => {
    if (chatHistoryResponse && !isLoading) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToBottom(false);
      }, 100);
    }
  }, [chatHistoryResponse, isLoading]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || isStreaming) return;

    const messageText = newMessage.trim();
    const userMessageId = new ObjectId().toHexString();
    const aiMessageId = new ObjectId().toHexString();

    // Generate conversation ID if this is a new chat
    let conversationId = currentChatId;
    if (!conversationId) {
      conversationId = new ObjectId().toHexString();
      setCurrentChatId(conversationId);
    }

    // Create and add user message
    const userMessage: TChatMessage = {
      _id: userMessageId,
      message: messageText,
      sender: "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update UI optimistically
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsStreaming(true);
    setStreamingContent("");

    // Scroll to show user message
    setTimeout(() => scrollToBottom(), 50);

    // Send message and handle streaming
    const response = await sendMessageMutation.mutateAsync({
      conversationId: conversationId,
      message: messageText,
      userId: userId,
      messageId: userMessageId,
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    let accumulatedContent = "";

    // Process streaming response
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        const jsonPart = line.slice(6);
        if (jsonPart === "[DONE]") break;

        const data = JSON.parse(jsonPart);
        const delta = data.delta || data.content || data.token || "";

        if (typeof delta === "string" && delta) {
          accumulatedContent += delta;
          setStreamingContent(accumulatedContent);
        }
      }
    }

    // Create AI message from streamed content
    const aiMessage: TChatMessage = {
      _id: aiMessageId,
      message: accumulatedContent,
      sender: "assistant",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add AI message and clean up
    setMessages((prev) => [...prev, aiMessage]);
    setStreamingContent("");
    setIsStreaming(false);

    // Update sidebar
    queryClient.invalidateQueries({
      queryKey: ["useGetConversationList", { user_id: userId }],
    });

    // Scroll to show final AI message
    setTimeout(() => scrollToBottom(), 50);
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
    if (!files || !userId) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const id = new ObjectId().toHexString();
      const newItem: UploadItem = {
        id,
        name: file.name,
        status: "processing",
      };
      setUploads((prev) => [...prev, newItem]);

      // Upload file
      const response = await uploadFileMutation.mutateAsync({
        file,
        userId: userId,
      });

      // Update upload status
      setUploads((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status: response ? "processed" : "failed",
                error: response ? undefined : "Upload failed",
              }
            : u
        )
      );

      // Remove upload item after 2 seconds
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.id !== id));
      }, 2000);
    }

    event.currentTarget.value = "";
  };

  return (
    <div className="flex h-[calc(100vh)] w-full flex-1 flex-col">
      {/* Header */}
      <div className="border-border bg-background sticky top-0 z-10 flex items-center gap-3 border-b p-3">
        <button
          onClick={onBack}
          className="hover:bg-muted rounded-lg p-1.5 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-semibold">
          {chatTitle || chatHistoryResponse?.data?.title || DEFAULT_TITLES.CHAT}
        </h2>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3"
        onScroll={handleScroll}
      >
        {messages.length === 0 && !isStreaming ? (
          <div className="flex items-center justify-center text-center">
            <div>
              <p className="mb-2 text-lg font-medium">Welcome!</p>
              <p className="text-muted-foreground">
                Start a new conversation to get help with your questions.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-full flex-col justify-end pb-3">
            <div className="space-y-4">
              {messages.map((message) => {
                const isUser = message.sender === "user";
                return (
                  <div
                    key={message._id}
                    className={cn(
                      `flex ${isUser ? "justify-end" : "justify-start"}`
                    )}
                  >
                    <div
                      className={cn(
                        `max-w-[70%] rounded-lg px-4 py-2 ${
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`
                      )}
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
                  <div className={`bg-muted max-w-[70%] rounded-lg px-4 py-2`}>
                    {streamingContent ? (
                      <>
                        <MarkdownRenderer
                          content={streamingContent}
                          className={LAYOUT.PROSE_SIZE}
                        />
                        <span className="bg-primary ml-1 inline-block h-4 w-0.5 animate-pulse" />
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-sm">
                            AI is thinking
                          </span>
                        </div>
                        <div className="relative">
                          <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} className="h-0 shrink-0" />
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
      <div className="border-border bg-background sticky bottom-0 z-10 border-t p-4">
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
                    {u.status === "processing" && "Uploading..."}
                    {u.status === "processed" && "Upload successful"}
                    {u.status === "failed" && "Upload failed"}
                  </span>
                </div>
                {u.status === "failed" && u.error && (
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
          <label
            className={cn(
              `hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors ${!userId || isStreaming ? "cursor-not-allowed opacity-50" : ""}`
            )}
          >
            <Paperclip className="h-5 w-5" />
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              disabled={!userId || isStreaming}
              className="hidden"
            />
          </label>

          {/* Message input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isStreaming}
            className="border-input bg-background focus:ring-ring flex-1 rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
          />

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !userId || isStreaming}
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
