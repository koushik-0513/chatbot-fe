import { motion } from "framer-motion";

import { useGetPosts } from "../services/posts-service";
import { AskQuestion } from "./sub-components/home-related/ask-question";
import { BlogCard } from "./sub-components/home-related/blog-card";
import { ResentMessage } from "./sub-components/home-related/resent-message";

export const Homepage = () => {
  const {
    data: posts_data,
    isLoading,
    error,
  } = useGetPosts({ page: 1, limit: 5 });

  const display_posts =
    posts_data?.data
      ?.map((post, index) => ({
        ...post,
        id: post.id ? String(post.id) : `post-${index}`, // Fallback ID if post.id is undefined/null
      }))
      .filter(
        (post) => post.id && post.id !== "undefined" && post.id !== "null"
      ) || [];

  return (
    <motion.div
      className="space-y-4 pt-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <AskQuestion />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <ResentMessage />
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <motion.div
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-muted-foreground text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading posts...
          </motion.div>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <motion.div
          className="bg-destructive/10 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-destructive text-sm">
            Failed to load posts. Please try again later.
          </p>
        </motion.div>
      )}

      {/* Posts - Safer rendering */}
      {!isLoading &&
        !error &&
        display_posts.length > 0 &&
        display_posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <BlogCard
              id={post.id}
              title={post.title}
              description={post.description}
              imageurl={post.imageUrl}
              link={post.linkUrl}
            />
          </motion.div>
        ))}

      {/* No posts state */}
      {!isLoading && !error && display_posts.length === 0 && (
        <motion.div
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-muted-foreground text-sm">
            No posts available
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
