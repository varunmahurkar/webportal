'use client';

/**
 * ALEXIKA AI Search - Enterprise Search Component
 * Designed to compete with Perplexity AI, ChatGPT, Claude, Gemini, Grok
 * Uses only ALEXIKA core components for complete consistency
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Heading, Text, Label } from '../../app/core/Typography';
import * as Icons from '../../app/core/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { setQuery, setSearchContext, performSearch, setFilters, clearFilters } from '../../store/searchSlice';
import styles from './AISearch.module.css';

// Type definitions for search results
export interface SearchResultItem {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  score?: number;
  price?: number;
  name?: string;
}

export interface AISearchProps {
  placeholder?: string;
  label?: string;
  mode?: 'instant' | 'debounced' | 'manual';
  debounceDelay?: number;
  size?: 'large' | 'medium' | 'small';
  context?: string;
  searchFunction: (query: string, context?: string, filters?: Record<string, string | number | boolean>) => Promise<SearchResultItem[]>;
  enableFilters?: boolean;
  enableVoice?: boolean;
  enableExport?: boolean;
  enableAI?: boolean;
  compact?: boolean;
  showStats?: boolean;
  filterOptions?: Array<{
    key: string;
    label: string;
    type: 'select' | 'text' | 'number';
    options?: Array<{ label: string; value: string | number }>;
  }>;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
}

export const AISearch: React.FC<AISearchProps> = ({
  placeholder = 'Search anything...',
  label,
  mode = 'debounced',
  debounceDelay = 150,
  size = 'medium',
  context = 'global',
  searchFunction,
  enableFilters = true,
  enableVoice = true,
  enableExport = true,
  enableAI = true,
  compact = false,
  showStats = true,
  filterOptions = [],
  className = '',
  style = {},
  onFocus,
  onBlur,
  onClear
}) => {
  const dispatch = useAppDispatch();
  const { currentQuery, isSearching, error: searchError, results, filters } = useAppSelector(state => state.search);
  
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchStats, setSearchStats] = useState({ time: 0, sources: 0 });
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize context and AI suggestions
  useEffect(() => {
    dispatch(setSearchContext(context));
    if (enableAI) {
      const contextSuggestions = {
        colors: ['primary colors', 'brand palette', 'theme variables', 'css colors'],
        icons: ['navigation icons', 'social icons', 'ui icons', 'business icons'],
        database: ['user data', 'recent records', 'analytics', 'reports'],
        general: ['trending topics', 'popular searches', 'recent updates', 'featured content']
      };
      setSuggestions(contextSuggestions[context as keyof typeof contextSuggestions] || contextSuggestions.general);
    }
  }, [dispatch, context, enableAI]);

  // Voice search functionality
  const handleVoiceSearch = useCallback(() => {
    if (!enableVoice || !('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as unknown as { webkitSpeechRecognition: new() => SpeechRecognition }).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      dispatch(setQuery(transcript));
      handleSearch(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [enableVoice, dispatch]);

  // Main search function
  const handleSearch = useCallback(async (searchValue: string) => {
    if (!searchValue.trim()) return;
    
    const startTime = Date.now();
    
    try {
      const results = await dispatch(performSearch({ 
        query: searchValue, 
        context, 
        filters,
        searchFunction 
      })).unwrap();
      
      const endTime = Date.now();
      setSearchStats({ time: endTime - startTime, sources: 1 });
      
      if (enableAI && results && Array.isArray(results) && results.length > 0) {
        const relatedSuggestions = results.slice(0, 3).map((r: SearchResultItem) => 
          `Related: ${r.title || r.name || 'item'}`
        );
        setSuggestions(prev => [...relatedSuggestions, ...prev.slice(0, 2)]);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [dispatch, context, filters, searchFunction, enableAI]);

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
    dispatch(setQuery(newValue));

    switch (mode) {
      case 'instant':
        handleSearch(newValue);
        break;
      case 'debounced':
        debouncedSearch(newValue);
        break;
    }
  }, [mode, dispatch, handleSearch, debouncedSearch]);

  // Export functionality
  const handleExport = useCallback(() => {
    if (!enableExport || results.length === 0) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `search-results-${context}-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [enableExport, results, context]);

  // Handle clear
  const handleClear = useCallback(() => {
    dispatch(setQuery(''));
    if (onClear) onClear();
  }, [dispatch, onClear]);

  // Handle focus/blur
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (onFocus) onFocus();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (onBlur) onBlur();
  }, [onBlur]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`ai-search-container ${className}`} style={style}>
      {/* Label */}
      {label && (
        <Label style={{ marginBottom: '8px', display: 'block' }}>
          {label}
          <Text variant="caption" color="tertiary" style={{ marginLeft: '8px' }}>
            AI-Powered • {context}
          </Text>
        </Label>
      )}
      
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        {/* Stats */}
        {showStats && searchStats.time > 0 && !compact && (
          <div className={styles.searchStats}>
            <Text variant="caption" color="tertiary">
              <Icons.Clock size={12} /> {searchStats.time}ms •
              <Icons.Database size={12} /> {searchStats.sources} sources •
              <Icons.Target size={12} /> {results.length} results
            </Text>
          </div>
        )}
        
        <div className={`${styles.searchInputContainer} ${isFocused ? styles.focused : ''} ${searchError ? styles.error : ''}`}>
          <div className={styles.searchPrefix}>
            <Icons.Search size={16} />
          </div>
          
          <input
            ref={searchInputRef}
            type="text"
            value={currentQuery}
            placeholder={placeholder}
            className={styles.searchInput}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mode === 'manual') {
                handleSearch(currentQuery);
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
          {currentQuery && (
            <button type="button" className={styles.clearButton} onClick={handleClear}>
              <Icons.X size={14} />
            </button>
          )}
          
          {/* Action buttons */}
          <div className={styles.searchSuffix}>
            {enableVoice && (
              <button
                type="button"
                className={`${styles.actionButton} ${isListening ? styles.listening : ''}`}
                onClick={handleVoiceSearch}
                title={isListening ? "Stop listening" : "Voice search"}
              >
                {isListening ? <Icons.MicOff size={14} /> : <Icons.Mic size={14} />}
              </button>
            )}
            
            {enableFilters && filterOptions.length > 0 && (
              <button
                type="button"
                className={`${styles.actionButton} ${showFilters ? styles.active : ''}`}
                onClick={() => setShowFilters(!showFilters)}
                title="Advanced filters"
              >
                <Icons.Filter size={14} />
              </button>
            )}
            
            {enableExport && results.length > 0 && (
              <div className={styles.exportButton}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={handleExport}
                  title={`Export ${results.length} results`}
                >
                  <Icons.Download size={14} />
                </button>
                <span className={styles.exportBadge}>
                  <Text variant="caption">{results.length}</Text>
                </span>
              </div>
            )}
          </div>
          
          {/* Manual search button */}
          {mode === 'manual' && (
            <button
              type="button"
              className={`${styles.searchButton} ${isSearching ? styles.loading : ''}`}
              onClick={() => handleSearch(currentQuery)}
              disabled={isSearching}
            >
              <Icons.Search size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {enableFilters && showFilters && filterOptions.length > 0 && (
        <div className={styles.filtersPanel}>
          <div className={styles.filtersHeader}>
            <Text variant="label-md" weight={600}>Advanced Filters</Text>
            <button
              type="button"
              className={styles.clearFiltersButton}
              onClick={() => dispatch(clearFilters())}
            >
              <Text variant="caption">Clear</Text>
            </button>
          </div>
          
          <div className={styles.filtersGrid}>
            {filterOptions.map(option => (
              <div key={option.key} className={styles.filterItem}>
                <Label style={{ fontSize: '11px', marginBottom: '4px' }}>{option.label}</Label>
                {option.type === 'select' ? (
                  <select
                    className={styles.filterSelect}
                    value={filters[option.key] || ''}
                    onChange={(e) => dispatch(setFilters({ ...filters, [option.key]: e.target.value }))}
                  >
                    {option.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={option.type}
                    className={styles.filterInput}
                    placeholder={option.label}
                    value={filters[option.key] || ''}
                    onChange={(e) => dispatch(setFilters({ ...filters, [option.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className={styles.filtersActions}>
            <button
              type="button"
              className={styles.filterButton}
              onClick={() => dispatch(clearFilters())}
            >
              Clear
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${styles.primary}`}
              onClick={() => handleSearch(currentQuery)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      {/* AI Suggestions */}
      {enableAI && suggestions.length > 0 && !compact && (
        <div className={styles.suggestionsContainer}>
          <Text variant="caption" color="tertiary">
            <Icons.Zap size={12} /> AI Suggestions:
          </Text>
          <div className={styles.suggestions}>
            {suggestions.slice(0, 4).map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className={styles.suggestionTag}
                onClick={() => {
                  dispatch(setQuery(suggestion));
                  handleSearch(suggestion);
                }}
              >
                <Text variant="caption">{suggestion}</Text>
              </button>
            ))}
          </div>
        </div>
      )}

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
      {searchError && (
        <div className={styles.errorState}>
          <Icons.AlertCircle size={12} />
          <Text variant="caption" color="error">{searchError}</Text>
        </div>
      )}
    </div>
  );
};

export default AISearch;