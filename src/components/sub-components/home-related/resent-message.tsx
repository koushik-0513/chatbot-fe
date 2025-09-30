import { DEFAULT_TITLES } from "@/constants/titles";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useGetConversationById,
  useGetConversationList,
} from "@/hooks/api/chat";
import { useUserId } from "@/hooks/custom/use-user-id";

import { TChatMessage } from "@/types/chat-types";

type Props = {
  onOpenChat?: (conversationId: string | null, title?: string) => void;
};

export const ResentMessage = ({ onOpenChat }: Props) => {
  const { userId, isNewUser } = useUserId();

  const { data: history, isLoading: isHistoryLoading } = useGetConversationList(
    { user_id: userId || "" },
    { enabled: !!userId }
  );
  const recent = history?.data?.[0];
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

  const handleNewChat = () => {
    if (onOpenChat) onOpenChat(null, "New Chat");
  };

  return (
    <div>
      <Card
        onClick={isNewUser ? handleNewChat : handleOpen}
        className="cursor-pointer"
      >
        <CardHeader>
          <CardTitle>
            {isNewUser ? "Start New Chat" : "Recent Message"}
          </CardTitle>
        </CardHeader>
        <CardContent className="-mt-6">
          {isHistoryLoading ? (
            <div className="text-muted-foreground text-sm">
              Loading chat history...
            </div>
          ) : isNewUser ? (
            <>
              <div className="text-foreground my-2 text-sm">
                Welcome! Start a new conversation to get help with your
                questions.
              </div>
              <div className="text-muted-foreground mb-2 text-xs">
                Click to begin chatting
              </div>
            </>
          ) : conversationId ? (
            <>
              <div className="text-foreground my-2 line-clamp-2 text-sm">
                {preview}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">No recent chat</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
