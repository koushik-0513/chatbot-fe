import { useState } from "react";

import { ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useGetTopArticles } from "@/hooks/api/help";

type TSearchComponentProps = {
  onNavigateToHelp?: (articleId?: string) => void;
};

export const SearchComponent = ({
  onNavigateToHelp,
}: TSearchComponentProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch top articles from API
  const {
    data: topArticlesData,
    isLoading,
    error,
  } = useGetTopArticles({
    enabled: true,
  });

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

  const handleArticleClick = (article: { id: string; title?: string }) => {
    // Navigate to help page with article ID
    onNavigateToHelp?.(article.id);
  };

  const handleInputClick = () => {
    // Navigate to help page immediately when search input is clicked
    onNavigateToHelp?.();
  };

  return (
    <div className="bg-card border-border rounded-lg border p-6">
      {/* Search Input */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search for articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          onClick={handleInputClick}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border py-3 pr-12 pl-4 text-sm focus:ring-2 focus:outline-none"
        />
        <Button
          onClick={handleSearch}
          className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-md p-0"
          size="sm"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {error && (
          <div className="text-destructive py-4 text-center text-sm">
            {error.message}
          </div>
        )}
        {isLoading ? (
          <div className="text-destructive py-4 text-center text-sm">
            Loading articles...
          </div>
        ) : topArticlesData?.data?.articles &&
          topArticlesData.data.articles.length > 0 ? (
          topArticlesData.data.articles.slice(0, 4).map((article) => (
            <button
              key={article.id}
              onClick={() => handleArticleClick(article)}
              className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-md p-3 text-left transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-foreground text-sm font-medium">
                  {article.title}
                </h3>
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            </button>
          ))
        ) : (
          <div className="text-muted-foreground py-4 text-center text-sm">
            No articles available
          </div>
        )}
      </div>
    </div>
  );
};
