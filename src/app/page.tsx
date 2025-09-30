"use client";

import React, { useState } from "react";

import { Bot, ChevronDown } from "lucide-react";

import { Chatbot } from "@/components/chat-bot";

import { useUserId } from "@/hooks/custom/use-user-id";

export default function Home() {
  const [isChatbotopen, setIsChatbotOpen] = useState(false);
  const { userId } = useUserId();
  return (
    <div className="bg-card min-h-screen">
      <button
        onClick={() => setIsChatbotOpen(!isChatbotopen)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 bottom-6 z-50 cursor-pointer rounded-lg px-4 py-3 font-medium transition-colors"
      >
        {isChatbotopen ? <ChevronDown /> : <Bot />}
      </button>

      {isChatbotopen && userId && (
        <div key="chatbot-container" className="fixed right-6 bottom-20 z-50">
          <Chatbot user_id={userId} onClose={() => setIsChatbotOpen(false)} />
        </div>
      )}
    </div>
  );
}
