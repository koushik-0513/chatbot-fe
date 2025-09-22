export type TAuthor = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  profile_image?: string; // Help API format
  profileImage?: string; // News API format
  bio: string;
  role: string;
  isActive?: boolean;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  social_links?: {
    // Help API format
    linkedin?: string;
    twitter?: string;
  };
};

export type TChatbotProps = {
  user_id: string;
  onClose: () => void;
  isMaximized?: boolean;
  onMaximizeChange?: (isMaximized: boolean) => void;
};

export type TNavigationItem = {
  id: string;
  icon: React.ComponentType<{ className: string }>;
  label: string;
};

// Environment types
export type TEnv = {
  backendUrl: string;
};

export type TCreateUserRequest = {
  userId: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
};

export type TCreateUserResponse = {
  success: boolean;
  message: string;
  user_id: string;
};
