/**
 * Chat Input Component
 * Beautiful input design like Perplexity, ChatGPT, Claude
 * Icons only - no logic implementation
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Box, Flex } from '@/app/core/Grid';
import {
  Send,
  Plus,
  Paperclip,
  Image,
  Mic,
  Globe,
  Sparkles,
  ArrowUp,
  AtSign,
  Code,
  FileText,
  Camera,
  Search,
} from '@/app/core/icons';
import styles from './ChatInput.module.css';

export interface ChatInputProps {
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Ask anything...',
  className,
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box className={cn(styles.wrapper, className)}>
      <Box className={cn(styles.container, isFocused && styles.focused)}>
        {/* Top Row - Main Input */}
        <Flex className={styles.inputRow} alignItems="flex-end" gap={2}>
          {/* Left Actions */}
          <Flex className={styles.leftActions} alignItems="center" gap={1}>
            <Button variant="ghost" size="icon" className={styles.actionBtn} title="Add attachment">
              <Plus size={20} />
            </Button>
          </Flex>

          {/* Textarea */}
          <Box className={styles.textareaWrapper}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={1}
              className={styles.textarea}
            />
          </Box>

          {/* Right Actions */}
          <Flex className={styles.rightActions} alignItems="center" gap={1}>
            <Button
              variant={message.trim() ? 'default' : 'ghost'}
              size="icon"
              className={cn(styles.sendBtn, message.trim() && styles.sendBtnActive)}
              title="Send message"
            >
              <ArrowUp size={18} />
            </Button>
          </Flex>
        </Flex>

        {/* Bottom Row - Action Buttons */}
        <Flex className={styles.bottomRow} alignItems="center" justifyContent="between">
          {/* Left Side - Attachment Options */}
          <Flex className={styles.attachOptions} alignItems="center" gap={1}>
            <Button variant="ghost" size="sm" className={styles.optionBtn} title="Attach file">
              <Paperclip size={16} />
              <span>Attach</span>
            </Button>
            <Button variant="ghost" size="sm" className={styles.optionBtn} title="Upload image">
              <Image size={16} />
              <span>Image</span>
            </Button>
            <Button variant="ghost" size="sm" className={styles.optionBtn} title="Search web">
              <Globe size={16} />
              <span>Search</span>
            </Button>
            <Button variant="ghost" size="sm" className={styles.optionBtn} title="Code mode">
              <Code size={16} />
              <span>Code</span>
            </Button>
          </Flex>

          {/* Right Side - Voice & More */}
          <Flex className={styles.moreOptions} alignItems="center" gap={1}>
            <Button variant="ghost" size="icon" className={styles.iconBtn} title="Voice input">
              <Mic size={18} />
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Helper Text */}
      <Flex className={styles.helperRow} justifyContent="center">
        <span className={styles.helperText}>
          Nurav AI can make mistakes. Check important info.
        </span>
      </Flex>
    </Box>
  );
};

export default ChatInput;
