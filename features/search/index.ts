/**
 * ALEXIKA AI Search System - Optimized for Competition
 * 
 * Ultra-powerful search system designed to compete with Perplexity AI, ChatGPT, and Claude.
 * Features AI-powered suggestions, voice search, database queries, and advanced filtering.
 * 
 * Primary Usage:
 * import { AISearch } from '@/features/search';
 * 
 * Features:
 * - AI-powered search with intelligent suggestions
 * - Voice search and keyboard shortcuts
 * - Database integration (PostgreSQL, MySQL, MongoDB, Elasticsearch)
 * - Real-time filtering and analytics
 * - Export capabilities in multiple formats
 * - Compact yet powerful interface
 */

// AI Search Component - Main Export (Primary)
export { default as AISearch } from './AISearch';
export type { AISearchProps } from './AISearch';

// Additional Components
export { SearchResults } from './SearchResults';
export type { SearchResultsProps, SearchResultItem } from './SearchResults';

// Re-export commonly used types for convenience
export type {
  IconSize,
  IconProps
} from '../../app/core/icons';

/**
 * Search System Version
 */
export const SEARCH_SYSTEM_VERSION = '1.0.0';

/**
 * Default configuration constants
 */
export const SEARCH_DEFAULTS = {
  DEBOUNCE_DELAY: 300,
  PAGE_SIZE: 10,
  MAX_HISTORY_ITEMS: 100,
  MAX_RECENT_ITEMS: 10,
  SHORTCUT_KEY: 'k',
  VIEW_MODE: 'list' as const,
  SEARCH_MODE: 'debounced' as const,
} as const;

/**
 * Search result export formats
 */
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv', 
  XML: 'xml',
} as const;

export type ExportFormat = typeof EXPORT_FORMATS[keyof typeof EXPORT_FORMATS];

/**
 * Common search utility functions
 */
export const SearchUtils = {
  /**
   * Highlight text matches in search results
   */
  highlightMatches: (text: string, query: string): string => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  /**
   * Calculate search relevance score
   */
  calculateRelevance: (item: any, query: string): number => {
    if (!query) return 0;
    
    const title = item.title.toLowerCase();
    const description = (item.description || '').toLowerCase();
    const searchQuery = query.toLowerCase();
    
    let score = 0;
    
    // Title exact match
    if (title === searchQuery) score += 1.0;
    // Title starts with query
    else if (title.startsWith(searchQuery)) score += 0.8;
    // Title contains query
    else if (title.includes(searchQuery)) score += 0.6;
    
    // Description contains query
    if (description.includes(searchQuery)) score += 0.3;
    
    // Category match
    if (item.category?.toLowerCase().includes(searchQuery)) score += 0.2;
    
    // Tag matches
    if (item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery))) score += 0.1;
    
    return Math.min(score, 1.0);
  },

  /**
   * Sort search results by relevance
   */
  sortByRelevance: (results: any[], query: string): any[] => {
    return results
      .map(item => ({
        ...item,
        score: item.score || SearchUtils.calculateRelevance(item, query)
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  },

  /**
   * Filter results by category
   */
  filterByCategory: (results: any[], category: string): any[] => {
    if (!category || category === 'all') return results;
    return results.filter(item => item.category === category);
  },

  /**
   * Get unique categories from results
   */
  getCategories: (results: any[]): string[] => {
    const categories = results
      .map(item => item.category)
      .filter((category): category is string => Boolean(category));
    return Array.from(new Set(categories)).sort();
  },

  /**
   * Generate search query suggestions
   */
  generateSuggestions: (history: any[], currentQuery: string = ''): string[] => {
    const suggestions = history
      .filter(item => 
        item.query.toLowerCase().includes(currentQuery.toLowerCase()) &&
        item.query !== currentQuery
      )
      .map(item => item.query)
      .slice(0, 5);
    
    return Array.from(new Set(suggestions));
  },

  /**
   * Format search statistics
   */
  formatStats: (total: number, query?: string, timeMs?: number): string => {
    let stats = `${total.toLocaleString()} result${total !== 1 ? 's' : ''}`;
    
    if (query) {
      stats += ` for "${query}"`;
    }
    
    if (timeMs !== undefined) {
      stats += ` (${timeMs.toFixed(0)}ms)`;
    }
    
    return stats;
  }
};

/**
 * Predefined search configurations for common use cases
 */
export const SEARCH_PRESETS = {
  // Quick instant search for small datasets
  INSTANT: {
    mode: 'instant' as const,
    debounceDelay: 0,
    enableShortcuts: true,
    allowClear: true,
  },
  
  // Standard debounced search for API calls
  STANDARD: {
    mode: 'debounced' as const,
    debounceDelay: 300,
    enableShortcuts: true,
    allowClear: true,
    showSearchButton: false,
  },
  
  // Manual search for heavy operations
  MANUAL: {
    mode: 'manual' as const,
    showSearchButton: true,
    enableShortcuts: true,
    allowClear: true,
  },
  
  // High-performance search with minimal features
  MINIMAL: {
    mode: 'debounced' as const,
    debounceDelay: 500,
    enableShortcuts: false,
    allowClear: true,
    showSearchButton: false,
  }
} as const;

/**
 * Export preset configurations
 */
export type SearchPreset = keyof typeof SEARCH_PRESETS;