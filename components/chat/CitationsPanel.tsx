/**
 * Citations Panel — right-side persistent sources panel.
 * Slides in from right when the current response has sources.
 * Groups sources by type: Web, Wikipedia, Academic, Video, News, Community.
 * Each card shows: favicon + title + domain + quality score bar + publish date.
 * Connected to: ChatLayout (right panel slot), page.tsx (activeCitations state).
 */

'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Box, Flex } from '@/app/core/Grid';
import { Text } from '@/app/core/Typography';
import {
  Globe,
  X,
  BookOpen,
  Video,
  Newspaper,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  FileText,
  Loader2,
} from '@/app/core/icons';
import { Button } from '@/components/ui/button';
import styles from './CitationsPanel.module.css';
import type { Citation } from '@/hooks/useChat';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Source type configuration — label, icon, CSS modifier */
const SOURCE_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  web:       { label: 'Web',        icon: Globe,         color: 'web' },
  wikipedia: { label: 'Wikipedia',  icon: BookMarked,    color: 'wiki' },
  arxiv:     { label: 'Academic',   icon: BookOpen,      color: 'academic' },
  youtube:   { label: 'Video',      icon: Video,         color: 'video' },
  news:      { label: 'News',       icon: Newspaper,     color: 'news' },
  reddit:    { label: 'Community',  icon: MessageSquare, color: 'community' },
};

/** Display order for source groups */
const SOURCE_TYPE_ORDER = ['wikipedia', 'arxiv', 'web', 'news', 'youtube', 'reddit'];

export interface CitationsPanelProps {
  citations: Citation[];
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose: () => void;
  onToggleCollapse?: () => void;
  className?: string;
}

