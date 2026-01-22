/**
 * Chat Message Component
 * Displays individual messages in the conversation
 * Supports inline citation links for web search results
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/app/core/Typography';
import { Box, Flex } from '@/app/core/Grid';
import { User, Sparkles, Copy, Check } from '@/app/core/icons';
import styles from './ChatMessage.module.css';

export type MessageRole = 'user' | 'assistant' | 'system';

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

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
  isError?: boolean;
  citations?: Citation[];
}

/**
 * Parsed content segment - either plain text or a citation link
 */
interface ParsedContent {
  text: string;
  domain?: string;
  url?: string;
}

/**
 * Parses message content to extract citation markers 【domain.com】
 * and maps them to clickable links
 */
function parseCitationContent(
  content: string,
  citations: Citation[]
): ParsedContent[] {
  // Match 【domain.com】 pattern
  const citationRegex = /【([^】]+)】/g;
  const parts: ParsedContent[] = [];
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(content)) !== null) {
    // Add text before citation
    if (match.index > lastIndex) {
      parts.push({ text: content.slice(lastIndex, match.index) });
    }

    // Find matching citation by domain
    const domain = match[1];
    const citation = citations.find(
      (c) => c.root_url.includes(domain) || c.url.includes(domain)
    );

    parts.push({
      text: domain,
      domain,
      url: citation?.url || `https://${domain}`,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ text: content.slice(lastIndex) });
  }

  return parts;
}

export interface ChatMessageProps {
  message: Message;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, className }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box
      className={cn(
        styles.messageContainer,
        isUser && styles.userMessage,
        !isUser && styles.assistantMessage,
        message.isError && styles.errorMessage,
        className
      )}
    >
      <Flex className={styles.messageInner} gap={3}>
        {/* Avatar */}
        <Box className={cn(styles.avatar, isUser && styles.userAvatar)}>
          {isUser ? <User size={20} /> : <Sparkles size={20} />}
        </Box>

        {/* Content */}
        <Box className={styles.messageContent}>
          <Flex alignItems="center" gap={2} className={styles.messageHeader}>
            <Text variant="label-lg" weight={600}>
              {isUser ? 'You' : 'Nurav AI'}
            </Text>
          </Flex>

          <Box className={styles.messageBody}>
            {message.isLoading ? (
              <LoadingDots />
            ) : (
              <div className={styles.textContent}>
                {message.content.split('\n').map((line, i) => {
                  const parts = parseCitationContent(line, message.citations || []);
                  return (
                    <p key={i} className={styles.paragraph}>
                      {parts.map((part, j) =>
                        part.url ? (
                          <a
                            key={j}
                            href={part.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.citationLink}
                            title={part.url}
                          >
                            {part.domain}
                          </a>
                        ) : (
                          <span key={j}>{part.text || '\u00A0'}</span>
                        )
                      )}
                    </p>
                  );
                })}
              </div>
            )}
          </Box>

          {/* Copy button */}
          {!message.isLoading && (
            <Flex className={styles.messageActions} gap={1}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className={styles.actionButton}
                aria-label={copied ? 'Copied' : 'Copy message'}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

// Loading indicator with animated dots
const LoadingDots: React.FC = () => (
  <Flex className={styles.loadingIndicator} alignItems="center" gap={2}>
    <span className={styles.dot} style={{ animationDelay: '0ms' }} />
    <span className={styles.dot} style={{ animationDelay: '150ms' }} />
    <span className={styles.dot} style={{ animationDelay: '300ms' }} />
  </Flex>
);

// Container for multiple messages
export interface ChatMessagesProps {
  messages: Message[];
  className?: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, className }) => (
  <Box className={cn(styles.messagesContainer, className)}>
    {messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ))}
  </Box>
);

export default ChatMessage;
