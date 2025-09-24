"use client";

import { useEffect, useState } from "react";

import { Bot, ChevronDown, X } from "lucide-react";

import { Chatbot } from "@/components/chatbot";

import { useUserId } from "@/hooks/use-user-id";

const COLLAPSED_IFRAME_STYLES = {
  width: "60px",
  height: "60px",
  maxWidth: "none",
  maxHeight: "none",
};

const DEFAULT_IFRAME_STYLES = {
  width: "400px",
  height: "700px",
  borderRadius: "12px",
  maxWidth: "90vw",
  maxHeight: "90vh",
};

const START_TEST = {
  width: "60px",
  height: "60px",
  zIndex: 9999,
  borderRadius: "12px",
  position: "fixed",
};

const MAXIMIZED_IFRAME_STYLES = {
  width: "600px",
  height: "900px",
  borderRadius: "12px",
  maxWidth: "100%",
  maxHeight: "100%",
};

export default function WidgetPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const { user_id } = useUserId();
  const [config, setConfig] = useState({
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
      console.log("position", position);
      let initialStyles: any = { ...START_TEST };

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
  const resizeIframe = (styles: any) => {
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
    console.log("handleMaximizeChange", maximized);
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
        <div className="w-100% h-100%">
          <button
            onClick={handleOpen}
            className="cursor-pointer p-5"
            title="Open Chat"
          >
            <Bot />
          </button>
        </div>
      );
    }

    // EXPANDED STATE - Show full chat interface
    return (
      // <div className="w-full h-full">
      <>
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-100 cursor-pointer rounded-lg text-white transition-all duration-200 hover:scale-105 hover:bg-white/20"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <Chatbot
          user_id={user_id ?? ""}
          onClose={() => handleClose()}
          isMaximized={isMaximized}
          onMaximizeChange={handleMaximizeChange}
        />
      </>
      // </div>
    );
  }
}
