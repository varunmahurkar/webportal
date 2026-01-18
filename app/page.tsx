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
  const [conversations] = useState<Conversation[]>([
    { id: '1', title: 'Welcome to Nurav AI', timestamp: new Date() },
    { id: '2', title: 'Previous conversation', timestamp: new Date(Date.now() - 86400000) },
  ]);
  const [activeConversationId, setActiveConversationId] = useState('1');

  return (
    <ChatLayout
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelectConversation={setActiveConversationId}
      onNewChat={() => {}}
      onDeleteConversation={() => {}}
      onRenameConversation={() => {}}
      onSettingsClick={() => {}}
      onLogout={() => {}}
      userName="User"
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
