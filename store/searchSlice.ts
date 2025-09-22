/**
 * ALEXIKA Search Redux Slice
 * 
 * Redux Toolkit slice for managing search state across the application.
 * Provides centralized state management for search queries, results, history, and UI state.
 * 
 * Features:
 * - Search query management
 * - Results state handling
 * - Search history with persistence
 * - Recent searches tracking
 * - Filter and sort state
 * - Performance optimizations
 * - Type-safe operations
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { SearchResultItem } from '../features/search';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  context?: string;
  results?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface SearchState {
  // Current search state
  currentQuery: string;
  isSearching: boolean;
  error: string | null;
  
  // Results state
  results: SearchResultItem[];
  totalResults: number;
  currentPage: number;
  pageSize: number;
  
  // UI state
  viewMode: 'list' | 'grid' | 'card';
  sortBy: 'relevance' | 'title' | 'date' | 'category';
  sortOrder: 'asc' | 'desc';
  selectedCategory: string;
  
  // History and suggestions
  searchHistory: SearchHistoryItem[];
  recentSearches: SearchHistoryItem[];
  suggestions: string[];
  
  // Context and filters
  searchContext: string;
  filters: Record<string, string | number | boolean>;
  
  // Performance
  lastSearchTime: number;
  cacheEnabled: boolean;
}

const initialState: SearchState = {
  currentQuery: '',
  isSearching: false,
  error: null,
  results: [],
  totalResults: 0,
  currentPage: 1,
  pageSize: 10,
  viewMode: 'list',
  sortBy: 'relevance',
  sortOrder: 'desc',
  selectedCategory: 'all',
  searchHistory: [],
  recentSearches: [],
  suggestions: [],
  searchContext: 'global',
  filters: {},
  lastSearchTime: 0,
  cacheEnabled: true,
};

// Async thunk for performing search
export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (payload: { 
    query: string; 
    context?: string; 
    filters?: Record<string, string | number | boolean>;
    searchFunction: (query: string, context?: string, filters?: Record<string, string | number | boolean>) => Promise<SearchResultItem[]>;
  }) => {
    const { query, context = 'global', filters = {}, searchFunction } = payload;
    
    const startTime = Date.now();
    const results = await searchFunction(query, context, filters);
    const endTime = Date.now();
    
    return {
      results,
      query,
      context,
      filters,
      searchTime: endTime - startTime,
      timestamp: new Date(),
    };
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Query management
    setQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
      state.error = null;
    },
    
    clearQuery: (state) => {
      state.currentQuery = '';
      state.results = [];
      state.error = null;
    },
    
    // Results management
    setResults: (state, action: PayloadAction<SearchResultItem[]>) => {
      state.results = action.payload;
      state.totalResults = action.payload.length;
    },
    
    clearResults: (state) => {
      state.results = [];
      state.totalResults = 0;
      state.currentPage = 1;
    },
    
    // UI state management
    setViewMode: (state, action: PayloadAction<'list' | 'grid' | 'card'>) => {
      state.viewMode = action.payload;
    },
    
    setSortBy: (state, action: PayloadAction<'relevance' | 'title' | 'date' | 'category'>) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    
    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },
    
    // History management
    addToHistory: (state, action: PayloadAction<Omit<SearchHistoryItem, 'id' | 'timestamp'>>) => {
      const newHistoryItem: SearchHistoryItem = {
        ...action.payload,
        id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };
      
      // Add to history (keep last 100)
      state.searchHistory = [newHistoryItem, ...state.searchHistory].slice(0, 100);
      
      // Update recent searches (keep last 10 unique)
      state.recentSearches = [
        newHistoryItem,
        ...state.recentSearches.filter(item => item.query !== newHistoryItem.query)
      ].slice(0, 10);
    },
    
    clearHistory: (state) => {
      state.searchHistory = [];
    },
    
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    // Suggestions
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    
    // Context and filters
    setSearchContext: (state, action: PayloadAction<string>) => {
      state.searchContext = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<Record<string, string | number | boolean>>) => {
      state.filters = action.payload;
    },
    
    updateFilter: (state, action: PayloadAction<{ key: string; value: string | number | boolean }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    
    removeFilter: (state, action: PayloadAction<string>) => {
      delete state.filters[action.payload];
    },
    
    clearFilters: (state) => {
      state.filters = {};
      state.selectedCategory = 'all';
    },
    
    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isSearching = false;
    },
    
    // Performance
    setCacheEnabled: (state, action: PayloadAction<boolean>) => {
      state.cacheEnabled = action.payload;
    },
    
    // Load persisted state
    loadPersistedState: (state, action: PayloadAction<Partial<SearchState>>) => {
      const persistedData = action.payload;
      
      // Only load specific fields from persisted state
      if (persistedData.searchHistory) {
        state.searchHistory = persistedData.searchHistory.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp), // Convert string back to Date
        }));
      }
      
      if (persistedData.recentSearches) {
        state.recentSearches = persistedData.recentSearches.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp), // Convert string back to Date
        }));
      }
      
      if (persistedData.searchContext) {
        state.searchContext = persistedData.searchContext;
      }
      
      if (persistedData.viewMode) {
        state.viewMode = persistedData.viewMode;
      }
      
      if (persistedData.pageSize) {
        state.pageSize = persistedData.pageSize;
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.isSearching = false;
        state.results = action.payload.results;
        state.totalResults = action.payload.results.length;
        state.lastSearchTime = action.payload.searchTime;
        state.currentPage = 1;
        
        // Add to history
        if (action.payload.query.trim()) {
          const historyItem: SearchHistoryItem = {
            id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            query: action.payload.query,
            timestamp: action.payload.timestamp,
            context: action.payload.context,
            results: action.payload.results.length,
            metadata: action.payload.filters,
          };
          
          state.searchHistory = [historyItem, ...state.searchHistory].slice(0, 100);
          state.recentSearches = [
            historyItem,
            ...state.recentSearches.filter(item => item.query !== historyItem.query)
          ].slice(0, 10);
        }
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const {
  setQuery,
  clearQuery,
  setResults,
  clearResults,
  setViewMode,
  setSortBy,
  setSortOrder,
  setSelectedCategory,
  setCurrentPage,
  setPageSize,
  addToHistory,
  clearHistory,
  clearRecentSearches,
  setSuggestions,
  setSearchContext,
  setFilters,
  updateFilter,
  removeFilter,
  clearFilters,
  setError,
  setCacheEnabled,
  loadPersistedState,
} = searchSlice.actions;

export default searchSlice.reducer;

// Selectors
export const selectSearchState = (state: { search: SearchState }) => state.search;
export const selectCurrentQuery = (state: { search: SearchState }) => state.search.currentQuery;
export const selectSearchResults = (state: { search: SearchState }) => state.search.results;
export const selectIsSearching = (state: { search: SearchState }) => state.search.isSearching;
export const selectSearchError = (state: { search: SearchState }) => state.search.error;
export const selectSearchHistory = (state: { search: SearchState }) => state.search.searchHistory;
export const selectRecentSearches = (state: { search: SearchState }) => state.search.recentSearches;
export const selectViewMode = (state: { search: SearchState }) => state.search.viewMode;
export const selectCurrentPage = (state: { search: SearchState }) => state.search.currentPage;
export const selectPageSize = (state: { search: SearchState }) => state.search.pageSize;
export const selectTotalResults = (state: { search: SearchState }) => state.search.totalResults;
export const selectSelectedCategory = (state: { search: SearchState }) => state.search.selectedCategory;
export const selectFilters = (state: { search: SearchState }) => state.search.filters;
export const selectSearchContext = (state: { search: SearchState }) => state.search.searchContext;