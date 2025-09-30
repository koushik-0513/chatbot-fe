import { SENDER, STATUS } from "@/constants/enums";

export type TStatus = (typeof STATUS)[number];
export type TSender = (typeof SENDER)[number];

// Chat message type (matches the exact API response structure)
export type TChatMessage = {
  _id: string;
  message: string;
  sender: TSender;
  created_at: string;
  updated_at: string;
};

// Conversation item - matches actual API response
export type TConversationItem = {
  _id: string;
  title: string;
  user_id: string;
  status: string;
  updated_at: string;
};

// Conversation list API response - matches actual API response
export type TConversationListAPIResponse = {
  message: string;
  data: TConversationItem[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_conversations: number;
  };
};

// Conversation type (matches the exact API response structure)
type TConversation = {
  _id: string;
  title: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: TChatMessage[];
};

// Conversation API response (matches the exact API response structure)
export type TConversationAPIResponse = {
  data: TConversation;
  message: string;
};
