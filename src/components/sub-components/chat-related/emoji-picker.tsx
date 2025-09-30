"use client";

import { useEffect, useRef, useState } from "react";
import { createElement } from "react";

import dynamic from "next/dynamic";

export type TEmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
};

const EmojiPickerComponent = ({
  onEmojiSelect,
  onClose,
}: TEmojiPickerProps) => {
  const pickerRef = useRef<HTMLElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Dynamically import the emoji-picker-element only on client side
    const loadEmojiPicker = async () => {
      try {
        await import("emoji-picker-element");
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    loadEmojiPicker();
  }, [isClient]);

  useEffect(() => {
    if (!isLoaded || !isClient) return;

    const picker = pickerRef.current;
    if (picker) {
      const handleEmojiSelect = (event: Event) => {
        const customEvent = event as CustomEvent<{ unicode: string }>;
        onEmojiSelect(customEvent.detail.unicode);
        onClose();
      };

      picker.addEventListener("emoji-click", handleEmojiSelect);

      return () => {
        picker.removeEventListener("emoji-click", handleEmojiSelect);
      };
    }
  }, [isLoaded, isClient]);

  if (!isClient || !isLoaded) {
    return (
      <div className="absolute bottom-16 left-0 z-50 flex w-80 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
        <div className="text-sm text-gray-500">Loading emoji picker...</div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-16 left-0 z-50">
      <div className="relative">
        {createElement("emoji-picker", {
          ref: pickerRef,
          class: "emoji-picker-custom",
          style: {
            "--border-radius": "0.625rem",
            "--border-color": "var(--border)",
            "--background-color": "var(--card)",
            "--text-color": "var(--foreground)",
            "--category-emoji-padding": "8px",
            "--emoji-size": "20px",
            "--emoji-padding": "4px",
            "--category-icon-size": "16px",
            "--search-background-color": "var(--input)",
            "--search-border-color": "var(--border)",
            "--search-text-color": "var(--foreground)",
            "--search-placeholder-color": "var(--muted-foreground)",
            "--preview-background-color": "var(--muted)",
            "--preview-text-color": "var(--foreground)",
            "--category-background-color": "var(--card)",
            "--category-text-color": "var(--muted-foreground)",
            "--category-text-color-hover": "var(--foreground)",
            "--category-text-color-active": "var(--primary)",
            "--emoji-background-color-hover": "var(--muted)",
            "--emoji-background-color-active": "var(--primary)",
            "--emoji-background-color-active-opacity": "0.2",
          },
        })}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 rounded-full bg-gray-800 p-1 text-white transition-colors hover:bg-gray-700"
        >
          <span className="text-sm">×</span>
        </button>
      </div>
    </div>
  );
};

// Export the component with dynamic import and no SSR
export const EmojiPicker = dynamic(
  () => Promise.resolve(EmojiPickerComponent),
  {
    ssr: false,
    loading: () => (
      <div className="absolute bottom-16 left-0 z-50 flex w-80 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
        <div className="text-sm text-gray-500">Loading emoji picker...</div>
      </div>
    ),
  }
);
