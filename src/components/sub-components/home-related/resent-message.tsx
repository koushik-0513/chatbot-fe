import { useMemo } from "react";

import { DEFAULT_TITLES, UI_MESSAGES } from "@/constants/constants";
import {
  TChatMessage,
  TConversation,
} from "@/types/component-types/chat-types";
import { formatChatTime, formatDayOrDate } from "@/utils/date-time";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useGetChatHistory,
  useGetConversationById,
} from "@/hooks/api/chat-service";
import { useUserId } from "@/hooks/use-user-id";

type Props = {
  onOpenChat?: (conversationId: string | null, title?: string) => void;
};

export const ResentMessage = ({ onOpenChat }: Props) => {
  const { user_id, is_new_user } = useUserId();

  const { data: history, isLoading: isHistoryLoading } = useGetChatHistory(
    { user_id: user_id || "", page: 1, limit: 1 },
    { enabled: !!user_id }
  );

  const recent = history?.data?.[0];
  const conversationId = useMemo(() => {
    return recent?._id || null;
  }, [recent]);

  const title = recent?.title || DEFAULT_TITLES.RECENT_CHAT;
  const tsRaw = recent?.updatedAt || "";
  const day = formatDayOrDate(tsRaw);
  const time = formatChatTime(tsRaw);

  const { data: conv } = useGetConversationById(
    { conversationId: conversationId || "" },
    { enabled: !!conversationId }
  );

  const convData = conv?.data as TConversation;
  const messages: TChatMessage[] = convData?.messages || [];
  const last = messages[messages.length - 1];
  const preview = last?.message || "Tap to continue your last chat";

  const handleOpen = () => {
    if (onOpenChat) onOpenChat(conversationId, title);
  };

  const handleNewChat = () => {
    if (onOpenChat) onOpenChat(null, "New Chat");
  };

  return (
    <div>
      <Card onClick={is_new_user ? handleNewChat : handleOpen} className="cursor-pointer">
        <CardHeader>
          <CardTitle>{is_new_user ? "Start New Chat" : "Recent Message"}</CardTitle>
        </CardHeader>
        <CardContent className="-mt-6">
          {isHistoryLoading ? (
            <div className="text-muted-foreground text-sm">
              {UI_MESSAGES.LOADING.GENERAL}
            </div>
          ) : is_new_user ? (
            <div>
              <div className="text-foreground my-2 text-sm">
                Welcome! Start a new conversation to get help with your questions.
              </div>
              <div className="text-muted-foreground mb-2 text-xs">
                Click to begin chatting
              </div>
            </div>
          ) : conversationId ? (
            <div>
              <div className="text-foreground my-2 line-clamp-2 text-sm">
                {preview}
              </div>
              <div className="text-muted-foreground mb-2 text-xs">
                {day} • {time}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No recent chat</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
