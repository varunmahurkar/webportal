/**
 * Nurav AI Authentication API Service
 * Handles all authentication-related API calls to the backend
 */

import type {
  SignInRequest,
  SignUpRequest,
  AuthResponse,
} from '@/lib/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Authentication API endpoints
 */
const AUTH_ENDPOINTS = {
  SIGN_UP: '/auth/signup',
  SIGN_IN: '/auth/signin',
  SIGN_OUT: '/auth/signout',
  REFRESH_TOKEN: '/auth/refresh-token',
} as const;

/**
 * Generic fetch wrapper with error handling
 */
async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Request failed');
  }

  return data;
}

/**
 * Sign up a new user
 */
export async function signUp(credentials: SignUpRequest): Promise<AuthResponse> {
  return authFetch<AuthResponse>(AUTH_ENDPOINTS.SIGN_UP, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Sign in an existing user
 */
export async function signIn(credentials: SignInRequest): Promise<AuthResponse> {
  return authFetch<AuthResponse>(AUTH_ENDPOINTS.SIGN_IN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; message: string }> {
  return authFetch<{ success: boolean; message: string }>(AUTH_ENDPOINTS.SIGN_OUT, {
    method: 'POST',
  });
}

/**
 * Refresh the access token using refresh token
 */
export async function refreshToken(token: string): Promise<AuthResponse> {
  return authFetch<AuthResponse>(
    `${AUTH_ENDPOINTS.REFRESH_TOKEN}?refresh_token=${encodeURIComponent(token)}`,
    {
      method: 'POST',
    }
  );
}
