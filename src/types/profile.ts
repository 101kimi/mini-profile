export interface UserLink {
  url: string;
  favicon: string;
  id: string;
  title?: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  bio: string;
  avatar: string;
  links: UserLink[];
  isEditing: boolean;
  email: string;
  bgColor: string;
}