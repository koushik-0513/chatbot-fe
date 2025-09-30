"use client";

import { useState } from "react";

import { ArticleNavigationProvider } from "@/providers/article-navigation-provider";
import { MaximizeProvider } from "@/providers/maximize-provider";
import { ScrollProvider } from "@/providers/scroll-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type ProvidersProps = {
  children: React.ReactNode;
  onMaximizeChange?: (isMaximized: boolean) => void;
};

export const Providers = ({ children, onMaximizeChange }: ProvidersProps) => {
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
      <MaximizeProvider onMaximizeChange={onMaximizeChange}>
        <ScrollProvider>
          <ArticleNavigationProvider>{children}</ArticleNavigationProvider>
        </ScrollProvider>
      </MaximizeProvider>
    </QueryClientProvider>
  );
};
