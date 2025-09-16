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

import { useAutoMaximize } from "../hooks/use-auto-maximize";
import { Help } from "./help";
import { Home } from "./home";
import { Message } from "./message";
import { News } from "./news";
import { ChatContainer } from "./sub-components/chat-related/chat-container";

type TChatbotProps = {
  user_id: string;
  onClose?: () => void;
  isMaximized?: boolean;
  onMaximizeChange?: (isMaximized: boolean) => void;
};

type NavigationItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

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
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [pageKey, setPageKey] = useState(Date.now());
  const [internalIsMaximized, setInternalIsMaximized] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);
  const [navigatedFromHomepage, setNavigatedFromHomepage] = useState(false);
  const [postData, setPostData] = useState<any>(null);
  const [showActiveChat, setShowActiveChat] = useState(false);
  const isMaximized =
    externalIsMaximized !== undefined
      ? externalIsMaximized
      : internalIsMaximized;
  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevMaximizedRef = useRef<boolean | null>(null);
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

  const handlePageChange = (page: string, articleId?: string) => {
    // Track if we're navigating from homepage to help with an article
    if (activePage === "homepage" && page === "help" && articleId) {
      setNavigatedFromHomepage(true);
      setShowBackButton(true); // Show back button immediately for homepage->article navigation
    } else {
      setNavigatedFromHomepage(false);
      setShowBackButton(false);
    }

    setActivePage(page);
    setShowDetails(false); // Reset details state when changing pages
    setSelectedArticleId(articleId || null); // Set article ID if provided
    setDynamicTitle(null); // Reset dynamic title when changing pages
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
    setShowActiveChat(false); // Hide the active chat view

    // Reset scroll when going back to chat history
    resetAllScrollWithDelay(100);

    // Restore previous maximize state if it was changed for active chat
    if (prevMaximizedRef.current !== null) {
      const restore = prevMaximizedRef.current;
      if (externalIsMaximized !== undefined) {
        onMaximizeChange?.(restore);
      } else {
        setInternalIsMaximized(restore);
      }
      prevMaximizedRef.current = null;
    }
  };

  const handleNavigateToHome = () => {
    setNavigatedFromHomepage(false);
    handlePageChange("homepage");
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setShowChatHistory(false);
  };

  const handleChatSelected = (chatId: string | null) => {
    console.log("handleChatSelected called with chatId:", chatId);
    console.log("Setting selectedChatId to:", chatId);
    setSelectedChatId(chatId);
    setShowChatHistory(false);
    // Mark as new chat if it's a newly created one
    // You might want to pass this as a parameter from Message component
    console.log("Chat selection state updated");

    // Auto-maximize when selecting a chat from history
    prevMaximizedRef.current = isMaximized;
    if (externalIsMaximized !== undefined) {
      onMaximizeChange?.(true);
    } else {
      setInternalIsMaximized(true);
    }

    resetAllScrollWithDelay(100);
  };

  const handleBackClick = () => {
    // If we navigated from homepage, go back to homepage
    if (navigatedFromHomepage) {
      handleNavigateToHome();
    } else {
      // Otherwise, trigger the normal back behavior
      resetAllScrollWithDelay(100);
      setBackButtonTrigger((prev) => prev + 1);
    }
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

  // Use centralized auto-maximize hook
  const { triggerAutoMaximize, shouldAutoMaximize } = useAutoMaximize({
    onMaximizeChange,
    externalIsMaximized,
    setInternalIsMaximized,
  });

  // Check if we're on a details page where maximize should be shown
  const shouldShowMaximizeButton = () => {
    return showDetails && (activePage === "help" || activePage === "news");
  };

  // Get proper title for each page
  const getPageTitle = (page: string) => {
    // Use dynamic title if available for help page
    if (page === "help" && dynamicTitle) {
      return dynamicTitle;
    }

    // If we navigated from homepage and have an article selected, don't show "Help" initially
    if (
      page === "help" &&
      navigatedFromHomepage &&
      selectedArticleId &&
      !dynamicTitle
    ) {
      return ""; // Return empty string or you can return the article title if available
    }

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
      className="relaborder-border bg-card flex items-center rounded-t-lg border-b p-4"
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
        initial={{ opacity: title ? 1 : 0, y: title ? 0 : -5 }}
        animate={{ opacity: title ? 1 : 0, y: 0 }}
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

  if (activePage === "message" && showActiveChat) {
    console.log("Rendering ChatContainer with selectedChatId:", selectedChatId);
    return (
      <motion.div
        className={`border-border bg-background flex flex-col rounded-lg border shadow-2xl`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          height: isMaximized ? "calc(95vh - 3rem)" : "700px",
          width: isMaximized ? "calc(40vw - 3rem)" : "400px",
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
      >
        <ChatContainer
          chatId={selectedChatId}
          chatTitle={title ?? ""}
          onBack={handleBackToHistory}
          onClose={onClose}
        />
      </motion.div>
    );
  }

  // Main layout for all other views
  return (
    <motion.div
      className={`border-border flex flex-col border shadow-2xl ${
        isMaximized
          ? "h-[calc(95vh-3rem)] w-[calc(40vw-3rem)] rounded-lg"
          : "h-[800px] w-100 rounded-lg"
      } ${activePage === "homepage" ? "homepage-gradient" : "bg-background"}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        height: isMaximized ? "calc(95vh - 3rem)" : "700px",
        width: isMaximized ? "calc(40vw - 3rem)" : "400px",
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
              <Home
                onNavigateToHelp={(articleId) =>
                  handlePageChange("help", articleId)
                }
                onOpenChat={(conversationId, chatTitle) => {
                  // Navigate to chat view and open the selected conversation
                  setActivePage("message");
                  setShowChatHistory(false);
                  setSelectedChatId(conversationId);
                  setShowActiveChat(true);
                  setTitle(chatTitle || "Untitled Chat");
                  resetAllScrollWithDelay(100);

                  // Auto-maximize when entering active chat, remember previous state
                  prevMaximizedRef.current = isMaximized;
                  if (externalIsMaximized !== undefined) {
                    onMaximizeChange?.(true);
                  } else {
                    setInternalIsMaximized(true);
                  }
                }}
                onAskQuestion={() => {
                  // Go to chat history view for starting a new chat
                  handlePageChange("message");
                  setSelectedChatId(null);
                  setShowChatHistory(true);
                  setShowActiveChat(false);
                }}
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
                setShowActiveChat={setShowActiveChat}
                title={setTitle}
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
              <Help
                onShowBackButton={setShowBackButton}
                backButtonTrigger={backButtonTrigger}
                activePage={activePage}
                onShowDetails={setShowDetails}
                onBackFromDetails={handleBackFromDetails}
                onMinimizeOnly={handleMinimizeOnly}
                onAutoMaximize={triggerAutoMaximize}
                selectedArticleId={selectedArticleId}
                onTitleChange={setDynamicTitle}
                onNavigateToHome={handleNavigateToHome}
                navigatedFromHomepage={navigatedFromHomepage}
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
                onAutoMaximize={triggerAutoMaximize}
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
