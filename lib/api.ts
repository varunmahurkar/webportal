import { supabase } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.detail || error.message);
  }

  return response.json();
}

// Helper methods
export const api = {
  get: <T = any>(endpoint: string) => apiClient<T>(endpoint),

  post: <T = any>(endpoint: string, data: any) =>
    apiClient<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),

  put: <T = any>(endpoint: string, data: any) =>
    apiClient<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),

  delete: <T = any>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "DELETE" }),

  // Auth specific
  getCurrentUser: () => apiClient("/auth/me"),
};
