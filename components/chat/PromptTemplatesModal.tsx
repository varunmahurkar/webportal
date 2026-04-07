/**
 * PromptTemplatesModal — Browse, search, and select from built-in and custom prompt templates.
 * Features: category filter tabs, search, save custom prompt, usage tracking, one-click insert.
 * Connected to: usePromptTemplates (data + CRUD), ChatInput (receives selected prompt text).
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/app/core/Typography';
import { Box, Flex } from '@/app/core/Grid';
import {
  X,
  Search,
  Plus,
  Trash2,
  Star,
  BookOpen,
  Code,
  Lightbulb,
  FileText,
  Palette,
  Wrench,
  Sparkles,
  TrendingUp,
} from '@/app/core/icons';
import { usePromptTemplates, TemplateCategory, PromptTemplate } from '@/hooks/usePromptTemplates';
import styles from './PromptTemplatesModal.module.css';

/** Category config for tab display */
const CATEGORY_CONFIG: Record<TemplateCategory, { label: string; icon: React.ElementType }> = {
  research:  { label: 'Research',  icon: BookOpen  },
  analysis:  { label: 'Analysis',  icon: TrendingUp },
  writing:   { label: 'Writing',   icon: FileText   },
  coding:    { label: 'Coding',    icon: Code       },
  learning:  { label: 'Learning',  icon: Lightbulb  },
  creative:  { label: 'Creative',  icon: Palette    },
  custom:    { label: 'My Templates', icon: Star    },
};

export interface PromptTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user selects a template — inserts prompt text into chat input */
  onSelectTemplate: (promptText: string) => void;
  className?: string;
}

export const PromptTemplatesModal: React.FC<PromptTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  className,
}) => {
  const { templates, customTemplates, addTemplate, removeTemplate, recordUsage } = usePromptTemplates();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newCategory, setNewCategory] = useState<TemplateCategory>('custom');

  /** Filter templates by category and search query */
  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.prompt.toLowerCase().includes(q)
      );
    }
    return result;
  }, [templates, activeCategory, searchQuery]);

  const handleSelectTemplate = useCallback((template: PromptTemplate) => {
    recordUsage(template.id);
    onSelectTemplate(template.prompt);
    onClose();
  }, [recordUsage, onSelectTemplate, onClose]);

  const handleSaveTemplate = useCallback(() => {
    if (!newTitle.trim() || !newPrompt.trim()) return;
    addTemplate(newTitle.trim(), newPrompt.trim(), newCategory);
    setNewTitle('');
    setNewPrompt('');
    setNewCategory('custom');
    setShowSaveForm(false);
  }, [newTitle, newPrompt, newCategory, addTemplate]);

  if (!isOpen) return null;

  return (
    <Box className={cn(styles.overlay, className)} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Box className={styles.modal}>
        {/* Header */}
        <Flex alignItems="center" justifyContent="between" className={styles.modalHeader}>
          <Flex alignItems="center" gap={2}>
            <Sparkles size={20} className={styles.headerIcon} />
            <Text variant="heading-sm" weight={600}>Prompt Templates</Text>
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveForm(!showSaveForm)}
              className={styles.saveBtn}
            >
              <Plus size={14} />
              <span>Save Prompt</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className={styles.closeBtn}>
              <X size={18} />
            </Button>
          </Flex>
        </Flex>

        {/* Save Custom Prompt Form */}
        {showSaveForm && (
          <Box className={styles.saveForm}>
            <Text variant="label-sm" weight={600} className={styles.saveFormTitle}>
              Save Current / New Prompt
            </Text>
            <Input
              placeholder="Template title (e.g. 'Competitor Analysis')"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={styles.saveInput}
            />
            <textarea
              placeholder="Prompt text... use [PLACEHOLDER] for variables"
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              className={styles.saveTextarea}
              rows={3}
            />
            <Flex alignItems="center" gap={2}>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TemplateCategory)}
                className={styles.categorySelect}
              >
                {(Object.entries(CATEGORY_CONFIG) as [TemplateCategory, typeof CATEGORY_CONFIG[TemplateCategory]][]).map(
                  ([cat, config]) => (
                    <option key={cat} value={cat}>{config.label}</option>
                  )
                )}
              </select>
              <Button
                size="sm"
                onClick={handleSaveTemplate}
                disabled={!newTitle.trim() || !newPrompt.trim()}
                className={styles.saveBtnConfirm}
              >
                Save Template
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSaveForm(false)}>
                Cancel
              </Button>
            </Flex>
          </Box>
        )}

        {/* Search */}
        <Box className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </Box>

        {/* Category Tabs */}
        <Flex className={styles.categoryTabs} gap={1}>
          <button
            className={cn(styles.categoryTab, activeCategory === 'all' && styles.categoryTabActive)}
            onClick={() => setActiveCategory('all')}
          >
            <Wrench size={13} />
            <span>All</span>
            <span className={styles.tabCount}>{templates.length}</span>
          </button>
          {(Object.entries(CATEGORY_CONFIG) as [TemplateCategory, typeof CATEGORY_CONFIG[TemplateCategory]][]).map(
            ([cat, config]) => {
              const Icon = config.icon;
              const count = templates.filter((t) => t.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  className={cn(styles.categoryTab, activeCategory === cat && styles.categoryTabActive)}
                  onClick={() => setActiveCategory(cat)}
                >
                  <Icon size={13} />
                  <span>{config.label}</span>
                  <span className={styles.tabCount}>{count}</span>
                </button>
              );
            }
          )}
        </Flex>

        {/* Templates Grid */}
        <Box className={styles.templatesGrid}>
          {filteredTemplates.length === 0 ? (
            <Flex direction="column" alignItems="center" justifyContent="center" className={styles.emptyState}>
              <Search size={32} className={styles.emptyIcon} />
              <Text variant="body-sm" color="secondary">No templates found</Text>
              <Text variant="caption" color="secondary">Try a different search or category</Text>
            </Flex>
          ) : (
            filteredTemplates.map((template) => {
              const CategoryIcon = CATEGORY_CONFIG[template.category]?.icon || Wrench;
              return (
                <Box key={template.id} className={styles.templateCard}>
                  <Flex alignItems="start" justifyContent="between" className={styles.cardHeader}>
                    <Flex alignItems="center" gap={2}>
                      <CategoryIcon size={14} className={styles.cardCategoryIcon} />
                      <Text variant="label-sm" weight={600} className={styles.cardTitle}>
                        {template.title}
                      </Text>
                    </Flex>
                    {!template.isBuiltIn && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); removeTemplate(template.id); }}
                        className={styles.deleteBtn}
                        title="Delete template"
                      >
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </Flex>
                  <Text variant="caption" color="secondary" className={styles.cardPreview}>
                    {template.prompt.length > 120
                      ? `${template.prompt.slice(0, 120)}...`
                      : template.prompt}
                  </Text>
                  <Flex alignItems="center" justifyContent="between" className={styles.cardFooter}>
                    <span className={cn(styles.categoryBadge, styles[`category_${template.category}`])}>
                      {CATEGORY_CONFIG[template.category]?.label}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleSelectTemplate(template)}
                      className={styles.useBtn}
                    >
                      Use Template
                    </Button>
                  </Flex>
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PromptTemplatesModal;
