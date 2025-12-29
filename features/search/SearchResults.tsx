'use client';

/**
 * Nurav Search Results - Clean & Consistent Component
 * Uses only Nurav core components for complete consistency
 * No Ant Design dependencies - pure HTML with proper TypeScript
 */

import React, { useState, useCallback } from 'react';
import { Heading, Text } from '../../app/core/Typography';
import * as Icons from '../../app/core/icons';
import styles from './SearchResults.module.css';

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  thumbnail?: string;
  metadata?: Record<string, string | number | boolean>;
  score?: number;
  category?: string;
  tags?: string[];
  timestamp?: Date;
}

export interface SearchResultsProps {
  results: SearchResultItem[];
  query?: string;
  loading?: boolean;
  error?: string | null;
  viewMode?: 'list' | 'grid' | 'card';
  pageSize?: number;
  currentPage?: number;
  total?: number;
  enablePagination?: boolean;
  showStats?: boolean;
  allowViewModeSwitch?: boolean;
  renderItem?: (item: SearchResultItem, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  errorState?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onResultClick?: (item: SearchResultItem, index: number) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onViewModeChange?: (mode: 'list' | 'grid' | 'card') => void;
  onExport?: (format: 'json' | 'csv') => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results = [],
  query = '',
  loading = false,
  error = null,
  viewMode = 'list',
  pageSize = 10,
  currentPage = 1,
  total,
  enablePagination = true,
  showStats = true,
  allowViewModeSwitch = true,
  renderItem,
  emptyState,
  loadingState,
  errorState,
  className = '',
  style = {},
  onResultClick,
  onPageChange,
  onViewModeChange,
  onExport
}) => {
  const [localViewMode, setLocalViewMode] = useState(viewMode);

  const totalResults = total || results.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = enablePagination ? results.slice(startIndex, endIndex) : results;

  // Handle pagination (moved to top to satisfy Rules of Hooks)
  const handlePageChange = useCallback((page: number) => {
    if (onPageChange) {
      onPageChange(page, pageSize);
    }
  }, [onPageChange, pageSize]);

  // Highlight query text
  const highlightText = useCallback((text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery || !text) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, []);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: 'list' | 'grid' | 'card') => {
    setLocalViewMode(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  }, [onViewModeChange]);

  // Handle result click
  const handleResultClick = useCallback((item: SearchResultItem, index: number) => {
    if (onResultClick) {
      onResultClick(item, index);
    }
    
    if (item.url && !onResultClick) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }, [onResultClick]);

  // Handle export
  const handleExport = useCallback((format: 'json' | 'csv') => {
    if (onExport) {
      onExport(format);
      return;
    }

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(results, null, 2);
          filename = `search-results-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          const headers = ['ID', 'Title', 'Description', 'URL', 'Category', 'Score'];
          const csvRows = [
            headers.join(','),
            ...results.map(item => [
              item.id,
              `"${item.title.replace(/"/g, '""')}"`,
              `"${(item.description || '').replace(/"/g, '""')}"`,
              item.url || '',
              item.category || '',
              item.score?.toString() || ''
            ].join(','))
          ];
          content = csvRows.join('\n');
          filename = `search-results-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
    }
  }, [onExport, results]);

  // Default result item renderer
  const defaultRenderItem = useCallback((item: SearchResultItem, index: number) => (
    <div 
      key={item.id} 
      className={styles.resultItem}
      onClick={() => handleResultClick(item, index)}
    >
      {item.thumbnail && (
        <div className={styles.resultThumbnail}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.thumbnail} alt={item.title} />
        </div>
      )}
      
      <div className={styles.resultContent}>
        <div className={styles.resultTitle}>
          <Text variant="body-md" weight={600} color="primary">
            {highlightText(item.title, query)}
          </Text>
          {item.score && (
            <Text variant="body-xs" color="tertiary">
              ({Math.round(item.score * 100)}%)
            </Text>
          )}
        </div>
        
        {item.description && (
          <div className={styles.resultDescription}>
            <Text variant="body-sm" color="secondary">
              {highlightText(item.description, query)}
            </Text>
          </div>
        )}
        
        <div className={styles.resultMeta}>
          {item.category && (
            <span className={styles.resultCategory}>
              <Text variant="caption">{item.category}</Text>
            </span>
          )}
          {item.url && (
            <Text variant="caption" color="tertiary">
              <Icons.Link size={12} />
              {new URL(item.url).hostname}
            </Text>
          )}
          {item.timestamp && (
            <Text variant="caption" color="tertiary">
              <Icons.Clock size={12} />
              {item.timestamp.toLocaleDateString()}
            </Text>
          )}
        </div>
      </div>
    </div>
  ), [query, highlightText, handleResultClick]);

  // Render controls
  const renderControls = () => (
    <div className={styles.resultsHeader}>
      <div className={styles.statsContainer}>
        {showStats && (
          <Text variant="body-sm" color="secondary">
            {loading ? 'Searching...' : `${totalResults.toLocaleString()} results`}
            {query && ` for "${query}"`}
          </Text>
        )}
      </div>
      
      <div className={styles.controlsContainer}>
        {allowViewModeSwitch && (
          <div className={styles.viewModeButtons}>
            <button
              className={`${styles.viewModeButton} ${localViewMode === 'list' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('list')}
            >
              <Icons.List size={14} />
            </button>
            <button
              className={`${styles.viewModeButton} ${localViewMode === 'grid' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('grid')}
            >
              <Icons.Grid3x3 size={14} />
            </button>
            <button
              className={`${styles.viewModeButton} ${localViewMode === 'card' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('card')}
            >
              <Icons.Image size={14} />
            </button>
          </div>
        )}
        
        {results.length > 0 && (
          <div className={styles.exportContainer}>
            <button
              className={styles.exportButton}
              onClick={() => handleExport('json')}
            >
              <Icons.Download size={14} />
              <Text variant="caption">Export JSON</Text>
            </button>
            <button
              className={styles.exportButton}
              onClick={() => handleExport('csv')}
            >
              <Icons.FileText size={14} />
              <Text variant="caption">Export CSV</Text>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Handle loading state
  if (loading && paginatedResults.length === 0) {
    return (
      <div className={`${styles.searchResults} ${className}`} style={style}>
        {renderControls()}
        {loadingState || (
          <div className={styles.loadingState}>
            <Icons.Loader2 size={32} />
            <Text variant="body-md" color="secondary">
              Searching...
            </Text>
          </div>
        )}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={`${styles.searchResults} ${className}`} style={style}>
        {renderControls()}
        {errorState || (
          <div className={styles.errorState}>
            <Icons.AlertCircle size={32} />
            <Heading level={4} color="primary">Search Error</Heading>
            <Text variant="body-md" color="secondary">{error}</Text>
          </div>
        )}
      </div>
    );
  }

  // Handle empty state
  if (paginatedResults.length === 0) {
    return (
      <div className={`${styles.searchResults} ${className}`} style={style}>
        {renderControls()}
        {emptyState || (
          <div className={styles.emptyState}>
            <Icons.Search size={32} />
            <Text variant="body-lg" color="secondary">No results found</Text>
            {query && (
              <Text variant="body-sm" color="tertiary">
                Try adjusting your search terms or filters
              </Text>
            )}
          </div>
        )}
      </div>
    );
  }

  // Render results
  const resultsContent = () => {
    if (localViewMode === 'grid') {
      return (
        <div className={styles.gridResults}>
          {paginatedResults.map((item, index) => 
            renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
          )}
        </div>
      );
    }

    return (
      <div className={styles.listResults}>
        {paginatedResults.map((item, index) => 
          renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.searchResults} ${className}`} style={style}>
      {renderControls()}
      
      {resultsContent()}

      {loading && paginatedResults.length > 0 && (
        <div className={styles.loadingMore}>
          <Icons.Loader2 size={16} />
        </div>
      )}

      {enablePagination && totalResults > pageSize && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <Icons.ChevronLeft size={16} />
            Previous
          </button>
          
          <Text variant="body-sm" color="secondary">
            Page {currentPage} of {Math.ceil(totalResults / pageSize)}
          </Text>
          
          <button 
            className={styles.pageButton}
            disabled={currentPage >= Math.ceil(totalResults / pageSize)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
            <Icons.ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;