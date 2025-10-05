/**
 * ALEXIKA AI Copy to Clipboard Hook
 * Reusable hook for copying text to clipboard with success/error handling
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface CopyState {
  copiedText: string | null;
  isCopied: boolean;
}

interface UseCopyToClipboardReturn {
  copyToClipboard: (text: string) => Promise<boolean>;
  copiedText: string | null;
  isCopied: boolean;
  resetCopyState: () => void;
}

/**
 * Custom hook for copying text to clipboard
 * @param resetDelay - Time in milliseconds before resetting the copied state (default: 2000ms)
 * @returns Object with copy function and state
 */
export const useCopyToClipboard = (resetDelay: number = 2000): UseCopyToClipboardReturn => {
  const [copyState, setCopyState] = useState<CopyState>({
    copiedText: null,
    isCopied: false,
  });

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    if (!text) {
      toast.error('No text to copy');
      return false;
    }

    try {
      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('Copy command failed');
        }
      }

      // Update state
      setCopyState({
        copiedText: text,
        isCopied: true,
      });

      // Show success message
      toast.success('Copied to clipboard!');

      // Reset state after delay
      setTimeout(() => {
        setCopyState({
          copiedText: null,
          isCopied: false,
        });
      }, resetDelay);

      return true;
    } catch (error) {
      console.error('Failed to copy text: ', error);
      toast.error('Failed to copy to clipboard');
      
      // Reset state on error
      setCopyState({
        copiedText: null,
        isCopied: false,
      });
      
      return false;
    }
  }, [resetDelay]);

  const resetCopyState = useCallback(() => {
    setCopyState({
      copiedText: null,
      isCopied: false,
    });
  }, []);

  return {
    copyToClipboard,
    copiedText: copyState.copiedText,
    isCopied: copyState.isCopied,
    resetCopyState,
  };
};