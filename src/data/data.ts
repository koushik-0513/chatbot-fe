import { TChatMessage } from "../types/types";

export const initialChatMessages: TChatMessage[] = [
  {
    id: 1,
    text: "Hello! How can I help you today?",
    isUser: false,
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    text: "I need help with my account",
    isUser: true,
    timestamp: "10:31 AM",
  },
  {
    id: 3,
    text: "I'd be happy to help! What specific issue are you facing?",
    isUser: false,
    timestamp: "10:32 AM",
  },
];
