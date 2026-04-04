/**
 * Chat Input Component — Nurav AI
 * Multi-line input with send/stop controls, keyboard shortcuts, and
 * pre-send mode selector (Fast / Research / Deep).
 * Mode selector lives in the toolbar — user picks mode BEFORE sending.
 * Personalization toggle (Sparkles icon) enables KG + memory context injection.
 * Connected to: page.tsx (handleSend), useChat (sendMessage, stopGeneration, selectedMode, usePersonalization).
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Box, Flex } from '@/app/core/Grid';
import {
  ArrowUp,
  Plus,
  Paperclip,
  Image,
  Mic,
  Globe,
  Code,
  Sparkles,
  Zap,
  BookOpen,
  Microscope,
  FileText,
  Video,
  Square,
} from '@/app/core/icons';
import styles from './ChatInput.module.css';
import type { QueryMode } from '@/hooks/useChat';

/** Labels and icons for each query mode chip */
const MODE_CONFIG: Record<QueryMode, { label: string; icon: React.ElementType; title: string }> = {
  simple: { label: 'Fast', icon: Zap, title: 'Fast mode — < 5s, web only' },
  research: { label: 'Research', icon: BookOpen, title: 'Research mode — 5-15s, multi-source' },
  deep: { label: 'Deep', icon: Microscope, title: 'Deep mode — 15-30s, academic + full synthesis' },
};

export interface ChatInputProps {
  placeholder?: string;
  className?: string;
  onSend?: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  /** Currently selected mode (controlled by parent / useChat) */
  selectedMode?: QueryMode;
  /** Called when user switches mode in the toolbar */
  onModeChange?: (mode: QueryMode) => void;
  /** Whether KG + memory personalisation is enabled (opt-in toggle) */
  usePersonalization?: boolean;
  /** Called when user toggles personalisation on/off */
  onPersonalizationToggle?: (enabled: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Ask anything...',
  className,
  onSend,
  onStop,
  disabled = false,
  isGenerating = false,
  selectedMode = 'research',
  onModeChange,
  usePersonalization = false,
  onPersonalizationToggle,
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Handle send message */
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSend?.(message.trim());
    setMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  /** Handle keyboard submit */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <Box className={cn(styles.wrapper, className)}>
      <Box className={cn(styles.container, isFocused && styles.focused)}>
        {/* Main Input Area */}
        <Flex className={styles.inputArea}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={styles.textarea}
          />
        </Flex>

        {/* Actions Bar */}
        <Flex className={styles.actionsBar} alignItems="center" justifyContent="between">
          {/* Left Actions */}
          <Flex className={styles.leftActions} alignItems="center" gap={1}>
            {/* Attach Menu */}
            <Box className={styles.attachMenuWrapper}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(styles.actionBtn, showAttachMenu && styles.actionBtnActive)}
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                title="Attach"
              >
                <Plus size={20} />
              </Button>

              {showAttachMenu && (
                <Box className={styles.attachMenu}>
                  <Button variant="ghost" className={styles.attachMenuItem}>
                    <Paperclip size={18} />
                    <span>Upload File</span>
                  </Button>
                  <Button variant="ghost" className={styles.attachMenuItem}>
                    <Image size={18} />
                    <span>Upload Image</span>
                  </Button>
                  <Button variant="ghost" className={styles.attachMenuItem}>
                    <FileText size={18} />
                    <span>Upload Document</span>
                  </Button>
                  <Button variant="ghost" className={styles.attachMenuItem}>
                    <Video size={18} />
                    <span>Upload Video</span>
                  </Button>
                </Box>
              )}
            </Box>

            <div className={styles.divider} />

            {/* Pre-Send Mode Chips — user picks mode BEFORE sending */}
            <Flex className={styles.modeChips} alignItems="center" gap={1}>
              {(Object.entries(MODE_CONFIG) as [QueryMode, typeof MODE_CONFIG[QueryMode]][]).map(
                ([mode, config]) => {
                  const Icon = config.icon;
                  const isActive = selectedMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      className={cn(styles.modeChip, isActive && styles.modeChipActive)}
                      onClick={() => onModeChange?.(mode)}
                      title={config.title}
                      disabled={disabled}
                    >
                      <Icon size={13} />
                      <span>{config.label}</span>
                    </button>
                  );
                }
              )}
            </Flex>

            <div className={styles.divider} />

            {/* Personalisation Toggle — opt-in KG + memory context injection */}
            <button
              type="button"
              className={cn(styles.modeChip, usePersonalization && styles.modeChipActive)}
              onClick={() => onPersonalizationToggle?.(!usePersonalization)}
              title={usePersonalization ? 'Personalisation ON — click to disable' : 'Enable personalisation (uses your knowledge graph & interests)'}
              disabled={disabled}
            >
              <Sparkles size={13} />
              <span>Personal</span>
            </button>
          </Flex>

          {/* Right Actions */}
          <Flex className={styles.rightActions} alignItems="center" gap={1}>
            <Button variant="ghost" size="icon" className={styles.actionBtn} title="Voice input">
              <Mic size={18} />
            </Button>

            {isGenerating ? (
              <Button
                size="icon"
                className={cn(styles.sendBtn, styles.stopBtn)}
                onClick={onStop}
                title="Stop generating"
              >
                <Square size={14} fill="currentColor" />
              </Button>
            ) : (
              <Button
                size="icon"
                className={cn(styles.sendBtn, message.trim() && !disabled && styles.sendBtnActive)}
                disabled={!message.trim() || disabled}
                onClick={handleSend}
                title={`Send (${MODE_CONFIG[selectedMode].label} mode)`}
              >
                <ArrowUp size={18} />
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Footer Text */}
      <p className={styles.footerText}>
        Nurav AI may produce inaccurate information. Verify important details.
      </p>
    </Box>
  );
};

export default ChatInput;
