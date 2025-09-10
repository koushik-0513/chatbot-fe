import { useCallback, useEffect, useRef } from "react";

interface ScrollManagementOptions {
  resetOnMount?: boolean;
  resetOnUnmount?: boolean;
  delay?: number;
}

export const useScrollManagement = (options: ScrollManagementOptions = {}) => {
  const { resetOnMount = true, resetOnUnmount = false, delay = 0 } = options;

  const scrollResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetScroll = useCallback(() => {
    // Clear any existing timeout
    if (scrollResetTimeoutRef.current) {
      clearTimeout(scrollResetTimeoutRef.current);
    }

    const performReset = () => {
      // Reset main window scroll
      window.scrollTo(0, 0);

      // Reset all scrollable elements
      const scrollableElements = document.querySelectorAll(
        '[class*="overflow-y-auto"], [class*="overflow-y-scroll"], [class*="overflow-auto"], [class*="scrollbar"]'
      );

      scrollableElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.scrollTop !== undefined) {
          htmlElement.scrollTop = 0;
        }
        if (htmlElement.scrollLeft !== undefined) {
          htmlElement.scrollLeft = 0;
        }
      });

      // Also reset any elements with specific scroll classes
      const specificScrollElements = document.querySelectorAll(
        ".scroll-container, .scrollable-content, .overflow-scroll"
      );

      specificScrollElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.scrollTop !== undefined) {
          htmlElement.scrollTop = 0;
        }
        if (htmlElement.scrollLeft !== undefined) {
          htmlElement.scrollLeft = 0;
        }
      });
    };

    if (delay > 0) {
      scrollResetTimeoutRef.current = setTimeout(performReset, delay);
    } else {
      performReset();
    }
  }, [delay]);

  const resetScrollToElement = useCallback(
    (elementRef: React.RefObject<HTMLElement>) => {
      if (elementRef.current) {
        elementRef.current.scrollTop = 0;
        elementRef.current.scrollLeft = 0;
      }
    },
    []
  );

  // Reset scroll on mount
  useEffect(() => {
    if (resetOnMount) {
      resetScroll();
    }

    return () => {
      if (scrollResetTimeoutRef.current) {
        clearTimeout(scrollResetTimeoutRef.current);
      }
    };
  }, [resetOnMount, resetScroll]);

  // Reset scroll on unmount
  useEffect(() => {
    return () => {
      if (resetOnUnmount) {
        resetScroll();
      }
    };
  }, [resetOnUnmount, resetScroll]);

  return {
    resetScroll,
    resetScrollToElement,
  };
};
