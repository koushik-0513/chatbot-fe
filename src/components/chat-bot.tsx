"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useArticleNavigation } from "@/contexts/article-navigation-context";
import { useScrollContext } from "@/contexts/scroll-context";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { useAutoMaximize } from "@/hooks/custom/use-auto-maximize";

import { Help } from "./help";
import { Home } from "./home";
import { Message } from "./message";
import { News } from "./news";
import { ChatContainer } from "./sub-components/chat-related/chat-container";
import { Header } from "./sub-components/header";
import { Navigation } from "./sub-components/navigation-bar";

type TChatbotProps = {
  user_id: string;
  isMaximized?: boolean; // controlled
  onClose?: () => void;
  onMaximizeChange?: (isMaximized: boolean) => void;
};

export const Chatbot = ({
  isMaximized: externalIsMaximized,
  onMaximizeChange,
}: TChatbotProps) => {
  const [activePage, setActivePage] = useState("homepage");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonTrigger, setBackButtonTrigger] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);
  const [showActiveChat, setShowActiveChat] = useState(false);
  const [navigatedFromHomepage, setNavigatedFromHomepage] = useState(false);
  const [isArticleScrolled, setIsArticleScrolled] = useState(false);
  const { isArticleDetailsOpen } = useArticleNavigation();

  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const prevMaximizedRef = useRef<boolean | null>(null);
  const { resetAllScroll } = useScrollContext();

  // Use controlled maximize value; default to false if not provided (read-only)
  const isMaximized = externalIsMaximized ?? false;

  // Helper to request maximize state changes (controlled)
  const setMaximized = (maximized: boolean) => {
    onMaximizeChange?.(maximized);
  };

  // Reset scroll position when active page changes
  useEffect(() => {
    resetAllScroll();
  }, [activePage, resetAllScroll]);

  const handlePageChange = (page: string, articleId?: string) => {
    if (activePage === "homepage" && page === "help" && articleId) {
      setShowBackButton(true);
      setNavigatedFromHomepage(true);
    } else {
      setShowBackButton(false);
      setNavigatedFromHomepage(false);
    }

    setActivePage(page);
    setShowDetails(false);
    setSelectedArticleId(articleId || null);
    setDynamicTitle(null);

    // Auto-minimize on page change
    setMaximized(false);

    if (page === "message") setShowChatHistory(true);

    resetAllScroll();
  };

  const handleBackToHistory = () => {
    setSelectedChatId(null);
    setShowChatHistory(true);
    setShowActiveChat(false);
    resetAllScroll();

    // Restore previous maximize state if it was changed for active chat
    if (prevMaximizedRef.current !== null) {
      setMaximized(prevMaximizedRef.current);
      prevMaximizedRef.current = null;
    }
  };

  const handleChatSelected = (chatId: string | null) => {
    setSelectedChatId(chatId);
    setShowChatHistory(false);

    // Auto-maximize when selecting a chat from history
    prevMaximizedRef.current = isMaximized;
    setMaximized(true);

    resetAllScroll();
  };

  const handleBackClick = () => {
    resetAllScroll();
    setBackButtonTrigger((prev) => prev + 1);
  };

  const handleBackFromDetails = () => {
    setMaximized(false);
    setShowDetails(false);
    setShowBackButton(false);
    setNavigatedFromHomepage(false);

    handlePageChange("homepage");
    resetAllScroll();
    setIsArticleScrolled(false);
  };

  const handleContentScroll = useCallback(() => {
    if (!contentRef.current || activePage !== "help" || !showDetails) return;
    const isScrolled = contentRef.current.scrollTop > 10;
    setIsArticleScrolled(isScrolled);
  }, [activePage, showDetails]);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    element.addEventListener("scroll", handleContentScroll);
    return () => element.removeEventListener("scroll", handleContentScroll);
  }, [handleContentScroll]);

  // Centralized auto-maximize hook (pass a no-op for the removed internal setter)
  const { triggerAutoMaximize } = useAutoMaximize({
    onMaximizeChange,
    externalIsMaximized,
    setInternalIsMaximized: () => {}, // no-op
  });

  const handleOpenChat = (
    conversationId: string | null,
    chatTitle?: string
  ) => {
    setActivePage("message");
    setShowChatHistory(false);
    setSelectedChatId(conversationId);
    setShowActiveChat(true);
    setTitle(chatTitle || "Untitled Chat");
    resetAllScroll();

    // Auto-maximize when entering active chat, remember previous state
    prevMaximizedRef.current = isMaximized;
    setMaximized(true);
  };

  const handleAskQuestion = () => {
    handlePageChange("message");
    setSelectedChatId(null);
    setShowChatHistory(true);
    setShowActiveChat(false);
  };

  const triggerAutoMinimize = () => setMaximized(false);

  const handleNavigateToHelp = (articleId?: string) => {
    handlePageChange("help", articleId);
  };

  const shouldShowMaximizeButton = () => {
    return showDetails && (activePage === "help" || activePage === "news");
  };

  const getPageTitle = (page: string) => {
    if (page === "help" && dynamicTitle) return dynamicTitle;
    if (
      page === "help" &&
      isArticleDetailsOpen &&
      selectedArticleId &&
      !dynamicTitle
    ) {
      return "";
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

  return (
    <motion.div
      className={cn(
        "chatbot-container flex flex-col shadow-2xl",
        activePage === "homepage" ? "homepage-gradient" : "bg-background"
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        height: isMaximized ? "100%" : "700px",
        width: isMaximized ? "100%" : "400px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      layout="size"
    >
      {activePage !== "homepage" && !showActiveChat && (
        <Header
          title={getPageTitle(activePage)}
          showBack={showBackButton}
          onBackClick={handleBackClick}
          isMaximized={isMaximized}
          onMaximizeChange={setMaximized}
          shouldShowMaximizeButton={shouldShowMaximizeButton}
          showTitleOnScroll={activePage === "help" && showDetails}
          isScrolled={isArticleScrolled}
        />
      )}

      <motion.div
        ref={contentRef}
        className="scroll-container flex-1 overflow-y-auto pt-14"
        style={{ minHeight: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 100 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {activePage === "homepage" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-4"
            >
              <Home
                onNavigateToHelp={handleNavigateToHelp}
                onOpenChat={handleOpenChat}
                onAskQuestion={handleAskQuestion}
              />
            </motion.div>
          )}

          {activePage === "message" && showActiveChat ? (
            <motion.div
              className={cn(
                "chatbot-container border-border bg-background flex flex-col rounded-lg border shadow-2xl"
              )}
              style={{ height: "calc(3rem + 95vh)" }}
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
                chatTitle={title ?? ""}
                onBack={handleBackToHistory}
              />
            </motion.div>
          ) : activePage === "message" ? (
            <motion.div
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
          ) : null}

          {activePage === "help" && (
            <motion.div
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
                selectedArticleId={selectedArticleId}
                onTitleChange={setDynamicTitle}
                navigatedFromHomepage={navigatedFromHomepage}
              />
            </motion.div>
          )}

          {activePage === "news" && (
            <motion.div
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
                onAutoMaximize={triggerAutoMaximize}
                onAutoMinimize={triggerAutoMinimize}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!showDetails && showActiveChat !== true && (
        <Navigation activePage={activePage} onPageChange={handlePageChange} />
      )}
    </motion.div>
  );
};
