/**
 * ContradictionAlert — Client-side heuristic detector for conflicting source signals.
 * Scans citation snippets for contradictory sentiment/claim indicators.
 * Surfaces a dismissible warning badge when potential contradictions are detected.
 * Connected to: ChatMessage (shown below answer for research/deep mode responses).
 */

'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/app/core/Typography';
import { Box, Flex } from '@/app/core/Grid';
import { AlertTriangle, X, ChevronDown, ChevronUp } from '@/app/core/icons';
import styles from './ContradictionAlert.module.css';

export interface ContradictionSource {
  id: number;
  title: string;
  url: string;
  snippet?: string;
}

interface ContradictionPair {
  sourceA: ContradictionSource;
  sourceB: ContradictionSource;
  reason: string;
}

/** Word clusters representing opposing stances */
const POSITIVE_SIGNALS = [
  'effective', 'beneficial', 'proven', 'supports', 'increases', 'improves',
  'safe', 'recommended', 'successful', 'positive', 'advantage', 'better',
  'significant improvement', 'promotes', 'enhances', 'outperforms',
];

const NEGATIVE_SIGNALS = [
  'ineffective', 'harmful', 'disproven', 'contradicts', 'decreases', 'worsens',
  'unsafe', 'not recommended', 'failed', 'negative', 'risk', 'worse',
  'no significant', 'inhibits', 'reduces', 'underperforms',
];

function scoreSignal(text: string): number {
  const lower = text.toLowerCase();
  const pos = POSITIVE_SIGNALS.filter((w) => lower.includes(w)).length;
  const neg = NEGATIVE_SIGNALS.filter((w) => lower.includes(w)).length;
  return pos - neg; // positive = net positive, negative = net negative
}

/** Detect potential contradictions across citation snippets */
function detectContradictions(sources: ContradictionSource[]): ContradictionPair[] {
  const withSnippets = sources.filter((s) => s.snippet && s.snippet.length > 30);
  if (withSnippets.length < 2) return [];

  const scored = withSnippets.map((s) => ({ source: s, score: scoreSignal(s.snippet!) }));
  const pairs: ContradictionPair[] = [];

  for (let i = 0; i < scored.length; i++) {
    for (let j = i + 1; j < scored.length; j++) {
      const a = scored[i];
      const b = scored[j];
      // Contradiction: one is clearly positive (+2 or higher) and the other clearly negative (-2 or lower)
      if (a.score >= 2 && b.score <= -2) {
        pairs.push({
          sourceA: a.source,
          sourceB: b.source,
          reason: `"${a.source.title.slice(0, 40)}..." reports positive outcomes while "${b.source.title.slice(0, 40)}..." reports contrary findings.`,
        });
      } else if (a.score <= -2 && b.score >= 2) {
        pairs.push({
          sourceA: b.source,
          sourceB: a.source,
          reason: `"${b.source.title.slice(0, 40)}..." reports positive outcomes while "${a.source.title.slice(0, 40)}..." reports contrary findings.`,
        });
      }
    }
  }

  // Cap at 3 pairs to avoid noise
  return pairs.slice(0, 3);
}

export interface ContradictionAlertProps {
  citations: ContradictionSource[];
  className?: string;
}

export const ContradictionAlert: React.FC<ContradictionAlertProps> = ({ citations, className }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const contradictions = useMemo(() => detectContradictions(citations), [citations]);

  if (contradictions.length === 0 || isDismissed) return null;

  return (
    <Box className={cn(styles.alert, className)}>
      <Flex alignItems="center" justifyContent="between" className={styles.alertHeader}>
        <Flex alignItems="center" gap={2}>
          <AlertTriangle size={15} className={styles.alertIcon} />
          <Text variant="label-sm" weight={600} className={styles.alertTitle}>
            Conflicting Sources Detected
          </Text>
          <span className={styles.alertBadge}>{contradictions.length}</span>
        </Flex>
        <Flex alignItems="center" gap={1}>
          <button
            className={styles.toggleBtn}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse details' : 'View details'}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            className={styles.dismissBtn}
            onClick={() => setIsDismissed(true)}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </Flex>
      </Flex>

      {isExpanded && (
        <Box className={styles.alertBody}>
          <Text variant="caption" color="secondary" className={styles.alertIntro}>
            Some sources in this response may present conflicting information. Review carefully:
          </Text>
          {contradictions.map((pair, idx) => (
            <Box key={idx} className={styles.contradictionPair}>
              <Flex alignItems="start" gap={2} className={styles.pairSources}>
                <a href={pair.sourceA.url} target="_blank" rel="noopener noreferrer" className={cn(styles.pairSource, styles.sourcePositive)}>
                  [{pair.sourceA.id}] {pair.sourceA.title.slice(0, 35)}...
                </a>
                <span className={styles.vsLabel}>vs</span>
                <a href={pair.sourceB.url} target="_blank" rel="noopener noreferrer" className={cn(styles.pairSource, styles.sourceNegative)}>
                  [{pair.sourceB.id}] {pair.sourceB.title.slice(0, 35)}...
                </a>
              </Flex>
              <Text variant="caption" color="secondary" className={styles.pairReason}>
                {pair.reason}
              </Text>
            </Box>
          ))}
          <Text variant="caption" color="tertiary" className={styles.alertFootnote}>
            This is a heuristic signal — always verify sources independently.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ContradictionAlert;
