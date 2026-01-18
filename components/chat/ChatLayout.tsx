/**
 * Nurav AI Chat Layout Component
 *
 * The main layout structure for the ChatGPT-style interface.
 * Features:
 * - Collapsible sidebar integration
 * - Main content area with flexible sizing
 * - Mobile-responsive overlay for sidebar
 * - Keyboard shortcuts support
 */

'use client';

import React, { useState, useCallback, useEffect, memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar, Conversation } from './Sidebar';
import { Box } from '@/app/core/Grid';
import { Button } from '@/components/ui/button';
import { Menu } from '@/app/core/icons';
import styles from './ChatLayout.module.css';

/**
 * Chat layout props interface
 */
export interface ChatLayoutProps {
  children: ReactNode;
  conversations?: Conversation[];
  activeConversationId?: string;
  onNewChat?: () => void;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  className?: string;
  sidebarDefaultCollapsed?: boolean;
}

/**
 * ChatLayout component - Main wrapper for the chat interface
 */
export const ChatLayout = memo<ChatLayoutProps>(({
  children,
  conversations = [],
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onSettingsClick,
  onLogout,
  className,
  sidebarDefaultCollapsed = false,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(sidebarDefaultCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle sidebar toggle
  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileMenuOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  // Handle conversation selection (close mobile menu after selection)
  const handleSelectConversation = useCallback((id: string) => {
    onSelectConversation?.(id);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [onSelectConversation, isMobile]);

  // Handle new chat (close mobile menu after creation)
  const handleNewChat = useCallback(() => {
    onNewChat?.();
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [onNewChat, isMobile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      }
      // Ctrl/Cmd + Shift + N for new chat
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        handleNewChat();
      }
      // Escape to close mobile menu
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSidebar, handleNewChat, isMobileMenuOpen]);

  return (
    <div
      className={cn(
        styles.chatLayout,
        isSidebarCollapsed && styles.sidebarCollapsed,
        className
      )}
    >
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isCollapsed={isMobile ? !isMobileMenuOpen : isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={onDeleteConversation}
        onRenameConversation={onRenameConversation}
        onSettingsClick={onSettingsClick}
        onLogout={onLogout}
        className={cn(
          styles.sidebar,
          isMobile && isMobileMenuOpen && styles.mobileOpen
        )}
      />

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <Box className={styles.mobileHeader}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className={styles.menuButton}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </Button>
          </Box>
        )}

        {/* Chat Content */}
        <div className={styles.chatContent}>
          {children}
        </div>
      </main>
    </div>
  );
});

ChatLayout.displayName = 'ChatLayout';

export default ChatLayout;
