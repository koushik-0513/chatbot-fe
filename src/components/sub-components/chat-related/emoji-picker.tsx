"use client";

import { useEffect, useRef } from "react";

export type TEmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
};

export const EmojiPicker = ({ onEmojiSelect, onClose }: TEmojiPickerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadEmojiPicker = async () => {
      try {
        await import("emoji-picker-element");
        
        if (containerRef.current) {
          // Create the emoji-picker element
          const picker = document.createElement("emoji-picker");
          picker.className = "w-full h-full";
          
          // Add event listener
          const handleEmojiSelect = (event: Event) => {
            const customEvent = event as CustomEvent<{ unicode: string }>;
            onEmojiSelect(customEvent.detail.unicode);
            onClose();
          };

          picker.addEventListener("emoji-click", handleEmojiSelect);
          
          // Clear container and add picker
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(picker);

          return () => {
            picker.removeEventListener("emoji-click", handleEmojiSelect);
          };
        }
      } catch (error) {
        console.error("Failed to load emoji picker:", error);
      }
    };

    loadEmojiPicker();
  }, [onEmojiSelect, onClose]);

  return (
    <div className="absolute bottom-20 left-4 z-50">
      <div className="relative">
        <div
          ref={containerRef}
          className="w-80 h-80"
        />
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-gray-600 p-1 text-white text-xs hover:bg-gray-700 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};
