"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useArticleNavigation } from "@/providers/article-navigation-provider";
import { useMaximize } from "@/providers/maximize-provider";
import { useScrollContext } from "@/providers/scroll-provider";
import { useTitle } from "@/providers/title-provider";

import { cn } from "@/lib/utils";

import { Chat } from "./chat";
import { Help } from "./help";
import { Home } from "./home";
import { News } from "./news";
import { Messages } from "./sub-components/chat-related/messages";
import { Header } from "./sub-components/header";
import { Navigation } from "./sub-components/navigation-bar";

export const Chatbot = () => {
  const [activePage, setActivePage] = useState("homepage");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonTrigger, setBackButtonTrigger] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [showActiveChat, setShowActiveChat] = useState(false);
  const [navigatedFromHomepage, setNavigatedFromHomepage] = useState(false);
  const [isArticleScrolled, setIsArticleScrolled] = useState(false);
  const { isArticleDetailsOpen } = useArticleNavigation();
  const { isMaximized, autoMinimize, autoMaximize } = useMaximize();
  const { title: dynamicTitle } = useTitle();

  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const { resetAllScroll } = useScrollContext();

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
    autoMinimize();
  };

  const onChatSelected = (chatId: string | null) => {
    setSelectedChatId(chatId);
    setShowChatHistory(false);
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
  }, [handleContentScroll]);

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

  const containerStyle: React.CSSProperties = {
    height: isMaximized ? "calc(100vh)" : "700px",
    width: isMaximized ? "calc(100vw)" : "400px",
  };

  return (
    <div
      className={cn(
        "chatbot-container flex h-full min-h-0 w-full flex-1 flex-col shadow-2xl",
        activePage === "homepage" ? "homepage-gradient" : "bg-background"
      )}
      style={containerStyle}
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

      {activePage === "homepage" && (
        <Home
          onNavigateToHelp={handleNavigateToHelp}
          onOpenChat={handleOpenChat}
          onAskQuestion={handleAskQuestion}
        />
      )}

      {activePage === "message" && showActiveChat ? (
        <Messages
          chatId={selectedChatId}
          chatTitle={title ?? ""}
          onBack={onBackToHistory}
        />
      ) : activePage === "message" ? (
        <Chat
          showChatHistory={showChatHistory}
          onChatSelected={onChatSelected}
          onBackToHistory={onBackToHistory}
          setShowActiveChat={setShowActiveChat}
          title={setTitle}
        />
      ) : null}

      {activePage === "help" && (
        <div
          className="flex h-full min-h-0 w-full flex-1 overflow-y-auto"
          ref={contentRef}
        >
          <Help
            onShowBackButton={setShowBackButton}
            backButtonTrigger={backButtonTrigger}
            activePage={activePage}
            onShowDetails={setShowDetails}
            onBackFromDetails={handleBackFromDetails}
            selectedArticleId={selectedArticleId}
            navigatedFromHomepage={navigatedFromHomepage}
          />
        </div>
      )}

      {activePage === "news" && (
        <News
          onShowBackButton={setShowBackButton}
          backButtonTrigger={backButtonTrigger}
          activePage={activePage}
          onShowDetails={setShowDetails}
        />
      )}

      {!showDetails && showActiveChat !== true && (
        <Navigation activePage={activePage} onPageChange={handlePageChange} />
      )}
    </div>
  );
};
