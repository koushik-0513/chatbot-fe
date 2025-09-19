"use client";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown } from "lucide-react";

import { Chatbot } from "@/components/chatbot";
import { useUserId } from "@/hooks/use-user-id";

// Widget configuration interface
interface ChatbotWidgetConfig {
  apiUrl?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme?: "light" | "dark";
  primaryColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  width?: string;
  height?: string;
  zIndex?: number;
  showWelcomeMessage?: boolean;
  welcomeMessage?: string;
}

// Default configuration
const defaultConfig: Required<ChatbotWidgetConfig> = {
  apiUrl: "",
  position: "bottom-right",
  theme: "light",
  primaryColor: "#3b82f6",
  buttonColor: "#3b82f6",
  buttonTextColor: "#ffffff",
  width: "400px",
  height: "700px",
  zIndex: 9999,
  showWelcomeMessage: true,
  welcomeMessage: "Welcome to Our Website",
};

// Widget component
const ChatbotWidget: React.FC<{ config: ChatbotWidgetConfig }> = ({ config }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { user_id, is_loading, is_creating_user, create_user_error } = useUserId();

  const mergedConfig = { ...defaultConfig, ...config };

  // Set CSS custom properties for theming
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--chatbot-primary", mergedConfig.primaryColor);
    root.style.setProperty("--chatbot-button-color", mergedConfig.buttonColor);
    root.style.setProperty("--chatbot-button-text-color", mergedConfig.buttonTextColor);
  }, [mergedConfig]);

  // Get position classes
  const getPositionClasses = () => {
    switch (mergedConfig.position) {
      case "bottom-left":
        return "left-6 bottom-6";
      case "top-right":
        return "right-6 top-6";
      case "top-left":
        return "left-6 top-6";
      default:
        return "right-6 bottom-6";
    }
  };

  return (
    <>
      {/* Main content area - only show if welcome message is enabled */}
      {mergedConfig.showWelcomeMessage && (
        <motion.div
          className="bg-card min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-screen flex-row items-center justify-center">
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h1
                className="text-foreground mb-4 text-4xl font-bold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {mergedConfig.welcomeMessage}
              </motion.h1>
              <motion.p
                className="text-muted-foreground mb-8 text-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                This is a demo page to show the chatbot positioning
              </motion.p>

              {/* Loading and status indicators */}
              <AnimatePresence>
                {is_loading && (
                  <motion.div
                    key="loading-indicator"
                    className="text-muted-foreground mb-4 text-sm"
                    initial={{ opacity: 0, y: 10 }}
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
                    className="text-primary mb-4 text-sm"
                    initial={{ opacity: 0, y: 10 }}
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
                    className="bg-destructive/10 mb-4 rounded-lg px-4 py-2"
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

                {user_id && !is_loading && (
                  <motion.div
                    key="user-active-indicator"
                    className="bg-primary/10 mb-4 rounded-lg px-4 py-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-primary text-sm">User session active</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Chatbot toggle button */}
      <motion.button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className={`fixed ${getPositionClasses()} z-50 cursor-pointer rounded-lg px-4 py-3 font-medium transition-colors`}
        style={{
          backgroundColor: mergedConfig.buttonColor,
          color: mergedConfig.buttonTextColor,
          zIndex: mergedConfig.zIndex,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.8,
          type: "spring",
          stiffness: 200,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isChatbotOpen ? <ChevronDown /> : <Bot />}
      </motion.button>

      {/* Chatbot positioned */}
      <AnimatePresence>
        {isChatbotOpen && user_id && (
          <motion.div
            key="chatbot-container"
            className={`fixed ${getPositionClasses()} z-50`}
            style={{
              zIndex: mergedConfig.zIndex,
              bottom: mergedConfig.position.includes("bottom") ? "5rem" : "auto",
              top: mergedConfig.position.includes("top") ? "5rem" : "auto",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, stiffness: 100 }}
          >
            <div
              style={{
                width: mergedConfig.width,
                height: mergedConfig.height,
              }}
            >
              <Chatbot
                user_id={user_id}
                onClose={() => setIsChatbotOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Web Component wrapper
class ChatbotWidgetElement extends HTMLElement {
  private root: any = null;
  private config: ChatbotWidgetConfig = {};

  connectedCallback() {
    // Parse configuration from attributes
    this.config = {
      apiUrl: this.getAttribute("api-url") || "",
      position: (this.getAttribute("position") as any) || "bottom-right",
      theme: (this.getAttribute("theme") as any) || "light",
      primaryColor: this.getAttribute("primary-color") || "#3b82f6",
      buttonColor: this.getAttribute("button-color") || "#3b82f6",
      buttonTextColor: this.getAttribute("button-text-color") || "#ffffff",
      width: this.getAttribute("width") || "400px",
      height: this.getAttribute("height") || "700px",
      zIndex: parseInt(this.getAttribute("z-index") || "9999"),
      showWelcomeMessage: this.getAttribute("show-welcome") !== "false",
      welcomeMessage: this.getAttribute("welcome-message") || "Welcome to Our Website",
    };

    // Create shadow DOM
    this.attachShadow({ mode: "open" });
    
    // Create a container for React
    const container = document.createElement("div");
    this.shadowRoot?.appendChild(container);

    // Create React root and render
    this.root = createRoot(container);
    this.root.render(React.createElement(ChatbotWidget, { config: this.config }));
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    }
  }

  // Method to update configuration
  updateConfig(newConfig: Partial<ChatbotWidgetConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.root) {
      this.root.render(React.createElement(ChatbotWidget, { config: this.config }));
    }
  }
}

// Register the custom element
if (typeof window !== "undefined" && !customElements.get("chatbot-widget")) {
  customElements.define("chatbot-widget", ChatbotWidgetElement);
}

export { ChatbotWidget, ChatbotWidgetElement, type ChatbotWidgetConfig };
