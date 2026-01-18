/**
 * Nurav AI Welcome Screen Component
 *
 * The initial screen shown when starting a new conversation.
 * Features:
 * - Animated logo
 * - Suggested prompts/queries
 * - Quick action buttons
 * - Feature highlights
 */

'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Typography, Text, Heading } from '@/app/core/Typography';
import { Box, Flex, Stack, Grid } from '@/app/core/Grid';
import {
  Sparkles,
  Search,
  Code,
  FileText,
  Lightbulb,
  MessageSquare,
  Globe,
  Zap,
} from '@/app/core/icons';
import styles from './WelcomeScreen.module.css';

// Add Lightbulb to icons export

/**
 * Suggestion card interface
 */
export interface Suggestion {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  prompt: string;
}

/**
 * Welcome screen props interface
 */
export interface WelcomeScreenProps {
  onSuggestionClick?: (prompt: string) => void;
  suggestions?: Suggestion[];
  userName?: string;
  className?: string;
}

/**
 * Default suggestions for quick start
 */
const defaultSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Explain a concept',
    description: 'Get clear explanations on any topic',
    icon: <Lightbulb size={20} />,
    prompt: 'Explain how machine learning works in simple terms',
  },
  {
    id: '2',
    title: 'Write code',
    description: 'Generate code in any programming language',
    icon: <Code size={20} />,
    prompt: 'Write a Python function to sort a list of numbers',
  },
  {
    id: '3',
    title: 'Search the web',
    description: 'Find real-time information online',
    icon: <Globe size={20} />,
    prompt: 'What are the latest developments in AI?',
  },
  {
    id: '4',
    title: 'Analyze content',
    description: 'Summarize or analyze documents',
    icon: <FileText size={20} />,
    prompt: 'Summarize the key points of this article for me',
  },
];

/**
 * WelcomeScreen component for new conversations
 */
export const WelcomeScreen = memo<WelcomeScreenProps>(({
  onSuggestionClick,
  suggestions = defaultSuggestions,
  userName,
  className,
}) => {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box className={cn(styles.welcomeScreen, className)}>
      <Stack
        direction="vertical"
        spacing={8}
        className={styles.welcomeContent}
      >
        {/* Logo and Title */}
        <Flex
          direction="column"
          alignItems="center"
          gap={4}
          className={styles.heroSection}
        >
          <Box className={styles.logoContainer}>
            <Sparkles size={48} className={styles.logoIcon} />
          </Box>

          <Stack direction="vertical" spacing={2} className={styles.titleSection}>
            <Heading level={1} align="center" className={styles.title}>
              {userName ? `${getGreeting()}, ${userName}` : getGreeting()}
            </Heading>
            <Text
              variant="body-lg"
              color="secondary"
              align="center"
              className={styles.subtitle}
            >
              How can I help you today?
            </Text>
          </Stack>
        </Flex>

        {/* Suggestions Grid */}
        <Box className={styles.suggestionsSection}>
          <Grid columns={2} gap={3} className={styles.suggestionsGrid}>
            {suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onClick={() => onSuggestionClick?.(suggestion.prompt)}
              />
            ))}
          </Grid>
        </Box>

        {/* Feature Pills */}
        <Flex
          wrap="wrap"
          justifyContent="center"
          gap={2}
          className={styles.featurePills}
        >
          <FeaturePill icon={<Zap size={14} />} label="Fast responses" />
          <FeaturePill icon={<Globe size={14} />} label="Web search" />
          <FeaturePill icon={<Code size={14} />} label="Code generation" />
          <FeaturePill icon={<MessageSquare size={14} />} label="Conversations" />
        </Flex>
      </Stack>
    </Box>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

/**
 * Suggestion card component
 */
interface SuggestionCardProps {
  suggestion: Suggestion;
  onClick: () => void;
}

const SuggestionCard = memo<SuggestionCardProps>(({ suggestion, onClick }) => (
  <button
    className={styles.suggestionCard}
    onClick={onClick}
  >
    <Flex direction="column" gap={2} className={styles.suggestionContent}>
      {suggestion.icon && (
        <Box className={styles.suggestionIcon}>
          {suggestion.icon}
        </Box>
      )}
      <Text variant="body-md" weight={500} className={styles.suggestionTitle}>
        {suggestion.title}
      </Text>
      {suggestion.description && (
        <Text variant="body-sm" color="secondary" className={styles.suggestionDescription}>
          {suggestion.description}
        </Text>
      )}
    </Flex>
  </button>
));

SuggestionCard.displayName = 'SuggestionCard';

/**
 * Feature pill component
 */
interface FeaturePillProps {
  icon: React.ReactNode;
  label: string;
}

const FeaturePill = memo<FeaturePillProps>(({ icon, label }) => (
  <Flex
    alignItems="center"
    gap={1.5}
    className={styles.featurePill}
  >
    {icon}
    <Text variant="caption">{label}</Text>
  </Flex>
));

FeaturePill.displayName = 'FeaturePill';

export default WelcomeScreen;
