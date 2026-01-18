/**
 * Sidebar Component
 * Collapsible sidebar for conversation management
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/app/core/Typography';
import { Flex, Box } from '@/app/core/Grid';
import {
  Plus,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Sun,
  Moon,
  Palette,
  LogOut,
  User,
  Sparkles,
  Check,
} from '@/app/core/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTheme, ThemeMode } from '@/app/core/ThemeWrapper';
import styles from './Sidebar.module.css';

export interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

export interface SidebarProps {
  conversations?: Conversation[];
  activeConversationId?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNewChat?: () => void;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  className?: string;
}

// Preset colors for custom theme
const presetColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#3b82f6',
];

export const Sidebar: React.FC<SidebarProps> = ({
  conversations = [],
  activeConversationId,
  isCollapsed = false,
  onToggleCollapse,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onSettingsClick,
  onLogout,
  userName = 'User',
  userEmail,
  className,
}) => {
  const { config, updateTheme } = useTheme();
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  // Theme change handler
  const handleThemeChange = (mode: ThemeMode) => {
    updateTheme({ mode });
  };

  // Color change handler
  const handleColorChange = (color: string) => {
    updateTheme({ primaryColor: color, mode: 'custom' });
  };

  // Get theme icon based on current mode
  const getThemeIcon = () => {
    switch (config.mode) {
      case 'light': return <Sun size={18} />;
      case 'dark': return <Moon size={18} />;
      case 'custom': return <Palette size={18} />;
      default: return <Sun size={18} />;
    }
  };

  // Get theme label
  const getThemeLabel = () => {
    switch (config.mode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'custom': return 'Custom';
      default: return 'Light';
    }
  };

  return (
    <aside
      className={cn(styles.sidebar, isCollapsed && styles.collapsed, className)}
      data-collapsed={isCollapsed}
    >
      {/* Header */}
      <Box className={styles.sidebarHeader}>
        <Flex alignItems="center" justifyContent="between" gap={2}>
          {!isCollapsed && (
            <Flex alignItems="center" gap={2}>
              <Sparkles size={24} className={styles.logoIcon} />
              <Text variant="heading-sm" weight={600}>Nurav AI</Text>
            </Flex>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={styles.collapseButton}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </Flex>
      </Box>

      {/* New Chat Button */}
      <Box className={styles.newChatSection} paddingX={3} paddingY={2}>
        <Button
          variant="outline"
          onClick={onNewChat}
          className={cn(styles.newChatButton, isCollapsed && styles.iconOnly)}
        >
          <Plus size={18} />
          {!isCollapsed && <span>New Chat</span>}
        </Button>
      </Box>

      {/* Conversations List */}
      <Box className={styles.conversationsList}>
        {!isCollapsed ? (
          <Box className={styles.conversationsStack}>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onSelect={() => onSelectConversation?.(conversation.id)}
                onDelete={() => onDeleteConversation?.(conversation.id)}
                onRename={(title) => onRenameConversation?.(conversation.id, title)}
              />
            ))}
            {conversations.length === 0 && (
              <Box className={styles.emptyState} padding={4}>
                <Text variant="body-sm" color="secondary" align="center">
                  No conversations yet
                </Text>
              </Box>
            )}
          </Box>
        ) : (
          <Box className={styles.collapsedConversations}>
            {conversations.slice(0, 5).map((conversation) => (
              <Button
                key={conversation.id}
                variant={conversation.id === activeConversationId ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => onSelectConversation?.(conversation.id)}
                className={styles.collapsedConversationButton}
                title={conversation.title}
              >
                <MessageSquare size={18} />
              </Button>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box className={styles.sidebarFooter}>
        {/* Theme Section */}
        <Box className={styles.themeSection}>
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={() => setIsThemePanelOpen(!isThemePanelOpen)}
            className={cn(styles.footerButton, isCollapsed && styles.iconOnly)}
          >
            {getThemeIcon()}
            {!isCollapsed && (
              <>
                <span>{getThemeLabel()}</span>
                {isThemePanelOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </>
            )}
          </Button>

          {/* Theme Panel */}
          {isThemePanelOpen && !isCollapsed && (
            <Box className={styles.themePanel}>
              {/* Theme Mode Buttons */}
              <Box className={styles.themeModes}>
                <Text variant="label-sm" color="secondary" className={styles.themePanelLabel}>
                  Theme
                </Text>
                <Flex gap={1} className={styles.themeButtons}>
                  <Button
                    variant={config.mode === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('light')}
                    className={styles.themeButton}
                  >
                    <Sun size={14} />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={config.mode === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('dark')}
                    className={styles.themeButton}
                  >
                    <Moon size={14} />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={config.mode === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('custom')}
                    className={styles.themeButton}
                  >
                    <Palette size={14} />
                    <span>Custom</span>
                  </Button>
                </Flex>
              </Box>

              {/* Color Picker - Only in custom mode */}
              {config.mode === 'custom' && (
                <Box className={styles.colorPicker}>
                  <Text variant="label-sm" color="secondary" className={styles.themePanelLabel}>
                    Accent Color
                  </Text>
                  {/* Preset Colors */}
                  <Flex wrap="wrap" gap={1} className={styles.colorPresets}>
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          styles.colorPreset,
                          config.primaryColor === color && styles.colorPresetActive
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      >
                        {config.primaryColor === color && (
                          <Check size={12} className={styles.colorPresetCheck} />
                        )}
                      </button>
                    ))}
                  </Flex>
                  {/* Custom Color Input */}
                  <Flex alignItems="center" gap={2} className={styles.customColorInput}>
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className={styles.colorInput}
                    />
                    <Text variant="caption" color="secondary" className={styles.colorValue}>
                      {config.primaryColor.toUpperCase()}
                    </Text>
                  </Flex>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Settings */}
        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'default'}
          onClick={onSettingsClick}
          className={cn(styles.footerButton, isCollapsed && styles.iconOnly)}
        >
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(styles.userButton, isCollapsed && styles.iconOnly)}
            >
              <div className={styles.userAvatar}>
                <User size={18} />
              </div>
              {!isCollapsed && (
                <div className={styles.userInfo}>
                  <Text variant="body-sm" weight={500} truncate>{userName}</Text>
                  {userEmail && (
                    <Text variant="caption" color="secondary" truncate>{userEmail}</Text>
                  )}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={styles.userDropdown}>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings size={16} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className={styles.logoutItem}>
              <LogOut size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Box>
    </aside>
  );
};

// Conversation item component
interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== conversation.title) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className={cn(styles.conversationItem, isActive && styles.active)}>
      {isEditing ? (
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className={styles.editInput}
          autoFocus
        />
      ) : (
        <>
          <button className={styles.conversationButton} onClick={onSelect}>
            <MessageSquare size={16} className={styles.conversationIcon} />
            <span className={styles.conversationTitle}>{conversation.title}</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={styles.conversationActions}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit size={14} />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className={styles.deleteItem}>
                <Trash2 size={14} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default Sidebar;
