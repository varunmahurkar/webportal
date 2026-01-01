/**
 * Nurav AI Authentication Hook and Context
 * Provides authentication state management across the application
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type {
  User,
  SignInRequest,
  SignUpRequest,
  AuthResponse,
  AuthContextValue,
  AUTH_STORAGE_KEYS,
} from '@/lib/types/auth';
import * as authApi from '@/lib/api/auth';

/**
 * Storage keys for persisting auth state
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'nurav_access_token',
  REFRESH_TOKEN: 'nurav_refresh_token',
  USER: 'nurav_user',
} as const;

/**
 * Default context value when not within provider
 */
const defaultContextValue: AuthContextValue = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => ({ success: false, message: 'Auth provider not initialized' }),
  signUp: async () => ({ success: false, message: 'Auth provider not initialized' }),
  signOut: async () => {},
  refreshSession: async () => false,
};

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextValue>(defaultContextValue);

/**
 * Storage helper functions for browser environment
 */
const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

/**
 * AuthProvider component that wraps the application
 * Manages authentication state and provides auth methods
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        const storedRefresh = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
        const storedUser = storage.get(STORAGE_KEYS.USER);

        if (storedToken) setAccessToken(storedToken);
        if (storedRefresh) setRefreshToken(storedRefresh);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            storage.remove(STORAGE_KEYS.USER);
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Persist auth data to localStorage
   */
  const persistAuthData = useCallback(
    (userData: User | null, access: string | null, refresh: string | null) => {
      if (userData) {
        storage.set(STORAGE_KEYS.USER, JSON.stringify(userData));
      } else {
        storage.remove(STORAGE_KEYS.USER);
      }

      if (access) {
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, access);
      } else {
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      }

      if (refresh) {
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh);
      } else {
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      }
    },
    []
  );

  /**
   * Clear all auth data
   */
  const clearAuthData = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  /**
   * Sign in handler
   */
  const handleSignIn = useCallback(
    async (credentials: SignInRequest): Promise<AuthResponse> => {
      try {
        const response = await authApi.signIn(credentials);

        if (response.success && response.user && response.access_token) {
          setUser(response.user);
          setAccessToken(response.access_token);
          setRefreshToken(response.refresh_token || null);
          persistAuthData(
            response.user,
            response.access_token,
            response.refresh_token || null
          );
        }

        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Sign in failed';
        return { success: false, message };
      }
    },
    [persistAuthData]
  );

  /**
   * Sign up handler
   */
  const handleSignUp = useCallback(
    async (credentials: SignUpRequest): Promise<AuthResponse> => {
      try {
        const response = await authApi.signUp(credentials);

        if (response.success && response.user && response.access_token) {
          setUser(response.user);
          setAccessToken(response.access_token);
          setRefreshToken(response.refresh_token || null);
          persistAuthData(
            response.user,
            response.access_token,
            response.refresh_token || null
          );
        }

        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Sign up failed';
        return { success: false, message };
      }
    },
    [persistAuthData]
  );

  /**
   * Sign out handler
   */
  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      await authApi.signOut();
    } catch (error) {
      console.error('Sign out API call failed:', error);
    } finally {
      clearAuthData();
    }
  }, [clearAuthData]);

  /**
   * Refresh session handler
   */
  const handleRefreshSession = useCallback(async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const response = await authApi.refreshToken(refreshToken);

      if (response.success && response.access_token) {
        setAccessToken(response.access_token);
        if (response.refresh_token) {
          setRefreshToken(response.refresh_token);
        }
        if (response.user) {
          setUser(response.user);
        }
        persistAuthData(
          response.user || user,
          response.access_token,
          response.refresh_token || refreshToken
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      clearAuthData();
      return false;
    }
  }, [refreshToken, user, persistAuthData, clearAuthData]);

  /**
   * Memoized context value
   */
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!user && !!accessToken,
      isLoading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      refreshSession: handleRefreshSession,
    }),
    [
      user,
      accessToken,
      refreshToken,
      isLoading,
      handleSignIn,
      handleSignUp,
      handleSignOut,
      handleRefreshSession,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * Must be used within an AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === defaultContextValue) {
    console.warn('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default useAuth;
