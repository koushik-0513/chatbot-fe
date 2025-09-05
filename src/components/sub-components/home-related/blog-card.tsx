import Link from "next/link";

import { motion } from "framer-motion";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Update your BlogCard interface to make some props optional
interface TBlogCardProps {
  id: string;
  title: string;
  description?: string; // Make optional
  imageurl?: string; // Make optional
  link: string;
}

export const BlogCard = ({
  title,
  description = "No description available", // Default values
  imageurl,
  link,
}: TBlogCardProps) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="mb-4 overflow-hidden p-0">
        <div className="px-3 pt-4">
          <img
            src={imageurl}
            alt={title}
            className="h-48 w-full object-cover"
          />
        </div>
        <Link href={link}>
          <div>
            <CardHeader className="border-border hover:bg-muted border-t p-4 transition-colors">
              <CardTitle className="text-card-foreground mb-2 text-lg font-bold">
                {title}
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </CardHeader>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};
