"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown } from "lucide-react";

import { Chatbot } from "@/components/chatbot";
import { useUserId } from "@/hooks/use-user-id";

// Standalone iframe page for chatbot embedding
export default function IframePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user_id, is_loading, is_creating_user, create_user_error } = useUserId();

  // Handle messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the same origin or trusted domains
      if (event.origin !== window.location.origin && !isTrustedOrigin(event.origin)) {
        return;
      }

      const { type, data } = event.data || {};

      switch (type) {
        case 'OPEN_CHATBOT':
          setIsChatbotOpen(true);
          break;
        case 'CLOSE_CHATBOT':
          setIsChatbotOpen(false);
          break;
        case 'TOGGLE_CHATBOT':
          setIsChatbotOpen(prev => !prev);
          break;
        case 'SET_USER_ID':
          // Handle custom user ID if provided
          break;
      }
    };

    // Check if we're in an iframe
    const isInIframe = window !== window.parent;
    
    if (isInIframe) {
      // Send ready signal to parent
      window.parent.postMessage({ type: 'CHATBOT_READY' }, '*');
      setIsLoaded(true);
    } else {
      // If not in iframe, show the toggle button
      setIsLoaded(true);
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send messages to parent window
  const sendMessageToParent = (type: string, data?: any) => {
    if (window !== window.parent) {
      window.parent.postMessage({ type, data }, '*');
    }
  };

  const handleToggleChatbot = () => {
    const newState = !isChatbotOpen;
    setIsChatbotOpen(newState);
    sendMessageToParent('CHATBOT_TOGGLED', { isOpen: newState });
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
    sendMessageToParent('CHATBOT_CLOSED');
  };

  // Check if origin is trusted (you can customize this list)
  const isTrustedOrigin = (origin: string) => {
    const trustedOrigins = [
      'http://localhost:3000',
      'https://yourdomain.com',
      // Add more trusted domains as needed
    ];
    return trustedOrigins.includes(origin);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background">
      {/* Toggle button - only show if not in iframe */}
      {window === window.parent && (
        <motion.button
          onClick={handleToggleChatbot}
          className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 bottom-6 z-50 cursor-pointer rounded-lg px-4 py-3 font-medium transition-colors"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isChatbotOpen ? <ChevronDown /> : <Bot />}
        </motion.button>
      )}

      {/* Status indicators */}
      <AnimatePresence>
        {is_loading && (
          <motion.div
            key="loading-indicator"
            className="text-muted-foreground fixed left-4 top-4 z-40 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Initializing user session...
          </motion.div>
        )}

        {is_creating_user && (
          <motion.div
            key="creating-user-indicator"
            className="text-primary fixed left-4 top-12 z-40 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Creating user account...
          </motion.div>
        )}

        {create_user_error && (
          <motion.div
            key="error-indicator"
            className="bg-destructive/10 fixed left-4 top-20 z-40 rounded-lg px-4 py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-destructive text-sm">
              Warning: Could not connect to server. Working offline.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot - show when open and user is ready */}
      <AnimatePresence>
        {isChatbotOpen && user_id && (
          <motion.div
            key="chatbot-container"
            className="fixed right-6 bottom-20 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, stiffness: 100 }}
          >
            <Chatbot
              user_id={user_id}
              onClose={handleCloseChatbot}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback content when chatbot is closed or user not ready */}
      {(!isChatbotOpen || !user_id) && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <Bot className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              Chatbot Ready
            </h2>
            <p className="text-muted-foreground">
              {!user_id ? "Initializing..." : "Click the button to start chatting"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
