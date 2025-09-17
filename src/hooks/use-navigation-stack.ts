import { useCallback, useState } from "react";

export interface NavigationStackItem {
  id: string;
  type: "article" | "collection" | "search";
  data?: any; // Additional data associated with the item
}

export interface UseNavigationStackOptions {
  maxSize?: number; // Maximum stack size to prevent memory issues
}

export const useNavigationStack = (options: UseNavigationStackOptions = {}) => {
  const { maxSize = 50 } = options;
  const [stack, setStack] = useState<NavigationStackItem[]>([]);

  // Add item to stack
  const push = useCallback(
    (item: NavigationStackItem) => {
      setStack((prev) => {
        const newStack = [...prev, item];
        // Prevent stack from growing too large
        if (newStack.length > maxSize) {
          return newStack.slice(-maxSize);
        }
        return newStack;
      });
    },
    [maxSize]
  );

  // Remove and return the last item from stack
  const pop = useCallback((): NavigationStackItem | null => {
    let poppedItem: NavigationStackItem | null = null;
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      poppedItem = newStack.pop() || null;
      return newStack;
    });
    return poppedItem;
  }, []);

  // Get the last item without removing it
  const peek = useCallback((): NavigationStackItem | null => {
    return stack.length > 0 ? stack[stack.length - 1] : null;
  }, [stack]);

  // Get all items
  const getAll = useCallback((): NavigationStackItem[] => {
    return [...stack];
  }, [stack]);

  // Clear the entire stack
  const clear = useCallback(() => {
    setStack([]);
  }, []);

  // Get stack size
  const size = stack.length;

  // Check if stack is empty
  const isEmpty = stack.length === 0;

  // Check if stack has items
  const hasItems = stack.length > 0;

  // Navigate back through stack
  const navigateBack = useCallback((): NavigationStackItem | null => {
    return pop();
  }, [pop]);

  // Add current item and navigate to new item
  const navigateTo = useCallback(
    (currentItem: NavigationStackItem | null, newItem: NavigationStackItem) => {
      if (currentItem) {
        push(currentItem);
      }
      return newItem;
    },
    [push]
  );

  // Replace the entire stack with a new one
  const replaceStack = useCallback(
    (newStack: NavigationStackItem[]) => {
      setStack(newStack.slice(-maxSize)); // Ensure we don't exceed max size
    },
    [maxSize]
  );

  // Get stack history (for debugging)
  const getHistory = useCallback(() => {
    return stack.map((item, index) => ({
      ...item,
      position: index,
      isLast: index === stack.length - 1,
    }));
  }, [stack]);

  return {
    // State
    stack,
    size,
    isEmpty,
    hasItems,

    // Actions
    push,
    pop,
    peek,
    getAll,
    clear,
    navigateBack,
    navigateTo,
    replaceStack,

    // Utilities
    getHistory,
  };
};
