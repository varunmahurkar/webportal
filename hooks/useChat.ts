/**
 * Chat Hook — manages chat state, LLM streaming, citations, confidence, and agentic mode.
 * Calls: backend /chat/stream, /chat/agentic-stream, /chat/suggest-mode, /chat/completions.
 * Connected to: ChatInput (sends messages + pre-selected mode), ChatMessage (displays responses +
 * confidence badge), ModeSelector (post-send confirmation), CitationsPanel (right-side sources),
 * Sidebar (conversation persistence).
 */

import { useState, useCallback, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Citation data from web search results — includes quality metadata
 */
export interface Citation {
  id: number;
  url: string;
  root_url: string;
  title: string;
  snippet?: string;
  favicon_url?: string;
  source_type?: string;       // "web" | "arxiv" | "youtube" | "wikipedia" | "news" | "reddit"
  quality_score?: number;     // 0-100 from source_quality.py
  credibility_tier?: string;  // "authoritative" | "reputable" | "community" | "general"
  published_at?: string;      // ISO 8601 publish date
}

/**
 * Answer confidence assessment received from backend after synthesis
 */
export interface ConfidenceScore {
  score: number;           // 0-100
  label: string;           // "High" | "Medium" | "Low" | "Uncertain"
  cited_sources: number;
  total_sources: number;
  coverage_ratio?: number;
  avg_source_quality?: number;
}

/**
 * Chat message with optional citations and confidence data
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  citations?: Citation[];
  confidence?: ConfidenceScore;  // set after "done" event with confidence payload
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
  | "cached"
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
  /** Authentication token for conversation persistence */
  authToken?: string | null;
  /** Default mode for new chats — persisted across queries */
  defaultMode?: QueryMode;
  /** Enable KG + memory personalisation by default (user opt-in) */
  defaultPersonalization?: boolean;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<LLMProvider>(options.provider || "google");
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [modeSuggestion, setModeSuggestion] = useState<ModeSuggestion | null>(null);
  const [activeMode, setActiveMode] = useState<QueryMode | null>(null);
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  /** Pre-selected mode chosen by user in ChatInput before sending */
  const [selectedMode, setSelectedMode] = useState<QueryMode>(options.defaultMode || "research");
  /** KG + memory personalisation toggle — off by default (privacy-respecting opt-in) */
  const [usePersonalization, setUsePersonalization] = useState<boolean>(options.defaultPersonalization ?? false);
  const abortControllerRef = useRef<AbortController | null>(null);

  /** Generate unique ID for messages */
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  /**
   * Request mode suggestion from backend without sending the full query.
   * Skipped when user has pre-selected a mode (selectedMode != null).
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

  /** Dismiss the current mode suggestion */
  const dismissModeSuggestion = useCallback(() => {
    setModeSuggestion(null);
  }, []);

  /**
   * Send a message using the agentic streaming endpoint.
   * Handles all SSE event types including the new "confidence" event.
   */
  const _sendAgentic = useCallback(async (
    content: string,
    assistantId: string,
    chatHistory: { role: string; content: string }[],
    confirmedMode?: QueryMode,
  ) => {
    const response = await fetch(`${API_URL}/chat/agentic-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}),
      },
      body: JSON.stringify({
        message: content.trim(),
        provider,
        chat_history: chatHistory,
        system_prompt: options.systemPrompt,
        mode: confirmedMode || null,
        conversation_id: conversationId,
        use_personalization: usePersonalization,
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
    let confidenceData: ConfidenceScore | undefined;
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
            citations.push(parsed.citation as Citation);
          } else if (parsed.type === "content") {
            fullContent += parsed.content || "";
          } else if (parsed.type === "confidence") {
            // Store confidence for badge display — emitted before "done"
            confidenceData = {
              score: parsed.score ?? 0,
              label: parsed.label ?? "Uncertain",
              cited_sources: parsed.cited_sources ?? 0,
              total_sources: parsed.total_sources ?? 0,
              coverage_ratio: parsed.coverage_ratio,
              avg_source_quality: parsed.avg_source_quality,
            };
          } else if (parsed.type === "followup" && parsed.questions) {
            setFollowupQuestions(parsed.questions);
          } else if (parsed.type === "done") {
            setStatus("done");
            break;
          } else if (parsed.type === "error") {
            throw new Error(parsed.error);
          }
        } catch (parseError) {
          if ((parseError as Error).message?.includes("Failed") ||
              (parseError as Error).message?.includes("Error")) {
            throw parseError;
          }
        }

        // Progressive UI update on every chunk
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: fullContent,
                  citations: [...citations],
                  confidence: confidenceData,
                  isLoading: fullContent.length === 0,
                }
              : msg
          )
        );
      }
    }

    // Final update — ensure confidence is stored
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId
          ? { ...msg, isLoading: false, confidence: confidenceData }
          : msg
      )
    );
  }, [provider, options.systemPrompt, options.authToken, conversationId, usePersonalization]);

  /**
   * Send a message using the legacy streaming endpoint (web search, no agentic)
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
          if (parsed.type === "status") setStatus(parsed.status as StreamStatus);
          else if (parsed.type === "citation") citations.push(parsed.citation as Citation);
          else if (parsed.type === "content") fullContent += parsed.content || "";
          else if (parsed.type === "done") { setStatus("done"); break; }
          else if (parsed.type === "error") throw new Error(parsed.error);
        } catch {
          if (!isJsonFormat) fullContent += data;
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: fullContent, citations: [...citations], isLoading: fullContent.length === 0 }
              : msg
          )
        );
      }
    }

    setMessages((prev) =>
      prev.map((msg) => msg.id === assistantId ? { ...msg, isLoading: false } : msg)
    );
  }, [provider, options.systemPrompt, options.webSearchEnabled]);

  /**
   * Send a message to the LLM with streaming response.
   * If user pre-selected a mode in ChatInput, it is used directly (no suggest-mode roundtrip).
   */
  const sendMessage = useCallback(async (content: string, confirmedMode?: QueryMode) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setStatus("idle");
    setModeSuggestion(null);
    const resolvedMode = confirmedMode || selectedMode;
    setActiveMode(resolvedMode);
    setFollowupQuestions([]);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
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
      const chatHistory = messages.map((msg) => ({ role: msg.role, content: msg.content }));

      if (options.agenticMode) {
        await _sendAgentic(content, assistantId, chatHistory, resolvedMode);
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
  }, [messages, isLoading, selectedMode, options.agenticMode, _sendAgentic, _sendLegacy]);

  /** Clear chat history */
  const clearChat = useCallback(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setStatus("idle");
    setModeSuggestion(null);
    setActiveMode(null);
    setFollowupQuestions([]);
    setConversationId(null);
  }, []);

  /** Stop the current generation */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setStatus("idle");
    }
  }, []);

  /** Load an existing conversation from the backend */
  const loadConversation = useCallback(async (convId: string) => {
    if (!options.authToken) return;
    try {
      const response = await fetch(`${API_URL}/conversations/${convId}`, {
        headers: { Authorization: `Bearer ${options.authToken}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      const conv = data.conversation;
      if (conv?.messages) {
        const loadedMessages: ChatMessage[] = conv.messages.map((msg: any) => ({
          id: msg.id || generateId(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          citations: msg.citations || [],
        }));
        setMessages(loadedMessages);
        setConversationId(convId);
        setFollowupQuestions([]);
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  }, [options.authToken]);

  /** Retry the last message */
  const retryLast = useCallback(async () => {
    if (messages.length < 1) return;
    const lastUserIdx = messages.findLastIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const lastUserMessage = messages[lastUserIdx];
    setMessages((prev) => prev.slice(0, lastUserIdx));
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
    selectedMode,
    usePersonalization,
    followupQuestions,
    conversationId,
    setProvider,
    setConversationId,
    setSelectedMode,
    setUsePersonalization,
    sendMessage,
    suggestMode,
    dismissModeSuggestion,
    clearChat,
    stopGeneration,
    retryLast,
    loadConversation,
  };
}

export default useChat;
