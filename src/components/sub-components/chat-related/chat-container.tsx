import { useEffect, useRef, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { ArrowDown, ArrowLeft, Paperclip, Send, Smile, X } from "lucide-react";

import { Input } from "@/components/ui/input";

import { getConversationById, sendMessage } from "@/hooks/api/chat-service";

import { useUserId } from "../../../hooks/use-user-id";
import { TChatMessage } from "../../../types/types";
import { EmojiPicker } from "./emoji-picker";

type TChatContainerProps = {
  chatId: string | null;
  chatTitle: string;
  onBack: () => void;
  onClose?: () => void;
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
  } = useQuery({
    queryKey: ["conversation", chatId],
    queryFn: () => getConversationById(chatId),
    enabled: true,
  });
  const { resetAllScroll, resetAllScrollWithDelay } = useScrollContext();
  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Reset scroll when component mounts or chatId changes
  useEffect(() => {
    resetAllScrollWithDelay(100);
  }, [chatId, resetAllScrollWithDelay]);

  // Get messages from API or use empty array as fallback and normalize
  const conversationData: any = chatHistoryResponse?.data;
  const rawMessages: any[] = Array.isArray(conversationData)
    ? conversationData
    : conversationData?.messages || [];
  const normalizedMessages = rawMessages.map((m: any, index: number) => {
    const id = m._id || m.id || `${index}`;
    const text = m.text || m.content || m.message || "";
    const role = m.role || m.sender || (m.isUser ? "user" : "assistant");
    const isUser =
      role === "user" || m.is_user === true || m.isUser === true || false;
    const timestamp =
      m.timestamp ||
      m.created_at ||
      m.createdAt ||
      conversationData?.updatedAt ||
      "";
    return { id, text, isUser, timestamp };
  });

  const [displayMessages, setDisplayMessages] = useState(normalizedMessages);

  const smoothScrollToBottom = () => {
    const bottomEl = bottomRef.current;
    if (!bottomEl) return;
    bottomEl.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // Auto-scroll to bottom when messages update (if near bottom)
  useEffect(() => {
    if (isAtBottom) {
      requestAnimationFrame(() => smoothScrollToBottom());
    }
  }, [displayMessages, isAtBottom]);

  // Auto-scroll to bottom on initial load/open of a conversation
  useEffect(() => {
    requestAnimationFrame(() => {
      smoothScrollToBottom();
      setIsAtBottom(true);
    });
  }, [chatHistoryResponse]);

  const handleScrollPosition = () => {
    const el = messagesRef.current;
    if (!el) return;
    const threshold = 50;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = (smooth: boolean) => {
    const el = bottomRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    setIsAtBottom(true);
  };

  // Sync local messages when server messages change (e.g., on refetch)
  useEffect(() => {
    setDisplayMessages(normalizedMessages);
  }, [chatHistoryResponse]);

  const pendingUpdateTimer = useRef<number | null>(null);
  const latestAssistantTextRef = useRef<string>("");

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user_id) return;

    const userMsgId = new ObjectId().toHexString();
    const assistantMsgId = new ObjectId().toHexString();

    // Optimistically append user's message
    const optimisticUser = {
      id: userMsgId,
      text: newMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    // Seed assistant placeholder
    const optimisticAssistant = {
      id: assistantMsgId,
      text: "",
      isUser: false,
      timestamp: new Date().toISOString(),
    };

    // Force stick-to-bottom when sending
    setIsAtBottom(true);

    // Local UI state: append to end of normalized messages
    setDisplayMessages((prev) => [
      ...prev,
      optimisticUser,
      optimisticAssistant,
    ]);

    try {
      const response = await sendMessage(
        chatId,
        newMessage,
        user_id,
        userMsgId
      );
      setNewMessage("");

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      const processChunk = (chunk: string) => {
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Save last partial line
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          const ssePrefix = "data: ";
          if (!trimmed.startsWith(ssePrefix)) continue;
          const jsonPart = trimmed.slice(ssePrefix.length);
          try {
            const evt = JSON.parse(jsonPart);
            const delta =
              evt.delta || evt.textDelta || evt.token || evt.content || "";
            if (typeof delta === "string" && delta) {
              assistantText += delta;
              latestAssistantTextRef.current = assistantText;
              if (pendingUpdateTimer.current == null) {
                pendingUpdateTimer.current = window.setTimeout(() => {
                  setDisplayMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, text: latestAssistantTextRef.current }
                        : m
                    )
                  );
                  pendingUpdateTimer.current = null;
                  if (isAtBottom) scrollToBottom(true);
                }, 60);
              }
            }
          } catch {}
        }
      };

      // Continuously read stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        processChunk(text);
        await new Promise((r) => setTimeout(r, 40));
      }

      // Final flush after stream ends
      if (latestAssistantTextRef.current) {
        setDisplayMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, text: latestAssistantTextRef.current }
              : m
          )
        );
      }

      // After stream completes, you might refetch conversation
      queryClient.invalidateQueries({ queryKey: ["conversation", chatId] });
    } catch (error) {
      console.error("Failed to send/stream message:", error);
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
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-destructive">Failed to load chat</div>
        <div className="text-muted-foreground mt-2 text-sm">
          {error.message}
        </div>
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
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <div className="bg-primary-foreground h-4 w-4 rounded-full"></div>
          </div>
          <span className="text-foreground font-bold">{chatTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-full p-1 transition-colors"
            title="Close chat"
          >
            <X className="text-muted-foreground h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesRef}
        className="flex-1 space-y-1 overflow-y-auto p-2"
        onScroll={handleScrollPosition}
      >
        {displayMessages.length === 0 ? (
          <div className="flex justify-start">
            <div className="bg-card text-card-foreground border-border max-w-xs rounded-lg border p-1.5">
              <p className="text-foreground text-sm">
                👋 Hello! How can I help you today?
              </p>
              <p className="text-muted-foreground mt-1 text-xs">Just now</p>
            </div>
          </div>
        ) : (
          displayMessages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-lg p-3 ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border-border border"
                }`}
              >
                <p className="text-foreground text-sm">{message.text}</p>
                <p
                  className={`mt-1 text-xs ${
                    message.isUser
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Fixed scroll-to-bottom button */}
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
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">{file.name}</span>
                <button
                  onClick={() =>
                    setSelectedFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
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
