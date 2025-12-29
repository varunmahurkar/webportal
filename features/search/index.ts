/**
 * Nurav AI Search System - Optimized for Competition
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

// Search Component - Main Export (Primary)
export { default as Search, AISearch } from './AISearch';
export type { SearchProps } from './AISearch';

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
 * Search version for tracking
 */

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