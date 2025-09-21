"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown } from "lucide-react";

import { Chatbot } from "@/components/chatbot";

import { useUserId } from "@/hooks/use-user-id";

export default function Home() {
  const [isChatbotopen, setIsChatbotOpen] = useState(false);
  const { user_id } = useUserId();
  return (
    <motion.div
      className="bg-card min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={() => setIsChatbotOpen(!isChatbotopen)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 bottom-6 z-50 cursor-pointer rounded-lg px-4 py-3 font-medium transition-colors"
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
        {isChatbotopen ? <ChevronDown /> : <Bot />}
      </motion.button>

      {/* Chatbot positioned at bottom right */}
      <AnimatePresence>
        {isChatbotopen && user_id && (
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
              onClose={() => setIsChatbotOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
