/**
 * Mode Selector Component
 * Displays AI-suggested query mode with confirmation/override options.
 * Part of the hybrid triggering system (AI suggests, user confirms).
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/app/core/Typography';
import { Box, Flex } from '@/app/core/Grid';
import { Zap, Search, Sparkles, X, Clock } from '@/app/core/icons';
import type { QueryMode, ModeSuggestion } from '@/hooks/useChat';
import styles from './ModeSelector.module.css';

/**
 * Mode configuration with visual properties
 */
const MODE_CONFIG: Record<QueryMode, {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
}> = {
  simple: {
    icon: Zap,
    label: 'Quick',
    description: 'Fast web search answer',
    color: 'green',
  },
  research: {
    icon: Search,
    label: 'Research',
    description: 'Multi-source deep search',
    color: 'blue',
  },
  deep: {
    icon: Sparkles,
    label: 'Deep',
    description: 'Comprehensive analysis',
    color: 'purple',
  },
};

export interface ModeSelectorProps {
  suggestion: ModeSuggestion;
  onConfirm: (mode: QueryMode) => void;
  onDismiss: () => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  suggestion,
  onConfirm,
  onDismiss,
  className,
}) => {
  const suggestedConfig = MODE_CONFIG[suggestion.suggested_mode];
  const SuggestedIcon = suggestedConfig.icon;

  return (
    <Box className={cn(styles.container, className)}>
      {/* Header with dismiss */}
      <Flex alignItems="center" justifyContent="between" className={styles.header}>
        <Flex alignItems="center" gap={2}>
          <SuggestedIcon size={16} className={styles.headerIcon} />
          <Text variant="label-md" weight={600}>
            Suggested: {suggestedConfig.label} mode
          </Text>
        </Flex>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className={styles.dismissBtn}
        >
          <X size={14} />
        </Button>
      </Flex>

      {/* Reasoning */}
      <Text variant="body-sm" color="secondary" className={styles.reasoning}>
        {suggestion.reasoning}
      </Text>

      {/* Estimated time */}
      <Flex alignItems="center" gap={1} className={styles.timeEstimate}>
        <Clock size={12} />
        <Text variant="caption" color="tertiary">
          Est. {suggestion.estimated_time}
        </Text>
      </Flex>

      {/* Mode options */}
      <Flex className={styles.modeOptions} gap={2}>
        {(Object.keys(MODE_CONFIG) as QueryMode[]).map((mode) => {
          const config = MODE_CONFIG[mode];
          const Icon = config.icon;
          const isSuggested = mode === suggestion.suggested_mode;

          return (
            <Button
              key={mode}
              variant="ghost"
              className={cn(
                styles.modeBtn,
                styles[`mode_${config.color}`],
                isSuggested && styles.modeBtnSuggested,
              )}
              onClick={() => onConfirm(mode)}
            >
              <Icon size={14} />
              <span>{config.label}</span>
            </Button>
          );
        })}
      </Flex>
    </Box>
  );
};

export default ModeSelector;
