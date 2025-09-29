import { useCallback } from "react";

type UseAutoMaximizeProps = {
  onMaximizeChange?: (isMaximized: boolean) => void;
  externalIsMaximized?: boolean;
  setInternalIsMaximized?: (isMaximized: boolean) => void;
};

export const useAutoMaximize = ({
  onMaximizeChange,
  externalIsMaximized,
  setInternalIsMaximized,
}: UseAutoMaximizeProps) => {
  const triggerAutoMaximize = useCallback(() => {
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
