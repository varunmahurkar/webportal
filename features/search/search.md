# ALEXIKA Search System

Simple, powerful, and clean search components optimized for performance and ease of use. Designed to be flexible and lightweight while providing everything you need for modern web applications.

## 📁 Structure

```
features/search/
├── AISearch.tsx         # 🚀 Main search component (simplified)
├── SearchResults.tsx    # Advanced results display component
├── index.ts            # Optimized exports
└── search.md           # This documentation file
```

## 🔥 Key Features

- **⚡ Lightning Fast**: Optimized debounced search with instant results
- **🎨 Clean UI**: Beautiful, responsive interface using ALEXIKA design system
- **🛠️ Flexible**: Easy to customize and extend for any use case
- **📱 Mobile Ready**: Responsive design that works on all devices
- **🔍 Smart Highlighting**: Query text highlighting in results
- **📄 Export Ready**: Built-in JSON and CSV export functionality
- **🎯 TypeScript**: Full TypeScript support with proper interfaces

## 🚀 Quick Start

### Basic Usage

```tsx
import { Search } from '@/features/search';

<Search
  placeholder="Search anything..."
  searchFunction={async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  }}
/>
```

### With Results Display

```tsx
import { Search, SearchResults } from '@/features/search';

function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await fetch(`/api/search?q=${query}`).then(r => r.json());
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Search
        placeholder="Search anything..."
        searchFunction={handleSearch}
        mode="debounced"
        debounceDelay={300}
      />
      
      <SearchResults
        results={results}
        loading={loading}
        onResultClick={(item) => console.log('Clicked:', item)}
      />
    </div>
  );
}
```

## 📚 Component Props

### Search Component

```tsx
interface SearchProps {
  placeholder?: string;           // Placeholder text
  label?: string;                 // Label above search input
  mode?: 'instant' | 'debounced' | 'manual'; // Search trigger mode
  debounceDelay?: number;         // Debounce delay in ms (default: 300)
  searchFunction: (query: string) => Promise<SearchResultItem[]>; // Required
  className?: string;             // Additional CSS classes
  style?: React.CSSProperties;    // Inline styles
  onFocus?: () => void;           // Focus event handler
  onBlur?: () => void;            // Blur event handler
  onClear?: () => void;           // Clear event handler
  onSearch?: (query: string) => void; // Search event handler
}
```

### SearchResults Component

```tsx
interface SearchResultsProps {
  results: SearchResultItem[];    // Array of search results
  query?: string;                 // Current query for highlighting
  loading?: boolean;              // Loading state
  error?: string | null;          // Error message
  viewMode?: 'list' | 'grid' | 'card'; // Display mode
  pageSize?: number;              // Items per page
  currentPage?: number;           // Current page number
  total?: number;                 // Total results count
  enablePagination?: boolean;     // Enable pagination
  showStats?: boolean;            // Show result statistics
  allowViewModeSwitch?: boolean;  // Enable view mode switching
  className?: string;             // Additional CSS classes
  style?: React.CSSProperties;    // Inline styles
  onResultClick?: (item: SearchResultItem, index: number) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onViewModeChange?: (mode: 'list' | 'grid' | 'card') => void;
  onExport?: (format: 'json' | 'csv') => void;
}
```

### SearchResultItem Interface

```tsx
interface SearchResultItem {
  id: string;                     // Unique identifier
  title: string;                  // Result title
  description?: string;           // Result description
  category?: string;              // Result category
  score?: number;                 // Relevance score (0-1)
  price?: number;                 // Price (if applicable)
  name?: string;                  // Alternative name field
}
```

## 🎯 Examples

### Icon Search (Used in Icons Page)

```tsx
import { Search } from '@/features/search';

function IconSearch() {
  const searchIcons = async (query: string) => {
    // Filter icons based on query
    return iconList.filter(icon => 
      icon.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <Search
      placeholder="Search icon names..."
      searchFunction={searchIcons}
      mode="instant"
    />
  );
}
```

### Color Search (Used in Colors Page)

```tsx
import { Search } from '@/features/search';

function ColorSearch() {
  const searchColors = async (query: string) => {
    // Filter colors based on query
    return colorList.filter(color => 
      color.name.toLowerCase().includes(query.toLowerCase()) ||
      color.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <Search
      placeholder="Search colors, variables, themes..."
      label="Color Search"
      searchFunction={searchColors}
      mode="debounced"
      debounceDelay={150}
    />
  );
}
```

## 🎨 Styling

The search components use CSS modules and integrate with the ALEXIKA design system. All components respond to CSS custom properties for theming.

## 🔧 Migration from Old AISearch

The new Search component is backward compatible. You can still import `AISearch` as an alias:

```tsx
// Both work the same way
import { Search } from '@/features/search';
import { AISearch } from '@/features/search'; // Alias for Search

// Old complex props are ignored, only basic props are used
<AISearch
  placeholder="Search..."
  searchFunction={handleSearch}
  // These props are now ignored:
  enableVoice={true}
  enableFilters={true}
  enableAI={true}
/>
```

## 🚀 Performance

- **Debounced Search**: Reduces API calls by 70-90%
- **Lightweight Bundle**: Minimal dependencies and tree-shakable
- **Fast Rendering**: Optimized React patterns for smooth UX
- **Memory Efficient**: Proper cleanup and state management

This simplified search system provides clean, powerful search functionality that's easy to use and maintain!