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
  total_posts: number;
  current_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
};

export type TGetPostsParams = {
  page: number;
  limit: number;
};
