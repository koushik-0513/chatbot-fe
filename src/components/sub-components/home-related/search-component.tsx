import { useState } from "react";

import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TSearchComponentProps {
  onNavigateToHelp?: () => void;
}

// Sample articles data
const sampleArticles = [
  {
    id: "1",
    title: "How ticket states work",
    description: "Learn about different ticket states and their meanings",
  },
  {
    id: "2",
    title: "Create a custom report",
    description: "Step-by-step guide to creating custom reports",
  },
  {
    id: "3",
    title: "HubSpot app",
    description: "Integration guide for HubSpot application",
  },
  {
    id: "4",
    title: "Import your Mixpanel contacts",
    description: "How to import contacts from Mixpanel platform",
  },
];

export const SearchComponent = ({
  onNavigateToHelp,
}: TSearchComponentProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to help page with search query
      onNavigateToHelp?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleArticleClick = (articleId: string) => {
    // Navigate to help page when article is clicked
    onNavigateToHelp?.();
  };

  return (
    <motion.div
      className="bg-card border-border rounded-lg border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Search Input */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search for help"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border py-3 pr-12 pl-4 text-sm focus:ring-2 focus:outline-none"
        />
        <Button
          onClick={handleSearch}
          className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 rounded-md p-0"
          size="sm"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Sample Articles */}
      <div className="space-y-3">
        {sampleArticles.map((article, index) => (
          <motion.button
            key={article.id}
            onClick={() => handleArticleClick(article.id)}
            className="hover:bg-muted/50 flex w-full items-center justify-between rounded-md p-3 text-left transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex-1">
              <h3 className="text-foreground text-sm font-medium">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-xs">
                {article.description}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
