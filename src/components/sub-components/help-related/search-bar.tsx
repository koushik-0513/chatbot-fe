"use client";

import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search for help"
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border py-3 pr-12 pl-4 text-sm focus:ring-2 focus:outline-none"
      />
      <Search className="text-muted-foreground absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
    </div>
  );
};
