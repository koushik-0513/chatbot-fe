import React, { useEffect, useState } from "react";
import { Root, createRoot } from "react-dom/client";

import { setRuntimeEnv } from "@/config/env";
import { Providers } from "@/providers/providers";
import { TChatbotProps, TEnv } from "@/types/types";
import { Bot, ChevronDown } from "lucide-react";

import { Chatbot } from "@/components/chatbot";

type WidgetChatbotProps = Omit<TChatbotProps, "user_id" | "onClose">;

type InitOptions = {
  target?: string | HTMLElement;
  userId: string;
  backendUrl?: string;
  chatbotProps?: WidgetChatbotProps;
  initiallyOpen?: boolean;
  onClose?: () => void;
};

type InstanceRecord = {
  root: Root;
  container: HTMLElement;
  createdInternally: boolean;
};

const instances = new Map<HTMLElement, InstanceRecord>();

const resolveTarget = (target?: string | HTMLElement): HTMLElement | null => {
  if (!target) {
    return null;
  }

  if (typeof target === "string") {
    return document.querySelector(target);
  }

  return target;
};

const createDefaultContainer = (): HTMLElement => {
  const container = document.createElement("div");
  container.className = "chatbot-widget-host";
  container.style.position = "fixed";
  container.style.right = "24px";
  container.style.bottom = "24px";
  container.style.zIndex = "2147483647"; // Keep widget on top
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "flex-end";
  container.style.gap = "16px";
  container.id = "chatbot-widget-host";
  document.body.appendChild(container);
  return container;
};

const ensureContainer = (
  target?: string | HTMLElement
): {
  element: HTMLElement;
  createdInternally: boolean;
} => {
  const existingTarget = resolveTarget(target);

  if (existingTarget) {
    return { element: existingTarget, createdInternally: false };
  }

  const internallyCreated = createDefaultContainer();
  return { element: internallyCreated, createdInternally: true };
};

const FloatingChatbot: React.FC<{
  userId: string;
  chatbotProps?: WidgetChatbotProps;
  initiallyOpen?: boolean;
  onRequestClose: () => void;
}> = ({ userId, chatbotProps, initiallyOpen = false, onRequestClose }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  useEffect(() => {
    setIsOpen(initiallyOpen);
  }, [initiallyOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    onRequestClose();
  };

  return (
    <div className="chatbot-widget-shell relative flex flex-col items-end gap-4">
      {isOpen && (
        <div className="chatbot-widget-panel">
          <Chatbot
            user_id={userId}
            onClose={handleClose}
            {...(chatbotProps ?? {})}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        className="chatbot-widget-toggle bg-primary text-primary-foreground hover:bg-primary/90 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <Bot className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

const mount = ({
  target,
  userId,
  backendUrl,
  chatbotProps,
  initiallyOpen,
  onClose,
}: InitOptions) => {
  if (!userId) {
    throw new Error("ChatbotWidget.init: `userId` is required");
  }

  if (backendUrl) {
    setRuntimeEnv({ backendUrl });
  }

  const { element, createdInternally } = ensureContainer(target);

  const onRequestClose = () => {
    onClose?.();
  };

  const render = () => (
    <Providers>
      <FloatingChatbot
        userId={userId}
        chatbotProps={chatbotProps}
        initiallyOpen={initiallyOpen}
        onRequestClose={onRequestClose}
      />
    </Providers>
  );

  const existing = instances.get(element);

  if (existing) {
    existing.root.render(render());
    instances.set(element, {
      root: existing.root,
      container: element,
      createdInternally: existing.createdInternally,
    });
    return element;
  }

  const root = createRoot(element);
  root.render(render());

  instances.set(element, { root, container: element, createdInternally });

  return element;
};

const destroy = (target?: string | HTMLElement) => {
  if (target) {
    const resolved = resolveTarget(target);
    if (!resolved) {
      return;
    }

    const instance = instances.get(resolved);
    if (!instance) {
      return;
    }

    instance.root.unmount();
    instances.delete(resolved);

    if (instance.createdInternally && resolved.parentNode) {
      resolved.parentNode.removeChild(resolved);
    }

    return;
  }

  instances.forEach((instance, element) => {
    instance.root.unmount();
    if (instance.createdInternally && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
  instances.clear();
};

const widget = { init: mount, destroy };

declare global {
  interface Window {
    ChatbotWidget?: typeof widget;
    __CHATBOT_WIDGET_CONFIG__?: {
      env?: Partial<TEnv>;
    };
  }
}

if (typeof window !== "undefined") {
  window.ChatbotWidget = widget;
}

export default widget;
