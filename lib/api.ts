/**
 * API client for Nurav AI backend services
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Type definitions for API responses
export interface UsernameCheckResponse {
  username: string;
  available: boolean;
  message: string;
  suggestions?: string[];
}

export interface PasswordValidationResponse {
  valid: boolean;
  score: number;
  level: "weak" | "fair" | "good" | "strong";
  issues: string[];
  feedback: string[];
}

export interface RandomUsernameResponse {
  username: string;
  suggestions: string[];
}

export interface BloomFilterResponse {
  filter_data: string;
  hash_count: number;
  size: number;
  item_count: number;
  last_updated: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username?: string;
    full_name?: string;
  };
  access_token?: string;
  refresh_token?: string;
}

/**
 * Generic fetch wrapper with CORS and error handling
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.detail || error.message);
  }

  return response.json();
}

export const api = {
  // ==========================================================================
  // Authentication Endpoints
  // ==========================================================================

  /**
   * Sign up a new user with email, password, and username
   */
  signup: (data: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
  }): Promise<AuthResponse> =>
    apiClient("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  /**
   * Sign in an existing user
   */
  signin: (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> =>
    apiClient("/auth/signin", { method: "POST", body: JSON.stringify(data) }),

  /**
   * Sign out the current user
   */
  signout: (token: string) =>
    apiClient("/auth/signout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * Get current user info
   */
  me: (token: string) =>
    apiClient<AuthResponse["user"]>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * Get full user profile from auth_users_table
   */
  getProfile: (token: string) =>
    apiClient<{
      success: boolean;
      profile: {
        user_uuid: string;
        username: string;
        email: string;
        name: string | null;
        profile_image_url: string | null;
        subscription_status: string;
        auth_user_role: string;
        is_verified: boolean;
        created_at: string;
        updated_at: string;
        last_login_at: string | null;
      };
    }>("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * Update user profile
   */
  updateProfile: (
    token: string,
    data: { name?: string; profile_image_url?: string }
  ) =>
    apiClient("/auth/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  // ==========================================================================
  // Username Validation & Bloom Filter Endpoints
  // ==========================================================================

  /**
   * Check username availability using Bloom filter + database
   */
  checkUsername: (username: string): Promise<UsernameCheckResponse> =>
    apiClient(`/auth/check-username/${encodeURIComponent(username)}`),

  /**
   * Check username availability (POST version with body)
   */
  checkUsernamePost: (username: string): Promise<UsernameCheckResponse> =>
    apiClient("/auth/check-username", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),

  /**
   * Generate a random available username
   */
  generateUsername: (): Promise<RandomUsernameResponse> =>
    apiClient("/auth/generate-username"),

  /**
   * Get Bloom filter data for client-side username checking
   */
  getBloomFilter: (): Promise<BloomFilterResponse> =>
    apiClient("/auth/bloom-filter"),

  // ==========================================================================
  // Password Validation Endpoints
  // ==========================================================================

  /**
   * Validate password strength and complexity
   */
  validatePassword: (password: string): Promise<PasswordValidationResponse> =>
    apiClient("/auth/validate-password", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
};
