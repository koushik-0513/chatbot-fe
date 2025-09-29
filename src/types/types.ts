export type TAuthor = {
  id: string;
  name: string;
  email: string;
  profile_image?: string; // Help API format
  profileImage?: string; // News API format
  bio: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  social_links: {
    // Help API format
    linkedin: string;
    twitter: string;
  };
};

export type TStarttest = {
  width: string;
  height: string;
  zIndex?: number;
  borderRadius?: string;
  position?: string;
  bottom?: string;
  left?: string;
  right?: string;
  top?: string;
  maxWidth?: string;
  maxHeight?: string;
};
