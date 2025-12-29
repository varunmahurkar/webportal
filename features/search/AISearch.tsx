'use client';

/**
 * Nurav Search - Simple Search Component
 * Clean and straightforward search functionality
 * Uses only Nurav core components for complete consistency
 */

import React, { useState, useCallback, useRef } from 'react';
import { Text, Label } from '../../app/core/Typography';
import * as Icons from '../../app/core/icons';
import styles from './AISearch.module.css';

// Type definitions for search results
export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  score?: number;
  price?: number;
  name?: string;
}

export interface SearchProps {
  placeholder?: string;
  label?: string;
  mode?: 'instant' | 'debounced' | 'manual';
  debounceDelay?: number;
  searchFunction: (query: string) => Promise<SearchResultItem[]>;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onSearch?: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  label,
  mode = 'debounced',
  debounceDelay = 300,
  searchFunction,
  className = '',
  style = {},
  onFocus,
  onBlur,
  onClear,
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Main search function
  const handleSearch = useCallback(async (searchValue: string) => {
    if (!searchValue.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const searchResults = await searchFunction(searchValue);
      setResults(searchResults);
      if (onSearch) {
        onSearch(searchValue);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [searchFunction, onSearch]);

  // Debounced search
  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      handleSearch(searchValue);
    }, debounceDelay);
  }, [handleSearch, debounceDelay]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    switch (mode) {
      case 'instant':
        handleSearch(newValue);
        break;
      case 'debounced':
        debouncedSearch(newValue);
        break;
    }
  }, [mode, handleSearch, debouncedSearch]);

  // Handle clear
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    if (onClear) onClear();
  }, [onClear]);

  // Handle focus/blur
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (onFocus) onFocus();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (onBlur) onBlur();
  }, [onBlur]);

  // Cleanup debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`search-container ${className}`} style={style}>
      {/* Label */}
      {label && (
        <Label style={{ marginBottom: '8px', display: 'block' }}>
          {label}
        </Label>
      )}
      
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <div className={`${styles.searchInputContainer} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
          <div className={styles.searchPrefix}>
            <Icons.Search size={16} />
          </div>
          
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            placeholder={placeholder}
            className={styles.searchInput}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mode === 'manual') {
                handleSearch(query);
              }
            }}
          />
          
          {/* Loading */}
          {isSearching && (
            <div className={styles.loadingIndicator}>
              <Icons.Loader2 size={16} />
            </div>
          )}
          
          {/* Clear */}
          {query && (
            <button type="button" className={styles.clearButton} onClick={handleClear}>
              <Icons.X size={14} />
            </button>
          )}
          
          {/* Manual search button */}
          {mode === 'manual' && (
            <button
              type="button"
              className={`${styles.searchButton} ${isSearching ? styles.loading : ''}`}
              onClick={() => handleSearch(query)}
              disabled={isSearching}
            >
              <Icons.Search size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {results && results.length > 0 && (
        <div className={styles.resultsContainer}>
          {results.map((result: SearchResultItem, index: number) => (
            <div key={result.id || index} className={styles.resultItem}>
              <div className={styles.resultTitle}>
                <Text variant="body-md" weight={600}>
                  {result.title || result.name || 'Untitled'}
                </Text>
              </div>
              <div className={styles.resultDescription}>
                <Text variant="body-sm" color="secondary">
                  {result.description || 'No description available'}
                </Text>
              </div>
              <div className={styles.resultMeta}>
                {result.category && (
                  <span className={styles.resultCategory}>
                    <Text variant="caption">{result.category}</Text>
                  </span>
                )}
                {result.score && (
                  <Text variant="caption" color="tertiary">
                    Score: {(result.score * 100).toFixed(0)}%
                  </Text>
                )}
                {result.price && (
                  <Text variant="caption" color="success">
                    ${result.price}
                  </Text>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className={styles.errorState}>
          <Icons.AlertCircle size={12} />
          <Text variant="caption" color="error">{error}</Text>
        </div>
      )}
    </div>
  );
};

export default Search;

// Keep AISearch as an alias for backward compatibility
export const AISearch = Search;