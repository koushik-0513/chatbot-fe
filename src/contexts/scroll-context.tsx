"use client";

import React, { createContext, useCallback, useContext, useRef } from "react";

type ScrollContextType = {
  resetAllScroll: () => void;
  resetScrollToElement: (elementRef: React.RefObject<HTMLElement>) => void;
  registerScrollableElement: (element: HTMLElement) => void;
  unregisterScrollableElement: (element: HTMLElement) => void;
  resetAllScrollWithDelay: (delay?: number) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};

interface ScrollProviderProps {
  children: React.ReactNode;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const scrollableElementsRef = useRef<Set<HTMLElement>>(new Set());

  const resetAllScroll = useCallback(() => {
    // Reset main window scroll
    window.scrollTo(0, 0);

    // Reset all registered scrollable elements
    scrollableElementsRef.current.forEach((element) => {
      if (element && element.scrollTop !== undefined) {
        element.scrollTop = 0;
      }
      if (element && element.scrollLeft !== undefined) {
        element.scrollLeft = 0;
      }
    });

    // Also reset any elements with scroll classes (fallback)
    const scrollableElements = document.querySelectorAll(
      '[class*="overflow-y-auto"], [class*="overflow-y-scroll"], [class*="overflow-auto"], [class*="scrollbar"], .scroll-container, .scrollable-content, .flex-1.overflow-y-auto'
    );

    scrollableElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
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
      (chatbotContent as HTMLElement).scrollTop = 0;
    }
  }, []);

  const resetScrollToElement = useCallback(
    (elementRef: React.RefObject<HTMLElement>) => {
      if (elementRef.current) {
        elementRef.current.scrollTop = 0;
        elementRef.current.scrollLeft = 0;
      }
    },
    []
  );

  const registerScrollableElement = useCallback((element: HTMLElement) => {
    scrollableElementsRef.current.add(element);
  }, []);

  const unregisterScrollableElement = useCallback((element: HTMLElement) => {
    scrollableElementsRef.current.delete(element);
  }, []);

  const resetAllScrollWithDelay = useCallback(
    (delay: number = 100) => {
      // Immediate reset
      resetAllScroll();

      // Reset with delay to catch dynamically rendered elements
      setTimeout(() => {
        resetAllScroll();
      }, delay);

      // Additional reset for components that might render later
      setTimeout(() => {
        resetAllScroll();
      }, delay * 2);

      // Final reset to ensure everything is reset
      setTimeout(() => {
        resetAllScroll();
      }, delay * 3);
    },
    [resetAllScroll]
  );

  const value: ScrollContextType = {
    resetAllScroll,
    resetScrollToElement,
    registerScrollableElement,
    unregisterScrollableElement,
    resetAllScrollWithDelay,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
