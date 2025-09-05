"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";

import { Chatbot } from "@/components/chatbot";

import { use_user_id } from "@/hooks/use-user-id";

export default function Home() {
  const [isChatbotopen, setIsChatbotOpen] = useState(false);
  const { user_id, is_loading, is_creating_user, create_user_error } =
    use_user_id();
  return (
    <motion.div
      className="bg-card min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main content area */}
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
            Welcome to Our Website
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

      {/* Chatbot toggle button positioned at bottom right */}
      <motion.button
        onClick={() => setIsChatbotOpen(!isChatbotopen)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 bottom-6 z-50 rounded-lg px-4 py-3 font-medium transition-colors"
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
        <Bot />
      </motion.button>

      {/* Chatbot positioned at bottom right */}
      <AnimatePresence>
        {isChatbotopen && user_id && (
          <motion.div
            className="fixed right-6 bottom-20 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <Chatbot user_id={user_id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
