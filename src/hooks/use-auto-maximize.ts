import { useCallback, useRef } from "react";

interface UseAutoMaximizeProps {
  onMaximizeChange?: (isMaximized: boolean) => void;
  externalIsMaximized?: boolean;
  setInternalIsMaximized?: (isMaximized: boolean) => void;
}

export const useAutoMaximize = ({
  onMaximizeChange,
  externalIsMaximized,
  setInternalIsMaximized,
}: UseAutoMaximizeProps) => {
  const lastMaximizeTime = useRef<number>(0);
  const MAXIMIZE_DEBOUNCE_MS = 500; // Prevent rapid successive maximize calls

  const triggerAutoMaximize = useCallback(() => {
    const now = Date.now();

    // Debounce rapid successive calls
    if (now - lastMaximizeTime.current < MAXIMIZE_DEBOUNCE_MS) {
      return;
    }

    lastMaximizeTime.current = now;

    const newMaximized = true;
    if (externalIsMaximized !== undefined) {
      onMaximizeChange?.(newMaximized);
    } else if (setInternalIsMaximized) {
      setInternalIsMaximized(newMaximized);
    }
  }, [onMaximizeChange, externalIsMaximized, setInternalIsMaximized]);

  const shouldAutoMaximize = useCallback(
    (context: {
      navigatedFromHomepage?: boolean;
      cameFromSearch?: boolean;
      isDetailsView?: boolean;
    }) => {
      // Only auto-maximize for specific contexts
      return (
        context.isDetailsView &&
        (context.navigatedFromHomepage || context.cameFromSearch)
      );
    },
    []
  );

  return {
    triggerAutoMaximize,
    shouldAutoMaximize,
  };
};
