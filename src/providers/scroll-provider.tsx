"use client";

import React, { createContext, useCallback, useContext } from "react";

type ScrollContextType = {
  resetAllScroll: () => void;
  scrollToBottom: () => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};

type ScrollProviderProps = {
  children: React.ReactNode;
};

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const resetAllScroll = useCallback(() => {
    // Reset main window scroll
    window.scrollTo(0, 0);

    // Reset all scrollable elements
    const scrollableElements = document.querySelectorAll(
      '[class*="overflow-y-auto"], [class*="overflow-y-scroll"], [class*="overflow-auto"], [class*="scrollbar"], .scroll-container, .scrollable-content, .flex-1.overflow-y-auto'
    );

    scrollableElements.forEach((element) => {
      const htmlElement = element;
      if (htmlElement && htmlElement.scrollTop !== undefined) {
        htmlElement.scrollTop = 0;
      }
      if (htmlElement && htmlElement.scrollLeft !== undefined) {
        htmlElement.scrollLeft = 0;
      }
    });

    // Specifically target the main chatbot content area
    const chatbotContent = document.querySelector(".flex-1.overflow-y-auto");
    if (chatbotContent) {
      chatbotContent.scrollTop = 0;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    // Scroll main window to bottom
    window.scrollTo(0, document.body.scrollHeight);

    // Scroll all scrollable elements to bottom
    const scrollableElements = document.querySelectorAll(
      '[class*="overflow-y-auto"], [class*="overflow-y-scroll"], [class*="overflow-auto"], [class*="scrollbar"], .scroll-container, .scrollable-content, .flex-1.overflow-y-auto'
    );

    scrollableElements.forEach((element) => {
      const htmlElement = element;
      if (htmlElement && htmlElement.scrollTop !== undefined) {
        htmlElement.scrollTop = htmlElement.scrollHeight;
      }
    });

    // Specifically target the main chatbot content area
    const chatbotContent = document.querySelector(".flex-1.overflow-y-auto");
    if (chatbotContent) {
      const content = chatbotContent;
      content.scrollTop = content.scrollHeight;
    }
  }, []);

  const value: ScrollContextType = {
    resetAllScroll,
    scrollToBottom,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
