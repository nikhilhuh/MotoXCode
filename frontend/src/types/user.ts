export interface User {
  _id: string;
  username: string;
  email: string;
  role: "crew" | "admin" | "rider";
  token: string;
  avatar?: string;
  googleConnected?: boolean;
}