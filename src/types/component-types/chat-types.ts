// File service types
export type TUploadOptions = {
  file: File;
  userId: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
};

export enum TChatMessageSender {
  USER = "user",
  ASSISTANT = "assistant",
}

// Chat message type (matches the exact API response structure)
export type TChatMessage = {
  _id: string;
  message: string;
  sender: TChatMessageSender;
  createdAt: string;
  updatedAt: string;
};

// Display message type for UI components
export type TDisplayMessage = TChatMessage & { isNew: boolean };

// Chat history item - matches actual API response
export type TChatHistoryItem = {
  _id: string;
  title: string;
  userId: string;
  status: string;
  updatedAt: string;
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
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  messages: TChatMessage[];
};

// Conversation API response (matches the exact API response structure)
export type TConversationAPIResponse = {
  data: TConversation;
  message: string;
};

export enum TUploadStatus {
  UPLOADING = "uploading",
  SUCCESS = "success",
  ERROR = "error",
}
