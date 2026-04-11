/**
 * usePromptTemplates — Manage saved prompt templates with localStorage persistence.
 * Built-in research templates + user-saved custom prompts.
 * CRUD: add, remove, update, use (tracks usage count for sorting by popularity).
 * Connected to: PromptTemplatesModal (UI), ChatInput (trigger button).
 */

import { useState, useCallback, useEffect } from 'react';

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: TemplateCategory;
  isBuiltIn: boolean;
  usageCount: number;
  createdAt: string; // ISO 8601
}

export type TemplateCategory =
  | 'research'
  | 'analysis'
  | 'writing'
  | 'coding'
  | 'learning'
  | 'creative'
  | 'custom';

const STORAGE_KEY = 'nurav_prompt_templates';

/** Built-in research templates bundled with the app */
const BUILTIN_TEMPLATES: PromptTemplate[] = [
  {
    id: 'builtin_lit_review',
    title: 'Literature Review',
    prompt: 'Write a comprehensive literature review on [TOPIC]. Include key papers, methodologies, findings, and research gaps. Organize by themes and include critical analysis.',
    category: 'research',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_pros_cons',
    title: 'Pros & Cons Analysis',
    prompt: 'Provide a detailed pros and cons analysis of [TOPIC]. Include evidence-backed arguments for each side, consider different stakeholder perspectives, and conclude with a balanced summary.',
    category: 'analysis',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_explain_simple',
    title: 'Explain Like I\'m 5',
    prompt: 'Explain [CONCEPT] in the simplest possible terms, using everyday analogies and avoiding jargon. Then progressively add more depth in 3 levels: beginner, intermediate, advanced.',
    category: 'learning',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_compare',
    title: 'Compare & Contrast',
    prompt: 'Compare and contrast [OPTION A] vs [OPTION B]. Use a structured format with: overview of each, key similarities, key differences, use cases for each, and a recommendation based on different scenarios.',
    category: 'analysis',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_research_gap',
    title: 'Research Gap Finder',
    prompt: 'Analyze the current state of research on [TOPIC]. Identify: what is well-established, what is contested, what remains unexplored, and what the most promising directions for future research are.',
    category: 'research',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_code_review',
    title: 'Code Review & Refactor',
    prompt: 'Review the following code for: correctness, performance, security vulnerabilities, code style, and maintainability. Suggest specific improvements with examples:\n\n```\n[PASTE CODE HERE]\n```',
    category: 'coding',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_timeline',
    title: 'Historical Timeline',
    prompt: 'Create a detailed chronological timeline of [TOPIC/EVENT]. For each milestone, include: the date, what happened, why it was significant, and its lasting impact. Start from the earliest origins.',
    category: 'research',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_swot',
    title: 'SWOT Analysis',
    prompt: 'Conduct a thorough SWOT analysis of [SUBJECT — company/product/strategy]. For each quadrant (Strengths, Weaknesses, Opportunities, Threats), provide 5+ specific, evidence-backed points.',
    category: 'analysis',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_debate',
    title: 'Steel-Man Debate',
    prompt: 'Present the strongest possible case for [POSITION] — the "steel-man" argument. Then present the strongest counterargument. Avoid strawmanning. End with what evidence would change your mind.',
    category: 'analysis',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'builtin_teach',
    title: 'Teach Me Step by Step',
    prompt: 'Teach me [SKILL/TOPIC] from scratch. Structure it as a curriculum: prerequisites → fundamentals → intermediate concepts → advanced topics → practical exercises. Include resources for each stage.',
    category: 'learning',
    isBuiltIn: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  },
];

export interface UsePromptTemplatesReturn {
  templates: PromptTemplate[];
  builtInTemplates: PromptTemplate[];
  customTemplates: PromptTemplate[];
  addTemplate: (title: string, prompt: string, category: TemplateCategory) => PromptTemplate;
  removeTemplate: (id: string) => void;
  updateTemplate: (id: string, updates: Partial<Pick<PromptTemplate, 'title' | 'prompt' | 'category'>>) => void;
  recordUsage: (id: string) => void;
  getByCategory: (category: TemplateCategory) => PromptTemplate[];
  popularTemplates: PromptTemplate[];
}

export function usePromptTemplates(): UsePromptTemplatesReturn {
  const [customTemplates, setCustomTemplates] = useState<PromptTemplate[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist custom templates to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customTemplates));
    } catch {
      // localStorage full or unavailable — silently skip
    }
  }, [customTemplates]);

  const allTemplates = [...BUILTIN_TEMPLATES, ...customTemplates];

  const addTemplate = useCallback((
    title: string,
    prompt: string,
    category: TemplateCategory
  ): PromptTemplate => {
    const newTemplate: PromptTemplate = {
      id: `custom_${Date.now()}`,
      title,
      prompt,
      category,
      isBuiltIn: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomTemplates((prev) => [newTemplate, ...prev]);
    return newTemplate;
  }, []);

  const removeTemplate = useCallback((id: string) => {
    // Only allow removing custom templates
    setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTemplate = useCallback((
    id: string,
    updates: Partial<Pick<PromptTemplate, 'title' | 'prompt' | 'category'>>
  ) => {
    setCustomTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  /** Increment usage count — used for sorting by popularity */
  const recordUsage = useCallback((id: string) => {
    setCustomTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t))
    );
  }, []);

  const getByCategory = useCallback(
    (category: TemplateCategory) => allTemplates.filter((t) => t.category === category),
    [allTemplates]
  );

  const popularTemplates = [...allTemplates].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);

  return {
    templates: allTemplates,
    builtInTemplates: BUILTIN_TEMPLATES,
    customTemplates,
    addTemplate,
    removeTemplate,
    updateTemplate,
    recordUsage,
    getByCategory,
    popularTemplates,
  };
}
