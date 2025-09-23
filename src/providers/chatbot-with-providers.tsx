"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArticleNavigationProvider } from "@/contexts/article-navigation-context";
import { ScrollProvider } from "@/contexts/scroll-context";
import { ChatbotLauncher } from "../components/chat-bot-launcher";

import "../dist/styles.css";

export const Chatbot = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProvider>
        <ArticleNavigationProvider>
          <ChatbotLauncher />
        </ArticleNavigationProvider>
      </ScrollProvider>
    </QueryClientProvider>
  );
};
