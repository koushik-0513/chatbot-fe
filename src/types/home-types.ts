export type TPost = {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string;
  is_active: boolean;
  link_text: string;
  link_url: string;
  linkText: string;
  isActive: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
};

export type TPostsResponse = {
  data: TPost[];
  infinite_scroll: {
    has_more: boolean;
    next_cursor: string | null;
    limit: number;
  };
  message: string;
};

export type TGetInfiniteScrollPostsParams = {
  limit: number;
  cursor?: string | null;
};
