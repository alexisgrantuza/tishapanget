export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: "credentials" | "google" | "github" | "discord";
  role?: "user" | "admin";
  createdAt?: string;
  emailVerified?: boolean;
}

export interface UserSession {
  user: User;
  loggedInAt: string;
  expiresAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
