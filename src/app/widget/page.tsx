"use client";

import { useEffect, useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { BotMessageSquare, X } from "lucide-react";

import {
  COLLAPSED_IFRAME_STYLES,
  DEFAULT_IFRAME_STYLES,
  INITIAL_FRAME_STYLES,
  MAXIMIZED_IFRAME_STYLES,
} from "@/constants/styles";

import { ArticleNavigationProvider } from "@/providers/article-navigation-provider";
import { MaximizeProvider } from "@/providers/maximize-provider";
import { ScrollProvider } from "@/providers/scroll-provider";

import { Chatbot } from "@/components/chat-bot";

import { queryClient } from "@/lib/query-client";

import { useUserId } from "@/hooks/custom/use-user-id";

import { InitialFrameStyles } from "@/types/types";

export default function WidgetPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsMaximized] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const { userId } = useUserId();
  const [, setConfig] = useState({
    primaryColor: "#2563eb",
    customerId: "demo",
    position: "bottom-right",
  });

  useEffect(() => {
    // Detect if we're running inside an iframe
    const embedded = window !== window.parent;
    setIsEmbedded(embedded);

    if (embedded) {
      // EMBEDDED MODE - Running inside iframe

      // Parse URL parameters for configuration
      const urlParams = new URLSearchParams(window.location.search);
      const newConfig = {
        primaryColor: urlParams.get("primaryColor") || "#2563eb",
        customerId: urlParams.get("customerId") || "demo",
        position: urlParams.get("position") || "bottom-right",
      };
      setConfig(newConfig);

      // Start in collapsed state (floating button)
      setIsOpen(false);

      // Apply initial positioning and sizing based on config
      const position = newConfig.position;
      let initialStyles: InitialFrameStyles = { ...INITIAL_FRAME_STYLES };

      // Apply position-specific styles
      switch (position) {
        case "bottom-left":
          initialStyles = {
            ...initialStyles,
            bottom: "20px",
            left: "20px",
            right: "auto",
          };
          break;
        case "top-right":
          initialStyles = {
            ...initialStyles,
            top: "20px",
            right: "20px",
            bottom: "auto",
          };
          break;
        case "top-left":
          initialStyles = {
            ...initialStyles,
            top: "20px",
            left: "20px",
            bottom: "auto",
            right: "auto",
          };
          break;
        default: // bottom-right
          initialStyles = {
            ...initialStyles,
            bottom: "20px",
            right: "20px",
          };
      }

      // Apply the initial styles immediately since we know we're embedded
      window.parent.postMessage(
        {
          type: "CHATBOT_RESIZE",
          styles: initialStyles,
        },
        "*"
      );
    }
  }, []);

  // Resize the iframe from inside
  const resizeIframe = (styles: InitialFrameStyles) => {
    if (isEmbedded) {
      window.parent.postMessage(
        {
          type: "CHATBOT_RESIZE",
          styles: styles,
        },
        "*"
      );
    }
  };

  // Handle opening the chat
  const handleOpen = () => {
    setIsOpen(true);
    setIsMaximized(false);

    if (isEmbedded) {
      resizeIframe(DEFAULT_IFRAME_STYLES);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMaximized(false);

    if (isEmbedded) {
      // Resize back to floating button
      resizeIframe(COLLAPSED_IFRAME_STYLES);
    }
  };

  const handleMaximizeChange = (maximized: boolean) => {
    setIsMaximized(maximized);

    if (!isEmbedded) {
      return;
    }

    if (maximized) {
      if (!isOpen) {
        setIsOpen(true);
      }
      resizeIframe(MAXIMIZED_IFRAME_STYLES);
    } else {
      resizeIframe(DEFAULT_IFRAME_STYLES);
    }
  };

  // EMBEDDED MODE - Handle both collapsed and expanded states
  if (isEmbedded) {
    // COLLAPSED STATE - Show floating button
    if (!isOpen) {
      return (
        <>
          <button
            onClick={handleOpen}
            className="cursor-pointer bg-[#5d3ac8] rounded-full pt-[17px] pb-5 pl-5 pr-5"
            title="Open Chat"
          >
          <BotMessageSquare />
          </button>
        </>
      );
    }

    // EXPANDED STATE - Show full chat interface
    return (
      <div className="h-full w-full">
        <button
          onClick={handleClose}
          className="fixed top-5 right-6 z-100 cursor-pointer rounded-lg text-white transition-all duration-200 hover:scale-105 hover:bg-white/20"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <QueryClientProvider client={queryClient}>
          <MaximizeProvider onMaximizeChange={handleMaximizeChange}>
            <ScrollProvider>
              <ArticleNavigationProvider>
                <Chatbot user_id={userId ?? ""} onClose={() => handleClose()} />
              </ArticleNavigationProvider>
            </ScrollProvider>
          </MaximizeProvider>
        </QueryClientProvider>
      </div>
    );
  }
}