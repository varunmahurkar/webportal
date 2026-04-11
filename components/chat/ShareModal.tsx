/**
 * ShareModal — Generate and copy a shareable permalink for a conversation.
 * Share options: copy link, copy as Markdown, copy as plain text.
 * Link format: /share/{conversationId} (public read-only view).
 * Connected to: ChatMessage (share button action), page.tsx (conversation ID).
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/app/core/Typography';
import { Box, Flex } from '@/app/core/Grid';
import { X, Link, Copy, Check, Share, FileText, Globe } from '@/app/core/icons';
import styles from './ShareModal.module.css';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
  conversationTitle?: string;
  /** Message content to share as text */
  content?: string;
  className?: string;
}

type CopyState = 'idle' | 'copied';

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  conversationTitle = 'Nurav Research',
  content,
  className,
}) => {
  const [linkCopyState, setLinkCopyState] = useState<CopyState>('idle');
  const [textCopyState, setTextCopyState] = useState<CopyState>('idle');
  const [mdCopyState, setMdCopyState]     = useState<CopyState>('idle');

  const shareUrl = conversationId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${conversationId}`
    : '';

  const copyToClipboard = useCallback(async (text: string, setter: (s: CopyState) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter('copied');
      setTimeout(() => setter('idle'), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setter('copied');
      setTimeout(() => setter('idle'), 2000);
    }
  }, []);

  const handleCopyLink    = () => copyToClipboard(shareUrl, setLinkCopyState);
  const handleCopyText    = () => content && copyToClipboard(content, setTextCopyState);
  const handleCopyMarkdown = () => {
    if (!content) return;
    const md = `# ${conversationTitle}\n\n${content}\n\n---\n*Shared from [Nurav AI](${shareUrl})*`;
    copyToClipboard(md, setMdCopyState);
  };

  if (!isOpen) return null;

  return (
    <Box className={cn(styles.overlay, className)} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Box className={styles.modal}>
        {/* Header */}
        <Flex alignItems="center" justifyContent="between" className={styles.header}>
          <Flex alignItems="center" gap={2}>
            <Share size={18} className={styles.headerIcon} />
            <Text variant="heading-sm" weight={600}>Share Research</Text>
          </Flex>
          <Button variant="ghost" size="icon" onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </Button>
        </Flex>

        {/* Content */}
        <Box className={styles.body}>
          {/* Share Link */}
          {conversationId && (
            <Box className={styles.section}>
              <Text variant="label-sm" weight={600} color="secondary" className={styles.sectionLabel}>
                Shareable Link
              </Text>
              <Text variant="caption" color="secondary" className={styles.sectionDesc}>
                Anyone with this link can view this conversation (read-only).
              </Text>
              <Flex alignItems="center" gap={2} className={styles.linkRow}>
                <Flex alignItems="center" gap={2} className={styles.linkPreview}>
                  <Globe size={14} className={styles.linkIcon} />
                  <Input
                    value={shareUrl}
                    readOnly
                    className={styles.linkInput}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </Flex>
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className={cn(styles.copyBtn, linkCopyState === 'copied' && styles.copyBtnSuccess)}
                >
                  {linkCopyState === 'copied' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{linkCopyState === 'copied' ? 'Copied!' : 'Copy Link'}</span>
                </Button>
              </Flex>
            </Box>
          )}

          {/* Export Options */}
          {content && (
            <Box className={styles.section}>
              <Text variant="label-sm" weight={600} color="secondary" className={styles.sectionLabel}>
                Copy Content
              </Text>
              <Flex gap={2} wrap="wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyText}
                  className={cn(styles.exportBtn, textCopyState === 'copied' && styles.exportBtnSuccess)}
                >
                  {textCopyState === 'copied' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{textCopyState === 'copied' ? 'Copied!' : 'Copy Plain Text'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyMarkdown}
                  className={cn(styles.exportBtn, mdCopyState === 'copied' && styles.exportBtnSuccess)}
                >
                  {mdCopyState === 'copied' ? <Check size={14} /> : <FileText size={14} />}
                  <span>{mdCopyState === 'copied' ? 'Copied!' : 'Copy as Markdown'}</span>
                </Button>
              </Flex>
            </Box>
          )}

          {/* Privacy Note */}
          <Flex alignItems="center" gap={2} className={styles.privacyNote}>
            <Link size={13} className={styles.privacyIcon} />
            <Text variant="caption" color="secondary">
              Shared conversations are public. Sensitive content should not be shared.
            </Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ShareModal;
