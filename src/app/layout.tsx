"use client";

import "@/styles/global.css";
import { QueryClientProvider } from "@tanstack/react-query";

import { ArticleNavigationProvider } from "@/providers/article-navigation-provider";
import { MaximizeProvider } from "@/providers/maximize-provider";
import { ScrollProvider } from "@/providers/scroll-provider";

import { queryClient } from "@/lib/query-client";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element => {
  return (
    <html lang="en">
      <body className="flex items-center overflow-hidden justify-center bg-transparent">
        <QueryClientProvider client={queryClient}>
          <MaximizeProvider>
            <ScrollProvider>
              <ArticleNavigationProvider>{children}</ArticleNavigationProvider>
            </ScrollProvider>
          </MaximizeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
};

export { RootLayout };
