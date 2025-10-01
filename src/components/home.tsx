import { useGetTopArticles } from "@/hooks/api/help";
import { useGetPosts } from "@/hooks/api/posts";

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
  } = useGetTopArticles({ enabled: true });

  // Fetch posts
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetPosts({ limit: 5 }, { enabled: true });

  const displayArticles = topArticlesData?.data?.articles || [];

  const displayPosts =
    postsData?.data?.map((post) => ({
      ...post,
      id: post._id,
    })) || [];

  const isLoading = isLoadingArticles || isLoadingPosts;
  const hasError = articlesError || postsError;

  return (
    <div className="dark flex h-full flex-col space-y-4 overflow-y-auto p-4">
      <div className="text-foreground p-2">
        <h2 className="text-tertiary text-2xl font-bold">Hello</h2>
        <h3 className="text-tertiary text-2xl font-bold">
          How can I help you today?
        </h3>
      </div>
      <AskQuestion onAsk={onAskQuestion} />
      <ResentMessage onOpenChat={onOpenChat} />

      {/* Loading state */}
      {isLoading && (
        <div className="flex h-full w-[400px] items-center justify-center text-muted-foreground py-8 text-sm">
          Loading articles...
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="bg-destructive/10 rounded-lg p-4">
          <p className="text-destructive text-sm">Error loading news...</p>
        </div>
      )}

      {/* Posts Section */}
      {!isLoadingPosts && !postsError && displayPosts.length > 0 && (
        <div className="space-y-4">
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
          <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">
            No content available
          </div>
        )}
    </div>
  );
};
