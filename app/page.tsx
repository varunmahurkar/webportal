/**
 * Nurav AI Home Page
 * Main chat interface with:
 * - Pre-send mode selector (Fast/Research/Deep) in ChatInput toolbar
 * - Right-side sources panel that slides in when citations arrive
 * - Confidence badge on responses
 * - Agentic workflow: query analysis → multi-source search → synthesis
 * Connected to: useChat hook (streaming), ChatLayout (sidebar + sources panel),
 * conversationsApi (persistence), CitationsPanel (right panel).
 */

'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChatLayout, ChatInput, ChatMessages, ModeSelector, Conversation } from '@/components/chat';
import { CitationsPanel } from '@/components/chat/CitationsPanel';
import { Box, Flex } from './core/Grid';
import { Text } from './core/Typography';
import { Sparkles, AlertCircle } from './core/icons';
import { useChat, Citation, QueryMode } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import * as conversationsApi from '@/lib/api/conversations';
import styles from './page.module.css';

export default function HomePage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const { accessToken, isAuthenticated } = useAuth();

  // Chat state with agentic mode enabled, default mode = research
  const {
    messages,
    isLoading,
    error,
    status,
    modeSuggestion,
    activeMode,
    selectedMode,
    usePersonalization,
    followupQuestions,
    conversationId,
    setConversationId,
    setSelectedMode,
    setUsePersonalization,
    sendMessage,
    suggestMode,
    dismissModeSuggestion,
    clearChat,
    stopGeneration,
    loadConversation,
  } = useChat({
    provider: 'openai',
    agenticMode: true,
    authToken: accessToken,
    defaultMode: 'research',
    defaultPersonalization: false,
  });

  // Conversations for sidebar
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);

  // Load conversations from API on mount when authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    conversationsApi.listConversations(accessToken).then((convs) => {
      setConversations(
        convs.map((c) => ({
          id: c.id,
          title: c.title,
          timestamp: new Date(c.updated_at),
        })),
      );
    }).catch((err) => console.error('Failed to load conversations:', err));
  }, [isAuthenticated, accessToken]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Derive citations from the latest assistant message for the right panel
  const latestCitations = useMemo<Citation[]>(() => {
    const latestAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
    return latestAssistant?.citations ?? [];
  }, [messages]);

  const showSourcesPanel = latestCitations.length > 0;

  // Handle new chat
  const handleNewChat = () => {
    clearChat();
    setActiveConversationId(undefined);
    setConversationId(null);
    setPendingMessage(null);
  };

  // Handle selecting a conversation from sidebar
  const handleSelectConversation = useCallback(async (convId: string) => {
    setActiveConversationId(convId);
    await loadConversation(convId);
  }, [loadConversation]);

  /**
   * Handle send message.
   * If user pre-selected a mode in ChatInput, send directly (no suggest-mode roundtrip).
   * If mode is 'simple' AI auto-detect still fires — ModeSelector appears only for non-simple.
   */
  const handleSend = async (message: string) => {
    // User pre-selected mode → send immediately without suggest-mode call
    await _executeSend(message, selectedMode);
  };

  // Execute the actual send after mode confirmation
  const _executeSend = async (message: string, mode: QueryMode) => {
    setPendingMessage(null);
    dismissModeSuggestion();

    // Create conversation via API if this is the first message
    if (messages.length === 0 && !activeConversationId) {
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      if (isAuthenticated && accessToken) {
        try {
          const conv = await conversationsApi.createConversation(accessToken, title);
          setConversationId(conv.id);
          setActiveConversationId(conv.id);
          setConversations((prev) => [
            { id: conv.id, title: conv.title, timestamp: new Date(conv.created_at) },
            ...prev,
          ]);
        } catch (err) {
          console.error('Failed to create conversation:', err);
        }
      } else {
        const localId = `conv_${Date.now()}`;
        setActiveConversationId(localId);
        setConversations((prev) => [{ id: localId, title, timestamp: new Date() }, ...prev]);
      }
    }

    await sendMessage(message, mode);
  };

  // Handle mode confirmation from ModeSelector (post-send popup, only for deep/research)
  const handleModeConfirm = async (mode: QueryMode) => {
    if (pendingMessage) await _executeSend(pendingMessage, mode);
  };

  const handleModeDismiss = async () => {
    if (pendingMessage && modeSuggestion) {
      await _executeSend(pendingMessage, modeSuggestion.suggested_mode);
    }
    dismissModeSuggestion();
    setPendingMessage(null);
  };

  // Handle delete conversation
  const handleDeleteConversation = async (id: string) => {
    if (isAuthenticated && accessToken) {
      try {
        await conversationsApi.deleteConversation(accessToken, id);
      } catch (err) {
        console.error('Failed to delete conversation:', err);
      }
    }
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) handleNewChat();
  };

  // Handle rename conversation
  const handleRenameConversation = async (id: string, newTitle: string) => {
    if (isAuthenticated && accessToken) {
      try {
        await conversationsApi.updateConversationTitle(accessToken, id, newTitle);
      } catch (err) {
        console.error('Failed to rename conversation:', err);
      }
    }
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)));
  };

  // Convert messages to ChatMessage format
  const chatMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
    isLoading: msg.isLoading,
    citations: msg.citations as Citation[] | undefined,
    confidence: msg.confidence,
  }));

  const hasMessages = messages.length > 0;

  // Right-side sources panel
  const sourcesPanel = (
    <CitationsPanel
      citations={latestCitations}
      isOpen={showSourcesPanel}
      isCollapsed={isPanelCollapsed}
      onClose={() => {}} // keep panel — only collapsible, not closeable via X in main panel
      onToggleCollapse={() => setIsPanelCollapsed((prev) => !prev)}
    />
  );

  return (
    <ChatLayout
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelectConversation={handleSelectConversation}
      onNewChat={handleNewChat}
      onDeleteConversation={handleDeleteConversation}
      onRenameConversation={handleRenameConversation}
      onSettingsClick={() => {}}
      onLogout={() => {}}
      rightPanel={sourcesPanel}
      showRightPanel={showSourcesPanel}
    >
      <Flex direction="column" className={styles.chatContainer}>
        {/* Messages Area or Welcome Screen */}
        {hasMessages ? (
          <Box className={styles.messagesArea}>
            <ChatMessages
              messages={chatMessages}
              status={status}
              followupQuestions={followupQuestions}
              onFollowupClick={(q) => handleSend(q)}
            />
            <div ref={messagesEndRef} />
          </Box>
        ) : (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            className={styles.welcomeSection}
          >
            <Box className={styles.logoWrapper}>
              <Sparkles size={48} className={styles.logo} />
            </Box>
            <Text variant="display-sm" weight={600} align="center" className={styles.title}>
              What can I help you with?
            </Text>
            <Text variant="body-md" color="secondary" align="center" className={styles.subtitle}>
              Ask me anything - from code to creative writing
            </Text>
          </Flex>
        )}

        {/* Error Display */}
        {error && (
          <Flex className={styles.errorBanner} alignItems="center" gap={2}>
            <AlertCircle size={18} />
            <Text variant="body-sm" color="inherit">{error}</Text>
          </Flex>
        )}

        {/* Mode Suggestion — only shown for backend-suggested non-simple modes */}
        {modeSuggestion && pendingMessage && (
          <Box className={styles.modeSelectorArea}>
            <ModeSelector
              suggestion={modeSuggestion}
              onConfirm={handleModeConfirm}
              onDismiss={handleModeDismiss}
            />
          </Box>
        )}

        {/* Chat Input with pre-send mode selector */}
        <Box className={styles.inputSection}>
          <ChatInput
            placeholder="Ask anything..."
            onSend={handleSend}
            onStop={stopGeneration}
            disabled={isLoading}
            isGenerating={isLoading}
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            usePersonalization={usePersonalization}
            onPersonalizationToggle={setUsePersonalization}
          />
        </Box>
      </Flex>
    </ChatLayout>
  );
}
