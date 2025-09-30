"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface MaximizeContextType {
  isMaximized: boolean;
  setMaximized: (maximized: boolean) => void;
  autoMinimize: () => void;
  autoMaximize: () => void;
}

const MaximizeContext = createContext<MaximizeContextType | undefined>(
  undefined
);

interface MaximizeProviderProps {
  children: ReactNode;
  onMaximizeChange?: (isMaximized: boolean) => void;
}

export const MaximizeProvider = ({
  children,
  onMaximizeChange,
}: MaximizeProviderProps) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const setMaximized = (maximized: boolean) => {
    setIsMaximized(maximized);
    onMaximizeChange?.(maximized);
  };

  const autoMinimize = () => {
    setMaximized(false);
  };

  const autoMaximize = () => {
    setMaximized(true);
  };

  return (
    <MaximizeContext.Provider
      value={{
        isMaximized,
        setMaximized,
        autoMinimize,
        autoMaximize,
      }}
    >
      {children}
    </MaximizeContext.Provider>
  );
};

export const useMaximize = () => {
  const context = useContext(MaximizeContext);
  if (context === undefined) {
    throw new Error("useMaximize must be used within a MaximizeProvider");
  }
  return context;
};
