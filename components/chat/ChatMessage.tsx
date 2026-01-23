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
} from "./../../app/core/icons";
import styles from "./ChatMessage.module.css";

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
  citations: Citation[],
): ParsedContent[] {
  const citationRegex = /【([^】]+)】/g;
  const parts: ParsedContent[] = [];
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: content.slice(lastIndex, match.index) });
    }

    const domain = match[1];
    const citation = citations.find(
      (c) => c.root_url.includes(domain) || c.url.includes(domain),
    );

    parts.push({
      text: domain,
      domain,
      url: citation?.url || `https://${domain}`,
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ text: content.slice(lastIndex) });
  }

  return parts;
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
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(true);
  const isUser = message.role === "user";
  const hasCitations =
    !isUser && message.citations && message.citations.length > 0;

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
        {message.isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <Box className={styles.answerContent}>
              {message.content.split("\n").map((line, i) => {
                const parts = parseCitationContent(
                  line,
                  message.citations || [],
                );
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
                        <span key={j}>{part.text || "\u00A0"}</span>
                      ),
                    )}
                  </p>
                );
              })}
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

// Loading indicator
const LoadingIndicator: React.FC = () => (
  <Flex className={styles.loadingIndicator} alignItems="center" gap={2}>
    <div className={styles.loadingDot} style={{ animationDelay: "0ms" }} />
    <div className={styles.loadingDot} style={{ animationDelay: "150ms" }} />
    <div className={styles.loadingDot} style={{ animationDelay: "300ms" }} />
  </Flex>
);

// Container for multiple messages
export interface ChatMessagesProps {
  messages: Message[];
  className?: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  className,
}) => (
  <Box className={cn(styles.messagesContainer, className)}>
    {messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ))}
  </Box>
);

export default ChatMessage;
