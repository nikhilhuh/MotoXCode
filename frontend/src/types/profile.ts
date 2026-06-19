export interface Profile {
  _id?: string;
  username: string;
  email: string;
  role?: "crew" | "admin" | "rider";
  strikes?: number;
  coverImage?: string;
  avatar?: string;
  name?: string;
  headline?: string;
  bio?: string;
  years?: number;

  location?: string;

  bike?: string[];

  instagram?: string;
  youtube?: string;
  facebook?: string;

  googleConnected?: boolean;

  profileCompleted?: boolean;
}
