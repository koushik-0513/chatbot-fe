import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type TNavigationItem = {
  id: string;
  icon: React.ComponentType<{ className: string }>;
  label: string;
};

type NavigationProps = {
  activePage: string;
  onPageChange: (page: string) => void;
};

export const Navigation = ({ activePage, onPageChange }: NavigationProps) => (
  <motion.div className="border-border bg-card flex gap-1 rounded-b-lg border-t p-3">
    {NAVIGATION_ITEMS.map((item) => {
      const Icon = item.icon;
      const isActive = activePage === item.id;

      return (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          className={cn(
            "flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-md p-2 transition-colors",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
          <span
            className={cn(
              "text-xs font-medium",
              isActive ? "text-primary" : ""
            )}
          >
            {item.label}
          </span>
        </button>
      );
    })}
  </motion.div>
);
