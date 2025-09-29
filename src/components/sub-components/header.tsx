import { motion } from "framer-motion";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";

import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  onBackClick?: () => void;
  isMaximized?: boolean;
  onMaximizeChange?: (maximized: boolean) => void;
  shouldShowMaximizeButton?: () => boolean;
  showTitleOnScroll?: boolean;
  isScrolled?: boolean;
};

export const Header = ({
  title,
  showBack = false,
  onBackClick,
  isMaximized = false,
  onMaximizeChange,
  shouldShowMaximizeButton = () => false,
  showTitleOnScroll = false,
  isScrolled = false,
}: HeaderProps) => (
  <motion.div
    className={cn(
      "border-border bg-card fixed top-0 right-0 left-0 z-50 flex items-center rounded-t-lg border-b p-3"
    )}
  >
    {showBack && (
      <button
        onClick={onBackClick}
        className={cn(
          "hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors"
        )}
      >
        <ArrowLeft className={cn("text-muted-foreground h-5 w-5")} />
      </button>
    )}
    <div className={cn("flex flex-1 flex-col items-center")}>
      <motion.h2
        key={title}
        className={cn("text-foreground text-md text-center font-semibold")}
        initial={{ opacity: 0 }}
        animate={{
          opacity: showTitleOnScroll ? (isScrolled ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h2>
    </div>
    <div className={cn("mr-8 ml-auto flex items-center gap-2")}>
      {shouldShowMaximizeButton() && (
        <button
          onClick={() => {
            onMaximizeChange?.(!isMaximized);
          }}
          className={cn(
            "hover:bg-muted cursor-pointer rounded-full p-1 transition-colors"
          )}
        >
          {isMaximized ? (
            <Minimize2 className={cn("text-muted-foreground h-4 w-4")} />
          ) : (
            <Maximize2 className={cn("text-muted-foreground h-4 w-4")} />
          )}
        </button>
      )}
    </div>
  </motion.div>
);
