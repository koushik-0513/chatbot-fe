"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CircleQuestionMark,
  House,
  Maximize2,
  Megaphone,
  MessageSquareText,
  X,
} from "lucide-react";

import { chatHistoryData } from "../data/data";
import { Helppage } from "./help";
import { Homepage } from "./home";
import { Message } from "./message";
import { News } from "./news";
import { ChatContainer } from "./sub-components/chat-related/chat-container";

interface TChatbotProps {
  user_id: string;
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

export const Chatbot = ({ user_id }: TChatbotProps) => {
  const [activePage, setActivePage] = useState("homepage");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonTrigger, setBackButtonTrigger] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const handlePageChange = (page: string) => {
    setActivePage(page);
    setShowBackButton(false);
    if (page === "message") {
      setShowChatHistory(true);
    }
  };

  const handleBackToHistory = () => {
    setSelectedChatId(null);
    setShowChatHistory(true);
  };

  const handleChatSelected = (chatId: number) => {
    setSelectedChatId(chatId);
    setShowChatHistory(false);
  };

  const handleBackClick = () => {
    setBackButtonTrigger((prev) => prev + 1);
  };

  // Navigation Component
  const Navigation = () => (
    <motion.div
      className="border-border bg-card flex gap-1 rounded-b-lg border-t p-3"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <motion.button
            key={item.id}
            onClick={() => handlePageChange(item.id)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-md p-2 transition-all ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
            <span
              className={`text-xs font-medium ${isActive ? "text-primary" : ""}`}
            >
              {item.label}
            </span>
          </motion.button>
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <AnimatePresence>
        {showBack && (
          <motion.button
            onClick={handleBackClick}
            className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="text-muted-foreground h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <h2
        className={`${showBack ? "" : "flex-1"} text-foreground text-center text-lg font-semibold`}
      >
        {title}
      </h2>
      <div className="ml-auto flex items-center gap-2">
        <motion.button
          className="hover:bg-muted rounded-full p-1 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Maximize2 className="text-muted-foreground h-4 w-4" />
        </motion.button>
        <motion.button
          className="hover:bg-muted rounded-full p-1 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="text-muted-foreground h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );

  // If a chat is selected, show the full ChatContainer
  if (selectedChatId && activePage === "message") {
    const selectedChat = chatHistoryData.find(
      (chat) => chat.id === selectedChatId
    );
    return (
      <motion.div
        className="border-border bg-background flex h-[600px] w-96 flex-col rounded-lg border shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <ChatContainer
          chatId={selectedChatId}
          chatTitle={selectedChat?.title || "Chat"}
          onBack={handleBackToHistory}
        />
      </motion.div>
    );
  }

  // Main layout for all other views
  return (
    <motion.div
      className="border-border bg-background flex h-[600px] w-96 flex-col rounded-lg border shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      {/* Header - only show for non-homepage */}
      {activePage !== "homepage" && (
        <Header title={activePage} showBack={showBackButton} />
      )}

      {/* Content Area */}
      <motion.div
        className="flex-1 overflow-y-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <AnimatePresence mode="wait">
          {activePage === "homepage" && (
            <motion.div
              key="homepage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Homepage />
            </motion.div>
          )}
          {activePage === "message" && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
              key="help"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Helppage
                onShowBackButton={setShowBackButton}
                backButtonTrigger={backButtonTrigger}
              />
            </motion.div>
          )}
          {activePage === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <News
                onShowBackButton={setShowBackButton}
                backButtonTrigger={backButtonTrigger}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation - always shown */}
      <Navigation />
    </motion.div>
  );
};

export default Chatbot;
