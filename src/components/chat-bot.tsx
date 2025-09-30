"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useArticleNavigation } from "@/providers/article-navigation-provider";
import { useMaximize } from "@/providers/maximize-provider";
import { useScrollContext } from "@/providers/scroll-provider";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { Help } from "./help";
import { Home } from "./home";
import { Message } from "./message";
import { News } from "./news";
import { ChatContainer } from "./sub-components/chat-related/chat-container";
import { Header } from "./sub-components/header";
import { Navigation } from "./sub-components/navigation-bar";

type TChatbotProps = {
  user_id: string; // controlled
  onClose?: () => void;
};

export const Chatbot = ({}: TChatbotProps) => {
  // Use controlled maximize value; default to false if not provided (read-only)
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
  const { isMaximized, autoMinimize, autoMaximize } = useMaximize();

  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const { resetAllScroll } = useScrollContext();

  // Reset scroll position when active page changes

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

    // Only auto-minimize when going back to homepage or list views
    // Don't auto-minimize when entering details or chat container
    if (
      page === "homepage" ||
      (page === "help" && !articleId) ||
      page === "news"
    ) {
      autoMinimize();
    }

    if (page === "message") setShowChatHistory(true);

    resetAllScroll();
  };

  const onBackToHistory = () => {
    setSelectedChatId(null);
    setShowChatHistory(true);
    setShowActiveChat(false);
    resetAllScroll();

    // Auto-minimize when going back to chat history
    autoMinimize();
  };

  const onChatSelected = (chatId: string | null) => {
    setSelectedChatId(chatId);
    setShowChatHistory(false);

    // Auto-maximize when selecting a chat from history
    autoMaximize();

    resetAllScroll();
  };

  const handleBackClick = () => {
    resetAllScroll();
    setBackButtonTrigger((prev) => prev + 1);
  };

  const handleBackFromDetails = () => {
    autoMinimize();
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
  }, []);

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

    // Auto-maximize when entering active chat
    autoMaximize();
  };

  const handleAskQuestion = () => {
    handlePageChange("message");
    setSelectedChatId(null);
    setShowChatHistory(true);
    setShowActiveChat(false);
  };

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
        "chatbot-container flex h-full min-h-0 w-full flex-1 flex-col shadow-2xl",
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
          shouldShowMaximizeButton={shouldShowMaximizeButton}
          showTitleOnScroll={activePage === "help" && showDetails}
          isScrolled={isArticleScrolled}
        />
      )}

      {/* <div className="flex flex-1 min-h-0 w-full"> */}
      <AnimatePresence mode="wait">
        {activePage === "homepage" && (
          <motion.div
            key="homepage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex h-full min-h-0 w-full p-4"
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
            key="active-chat"
            className="flex h-full min-h-0 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              ...(isMaximized ? { height: "100%", width: "100%" } : {}),
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <ChatContainer
              chatId={selectedChatId}
              chatTitle={title ?? ""}
              onBack={onBackToHistory}
            />
          </motion.div>
        ) : activePage === "message" ? (
          <motion.div
            key="message-history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex h-full min-h-0 w-full"
          >
            <Message
              showChatHistory={showChatHistory}
              onChatSelected={onChatSelected}
              onBackToHistory={onBackToHistory}
              setShowActiveChat={setShowActiveChat}
              title={setTitle}
            />
          </motion.div>
        ) : null}

        {activePage === "help" && (
          <motion.div
            key="help"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex h-full min-h-0 w-full overflow-y-auto"
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
            key="news"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex h-full min-h-0 w-full flex-col overflow-y-auto p-4"
          >
            <News
              onShowBackButton={setShowBackButton}
              backButtonTrigger={backButtonTrigger}
              activePage={activePage}
              onShowDetails={setShowDetails}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* </div> */}

      {!showDetails && showActiveChat !== true && (
        <div className="sticky bottom-0 z-30 w-full">
          <Navigation activePage={activePage} onPageChange={handlePageChange} />
        </div>
      )}
    </motion.div>
  );
};
