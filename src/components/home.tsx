import { UI_MESSAGES } from "@/constants/constants";

import { useGetTopArticles } from "../hooks/api/help-service";
import { useGetPosts } from "../hooks/api/posts-service";
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
    data: posts_data,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetPosts({ page: 1, limit: 5 });

  const display_articles = topArticlesData?.data?.articles || [];

  const display_posts =
    posts_data?.data?.map((post) => ({
      ...post,
      id: post._id,
    })) || [];

  const isLoading = isLoadingArticles || isLoadingPosts;
  const hasError = articlesError || postsError;

  return (
    <div className="dark space-y-4">
      <div className="text-foreground p-2">
        <h2 className="text-tertiary text-2xl font-bold">Hello</h2>
        <h3 className="text-tertiary text-2xl font-bold">
          How can I help you today?
        </h3>
      </div>
      <div>
        <AskQuestion onAsk={onAskQuestion} />
      </div>

      <div>
        <ResentMessage onOpenChat={onOpenChat} />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground text-sm">
            {UI_MESSAGES.LOADING.ARTICLES}
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="bg-destructive/10 rounded-lg p-4">
          <p className="text-destructive text-sm">
            {UI_MESSAGES.ERROR.NEWS_LOAD_FAILED}
          </p>
        </div>
      )}

      {/* Posts Section */}
      {!isLoadingPosts && !postsError && display_posts.length > 0 && (
        <div>
          <div className="space-y-4">
            {display_posts.map((post, index) => (
              <div key={post.id}>
                <BlogCard
                  id={post.id}
                  title={post.title}
                  description={post.description}
                  imageurl={post.image_url}
                  link={post.link_url}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <SearchComponent onNavigateToHelp={onNavigateToHelp} />
      </div>
      {/* No content state */}
      {!isLoading &&
        !hasError &&
        display_articles.length === 0 &&
        display_posts.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground text-sm">
              No content available
            </div>
          </div>
        )}
    </div>
  );
};
