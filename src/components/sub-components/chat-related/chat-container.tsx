import { useEffect, useRef, useState } from "react";

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
  type UploadItem = {
    id: string;
    file: File;
    name: string;
    progress: number; // 0-100
    status: "uploading" | "success" | "error";
    error?: string;
  };
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoStick, setAutoStick] = useState(true); // auto-scroll unless user scrolled up

  // Typing animation state for assistant streaming
  const typingIntervalRef = useRef<number | null>(null);
  const charQueueRef = useRef<string[]>([]);
  const assistantMessageIdRef = useRef<string | null>(null);
  const streamDoneRef = useRef(false);
  const currentTypedTextRef = useRef<string>("");

  // Persist/restore typing state in sessionStorage so we can resume smoothly
  const typingStateKey = (cid: string | null) =>
    `typing_state:${cid ?? "null"}`;
  const persistTypingState = () => {
    try {
      const state = {
        assistantMessageId: assistantMessageIdRef.current,
        typedText: currentTypedTextRef.current,
        remaining: charQueueRef.current.join(""),
        streamDone: streamDoneRef.current,
      };
      sessionStorage.setItem(typingStateKey(chatId), JSON.stringify(state));
    } catch {}
  };
  const loadTypingState = () => {
    try {
      const raw = sessionStorage.getItem(typingStateKey(chatId));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const clearTypingState = () => {
    try {
      sessionStorage.removeItem(typingStateKey(chatId));
    } catch {}
  };

  const startTypingLoop = () => {
    if (typingIntervalRef.current != null) return;
    typingIntervalRef.current = window.setInterval(() => {
      const next = charQueueRef.current.splice(0, 3).join("");
      if (next) {
        const msgId = assistantMessageIdRef.current;
        if (!msgId) return;
        currentTypedTextRef.current =
          (currentTypedTextRef.current || "") + next;
        setDisplayMessages((prev) =>
          prev.map((m) =>
            m._id === msgId ? { ...m, message: currentTypedTextRef.current } : m
          )
        );
        if (autoStick) scrollToBottom(true);
        // Persist typing progress for resume on navigation
        persistTypingState();
      } else if (streamDoneRef.current) {
        if (typingIntervalRef.current != null) {
          window.clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          // Finalize and clear persisted state
          clearTypingState();
        }
      }
    }, 18);
  };

  // Reset scroll when component mounts or chatId changes
  useEffect(() => {
    resetAllScrollWithDelay(100);
  }, [chatId, resetAllScrollWithDelay]);

  // Get messages directly from API response
  const conversationData = chatHistoryResponse?.data;
  const messages: TChatMessage[] = conversationData?.messages || [];

  const [displayMessages, setDisplayMessages] =
    useState<TChatMessage[]>(messages);
  const effectiveTitle = (() => {
    const explicit = chatTitle && chatTitle.trim();
    if (explicit) return explicit;
    const apiTitle = conversationData?.title;
    if (apiTitle) return apiTitle;
    // For brand new chats (no messages yet), keep header empty until backend sets a title
    const hasMessages = messages.length > 0;
    return hasMessages ? "Untitled Chat" : "";
  })();

  const smoothScrollToBottom = () => {
    const bottomEl = bottomRef.current;
    if (!bottomEl) return;
    bottomEl.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // Auto-scroll to bottom when messages update (if near bottom)
  useEffect(() => {
    if (autoStick) {
      requestAnimationFrame(() => smoothScrollToBottom());
    }
  }, [displayMessages, autoStick]);

  // Auto-scroll to bottom on initial load/open of a conversation
  useEffect(() => {
    requestAnimationFrame(() => {
      smoothScrollToBottom();
      setIsAtBottom(true);
      setAutoStick(true);
    });
    // Try to restore in-progress typing state (resume instead of replay)
    const saved = loadTypingState();
    if (saved && saved.assistantMessageId) {
      assistantMessageIdRef.current = saved.assistantMessageId;
      streamDoneRef.current = !!saved.streamDone;
      currentTypedTextRef.current = saved.typedText || "";
      charQueueRef.current = (saved.remaining || "").split("");
      if (currentTypedTextRef.current || charQueueRef.current.length > 0) {
        setDisplayMessages((prev) =>
          prev.map((m) =>
            m._id === saved.assistantMessageId
              ? { ...m, message: currentTypedTextRef.current }
              : m
          )
        );
        startTypingLoop();
      }
    }
  }, [chatHistoryResponse, loadTypingState, startTypingLoop]);

  const handleScrollPosition = () => {
    const el = messagesRef.current;
    if (!el) return;
    const threshold = 50;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    setIsAtBottom(atBottom);
    setAutoStick(atBottom);
  };

  const scrollToBottom = (smooth: boolean) => {
    const el = bottomRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    setIsAtBottom(true);
    setAutoStick(true);
  };

  // Sync local messages when server messages change (e.g., on refetch)
  useEffect(() => {
    setDisplayMessages(messages);
  }, [messages]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      // Save typing progress before unmounting
      persistTypingState();
      if (typingIntervalRef.current != null) {
        window.clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [persistTypingState]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user_id) return;

    const userMsgId = new ObjectId().toHexString();
    const assistantMsgId = new ObjectId().toHexString();

    // Optimistically append user's message
    const optimisticUser: TChatMessage = {
      _id: userMsgId,
      message: newMessage,
      sender: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Seed assistant placeholder
    const optimisticAssistant: TChatMessage = {
      _id: assistantMsgId,
      message: "",
      sender: "assistant",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Force stick-to-bottom when sending
    setIsAtBottom(true);
    setAutoStick(true);

    // Local UI state: append to end of normalized messages
    setDisplayMessages((prev) => [
      ...prev,
      optimisticUser,
      optimisticAssistant,
    ]);

    // Prepare typing state for this assistant message
    assistantMessageIdRef.current = assistantMsgId;
    streamDoneRef.current = false;
    charQueueRef.current = [];
    currentTypedTextRef.current = "";

    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId: chatId,
        message: newMessage,
        userId: user_id,
        messageId: userMsgId,
      });
      setNewMessage("");

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

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
              // enqueue characters and start typewriter loop
              charQueueRef.current.push(...delta.split(""));
              startTypingLoop();
              persistTypingState();
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

      // Flush any remaining buffered partial line
      if (buffer && buffer.trim().length > 0) {
        processChunk(buffer + "\n");
        buffer = "";
      }

      // Mark stream as done, typing loop will stop once queue is empty
      assistantMessageIdRef.current = assistantMsgId;
      streamDoneRef.current = true;

      // Wait until typing queue finishes draining before refreshing queries
      const waitForTypingToFinish = async () =>
        new Promise<void>((resolve) => {
          const check = () => {
            const done =
              charQueueRef.current.length === 0 &&
              typingIntervalRef.current == null;
            if (done) resolve();
            else setTimeout(check, 40);
          };
          check();
        });
      await waitForTypingToFinish();

      // After stream completes and typing has finished, refetch conversation
      queryClient.invalidateQueries({ queryKey: ["conversation", chatId] });
      // Ensure chat history reorders with most recent activity
      queryClient.invalidateQueries({ queryKey: ["chatHistory", user_id] });
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

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || !user_id) return;

    const fileArray = Array.from(files);

    // Immediately start uploads with progress
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

      // Kick off the upload
      uploadFile({
        file,
        userId: user_id,
        onProgress: (p) =>
          setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress: p } : u))
          ),
      })
        .then((res) => {
          if (res.ok) {
            // Try to extract a file URL/name from response
            const data: Record<string, unknown> =
              (res.data as Record<string, unknown>) ?? {};
            const fileUrl: string | undefined =
              (data.url as string) ||
              (data.file_url as string) ||
              (data.location as string) ||
              (data.path as string) ||
              ((data.file as Record<string, unknown>)?.url as string) ||
              ((data.data as Record<string, unknown>)?.url as string);
            const fileName: string = file.name;

            // Append a user message representing the uploaded file
            const uploadMsgId = new ObjectId().toHexString();
            setDisplayMessages((prev) => [
              ...prev,
              {
                _id: uploadMsgId,
                message: fileUrl ? "Uploaded a file" : `Uploaded: ${fileName}`,
                sender: "user",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ]);

            setUploads((prev) =>
              prev.map((u) =>
                u.id === id ? { ...u, progress: 100, status: "success" } : u
              )
            );
            // Optional: auto-hide the item after a short delay
            setTimeout(() => {
              setUploads((prev) => prev.filter((u) => u.id !== id));
            }, 1500);
          } else {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === id
                  ? {
                      ...u,
                      status: "error",
                      error: res.error || "Upload failed",
                    }
                  : u
              )
            );
          }
        })
        .catch((err) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === id
                ? {
                    ...u,
                    status: "error",
                    error: String(err || "Upload error"),
                  }
                : u
            )
          );
        });
    });

    // Reset the input so selecting the same file again triggers change
    event.currentTarget.value = "";
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
          {effectiveTitle ? (
            <span className="text-foreground text-sm font-bold">
              {effectiveTitle}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Untitled Chat
              </span>
              {isLoading && (
                <span className="border-muted-foreground/50 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"></span>
              )}
            </div>
          )}
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
            </div>
          </div>
        ) : (
          displayMessages.map((message) => {
            const isUser = message.sender === "user";
            const isAssistantStreaming =
              !isUser &&
              message._id === assistantMessageIdRef.current &&
              (!streamDoneRef.current || charQueueRef.current.length > 0);
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
                  {!isUser && !message.message ? (
                    <div className="flex items-center gap-1 py-1">
                      <span className="sr-only">Assistant is typing</span>
                      <span className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.2s]"></span>
                      <span className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.1s]"></span>
                      <span className="bg-muted-foreground h-1.5 w-1.5 animate-bounce rounded-full"></span>
                    </div>
                  ) : (
                    <MarkdownRenderer
                      content={message.message}
                      className={`${
                        isUser ? "text-primary-foreground" : "text-foreground"
                      } prose-p:text-xs prose-p:mb-0.5 prose-headings:text-xs prose-headings:font-normal prose-code:text-xs`}
                      invert={isUser}
                    />
                  )}
                  {!isAssistantStreaming && (
                    <p
                      className={`mt-1 text-xs ${
                        isUser
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    ></p>
                  )}
                </div>
              </div>
            );
          })
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
