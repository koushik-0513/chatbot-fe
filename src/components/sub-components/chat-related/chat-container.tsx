import { useEffect, useRef, useState, useMemo } from "react";
import { useScrollContext } from "@/contexts/scroll-context";
import { TChatMessage } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { ArrowDown, ArrowLeft, Paperclip, Send, Smile, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  file: File;
  name: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
};

type StreamingMessage = {
  id: string;
  content: string;
  isComplete: boolean;
};

export const ChatContainer = ({
  chatId,
  chatTitle,
  onBack,
  onClose,
}: TChatContainerProps) => {
  const { user_id } = useUserId();
  const {
    data: chatHistoryResponse,
    isLoading,
    error,
  } = useGetConversationById(chatId);
  const { resetAllScrollWithDelay } = useScrollContext();
  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const sendMessageMutation = useSendMessage();

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage | null>(null);
  const [displayMessages, setDisplayMessages] = useState<TChatMessage[]>([]);

  // Memoize messages to prevent infinite re-renders
  const messages: TChatMessage[] = useMemo(() => {
    return chatHistoryResponse?.data?.messages || [];
  }, [chatHistoryResponse?.data?.messages]);

  const conversationTitle = chatHistoryResponse?.data?.title;

  // Simple title logic
  const displayTitle = chatTitle || conversationTitle || (messages.length > 0 ? "Untitled Chat" : "");

  // Update display messages when messages actually change
  useEffect(() => {
    setDisplayMessages(messages);
  }, [messages]);

  const scrollToBottom = (smooth: boolean = true) => {
    const el = bottomRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    setIsAtBottom(true);
  };

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    scrollToBottom(false);
  }, [chatHistoryResponse]);

  // Auto-scroll during streaming ONLY if user was already at bottom
  useEffect(() => {
    if (streamingMessage?.content && isAtBottom) {
      requestAnimationFrame(() => scrollToBottom(true));
    }
  }, [streamingMessage?.content, isAtBottom]);

  // Reset scroll when chatId changes
  useEffect(() => {
    resetAllScrollWithDelay(100);
  }, [chatId, resetAllScrollWithDelay]);

  const handleScrollPosition = () => {
    const el = messagesRef.current;
    if (!el) return;
    const threshold = 50;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    setIsAtBottom(atBottom);
  };

  // Memoize scroll position check to avoid disrupting streaming
  const checkAndMaintainScroll = () => {
    const messagesEl = messagesRef.current;
    return messagesEl ? 
      messagesEl.scrollTop + messagesEl.clientHeight >= messagesEl.scrollHeight - 20 
      : true;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user_id) return;

    const messageText = newMessage;
    const userMessageId = new ObjectId().toHexString();
    const aiMessageId = new ObjectId().toHexString();
    
    // Create user message
    const userMessage: TChatMessage = {
      _id: userMessageId,
      message: messageText,
      sender: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add user message to display immediately
    setDisplayMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Initialize streaming AI response
    setStreamingMessage({
      id: aiMessageId,
      content: "",
      isComplete: false,
    });

    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId: chatId,
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
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            
            try {
              const jsonPart = trimmed.slice(6); // Remove "data: "
              if (jsonPart === '[DONE]') continue;
              
              const data = JSON.parse(jsonPart);
              const delta = data.delta || data.content || data.token || '';
              
              if (typeof delta === 'string' && delta) {
                accumulatedContent += delta;
                
                // Update streaming message with accumulated content
                setStreamingMessage(prev => prev ? {
                  ...prev,
                  content: accumulatedContent
                } : null);
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', e);
            }
          }
        }

        // Complete the streaming message
        setStreamingMessage(prev => prev ? { ...prev, isComplete: true } : null);
        
        // Clear streaming and refresh data while preserving scroll position
        setTimeout(() => {
          // Check if user was at bottom before clearing streaming
          const wasAtBottom = checkAndMaintainScroll();
          
          setStreamingMessage(null);
          
          // Refresh data
          queryClient.invalidateQueries({ queryKey: ["conversation", chatId] });
          queryClient.invalidateQueries({ queryKey: ["chatHistory", user_id] });
          
          // Restore scroll position after data loads if user was at bottom
          if (wasAtBottom) {
            setTimeout(() => scrollToBottom(false), 50);
          }
        }, 200);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Clear streaming state on error
      setStreamingMessage(null);
    }
  };

  const handleBack = () => {
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user_id) return;

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      const id = new ObjectId().toHexString();
      const newItem: UploadItem = {
        id,
        file,
        name: file.name,
        progress: 0,
        status: "uploading",
      };
      setUploads((prev) => [...prev, newItem]);

      uploadFile({
        file,
        userId: user_id,
        onProgress: (p) =>
          setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress: p } : u))
          ),
      })
        .then((res) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === id
                ? { ...u, progress: 100, status: res.ok ? "success" : "error" }
                : u
            )
          );
          setTimeout(() => {
            setUploads((prev) => prev.filter((u) => u.id !== id));
          }, 1500);
        })
        .catch(() => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === id ? { ...u, status: "error", error: "Upload failed" } : u
            )
          );
        });
    });

    event.currentTarget.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-destructive">Failed to load chat</div>
        <div className="text-muted-foreground mt-2 text-sm">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Chat Header */}
      <div className="border-border bg-background flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="hover:bg-muted rounded-full p-1 transition-colors"
          >
            <ArrowLeft className="text-muted-foreground h-5 w-5" />
          </button>
          <span className="text-foreground text-sm font-bold">
            {displayTitle}
          </span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-muted rounded-full p-1 transition-colors"
          title="Close chat"
        >
          <X className="text-muted-foreground h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesRef}
        className="flex-1 space-y-1 overflow-y-auto p-2"
        onScroll={handleScrollPosition}
      >
        {displayMessages.length === 0 && !streamingMessage ? (
          <div className="flex justify-start">
            <div className="bg-card text-card-foreground border-border max-w-xs rounded-lg border p-1.5">
              <p className="text-foreground text-sm">
                👋 Hello! How can I help you today?
              </p>
            </div>
          </div>
        ) : (
          <>
            {displayMessages.map((message) => {
              const isUser = message.sender === "user";
              return (
                <div
                  key={message._id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`mb-2 max-w-xs rounded-lg p-2 ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground border-border border"
                    }`}
                  >
                    <MarkdownRenderer
                      content={message.message}
                      className={`${
                        isUser ? "text-primary-foreground" : "text-foreground"
                      } prose-p:text-xs prose-p:mb-0.5 prose-headings:text-xs prose-headings:font-normal prose-code:text-xs`}
                      invert={isUser}
                    />
                  </div>
                </div>
              );
            })}
            
            {/* Streaming AI Message */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-card text-card-foreground border-border mb-2 max-w-xs rounded-lg border p-2">
                  {streamingMessage.content ? (
                    <MarkdownRenderer
                      content={streamingMessage.content}
                      className="text-foreground prose-p:text-xs prose-p:mb-0.5 prose-headings:text-xs prose-headings:font-normal prose-code:text-xs"
                    />
                  ) : (
                    <div className="flex items-center gap-1 py-1">
                      <span className="sr-only">Assistant is typing</span>
                      <span className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.2s]"></span>
                      <span className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.1s]"></span>
                      <span className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full"></span>
                    </div>
                  )}
                  {!streamingMessage.isComplete && streamingMessage.content && (
                    <span className="animate-pulse">▎</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <button
          onClick={() => scrollToBottom(true)}
          className="bg-primary text-primary-foreground fixed right-10 bottom-40 rounded-full px-2 py-2 shadow hover:opacity-90"
          title="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}

      {/* Message Input */}
      <div className="border-border bg-background relative border-t p-2">
        {uploads.length > 0 && (
          <div className="mb-2 flex flex-col gap-2">
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
                    {u.status === "uploading" && `${u.progress}%`}
                    {u.status === "success" && "Uploaded"}
                    {u.status === "error" && "Failed"}
                  </span>
                </div>
                <div className="bg-muted mt-2 h-2 w-full rounded">
                  <div
                    className={`h-2 rounded ${
                      u.status === "error" ? "bg-destructive" : "bg-primary"
                    }`}
                    style={{
                      width: `${u.status === "error" ? 100 : u.progress}%`,
                    }}
                  />
                </div>
                {u.status === "error" && u.error && (
                  <div className="text-destructive mt-1 text-xs">{u.error}</div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="hover:bg-muted rounded-full p-1.5 transition-colors"
            >
              <Smile className="text-muted-foreground h-3.5 w-3.5" />
            </button>
            <label className="hover:bg-muted cursor-pointer rounded-full p-1.5 transition-colors">
              <Paperclip className="text-muted-foreground h-3.5 w-3.5" />
              <Input
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={!user_id}
                className="hidden"
              />
            </label>
          </div>
          <input
            type="text"
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="border-input bg-background text-foreground focus:ring-ring flex-1 rounded-full border p-2 text-sm focus:ring-2 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !user_id}
            className="bg-secondary hover:bg-muted/80 rounded-full p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="text-secondary-foreground h-3.5 w-3.5" />
          </button>
        </div>

        {showEmojiPicker && (
          <div>
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