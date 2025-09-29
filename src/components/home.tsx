import { cn } from "@/lib/utils";

import { useGetTopArticles } from "@/hooks/api/help-service";
import { useGetPosts } from "@/hooks/api/posts-service";

import { AskQuestion } from "./sub-components/home-related/ask-question";
import { BlogCard } from "./sub-components/home-related/blog-card";
import { ResentMessage } from "./sub-components/home-related/resent-message";
import { SearchComponent } from "./sub-components/home-related/search-component";

type THomepageProps = {
  onNavigateToHelp?: (articleId?: string) => void;
  onOpenChat?: (conversationId: string | null, title?: string) => void;
  onAskQuestion?: () => void;
};

export const Home = ({
  onNavigateToHelp,
  onOpenChat,
  onAskQuestion,
}: THomepageProps) => {
  // Fetch top articles
  const {
    data: topArticlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useGetTopArticles();

  // Fetch posts
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetPosts({ limit: 5 });

  const displayArticles = topArticlesData?.data?.articles || [];

  const displayPosts =
    postsData?.data?.map((post) => ({
      ...post,
      id: post._id,
    })) || [];

  const isLoading = isLoadingArticles || isLoadingPosts;
  const hasError = articlesError || postsError;

  return (
    <div className={cn("dark space-y-4")}>
      <div className={cn("text-foreground p-2")}>
        <h2 className={cn("text-tertiary text-2xl font-bold")}>Hello</h2>
        <h3 className={cn("text-tertiary text-2xl font-bold")}>
          How can I help you today?
        </h3>
      </div>
      <AskQuestion onAsk={onAskQuestion} />
      <ResentMessage onOpenChat={onOpenChat} />

      {/* Loading state */}
      {isLoading && (
        <div
          className={cn(
            "text-muted-foreground flex items-center justify-center py-8 text-sm"
          )}
        >
          Loading articles...
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className={cn("bg-destructive/10 rounded-lg p-4")}>
          <p className={cn("text-destructive text-sm")}>
            Error loading news...
          </p>
        </div>
      )}

      {/* Posts Section */}
      {!isLoadingPosts && !postsError && displayPosts.length > 0 && (
        <div className={cn("space-y-4")}>
          {displayPosts.map((post) => (
            <BlogCard
              id={post.id}
              key={post.id}
              title={post.title}
              description={post.description}
              imageurl={post.image_url}
              link={post.link_url}
            />
          ))}
        </div>
      )}
      <SearchComponent onNavigateToHelp={onNavigateToHelp} />
      {/* No content state */}
      {!isLoading &&
        !hasError &&
        displayArticles.length === 0 &&
        displayPosts.length === 0 && (
          <div
            className={cn(
              "text-muted-foreground flex items-center justify-center py-8 text-sm"
            )}
          >
            No content available
          </div>
        )}
    </div>
  );
};
