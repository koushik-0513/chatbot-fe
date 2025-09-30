import { SENDER, STATUS } from "@/constants/constants";

// File service types
export type TUploadOptions = {
  file: File;
  user_id: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
};

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

// Display message type for UI components
export type TDisplayMessage = TChatMessage & { isNew: boolean };

// Chat history item - matches actual API response
export type TChatHistoryItem = {
  _id: string;
  title: string;
  user_id: string;
  status: string;
  updated_at: string;
};

// Chat history API response - matches actual API response
export type TChatHistoryAPIResponse = {
  message: string;
  data: TChatHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_conversations: number;
  };
};

// Conversation type (matches the exact API response structure)
export type TConversation = {
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
