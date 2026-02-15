/**
 * Nurav AI Home Page
 * Main chat interface with LLM integration - Perplexity Style
 * Supports agentic workflow with adaptive query processing
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatLayout, ChatInput, ChatMessages, ModeSelector, Conversation } from '@/components/chat';
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
  const { accessToken, isAuthenticated } = useAuth();

  // Chat state with agentic mode enabled
  const {
    messages,
    isLoading,
    error,
    status,
    modeSuggestion,
    activeMode,
    followupQuestions,
    conversationId,
    setConversationId,
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
    }).catch((err) => {
      console.error('Failed to load conversations:', err);
    });
  }, [isAuthenticated, accessToken]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Handle send message - gets mode suggestion first, then sends
  const handleSend = async (message: string) => {
    // Request mode suggestion before sending
    const suggestion = await suggestMode(message);

    if (suggestion && suggestion.suggested_mode !== 'simple') {
      // Store message and show mode selector for non-simple queries
      setPendingMessage(message);
      return;
    }

    // For simple queries or if suggestion fails, send immediately
    await _executeSend(message, suggestion?.suggested_mode || 'simple');
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
        // Fallback for unauthenticated users: local-only conversation
        const localId = `conv_${Date.now()}`;
        setActiveConversationId(localId);
        setConversations((prev) => [
          { id: localId, title, timestamp: new Date() },
          ...prev,
        ]);
      }
    }

    await sendMessage(message, mode);
  };

  // Handle mode confirmation from ModeSelector
  const handleModeConfirm = async (mode: QueryMode) => {
    if (pendingMessage) {
      await _executeSend(pendingMessage, mode);
    }
  };

  // Handle mode selector dismiss - send with suggested mode
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
    if (activeConversationId === id) {
      handleNewChat();
    }
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
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  // Convert useChat messages to ChatMessage format with citations
  const chatMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
    isLoading: msg.isLoading,
    citations: msg.citations as Citation[] | undefined,
  }));

  const hasMessages = messages.length > 0;

  return (
    <ChatLayout
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelectConversation={handleSelectConversation}
      onNewChat={handleNewChat}
      onDeleteConversation={handleDeleteConversation}
      onRenameConversation={handleRenameConversation}
      onSettingsClick={() => console.log('Settings clicked')}
      onLogout={() => console.log('Logout clicked')}
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

        {/* Mode Suggestion - shown when AI suggests non-simple mode */}
        {modeSuggestion && pendingMessage && (
          <Box className={styles.modeSelectorArea}>
            <ModeSelector
              suggestion={modeSuggestion}
              onConfirm={handleModeConfirm}
              onDismiss={handleModeDismiss}
            />
          </Box>
        )}

        {/* Chat Input */}
        <Box className={styles.inputSection}>
          <ChatInput
            placeholder="Ask anything..."
            onSend={handleSend}
            onStop={stopGeneration}
            disabled={isLoading}
            isGenerating={isLoading}
          />
        </Box>
      </Flex>
    </ChatLayout>
  );
}
