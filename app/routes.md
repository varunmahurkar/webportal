# ALEXIKA AI Routes

## Application Routes

- **/** - Home page with ALEXIKA AI branding and hero section
- **/core/typography** - Typography system showcase with interactive controls  
- **/core/icons** - Icon library with search and filtering capabilities (uses SearchBox component)
- **/core/color** - Color system showcase with theme switching and CSS variable display (uses SearchBox component)

## Search System Examples

The ALEXIKA project uses a comprehensive generic search system located in `features/search/`. Here are implementation examples:

### Current Search Implementations

- **Icon Search** (`/core/icons`) - Real-time search through Lucide React icons with instant filtering
- **Color Search** (`/core/color`) - Search through design system colors and CSS variables

### Search System Features

- **Generic Components**: `SearchBox`, `SearchResults`, `SearchProvider`
- **Multiple Modes**: Instant, debounced, and manual search
- **State Management**: Global search context with history tracking
- **Flexible Display**: List, grid, and card view modes
- **Export Capabilities**: JSON, CSV, and XML export formats
- **Keyboard Shortcuts**: Cmd/Ctrl+K for quick access
- **Performance**: Debouncing, caching, and infinite scroll
- **Theme Integration**: Full ALEXIKA design system support

### Usage Pattern

```tsx
import { SearchBox, SearchResults, SearchProvider } from '@/features/search';

// Wrap app with SearchProvider for global state
<SearchProvider>
  <SearchBox 
    placeholder="Search anything..."
    mode="debounced" 
    onSearch={handleSearch}
    enableShortcuts
  />
  <SearchResults 
    results={searchResults}
    viewMode="grid"
    enablePagination
  />
</SearchProvider>
```

### Future Search Implementations

- **Product Search** - E-commerce search with filters and sorting
- **Documentation Search** - Knowledge base and FAQ search
- **User Search** - Team member and profile search
- **Content Search** - Media and document search
- **Analytics Search** - Metrics and dashboard search