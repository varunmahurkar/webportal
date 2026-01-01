/**
 * Nurav AI Authentication Types
 * Type definitions for authentication system
 */

/**
 * User data returned from authentication endpoints
 */
export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
  last_sign_in_at?: string;
  role?: UserRole;
}

/**
 * User roles for authorization
 */
export type UserRole = 'user' | 'admin' | 'moderator';

/**
 * Sign up request payload
 */
export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
}

/**
 * Sign in request payload
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Authentication response from backend API
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  access_token?: string;
  refresh_token?: string;
}

/**
 * Authentication state for context
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Authentication context value
 */
export interface AuthContextValue extends AuthState {
  signIn: (credentials: SignInRequest) => Promise<AuthResponse>;
  signUp: (credentials: SignUpRequest) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

/**
 * Token storage keys
 */
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'nurav_access_token',
  REFRESH_TOKEN: 'nurav_refresh_token',
  USER: 'nurav_user',
} as const;
