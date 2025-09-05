import { motion } from "framer-motion";

import { TNews } from "../../../types/types";

interface TNewsDetailsProps {
  news: TNews;
  onBack: () => void;
}

export const NewsDetails = ({ news }: TNewsDetailsProps) => {
  const format_date = (date_string: string | undefined): string => {
    if (!date_string) return "Recently";
    try {
      return new Date(date_string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const get_author_name = (): string => {
    if (news.author && typeof news.author === "object" && news.author.name) {
      return news.author.name;
    }
    return "Anonymous";
  };

  const get_author_initial = (): string => {
    const name = get_author_name();
    return name.charAt(0).toUpperCase();
  };

  const get_author_image = (): string | null => {
    if (
      news.author &&
      typeof news.author === "object" &&
      news.author.profileImage
    ) {
      return news.author.profileImage;
    }
    return null;
  };

  // Animation variants for better performance
  const container_variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const item_variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const scale_variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring" as const,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col"
      variants={container_variants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Image - Full Width */}
      {(news.imageUrl || news.image) && (
        <div
          className="mb-6 w-full"
        >
          <img
            src={news.imageUrl || news.image}
            alt={news.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-muted text-muted-foreground cursor-pointer rounded-full px-3 py-1 text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Article Title */}
        <motion.h1
          className="text-card-foreground text-xl leading-tight font-bold"
          variants={item_variants}
        >
          {news.title}
        </motion.h1>

        {/* Author and Metadata */}
        <motion.div
          className="flex items-center justify-between"
          variants={item_variants}
        >
          <div className="flex items-center gap-3">
            {get_author_image() ? (
              <motion.img
                src={get_author_image()!}
                alt={get_author_name()}
                className="h-10 w-10 rounded-full object-cover"
                variants={scale_variants}
              />
            ) : (
              <motion.div
                className="bg-muted flex h-10 w-10 items-center justify-center rounded-full"
                variants={scale_variants}
              >
                <span className="text-primary text-sm font-medium">
                  {get_author_initial()}
                </span>
              </motion.div>
            )}
            <motion.div variants={item_variants}>
              <p className="text-card-foreground text-sm font-medium">
                {get_author_name()}
              </p>
              <p className="text-muted-foreground text-xs">
                {format_date(news.publishedAt)}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        {news.content && (
          <motion.div
            className="prose prose-lg text-foreground max-w-none"
            variants={item_variants}
          >
            <motion.div
              dangerouslySetInnerHTML={{ __html: news.content }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>
        )}

        {/* Bullet Points */}
        {news.bulletPoints && news.bulletPoints.length > 0 && (
          <motion.div
            className="bg-muted rounded-lg p-6"
            variants={item_variants}
            whileHover={{ scale: 1.01 }}
          >
            <motion.h3
              className="text-card-foreground mb-4 text-xl font-semibold"
              variants={item_variants}
            >
              Key Points
            </motion.h3>
            <motion.ul className="space-y-3" variants={item_variants}>
              {news.bulletPoints.map((point, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  variants={item_variants}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.span
                    className="text-primary mt-1 font-bold"
                    variants={scale_variants}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    •
                  </motion.span>
                  <span className="text-foreground">{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};