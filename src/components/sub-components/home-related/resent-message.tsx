import { DEFAULT_TITLES } from "@/constants/titles";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useGetConversationById,
  useGetConversationList,
} from "@/hooks/api/chat";
import { useUserId } from "@/hooks/custom/use-user-id";

import { TApiError } from "@/types/api";
import { TChatMessage } from "@/types/chat-types";

type Props = {
  onOpenChat?: (conversationId: string | null, title?: string) => void;
};

export const ResentMessage = ({ onOpenChat }: Props) => {
  const { userId } = useUserId();

  const {
    data: history,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useGetConversationList(
    { user_id: userId || "" },
    {
      enabled: !!userId,
      retry: (failureCount, error) => {
        // Don't retry on 404 errors (no chat history)
        if (error && (error as TApiError)?.status_code === 404) {
          return false;
        }
        // Retry other errors up to 2 times
        return failureCount < 2;
      },
      retryDelay: 1000,
    }
  );
  const historyData = history?.data || [];
  const recent = historyData[0];
  const conversationId = recent?._id || "";

  const title = recent?.title ?? DEFAULT_TITLES.RECENT_CHAT;

  const { data: conv } = useGetConversationById(
    { conversationId },
    { enabled: !!conversationId } // react-query: run only when it exists
  );

  const convData = conv?.data;
  const messages: TChatMessage[] = convData?.messages || [];
  const last = messages[messages.length - 1];
  const preview = last?.message || "Tap to continue your last chat";

  const handleOpen = () => {
    if (onOpenChat) onOpenChat(conversationId, title);
  };

  // Early return if still loading
  if (isHistoryLoading) {
    return null;
  }

  const is404Error =
    historyError && (historyError as TApiError)?.status_code === 404;
  const hasRecentMessages = !is404Error && historyData.length > 0;

  if (!hasRecentMessages) {
    return null;
  }

  if (!conversationId) {
    return null;
  }

  return (
    <div>
      <Card onClick={handleOpen} className="cursor-pointer">
        <CardHeader>
          <CardTitle>Recent Message</CardTitle>
        </CardHeader>
        <CardContent className="-mt-6">
          <div className="text-foreground my-2 line-clamp-2 text-sm">
            {preview}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
