/**
 * Nurav AI Home Page
 * Main chat interface with LLM integration
 * Supports web search with inline citations
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatLayout, ChatInput, ChatMessages, Conversation, CitationsPanel, Citation } from '@/components/chat';
import { Box, Flex } from './core/Grid';
import { Text } from './core/Typography';
import { Sparkles, AlertCircle, Globe } from './core/icons';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import styles from './page.module.css';

export default function HomePage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat state with web search enabled
  const { messages, isLoading, error, sendMessage, clearChat, stopGeneration } = useChat({
    provider: 'openai',
    webSearchEnabled: true,
  });

  // Conversations for sidebar
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);

  // Citations panel state
  const [showCitations, setShowCitations] = useState(false);
  const [activeCitations, setActiveCitations] = useState<Citation[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract citations from the latest assistant message
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
    if (lastAssistant?.citations?.length) {
      setActiveCitations(lastAssistant.citations as Citation[]);
    } else {
      setActiveCitations([]);
    }
  }, [messages]);

  // Handle new chat
  const handleNewChat = () => {
    clearChat();
    setActiveConversationId(undefined);
  };

  // Handle send message
  const handleSend = async (message: string) => {
    await sendMessage(message);

    // Create conversation if this is the first message
    if (messages.length === 0 && !activeConversationId) {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        timestamp: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
    }
  };

  // Handle delete conversation
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      handleNewChat();
    }
  };

  // Handle rename conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
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
      onSelectConversation={setActiveConversationId}
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
            <ChatMessages messages={chatMessages} />
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

        {/* Chat Input with Sources Button */}
        <Box className={styles.inputSection}>
          <Flex alignItems="center" gap={2} className={styles.inputWrapper}>
            <Box className={styles.inputContainer}>
              <ChatInput
                placeholder="Ask anything..."
                onSend={handleSend}
                onStop={stopGeneration}
                disabled={isLoading}
                isGenerating={isLoading}
              />
            </Box>
            {activeCitations.length > 0 && (
              <Button
                variant={showCitations ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCitations(!showCitations)}
                className={styles.sourcesButton}
              >
                <Globe size={16} />
                <span>Sources ({activeCitations.length})</span>
              </Button>
            )}
          </Flex>
        </Box>
      </Flex>

      {/* Citations Panel */}
      <CitationsPanel
        citations={activeCitations}
        isOpen={showCitations}
        onClose={() => setShowCitations(false)}
      />
    </ChatLayout>
  );
}
