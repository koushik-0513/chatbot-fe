"use client";

import { Chatbot } from "@/providers/chatbot-with-providers";

export default function Home() {
  return (
    <div className="bg-card min-h-screen">
      <Chatbot />
    </div>
  );
}
