/**
 * Chat Layout — 3-column layout: [Sidebar] | [Chat Main] | [Sources Panel].
 * Sources panel slides in from the right when citations are available and hides on mobile.
 * Connected to: page.tsx (renders inside), Sidebar (left panel),
 * ChatInput + ChatMessage (content area), CitationsPanel (right panel).
 * Keyboard shortcuts: Ctrl+B (sidebar), Ctrl+Shift+N (new chat).
 */

'use client';

import React, { useState, useCallback, useEffect, memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar, Conversation } from './Sidebar';
import { Box } from '@/app/core/Grid';
import { Button } from '@/components/ui/button';
import { Menu } from '@/app/core/icons';
import styles from './ChatLayout.module.css';

export interface ChatLayoutProps {
  children: ReactNode;
  /** Right panel — CitationsPanel passed from page.tsx */
  rightPanel?: ReactNode;
  /** True when sources panel should be visible (citations exist) */
  showRightPanel?: boolean;
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

export const ChatLayout = memo<ChatLayoutProps>(({
  children,
  rightPanel,
  showRightPanel = false,
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) setIsMobileMenuOpen((prev) => !prev);
    else setIsSidebarCollapsed((prev) => !prev);
  }, [isMobile]);

  const handleSelectConversation = useCallback((id: string) => {
    onSelectConversation?.(id);
    if (isMobile) setIsMobileMenuOpen(false);
  }, [onSelectConversation, isMobile]);

  const handleNewChat = useCallback(() => {
    onNewChat?.();
    if (isMobile) setIsMobileMenuOpen(false);
  }, [onNewChat, isMobile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        handleNewChat();
      }
      if (e.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSidebar, handleNewChat, isMobileMenuOpen]);

  return (
    <div
      className={cn(
        styles.chatLayout,
        isSidebarCollapsed && styles.sidebarCollapsed,
        showRightPanel && styles.hasRightPanel,
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

      {/* Left Sidebar */}
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
        {/* Mobile Header */}
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

      {/* Right Panel — Sources Panel (slides in when sources arrive) */}
      {showRightPanel && rightPanel && (
        <aside className={styles.rightPanel}>
          {rightPanel}
        </aside>
      )}
    </div>
  );
});

ChatLayout.displayName = 'ChatLayout';

export default ChatLayout;
