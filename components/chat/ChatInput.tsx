/**
 * Chat Input Component
 * Modern design like Perplexity, ChatGPT, Claude
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
  X,
  Lightbulb,
  FileText,
  Video,
  Square,
} from '@/app/core/icons';
import styles from './ChatInput.module.css';

export interface ChatInputProps {
  placeholder?: string;
  className?: string;
  onSend?: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Ask anything...',
  className,
  onSend,
  onStop,
  disabled = false,
  isGenerating = false,
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
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
          {/* Textarea */}
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

              {/* Attach Dropdown */}
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

            {/* Feature Buttons */}
            <Button variant="ghost" size="sm" className={styles.featureBtn} title="Search the web">
              <Globe size={16} />
              <span>Search</span>
            </Button>
            <Button variant="ghost" size="sm" className={styles.featureBtn} title="Deep research">
              <Lightbulb size={16} />
              <span>Research</span>
            </Button>
            <Button variant="ghost" size="sm" className={styles.featureBtn} title="Code mode">
              <Code size={16} />
              <span>Code</span>
            </Button>
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
                title="Send message"
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
