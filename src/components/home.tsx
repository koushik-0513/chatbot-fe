import { motion } from "framer-motion";
import { X } from "lucide-react";

import { useGetTopArticles } from "../hooks/api/help-service";
import { useGetPosts } from "../hooks/api/posts-service";
import { AskQuestion } from "./sub-components/home-related/ask-question";
import { BlogCard } from "./sub-components/home-related/blog-card";
import { ResentMessage } from "./sub-components/home-related/resent-message";
import { SearchComponent } from "./sub-components/home-related/search-component";

interface THomepageProps {
  onNavigateToHelp?: (articleId?: string) => void;
  onClose?: () => void;
}

export const Home = ({ onNavigateToHelp, onClose }: THomepageProps) => {
  // Fetch top articles
  const {
    data: topArticlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useGetTopArticles();

  // Fetch posts
  const {
    data: posts_data,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetPosts({ page: 1, limit: 5 });

  const display_articles = topArticlesData?.data?.articles || [];

  const display_posts =
    posts_data?.data
      ?.map((post, index) => ({
        ...post,
        id: post.id ? String(post.id) : `post-${index}`,
      }))
      .filter(
        (post) => post.id && post.id !== "undefined" && post.id !== "null"
      ) || [];

  const isLoading = isLoadingArticles || isLoadingPosts;
  const hasError = articlesError || postsError;

  return (
    <motion.div
      className="dark relative space-y-4 pt-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close button */}
      {onClose && (
        <motion.button
          onClick={onClose}
          className="absolute top-2 right-1 z-10 cursor-pointer transition-colors"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close"
        >
          <X className="text-muted-foreground h-5 w-5" />
        </motion.button>
      )}
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
            Loading articles...
          </motion.div>
        </motion.div>
      )}

      {/* Error state */}
      {hasError && (
        <motion.div
          className="bg-destructive/10 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-destructive text-sm">
            Failed to load content. Please try again later.
          </p>
        </motion.div>
      )}

      {/* Posts Section */}
      {!isLoadingPosts && !postsError && display_posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="space-y-4">
            {display_posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
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
          </div>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 + 0.1 }}
      >
        <SearchComponent onNavigateToHelp={onNavigateToHelp} />
      </motion.div>
      {/* No content state */}
      {!isLoading &&
        !hasError &&
        display_articles.length === 0 &&
        display_posts.length === 0 && (
          <motion.div
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-muted-foreground text-sm">
              No content available
            </div>
          </motion.div>
        )}
    </motion.div>
  );
};
