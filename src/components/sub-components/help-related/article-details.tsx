import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown support

import { THelpArticle, THelpArticleDetailResponse } from "../../../types/types";

interface TArticleDetailsProps {
  initialArticle: THelpArticle;
  articleDetailsData: THelpArticleDetailResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  onBack: () => void;
}

export const ArticleDetails = ({
  initialArticle,
  articleDetailsData,
  isLoading,
  error,
  onBack,
}: TArticleDetailsProps) => {
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

  // Use API data if available, otherwise fall back to initial article data
  const article = articleDetailsData?.data.article || {
    id: initialArticle.id,
    title: initialArticle.title,
    content: initialArticle.content || "",
    excerpt: initialArticle.description || "",
    read_time: 5, // Default read time
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const author = articleDetailsData?.data.author || {
    id: "default",
    name: initialArticle.author || "Anonymous",
    role: "Author",
    profile_image: "",
    bio: "",
    email: "",
    social_links: {},
  };

  const co_authors = articleDetailsData?.data.co_authors || [];

  // Function to determine if content is HTML or Markdown
  const isHTML = (str: string) => {
    const htmlRegex = /<[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container_variants}
      initial="hidden"
      animate="visible"
    >
      {/* Article title */}
      <motion.div variants={item_variants}>
        <div className="flex items-center gap-2">
          <h1 className="text-card-foreground mb-3 text-2xl font-bold">
            {article.title}
          </h1>
          {isLoading && (
            <motion.div
              className="border-primary h-4 w-4 rounded-full border-2 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        {article.excerpt && (
          <p className="text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </motion.div>

      {/* Author information */}
      <motion.div className="space-y-3" variants={item_variants}>
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full"
            variants={scale_variants}
          >
            <span className="text-primary text-sm font-medium">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </motion.div>
          <motion.div variants={item_variants}>
            <p className="text-muted-foreground text-sm">
              Written by {author.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {author.role}
            </p>
          </motion.div>
        </div>

        {/* Co-authors */}
        {co_authors.length > 0 && (
          <motion.div
            className="flex items-center gap-2"
            variants={item_variants}
          >
            <span className="text-muted-foreground text-xs">
              Co-authored with:
            </span>
            <div className="flex -space-x-1">
              {co_authors.slice(0, 3).map((coAuthor, index) => (
                <motion.div
                  key={coAuthor.id}
                  className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-medium"
                  variants={scale_variants}
                  transition={{ delay: index * 0.1 }}
                >
                  {coAuthor.name.charAt(0)}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <motion.div className="flex flex-wrap gap-2" variants={item_variants}>
          {article.tags.map((tag, index) => (
            <motion.span
              key={tag}
              className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs"
              variants={scale_variants}
              transition={{ delay: index * 0.05 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Article content */}
      <motion.div
        className="prose prose-sm max-w-none"
        variants={item_variants}
      >
        {article.content ? (
          <>
            {/* Using react-markdown */}
            {!isHTML(article.content) ? (
              <motion.div
                className="article-content text-accent prose prose-sm max-w-none
                  prose-headings:text-card-foreground
                  prose-p:text-accent prose-p:leading-relaxed
                  prose-strong:text-card-foreground
                  prose-ul:text-accent prose-ol:text-accent
                  prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                  prose-code:bg-muted prose-code:text-card-foreground prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-muted prose-pre:text-card-foreground
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom component rendering
                    h1: ({children}) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
                    p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                    li: ({children}) => <li className="mb-1">{children}</li>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({children, className}) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>
                      ) : (
                        <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                          <code>{children}</code>
                        </pre>
                      );
                    },
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </motion.div>
            ) : (
              // If content is already HTML, render it as before
              <motion.div
                className="article-content text-accent"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  lineHeight: "1.6",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )}
          </>
        ) : (
          <motion.div className="space-y-4" variants={item_variants}>
            <p className="leading-relaxed text-gray-700">
              {article.excerpt || "No content available for this article."}
            </p>
            {isLoading && (
              <motion.div
                className="text-muted-foreground flex items-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="border-primary h-3 w-3 rounded-full border border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Loading full content...
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Article metadata */}
      <motion.div
        className="border-border border-t pt-4"
        variants={item_variants}
      >
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            Created: {new Date(article.created_at).toLocaleDateString()}
          </span>
          <span>
            Updated: {new Date(article.updated_at).toLocaleDateString()}
          </span>
        </div>
        {articleDetailsData && (
          <motion.div
            className="mt-2 flex items-center gap-2 text-xs text-green-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            Content enhanced with latest data
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};