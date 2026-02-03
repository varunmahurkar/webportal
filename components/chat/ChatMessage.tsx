/**
 * Chat Message Component - Perplexity Style
 * Clean, minimal design with prominent sources
 * Question at top, sources, then streamed answer
 */

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/app/core/Typography";
import { Box, Flex } from "@/app/core/Grid";
import {
  Copy,
  Check,
  Globe,
  Link,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  FileText,
  Sparkles,
} from "@/app/core/icons";
import styles from "./ChatMessage.module.css";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { StreamStatus } from "@/hooks/useChat";

export type MessageRole = "user" | "assistant" | "system";

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
 * Extracts hostname from URL for display
 */
function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export interface ChatMessageProps {
  message: Message;
  className?: string;
  status?: StreamStatus;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  className,
  status = "idle",
}) => {
  const [copied, setCopied] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(true);
  const isUser = message.role === "user";
  const hasCitations =
    !isUser && message.citations && message.citations.length > 0;

  // Debug logging
  if (!isUser && message.citations) {
    console.log("[ChatMessage] Citations received:", message.citations.length, message.citations);
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // User message - simple question display
  if (isUser) {
    return (
      <Box className={cn(styles.userQuestion, className)}>
        <Text variant="heading-lg" weight={600} className={styles.questionText}>
          {message.content}
        </Text>
      </Box>
    );
  }

  // Assistant message - Perplexity style with sources
  return (
    <Box className={cn(styles.answerContainer, className)}>
      {/* Sources Section - Shown first like Perplexity */}
      {hasCitations && (
        <Box className={styles.sourcesSection}>
          <Flex
            alignItems="center"
            justifyContent="between"
            className={styles.sourcesHeader}
          >
            <Flex alignItems="center" gap={2}>
              <Globe size={16} className={styles.sourcesIcon} />
              <Text variant="label-md" weight={600}>
                Sources
              </Text>
              <span className={styles.sourceCount}>
                {message.citations!.length}
              </span>
            </Flex>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className={styles.expandButton}
            >
              {sourcesExpanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </Button>
          </Flex>

          {sourcesExpanded && (
            <Flex className={styles.sourcesPills} gap={2} wrap="wrap">
              {message.citations!.map((citation, index) => (
                <a
                  key={citation.id}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourcePill}
                >
                  <span className={styles.sourceNumber}>{index + 1}</span>
                  <span className={styles.sourceDomain}>
                    {getHostname(citation.url)}
                  </span>
                </a>
              ))}
            </Flex>
          )}
        </Box>
      )}

      {/* Answer Section */}
      <Box className={styles.answerSection}>
        {/* Show loading indicator when loading OR when no content yet */}
        {(message.isLoading || (!message.content && status !== "idle" && status !== "done")) ? (
          <LoadingIndicator status={status} hasCitations={hasCitations} />
        ) : (
          <>
            <Box className={styles.answerContent}>
              <MarkdownRenderer
                content={message.content}
                citations={message.citations}
              />
            </Box>

            {/* Detailed Sources - Expandable */}
            {hasCitations && sourcesExpanded && (
              <Box className={styles.detailedSources}>
                <Text
                  variant="label-sm"
                  weight={600}
                  className={styles.detailedSourcesTitle}
                >
                  Referenced Sources
                </Text>
                <Box className={styles.sourceCards}>
                  {message.citations!.map((citation, index) => (
                    <a
                      key={citation.id}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sourceCard}
                    >
                      <Flex alignItems="start" gap={3}>
                        <span className={styles.sourceCardNumber}>
                          {index + 1}
                        </span>
                        <Box className={styles.sourceCardContent}>
                          <Text
                            variant="body-sm"
                            weight={500}
                            className={styles.sourceCardTitle}
                          >
                            {citation.title || getHostname(citation.url)}
                          </Text>
                          <Flex
                            alignItems="center"
                            gap={1}
                            className={styles.sourceCardUrl}
                          >
                            <Link size={12} />
                            <Text variant="caption" color="secondary">
                              {getHostname(citation.url)}
                            </Text>
                          </Flex>
                          {citation.snippet && (
                            <Text
                              variant="caption"
                              color="tertiary"
                              className={styles.sourceCardSnippet}
                            >
                              {citation.snippet.length > 150
                                ? `${citation.snippet.slice(0, 150)}...`
                                : citation.snippet}
                            </Text>
                          )}
                        </Box>
                        <ExternalLink
                          size={14}
                          className={styles.externalIcon}
                        />
                      </Flex>
                    </a>
                  ))}
                </Box>
              </Box>
            )}

            {/* Actions */}
            <Flex className={styles.actions} gap={2}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={styles.actionButton}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

/**
 * Status indicator configuration for each phase
 */
const STATUS_CONFIG: Record<
  StreamStatus,
  { icon: React.ElementType; label: string; showDots: boolean }
> = {
  idle: { icon: Sparkles, label: "Thinking...", showDots: true },
  searching: { icon: Search, label: "Searching the web...", showDots: false },
  reading: { icon: FileText, label: "Reading sources...", showDots: false },
  generating: { icon: Sparkles, label: "Generating response...", showDots: true },
  done: { icon: Check, label: "Complete", showDots: false },
};

/**
 * Loading indicator with visual progress phases
 */
const LoadingIndicator: React.FC<{
  status?: StreamStatus;
  hasCitations?: boolean;
}> = ({ status = "idle", hasCitations }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const Icon = config.icon;

  return (
    <Flex direction="column" gap={3}>
      <Flex alignItems="center" gap={2} className={styles.statusIndicator}>
        <Icon
          size={16}
          className={cn(styles.statusIcon, {
            [styles.statusIconSearching]: status === "searching",
            [styles.statusIconReading]: status === "reading",
            [styles.statusIconGenerating]: status === "generating" || status === "idle",
          })}
        />
        <Text variant="body-sm" color="secondary">
          {config.label}
        </Text>
      </Flex>
      {config.showDots && (
        <Flex className={styles.loadingIndicator} alignItems="center" gap={2}>
          <div className={styles.loadingDot} style={{ animationDelay: "0ms" }} />
          <div className={styles.loadingDot} style={{ animationDelay: "150ms" }} />
          <div className={styles.loadingDot} style={{ animationDelay: "300ms" }} />
        </Flex>
      )}
    </Flex>
  );
};

/**
 * Container for multiple messages with status support
 */
export interface ChatMessagesProps {
  messages: Message[];
  className?: string;
  status?: StreamStatus;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  className,
  status = "idle",
}) => (
  <Box className={cn(styles.messagesContainer, className)}>
    {messages.map((message, index) => {
      // Pass status to last assistant message that's still loading or has no content
      const isLastMessage = index === messages.length - 1;
      const isActiveAssistant = isLastMessage && message.role === "assistant" &&
        (message.isLoading || !message.content);

      return (
        <ChatMessage
          key={message.id}
          message={message}
          status={isActiveAssistant ? status : "idle"}
        />
      );
    })}
  </Box>
);

export default ChatMessage;
