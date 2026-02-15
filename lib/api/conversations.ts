/**
 * Conversations API Client
 * Handles CRUD operations for conversation persistence with the backend.
 * Requires authentication token for all operations.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Record<string, unknown>[];
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ConversationData {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: ConversationMessage[];
}

/**
 * Helper to build authenticated request headers
 */
function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Create a new conversation
 */
export async function createConversation(
  token: string,
  title: string = "New Conversation",
): Promise<ConversationData> {
  const response = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }

  const data = await response.json();
  return data.conversation;
}

/**
 * List user's conversations ordered by most recent
 */
export async function listConversations(
  token: string,
  limit: number = 50,
  offset: number = 0,
): Promise<ConversationData[]> {
  const response = await fetch(
    `${API_URL}/conversations?limit=${limit}&offset=${offset}`,
    {
      headers: authHeaders(token),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to list conversations");
  }

  const data = await response.json();
  return data.conversations;
}

/**
 * Load a conversation with all its messages
 */
export async function getConversation(
  token: string,
  conversationId: string,
): Promise<ConversationData> {
  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to load conversation");
  }

  const data = await response.json();
  return data.conversation;
}

/**
 * Append messages to an existing conversation
 */
export async function addMessages(
  token: string,
  conversationId: string,
  messages: { role: string; content: string; citations?: Record<string, unknown>[] }[],
): Promise<ConversationMessage[]> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ messages }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add messages");
  }

  const data = await response.json();
  return data.messages;
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(
  token: string,
  conversationId: string,
  title: string,
): Promise<ConversationData> {
  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to update conversation title");
  }

  const data = await response.json();
  return data.conversation;
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(
  token: string,
  conversationId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }
}
