/**
 * Authenticated Crew member.
 * Auth fields are always present after sign-in.
 * Display/profile fields are optional — populated after full profile setup.
 */
export interface User {
  _id: string;
  username: string;
  email: string;
  role: "crew" | "admin" | "rider";
  isVerified: boolean;
  /** JWT access token — stored client-side for auth headers */
  token?: string;
  googleId?: string;
  /** Optional display-layer fields */
  name?: string;
  bike?: string;
  image?: string;
  bio?: string;
  years?: number;
  location?: string;
  instagram?: string;
  whatsapp?: string;
  mvp?: boolean;
}
