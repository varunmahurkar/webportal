/**
 * Chat Hook
 * Manages chat state and LLM interactions with streaming support
 * Includes citation handling for web search results
 */

import { useState, useCallback, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Citation data from web search results
 */
export interface Citation {
  id: number;
  url: string;
  root_url: string;
  title: string;
  snippet?: string;
  favicon_url?: string;
}

/**
 * Chat message with optional citations
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  citations?: Citation[];
}

export type LLMProvider = "google" | "openai" | "anthropic";

interface UseChatOptions {
  provider?: LLMProvider;
  systemPrompt?: string;
  webSearchEnabled?: boolean;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<LLMProvider>(options.provider || "google");
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Generate unique ID for messages
   */
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  /**
   * Send a message to the LLM with streaming response
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add placeholder for assistant response
    const assistantId = generateId();
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setIsLoading(true);

    try {
      // Prepare chat history (excluding the new messages)
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${API_URL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.trim(),
          provider,
          chat_history: chatHistory,
          system_prompt: options.systemPrompt,
          web_search_enabled: options.webSearchEnabled || false,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let fullContent = "";
      let citations: Citation[] = [];
      let isJsonFormat = false;
      let buffer = ""; // Buffer for incomplete SSE lines

      // Mark as no longer loading (but still streaming)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, isLoading: false } : msg
        )
      );

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete lines from buffer
        const lines = buffer.split("\n");
        // Keep the last potentially incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6).trim();
          if (!data) continue;

          // Handle old format markers
          if (data === "[DONE]") {
            break;
          }

          if (data.startsWith("[ERROR]")) {
            throw new Error(data.slice(8));
          }

          // Try to parse as JSON (new format with citations)
          try {
            const parsed = JSON.parse(data);
            isJsonFormat = true;

            if (parsed.type === "citation" && parsed.citation) {
              console.log("[useChat] Received citation:", parsed.citation);
              citations.push(parsed.citation);
            } else if (parsed.type === "content") {
              fullContent += parsed.content || "";
            } else if (parsed.type === "done") {
              console.log("[useChat] Stream done. Total citations:", citations.length);
              break;
            } else if (parsed.type === "error") {
              throw new Error(parsed.error);
            }
          } catch (parseError) {
            // Old plain text format - only use if we haven't seen JSON
            if (!isJsonFormat) {
              fullContent += data;
            }
          }

          // Update message content and citations progressively
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: fullContent, citations: [...citations] }
                : msg
            )
          );
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return; // Request was cancelled
      }

      setError(err.message || "Failed to get response");

      // Remove the placeholder on error
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, provider, options.systemPrompt, options.webSearchEnabled]);

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  /**
   * Stop the current generation
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  /**
   * Retry the last message
   */
  const retryLast = useCallback(async () => {
    if (messages.length < 1) return;

    // Find the last user message
    const lastUserMessageIndex = messages.findLastIndex((m) => m.role === "user");
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];

    // Remove messages after the last user message
    setMessages((prev) => prev.slice(0, lastUserMessageIndex));

    // Resend the message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    provider,
    setProvider,
    sendMessage,
    clearChat,
    stopGeneration,
    retryLast,
  };
}

export default useChat;
