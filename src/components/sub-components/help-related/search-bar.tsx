"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

export const SearchBar = ({ searchQuery, onSearchChange, onClearSearch, isSearching }: SearchBarProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearClick = () => {
    onClearSearch();
  };

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Search for help"
        value={searchQuery}
        onChange={handleInputChange}
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border py-3 pr-12 pl-4 text-sm focus:ring-2 focus:outline-none"
      />
      {isSearching && searchQuery ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearClick}
          className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Search className="text-muted-foreground absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
      )}
    </div>
  );
};
