"use client";

import "@/styles/global.css";
import { QueryClientProvider } from "@tanstack/react-query";

import { ArticleNavigationProvider } from "@/providers/article-navigation-provider";
import { MaximizeProvider } from "@/providers/maximize-provider";
import { ScrollProvider } from "@/providers/scroll-provider";
import { TitleProvider } from "@/providers/title-provider";

import { queryClient } from "@/lib/query-client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex items-center justify-center overflow-hidden bg-transparent">
        <QueryClientProvider client={queryClient}>
          <MaximizeProvider>
            <ScrollProvider>
              <TitleProvider>
                <ArticleNavigationProvider>{children}</ArticleNavigationProvider>
              </TitleProvider>
            </ScrollProvider>
          </MaximizeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
