/**
 * ResearchTimeline — Chronological source timeline for deep research responses.
 * Groups citations by published_at year/month and renders a vertical timeline.
 * Shows how knowledge on a topic evolved over time.
 * Connected to: ChatMessage (shown after deep mode responses with dated citations).
 */

'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/app/core/Typography';
import { Box, Flex } from '@/app/core/Grid';
import { Clock, ExternalLink, ChevronDown, ChevronUp } from '@/app/core/icons';
import styles from './ResearchTimeline.module.css';

export interface TimelineCitation {
  id: number;
  url: string;
  title: string;
  source_type?: string;
  published_at?: string;
  snippet?: string;
}

interface TimelineGroup {
  period: string;     // e.g. "2024", "2023 Q3"
  year: number;
  citations: TimelineCitation[];
}

/** Parse and group citations by year (or "Unknown" if no date) */
function groupByTimePeriod(citations: TimelineCitation[]): TimelineGroup[] {
  const dated   = citations.filter((c) => c.published_at);
  const undated = citations.filter((c) => !c.published_at);

  const byYear: Record<number, TimelineCitation[]> = {};
  for (const c of dated) {
    const year = new Date(c.published_at!).getFullYear();
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(c);
  }

  const groups: TimelineGroup[] = Object.entries(byYear)
    .map(([year, cits]) => ({
      period: year,
      year: Number(year),
      citations: cits,
    }))
    .sort((a, b) => b.year - a.year); // newest first

  if (undated.length > 0) {
    groups.push({ period: 'Unknown Date', year: 0, citations: undated });
  }

  return groups;
}

const SOURCE_TYPE_COLORS: Record<string, string> = {
  arxiv:   '#3b82f6',
  pubmed:  '#22c55e',
  youtube: '#ef4444',
  news:    '#f97316',
  web:     '#6366f1',
  reddit:  '#ff4500',
};

export interface ResearchTimelineProps {
  citations: TimelineCitation[];
  className?: string;
}

export const ResearchTimeline: React.FC<ResearchTimelineProps> = ({ citations, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const groups = useMemo(() => groupByTimePeriod(citations), [citations]);

  // Only show if at least 2 dated sources
  const datedCount = citations.filter((c) => c.published_at).length;
  if (datedCount < 2) return null;

  const visibleGroups = isExpanded ? groups : groups.slice(0, 3);

  return (
    <Box className={cn(styles.timeline, className)}>
      <Flex alignItems="center" justifyContent="between" className={styles.timelineHeader}>
        <Flex alignItems="center" gap={2}>
          <Clock size={15} className={styles.headerIcon} />
          <Text variant="label-sm" weight={600}>Research Timeline</Text>
          <span className={styles.sourceCount}>{datedCount} dated sources</span>
        </Flex>
        {groups.length > 3 && (
          <button className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{isExpanded ? 'Show less' : `Show all ${groups.length} periods`}</span>
          </button>
        )}
      </Flex>

      <Box className={styles.timelineTrack}>
        {visibleGroups.map((group, groupIdx) => (
          <Box key={group.period} className={styles.timelineGroup}>
            {/* Year marker */}
            <Flex alignItems="center" gap={3} className={styles.periodHeader}>
              <div className={styles.periodDot} />
              <Text variant="label-md" weight={700} className={styles.periodLabel}>
                {group.period}
              </Text>
              <div className={styles.periodLine} />
              <Text variant="caption" color="secondary">
                {group.citations.length} source{group.citations.length !== 1 ? 's' : ''}
              </Text>
            </Flex>

            {/* Citations in this period */}
            <Box className={styles.periodCitations}>
              {group.citations.map((citation) => {
                const color = SOURCE_TYPE_COLORS[citation.source_type || 'web'] || '#6366f1';
                return (
                  <a
                    key={citation.id}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.citationCard}
                  >
                    <div
                      className={styles.citationAccent}
                      style={{ background: color }}
                    />
                    <Box className={styles.citationBody}>
                      <Text variant="body-sm" weight={500} className={styles.citationTitle}>
                        {citation.title || citation.url}
                      </Text>
                      {citation.snippet && (
                        <Text variant="caption" color="secondary" className={styles.citationSnippet}>
                          {citation.snippet.length > 100
                            ? `${citation.snippet.slice(0, 100)}...`
                            : citation.snippet}
                        </Text>
                      )}
                      {citation.published_at && (
                        <Text variant="caption" color="tertiary" className={styles.citationDate}>
                          {new Date(citation.published_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </Text>
                      )}
                    </Box>
                    <ExternalLink size={12} className={styles.citationExternal} />
                  </a>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResearchTimeline;
