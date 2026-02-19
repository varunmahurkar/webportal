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
import { Database } from "@/app/core/icons";

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
  source_type?: string; // "web", "arxiv", "youtube", "pubmed", "news"
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
  /** Follow-up question suggestions (shown after response) */
  followupQuestions?: string[];
  /** Callback when user clicks a follow-up question */
  onFollowupClick?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  className,
  status = "idle",
  followupQuestions = [],
  onFollowupClick,
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
                  className={cn(
                    styles.sourcePill,
                    citation.source_type && styles[`sourcePill_${citation.source_type}`],
                  )}
                >
                  <span className={styles.sourceNumber}>{index + 1}</span>
                  {citation.source_type && citation.source_type !== "web" && (
                    <span className={cn(styles.sourceTypeBadge, styles[`badge_${citation.source_type}`])}>
                      {SOURCE_TYPE_LABELS[citation.source_type] || citation.source_type}
                    </span>
                  )}
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
        ) : message.content ? (
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

            {/* Follow-up Question Chips */}
            {followupQuestions.length > 0 && (
              <Box className={styles.followupSection}>
                <Text variant="label-sm" weight={600} className={styles.followupTitle}>
                  Related questions
                </Text>
                <Flex className={styles.followupChips} gap={2} wrap="wrap">
                  {followupQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      className={styles.followupChip}
                      onClick={() => onFollowupClick?.(question)}
                    >
                      {question}
                    </button>
                  ))}
                </Flex>
              </Box>
            )}
          </>
        ) : null}
      </Box>
    </Box>
  );
};

/**
 * Source type display labels for citation badges
 */
const SOURCE_TYPE_LABELS: Record<string, string> = {
  arxiv: "Academic",
  youtube: "Video",
  pubmed: "Medical",
  scholar: "Scholar",
  news: "News",
  web: "Web",
};

/**
 * Status indicator configuration for each phase
 */
const STATUS_CONFIG: Record<
  StreamStatus,
  { icon: React.ElementType; label: string; showDots: boolean }
> = {
  idle: { icon: Sparkles, label: "Thinking...", showDots: true },
  analyzing: { icon: Database, label: "Analyzing query...", showDots: false },
  searching: { icon: Search, label: "Searching sources...", showDots: false },
  reading: { icon: FileText, label: "Reading sources...", showDots: false },
  retrieving: { icon: Database, label: "Retrieving context...", showDots: false },
  synthesizing: { icon: Sparkles, label: "Synthesizing answer...", showDots: true },
  generating: { icon: Sparkles, label: "Generating response...", showDots: true },
  cached: { icon: Check, label: "Loading cached response...", showDots: false },
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
            [styles.statusIconSearching]: status === "searching" || status === "analyzing",
            [styles.statusIconReading]: status === "reading" || status === "retrieving",
            [styles.statusIconGenerating]: status === "generating" || status === "synthesizing" || status === "idle",
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
  /** Follow-up questions for the latest response */
  followupQuestions?: string[];
  /** Callback when user clicks a follow-up question */
  onFollowupClick?: (question: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  className,
  status = "idle",
  followupQuestions = [],
  onFollowupClick,
}) => (
  <Box className={cn(styles.messagesContainer, className)}>
    {messages.map((message, index) => {
      const isLastMessage = index === messages.length - 1;
      const isActiveAssistant = isLastMessage && message.role === "assistant" &&
        (message.isLoading || !message.content);
      const isLastAssistantDone = isLastMessage && message.role === "assistant" &&
        !message.isLoading && message.content;

      return (
        <ChatMessage
          key={message.id}
          message={message}
          status={isActiveAssistant ? status : "idle"}
          followupQuestions={isLastAssistantDone ? followupQuestions : []}
          onFollowupClick={onFollowupClick}
        />
      );
    })}
  </Box>
);

export default ChatMessage;
