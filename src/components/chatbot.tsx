"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CircleQuestionMark,
  House,
  Maximize2,
  Megaphone,
  MessageSquareText,
  Minimize2,
  X,
} from "lucide-react";

import { Helppage } from "./help";
import { Homepage } from "./home";
import { Message } from "./message";
import { News } from "./news";
import { ChatContainer } from "./sub-components/chat-related/chat-container";

interface TChatbotProps {
  user_id: string;
  onClose?: () => void;
  isMaximized?: boolean;
  onMaximizeChange?: (isMaximized: boolean) => void;
}

interface NavigationItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { id: "homepage", icon: House, label: "Home" },
  { id: "message", icon: MessageSquareText, label: "Chat" },
  { id: "help", icon: CircleQuestionMark, label: "Help" },
  { id: "news", icon: Megaphone, label: "News" },
];

export const Chatbot = ({
  user_id,
  onClose,
  isMaximized: externalIsMaximized,
  onMaximizeChange,
}: TChatbotProps) => {
  const [activePage, setActivePage] = useState("homepage");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonTrigger, setBackButtonTrigger] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [pageKey, setPageKey] = useState(Date.now());
  const [internalIsMaximized, setInternalIsMaximized] = useState(false);
  const isMaximized =
    externalIsMaximized !== undefined
      ? externalIsMaximized
      : internalIsMaximized;
  const [showDetails, setShowDetails] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { resetAllScroll, resetScrollToElement, resetAllScrollWithDelay } =
    useScrollContext();

  // Reset scroll position when active page changes
  useEffect(() => {
    // Reset main content scroll
    if (contentRef.current) {
      resetScrollToElement(contentRef as React.RefObject<HTMLElement>);
    }

    // Reset all scroll positions globally with proper timing
    resetAllScrollWithDelay(150);
  }, [
    activePage,
    resetAllScroll,
    resetScrollToElement,
    resetAllScrollWithDelay,
  ]);

  // Reset scroll when pageKey changes (component remount)
  useEffect(() => {
    resetAllScrollWithDelay(100);
  }, [pageKey, resetAllScrollWithDelay]);

  const handlePageChange = (page: string) => {
    setActivePage(page);
    setShowBackButton(false);
    setShowDetails(false); // Reset details state when changing pages
    const newMaximized = false;
    if (externalIsMaximized !== undefined) {
      onMaximizeChange?.(newMaximized);
    } else {
      setInternalIsMaximized(newMaximized);
    }
    setPageKey(Date.now()); // Force component remount
    if (page === "message") {
      setShowChatHistory(true);
    }

    // Force scroll reset immediately when page changes
    if (contentRef.current) {
      resetScrollToElement(contentRef as React.RefObject<HTMLElement>);
    }
    resetAllScrollWithDelay(100);
  };

  const handleBackToHistory = () => {
    setSelectedChatId(null);
    setShowChatHistory(true);

    // Reset scroll when going back to chat history
    resetAllScrollWithDelay(100);
  };

  const handleChatSelected = (chatId: number) => {
    console.log("handleChatSelected called with chatId:", chatId);
    console.log("Setting selectedChatId to:", chatId);
    setSelectedChatId(chatId);
    setShowChatHistory(false);
    console.log("Chat selection state updated");
  };

  const handleBackClick = () => {
    // Reset scroll when back button is clicked
    resetAllScrollWithDelay(100);
    setBackButtonTrigger((prev) => prev + 1);
  };

  // Handle back navigation from details views with auto-minimize
  const handleBackFromDetails = () => {
    const newMaximized = false;
    if (externalIsMaximized !== undefined) {
      onMaximizeChange?.(newMaximized);
    } else {
      setInternalIsMaximized(newMaximized);
    }
    setShowDetails(false);
    setShowBackButton(false);
    resetAllScrollWithDelay(100);
  };

  // Handle just the minimize functionality without affecting other states
  const handleMinimizeOnly = () => {
    const newMaximized = false;
    if (externalIsMaximized !== undefined) {
      onMaximizeChange?.(newMaximized);
    } else {
      setInternalIsMaximized(newMaximized);
    }
    resetAllScrollWithDelay(100);
  };

  // Handle auto-maximize for details views
  const handleAutoMaximize = useCallback(() => {
    const newMaximized = true;
    if (externalIsMaximized !== undefined) {
      onMaximizeChange?.(newMaximized);
    } else {
      setInternalIsMaximized(newMaximized);
    }
  }, [externalIsMaximized, onMaximizeChange]);

  // Check if we're on a details page where maximize should be shown
  const shouldShowMaximizeButton = () => {
    return showDetails && (activePage === "help" || activePage === "news");
  };

  // Get proper title for each page
  const getPageTitle = (page: string) => {
    switch (page) {
      case "homepage":
        return "Home";
      case "message":
        return "Chat";
      case "help":
        return "Help";
      case "news":
        return "News";
      default:
        return page;
    }
  };

  // Navigation Component
  const Navigation = () => (
    <motion.div
      className="border-border bg-card flex gap-1 rounded-b-lg border-t p-3"
      layout
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handlePageChange(item.id)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-md p-2 transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
            <span
              className={`text-xs font-medium ${isActive ? "text-primary" : ""}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </motion.div>
  );

  // Header Component
  const Header = ({
    title,
    showBack = false,
  }: {
    title: string;
    showBack?: boolean;
  }) => (
    <motion.div
      className="border-border bg-card flex items-center rounded-t-lg border-b p-4"
      layout
    >
      {showBack && (
        <button
          onClick={handleBackClick}
          className="hover:bg-muted mr-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
        >
          <ArrowLeft className="text-muted-foreground h-5 w-5" />
        </button>
      )}
      <motion.h2
        key={title}
        className={`${showBack ? "" : "flex-1"} text-foreground text-center text-lg font-semibold`}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h2>
      <div className="ml-auto flex items-center gap-2">
        {shouldShowMaximizeButton() && (
          <button
            onClick={() => {
              const newMaximized = !isMaximized;
              if (externalIsMaximized !== undefined) {
                onMaximizeChange?.(newMaximized);
              } else {
                setInternalIsMaximized(newMaximized);
              }
            }}
            className="hover:bg-muted rounded-full p-1 transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="text-muted-foreground h-4 w-4" />
            ) : (
              <Maximize2 className="text-muted-foreground h-4 w-4" />
            )}
          </button>
        )}
        <button
          onClick={onClose}
          className="hover:bg-muted rounded-full p-1 transition-colors"
        >
          <X className="text-muted-foreground h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );

  // If a chat is selected, show the full ChatContainer
  console.log(
    "Current state - selectedChatId:",
    selectedChatId,
    "activePage:",
    activePage
  );

  if (selectedChatId && activePage === "message") {
    console.log("Rendering ChatContainer with selectedChatId:", selectedChatId);
    return (
      <motion.div
        className="border-border bg-background flex h-[600px] w-96 flex-col rounded-lg border shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
      >
        <ChatContainer
          chatId={selectedChatId}
          chatTitle="Chat"
          onBack={handleBackToHistory}
        />
      </motion.div>
    );
  }

  // Main layout for all other views
  return (
    <motion.div
      className={`border-border flex flex-col border shadow-2xl ${
        isMaximized
          ? "h-[calc(90vh-2rem)] w-[calc(40vw-3rem)] rounded-lg"
          : "h-[600px] w-96 rounded-lg"
      } ${activePage === "homepage" ? "homepage-gradient" : "bg-background"}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        height: isMaximized ? "calc(90vh - 2rem)" : "600px",
        width: isMaximized ? "calc(40vw - 3rem)" : "384px",
      }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 1.2,
      }}
      layout
    >
      {/* Header - only show for non-homepage */}
      {activePage !== "homepage" && (
        <Header title={getPageTitle(activePage)} showBack={showBackButton} />
      )}

      {/* Content Area */}
      <motion.div
        key={activePage}
        ref={contentRef}
        className="scroll-container flex-1 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 100 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        layout
        onAnimationComplete={() => {
          // Reset scroll after animation completes
          if (contentRef.current) {
            contentRef.current.scrollTop = 0;
          }
          resetAllScroll();
        }}
      >
        <AnimatePresence mode="wait">
          {activePage === "homepage" && (
            <motion.div
              key="homepage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-4"
            >
              <Homepage
                onNavigateToHelp={() => handlePageChange("help")}
                onClose={onClose}
              />
            </motion.div>
          )}
          {activePage === "message" && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-4"
            >
              <Message
                showChatHistory={showChatHistory}
                onChatSelected={handleChatSelected}
                onBackToHistory={handleBackToHistory}
              />
            </motion.div>
          )}
          {activePage === "help" && (
            <motion.div
              key={`help-${pageKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Helppage
                onShowBackButton={setShowBackButton}
                backButtonTrigger={backButtonTrigger}
                activePage={activePage}
                onShowDetails={setShowDetails}
                onBackFromDetails={handleBackFromDetails}
                onMinimizeOnly={handleMinimizeOnly}
                onAutoMaximize={handleAutoMaximize}
              />
            </motion.div>
          )}
          {activePage === "news" && (
            <motion.div
              key={`news-${pageKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-4"
            >
              <News
                onShowBackButton={setShowBackButton}
                backButtonTrigger={backButtonTrigger}
                activePage={activePage}
                onShowDetails={setShowDetails}
                onBackFromDetails={handleBackFromDetails}
                onAutoMaximize={handleAutoMaximize}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation - hide only when showing article/news details */}
      {!showDetails && <Navigation />}
    </motion.div>
  );
};

export default Chatbot;
