/**
 * Chat Hook
 * Manages chat state and LLM interactions with streaming support
 * Includes citation handling for web search results
 * Supports agentic workflow with mode suggestion and multi-source research
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
  source_type?: string; // "web", "arxiv", "youtube"
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

/**
 * Stream status phases for visual progress indication
 */
export type StreamStatus =
  | "idle"
  | "analyzing"
  | "searching"
  | "reading"
  | "retrieving"
  | "synthesizing"
  | "generating"
  | "done";

/**
 * Query mode for agentic workflow complexity routing
 */
export type QueryMode = "simple" | "research" | "deep";

/**
 * Mode suggestion from the backend query analyzer
 */
export interface ModeSuggestion {
  suggested_mode: QueryMode;
  reasoning: string;
  estimated_time: string;
  intent: string;
  sources: string[];
}

interface UseChatOptions {
  provider?: LLMProvider;
  systemPrompt?: string;
  webSearchEnabled?: boolean;
  /** Enable agentic mode with adaptive query processing */
  agenticMode?: boolean;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<LLMProvider>(options.provider || "google");
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [modeSuggestion, setModeSuggestion] = useState<ModeSuggestion | null>(null);
  const [activeMode, setActiveMode] = useState<QueryMode | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Generate unique ID for messages
   */
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  /**
   * Request mode suggestion from backend without sending the full query
   */
  const suggestMode = useCallback(async (message: string): Promise<ModeSuggestion | null> => {
    try {
      const response = await fetch(`${API_URL}/chat/suggest-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      setModeSuggestion(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  /**
   * Dismiss the current mode suggestion
   */
  const dismissModeSuggestion = useCallback(() => {
    setModeSuggestion(null);
  }, []);

  /**
   * Send a message using the agentic streaming endpoint
   */
  const _sendAgentic = useCallback(async (
    content: string,
    assistantId: string,
    chatHistory: { role: string; content: string }[],
    confirmedMode?: QueryMode,
  ) => {
    const response = await fetch(`${API_URL}/chat/agentic-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content.trim(),
        provider,
        chat_history: chatHistory,
        system_prompt: options.systemPrompt,
        mode: confirmedMode || null,
      }),
      signal: abortControllerRef.current!.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to get response");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("No response body");

    let fullContent = "";
    let citations: Citation[] = [];
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (!data) continue;

        try {
          const parsed = JSON.parse(data);

          if (parsed.type === "status" && parsed.status) {
            setStatus(parsed.status as StreamStatus);
          } else if (parsed.type === "mode") {
            setActiveMode(parsed.mode as QueryMode);
          } else if (parsed.type === "citation" && parsed.citation) {
            citations.push(parsed.citation);
          } else if (parsed.type === "content") {
            fullContent += parsed.content || "";
          } else if (parsed.type === "done") {
            setStatus("done");
            break;
          } else if (parsed.type === "error") {
            throw new Error(parsed.error);
          }
        } catch (parseError) {
          // Skip unparseable lines
          if ((parseError as Error).message?.includes("Failed") ||
              (parseError as Error).message?.includes("Error")) {
            throw parseError;
          }
        }

        // Update message progressively
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: fullContent,
                  citations: [...citations],
                  isLoading: fullContent.length === 0,
                }
              : msg
          )
        );
      }
    }

    // Final update
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId ? { ...msg, isLoading: false } : msg
      )
    );
  }, [provider, options.systemPrompt]);

  /**
   * Send a message using the legacy streaming endpoint (web search)
   */
  const _sendLegacy = useCallback(async (
    content: string,
    assistantId: string,
    chatHistory: { role: string; content: string }[],
  ) => {
    const response = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content.trim(),
        provider,
        chat_history: chatHistory,
        system_prompt: options.systemPrompt,
        web_search_enabled: options.webSearchEnabled || false,
      }),
      signal: abortControllerRef.current!.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to get response");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("No response body");

    let fullContent = "";
    let citations: Citation[] = [];
    let isJsonFormat = false;
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (!data) continue;

        if (data === "[DONE]") break;
        if (data.startsWith("[ERROR]")) throw new Error(data.slice(8));

        try {
          const parsed = JSON.parse(data);
          isJsonFormat = true;

          if (parsed.type === "status" && parsed.status) {
            setStatus(parsed.status as StreamStatus);
          } else if (parsed.type === "citation" && parsed.citation) {
            citations.push(parsed.citation);
          } else if (parsed.type === "content") {
            fullContent += parsed.content || "";
          } else if (parsed.type === "done") {
            setStatus("done");
            break;
          } else if (parsed.type === "error") {
            throw new Error(parsed.error);
          }
        } catch (parseError) {
          if (!isJsonFormat) {
            fullContent += data;
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: fullContent,
                  citations: [...citations],
                  isLoading: fullContent.length === 0,
                }
              : msg
          )
        );
      }
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId ? { ...msg, isLoading: false } : msg
      )
    );
  }, [provider, options.systemPrompt, options.webSearchEnabled]);

  /**
   * Send a message to the LLM with streaming response
   * Uses agentic endpoint when agenticMode is enabled, otherwise uses legacy
   */
  const sendMessage = useCallback(async (content: string, confirmedMode?: QueryMode) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setStatus("idle");
    setModeSuggestion(null);
    setActiveMode(confirmedMode || null);

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
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      if (options.agenticMode) {
        await _sendAgentic(content, assistantId, chatHistory, confirmedMode);
      } else {
        await _sendLegacy(content, assistantId, chatHistory);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;

      setError(err.message || "Failed to get response");
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      setTimeout(() => setStatus("idle"), 500);
    }
  }, [messages, isLoading, options.agenticMode, _sendAgentic, _sendLegacy]);

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setStatus("idle");
    setModeSuggestion(null);
    setActiveMode(null);
  }, []);

  /**
   * Stop the current generation
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setStatus("idle");
    }
  }, []);

  /**
   * Retry the last message
   */
  const retryLast = useCallback(async () => {
    if (messages.length < 1) return;

    const lastUserMessageIndex = messages.findLastIndex((m) => m.role === "user");
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];

    setMessages((prev) => prev.slice(0, lastUserMessageIndex));

    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    provider,
    status,
    modeSuggestion,
    activeMode,
    setProvider,
    sendMessage,
    suggestMode,
    dismissModeSuggestion,
    clearChat,
    stopGeneration,
    retryLast,
  };
}

export default useChat;
