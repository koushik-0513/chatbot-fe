import {
  CircleQuestionMark,
  House,
  Megaphone,
  MessageSquareText,
} from "lucide-react";

import type { TNavigationItem } from "@/components/sub-components/navigation-bar";

export const NAVIGATION_ITEMS: TNavigationItem[] = [
  { id: "homepage", icon: House, label: "Home" },
  { id: "message", icon: MessageSquareText, label: "Chat" },
  { id: "help", icon: CircleQuestionMark, label: "Help" },
  { id: "news", icon: Megaphone, label: "News" },
];
