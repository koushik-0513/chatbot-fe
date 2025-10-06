import { motion } from "framer-motion";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";

import { useMaximize } from "@/providers/maximize-provider";
import { useTitle } from "@/providers/title-provider";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  onBackClick?: () => void;
  shouldShowMaximizeButton?: () => boolean;
  showTitleOnScroll?: boolean;
  isScrolled?: boolean;
};

export const Header = ({
  title,
  showBack = false,
  onBackClick,
  shouldShowMaximizeButton = () => false,
  showTitleOnScroll = false,
  isScrolled = false,
}: HeaderProps): React.JSX.Element => {
  const { isMaximized, setMaximized } = useMaximize();
  const { title: dynamicTitle } = useTitle();
  
  // Use dynamic title from context if available, otherwise use prop title
  const displayTitle = dynamicTitle || title;

  return (
    <motion.div className="border-border bg-card sticky top-0 z-50 flex items-center rounded-t-lg border-b p-3">
      {showBack && (
        <button
          onClick={onBackClick}
          className="hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors"
        >
          <ArrowLeft className="text-muted-foreground h-5 w-5" />
        </button>
      )}
      <div className="flex flex-1 flex-col items-center">
        <motion.h2
          key={displayTitle}
          className="text-foreground text-md text-center font-semibold"
          initial={{ opacity: 0 }}
          animate={{
            opacity: showTitleOnScroll ? (isScrolled ? 1 : 0) : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {displayTitle}
        </motion.h2>
      </div>
      <div className="mr-8 ml-auto flex items-center gap-2">
        {shouldShowMaximizeButton() && (
          <button
            onClick={() => {
              setMaximized(!isMaximized);
            }}
            className="hover:bg-muted cursor-pointer rounded-full p-1 transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="text-muted-foreground h-4 w-4" />
            ) : (
              <Maximize2 className="text-muted-foreground h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};
