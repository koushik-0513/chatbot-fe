"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type TMaximizeContextType = {
  isMaximized: boolean;
  setMaximized: (maximized: boolean) => void;
  autoMinimize: () => void;
  autoMaximize: () => void;
};

const MaximizeContext = createContext<TMaximizeContextType | undefined>(
  undefined
);

type TMaximizeProviderProps = {
  children: ReactNode;
  onMaximizeChange?: (isMaximized: boolean) => void;
};

export const MaximizeProvider = ({
  children,
  onMaximizeChange,
}: TMaximizeProviderProps): React.JSX.Element => {
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

export const useMaximize = (): TMaximizeContextType => {
  const context = useContext(MaximizeContext);
  if (context === undefined) {
    throw new Error("useMaximize must be used within a MaximizeProvider");
  }
  return context;
};
