import { useMemo } from "react";

import { TConversation, TConversationMessage } from "@/types/types";
import { formatChatTime, formatDayOrDate } from "@/utils/datetime";

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
  const { user_id } = useUserId();

  const { data: history, isLoading: isHistoryLoading } = useGetChatHistory(
    user_id || "",
    1,
    1
  );

  const recent = history?.data?.[0];
  const conversationId = useMemo(() => {
    return recent?._id || null;
  }, [recent]);

  const title = recent?.title || "Recent Chat";
  const tsRaw = recent?.updatedAt || "";
  const day = formatDayOrDate(tsRaw);
  const time = formatChatTime(tsRaw);

  const { data: conv } = useGetConversationById(conversationId);

  const convData = conv?.data as
    | TConversation
    | TConversationMessage[]
    | undefined;
  const messages: TConversationMessage[] = Array.isArray(convData)
    ? convData
    : convData?.messages || [];
  const last = messages[messages.length - 1];
  const preview = last?.message || "Tap to continue your last chat";

  const handleOpen = () => {
    if (onOpenChat) onOpenChat(conversationId, title);
  };

  return (
    <div>
      <Card onClick={handleOpen} className="cursor-pointer">
        <CardHeader>
          <CardTitle>Recent Message</CardTitle>
        </CardHeader>
        <CardContent className="-mt-6">
          {isHistoryLoading ? (
            <div className="text-muted-foreground text-sm">Loading…</div>
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
