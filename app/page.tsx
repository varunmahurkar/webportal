/**
 * Nurav AI Home Page
 * Main interface with sidebar and chat input
 */

'use client';

import React, { useState } from 'react';
import { ChatLayout, ChatInput, Conversation } from '@/components/chat';
import { Box, Flex } from './core/Grid';
import { Text } from './core/Typography';
import { Sparkles } from './core/icons';
import styles from './page.module.css';

export default function HomePage() {
  // Sample conversations for sidebar
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'How to build a REST API', timestamp: new Date() },
    { id: '2', title: 'React best practices', timestamp: new Date(Date.now() - 86400000) },
    { id: '3', title: 'TypeScript generics explained', timestamp: new Date(Date.now() - 172800000) },
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);

  // Handle new chat
  const handleNewChat = () => {
    setActiveConversationId(undefined);
  };

  // Handle delete conversation
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(undefined);
    }
  };

  // Handle rename conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

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
        {/* Welcome Section */}
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

        {/* Chat Input */}
        <Box className={styles.inputSection}>
          <ChatInput placeholder="Ask anything..." />
        </Box>
      </Flex>
    </ChatLayout>
  );
}