/** Extract hostname from URL */
function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/** Format ISO date to relative/short label */
function formatPublishedDate(iso: string): string {
  if (!iso) return '';
  try {
    const dt = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - dt.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

/** Group citations by source_type in display order */
function groupByType(citations: Citation[]): { type: string; sources: Citation[] }[] {
  const groups: Record<string, Citation[]> = {};
  for (const c of citations) {
    const type = c.source_type || 'web';
    if (!groups[type]) groups[type] = [];
    groups[type].push(c);
  }

  const result: { type: string; sources: Citation[] }[] = [];
  for (const type of SOURCE_TYPE_ORDER) {
    if (groups[type]) {
      result.push({ type, sources: groups[type] });
      delete groups[type];
    }
  }
  // Any remaining ungrouped types
  for (const [type, sources] of Object.entries(groups)) {
    result.push({ type, sources });
  }
  return result;
}

/**
 * Quality Score Bar — visual indicator 0-100
 */
const QualityBar: React.FC<{ score: number; tier: string }> = ({ score, tier }) => {
  const tierColor = {
    authoritative: styles.qualityBarAuthoritative,
    reputable: styles.qualityBarReputable,
    community: styles.qualityBarCommunity,
    general: styles.qualityBarGeneral,
  }[tier] || styles.qualityBarGeneral;

  return (
    <div className={styles.qualityBarWrapper} title={`Quality: ${score}/100 (${tier})`}>
      <div
        className={cn(styles.qualityBarFill, tierColor)}
        style={{ width: `${score}%` }}
      />
    </div>
  );
};

/**
 * Single source card in the panel.
 * For arXiv sources, shows a "Read full paper" button that fetches extracted PDF text
 * from the /data/paper-text endpoint and displays it inline (collapsible).
 */
const SourceCard: React.FC<{ citation: Citation }> = ({ citation }) => {
  const hostname = getHostname(citation.url);
  const publishedLabel = formatPublishedDate(citation.published_at || '');
  const [paperText, setPaperText] = useState<string | null>(null);
  const [paperLoading, setPaperLoading] = useState(false);
  const [paperExpanded, setPaperExpanded] = useState(false);

  const isArxiv = citation.source_type === 'arxiv';

  const handleReadPaper = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (paperText) {
      setPaperExpanded((prev) => !prev);
      return;
    }
    // Derive PDF URL — arXiv abstracts use /abs/, PDFs use /pdf/
    const pdfUrl = citation.url.replace('/abs/', '/pdf/');
    setPaperLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/data/paper-text?url=${encodeURIComponent(pdfUrl)}&max_chars=8000`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPaperText(data.text);
      setPaperExpanded(true);
    } catch {
      setPaperText('[Could not extract paper text. Try opening the PDF directly.]');
      setPaperExpanded(true);
    } finally {
      setPaperLoading(false);
    }
  };

  return (
    <Box className={styles.sourceCardWrapper}>
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.sourceCard}
      >
        {/* Card header: favicon + number + domain */}
        <Flex alignItems="center" gap={2} className={styles.sourceCardHeader}>
          <span className={styles.sourceCardNumber}>{citation.id}</span>
          <div className={styles.faviconWrapper}>
            <img
              src={citation.favicon_url || `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
              alt=""
              className={styles.favicon}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <Globe size={12} className={styles.faviconFallback} />
          </div>
          <Text variant="caption" color="secondary" className={styles.sourceDomain}>
            {hostname}
          </Text>
          {publishedLabel && (
            <Text variant="caption" color="tertiary" className={styles.sourceDate}>
              {publishedLabel}
            </Text>
          )}
        </Flex>

        {/* Title */}
        <Text variant="body-sm" weight={500} className={styles.sourceTitle}>
          {citation.title || hostname}
        </Text>

        {/* Quality bar */}
        {(citation.quality_score ?? 0) > 0 && (
          <QualityBar score={citation.quality_score!} tier={citation.credibility_tier || 'general'} />
        )}
      </a>

      {/* "Read full paper" button — only for arXiv sources */}
      {isArxiv && (
        <Button
          variant="ghost"
          size="sm"
          className={styles.readPaperBtn}
          onClick={handleReadPaper}
          disabled={paperLoading}
          title={paperText ? (paperExpanded ? 'Collapse paper text' : 'Expand paper text') : 'Read full paper text'}
        >
          {paperLoading ? (
            <Loader2 size={12} className={styles.spinIcon} />
          ) : (
            <FileText size={12} />
          )}
          <span>{paperLoading ? 'Loading…' : paperText ? (paperExpanded ? 'Collapse' : 'Read paper') : 'Read full paper'}</span>
        </Button>
      )}

      {/* Inline paper text — collapsible */}
      {isArxiv && paperExpanded && paperText && (
        <Box className={styles.paperTextBox}>
          <Text variant="caption" color="secondary" className={styles.paperText}>
            {paperText}
          </Text>
        </Box>
      )}
    </Box>
  );
};

/**
 * Citations Panel — full right-side sources panel with type grouping
 */
export const CitationsPanel: React.FC<CitationsPanelProps> = ({
  citations,
  isOpen,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
  className,
}) => {
  const groups = useMemo(() => groupByType(citations), [citations]);

  if (!isOpen || citations.length === 0) return null;

  return (
    <Box className={cn(styles.panel, isCollapsed && styles.panelCollapsed, className)}>
      {/* Header */}
      <Flex className={styles.panelHeader} justifyContent="between" alignItems="center">
        {!isCollapsed && (
          <Flex alignItems="center" gap={2}>
            <Globe size={16} className={styles.headerIcon} />
            <Text variant="label-md" weight={600}>Sources</Text>
            <span className={styles.sourceCount}>{citations.length}</span>
          </Flex>
        )}

        <Flex alignItems="center" gap={1} className={isCollapsed ? styles.collapsedActions : ''}>
          {/* Collapse/expand toggle */}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className={styles.collapseBtn}
              title={isCollapsed ? 'Expand sources panel' : 'Collapse sources panel'}
            >
              {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </Button>
          )}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={styles.closeBtn}
              title="Close sources panel"
            >
              <X size={16} />
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Source groups — hidden when collapsed */}
      {!isCollapsed && (
        <Box className={styles.panelBody}>
          {groups.map(({ type, sources }) => {
            const config = SOURCE_TYPE_CONFIG[type] || SOURCE_TYPE_CONFIG.web;
            const Icon = config.icon;
            return (
              <Box key={type} className={styles.sourceGroup}>
                {/* Group header */}
                <Flex alignItems="center" gap={1} className={styles.groupHeader}>
                  <Icon size={13} className={cn(styles.groupIcon, styles[`groupIcon_${config.color}`])} />
                  <Text variant="caption" weight={600} className={styles.groupLabel}>
                    {config.label}
                  </Text>
                  <span className={styles.groupCount}>{sources.length}</span>
                </Flex>

                {/* Source cards */}
                <Box className={styles.groupCards}>
                  {sources.map((citation) => (
                    <SourceCard key={citation.id} citation={citation} />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Collapsed state — show numbered icons vertically */}
      {isCollapsed && (
        <Box className={styles.collapsedList}>
          {citations.slice(0, 8).map((c) => (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.collapsedItem}
              title={c.title || getHostname(c.url)}
            >
              <img
                src={c.favicon_url || `https://www.google.com/s2/favicons?domain=${getHostname(c.url)}&sz=32`}
                alt=""
                width={16}
                height={16}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </a>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CitationsPanel;
