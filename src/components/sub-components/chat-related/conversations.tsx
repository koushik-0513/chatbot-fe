import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type TChatHistoryProps = {
  id: string;
  title: string;
  onClick: (id: string) => void;
};

export const Conversation = ({
  id,
  title,
  onClick,
}: TChatHistoryProps) => {
  const handleClick = () => {
    onClick(id);
  };

  return (
    <motion.div
      className="border-border hover:bg-muted flex w-full cursor-pointer items-center justify-between border-b p-3 transition-colors"
      onClick={handleClick}
      whileHover={{ x: 5, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1">
        <h4 className="text-card-foreground mb-1 text-sm font-medium">
          {title}
        </h4>
      </div>
      <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
        <ChevronRight className="text-muted-foreground h-4 w-4" />
      </motion.div>
    </motion.div>
  );
};
