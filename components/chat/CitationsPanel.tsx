/**
 * Citations Panel Component
 * Displays all web search citations in a collapsible panel
 * Shows source URLs, titles, and snippets
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Box, Flex } from '@/app/core/Grid';
import { Text } from '@/app/core/Typography';
import { Globe, X, Link } from '@/app/core/icons';
import { Button } from '@/components/ui/button';
import styles from './CitationsPanel.module.css';

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

export interface CitationsPanelProps {
  citations: Citation[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Extracts hostname from URL for display
 */
function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Citations Panel - Shows all web sources in a sidebar panel
 */
export const CitationsPanel: React.FC<CitationsPanelProps> = ({
  citations,
  isOpen,
  onClose,
  className,
}) => {
  if (!isOpen || citations.length === 0) return null;

  return (
    <Box className={cn(styles.panel, className)}>
      {/* Header */}
      <Flex
        className={styles.header}
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex alignItems="center" gap={2}>
          <Globe size={18} />
          <Text variant="label-lg" weight={600}>
            Sources ({citations.length})
          </Text>
        </Flex>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close citations panel"
        >
          <X size={18} />
        </Button>
      </Flex>

      {/* Citations List */}
      <Box className={styles.citationsList}>
        {citations.map((citation) => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.citationCard}
          >
            <Flex alignItems="flex-start" gap={3}>
              {/* Favicon */}
              <Box className={styles.faviconWrapper}>
                <img
                  src={citation.favicon_url || `https://${getHostname(citation.url)}/favicon.ico`}
                  alt=""
                  className={styles.favicon}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <Globe size={16} className={styles.fallbackIcon} />
              </Box>

              {/* Content */}
              <Box className={styles.citationContent}>
                <Text
                  variant="body-sm"
                  weight={500}
                  className={styles.citationTitle}
                >
                  {citation.title || getHostname(citation.url)}
                </Text>
                <Flex alignItems="center" gap={1} className={styles.citationUrl}>
                  <Link size={12} />
                  <Text variant="caption" color="secondary">
                    {getHostname(citation.url)}
                  </Text>
                </Flex>
                {citation.snippet && (
                  <Text
                    variant="caption"
                    color="tertiary"
                    className={styles.snippet}
                  >
                    {citation.snippet.length > 120
                      ? `${citation.snippet.slice(0, 120)}...`
                      : citation.snippet}
                  </Text>
                )}
              </Box>
            </Flex>
          </a>
        ))}
      </Box>
    </Box>
  );
};

export default CitationsPanel;
