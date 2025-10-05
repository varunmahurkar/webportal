# ALEXIKA AI Routes

## Application Routes

- **/** - Empty home page ready for development
- **/core/typography** - Typography system showcase with interactive controls and copy-to-clipboard functionality
- **/core/icons** - Icon library showcase with all Lucide React icons organized by category
- **/core/color** - Color system showcase with theme switching and CSS variable display (includes search functionality)

## Search System

The ALEXIKA project uses a simplified and optimized search system located in `features/search/`. 

### Current Search Implementation

- **Color Search** (`/core/color`) - Simple search through design system colors and CSS variables

### Search System Features

- **Simple Components**: `Search`, `SearchResults`
- **Search Modes**: Instant, debounced, and manual search modes
- **Clean Interface**: Minimal UI with clear search input and results display
- **Performance**: Debounced search with configurable delay
- **Theme Integration**: Full ALEXIKA design system support

### Usage Pattern

```tsx
import { Search } from '@/features/search';

<Search
  placeholder="Search colors, variables, themes..."
  label="Color Search"
  searchFunction={async (query) => {
    // Your search implementation
    return results;
  }}
  mode="debounced"
  debounceDelay={300}
/>
```

### Search Component API

- **Props**: `placeholder`, `label`, `searchFunction`, `mode`, `debounceDelay`, `className`, `style`
- **Search Modes**: `'instant'`, `'debounced'`, `'manual'`
- **Result Type**: `SearchResultItem[]` with `id`, `title`, `description`, `category` properties

## Core Components

- **Grid System** (`/app/core/Grid.tsx`) - Simple CSS Grid and Flexbox layout components
- **Typography** (`/app/core/Typography.tsx`) - Comprehensive responsive typography system
- **ThemeWrapper** (`/app/core/ThemeWrapper.tsx`) - Theme management with light/dark/custom modes
- **Icons** (`/app/core/icons.ts`) - Centralized Lucide React icon exports

## Hooks

- **useCopyToClipboard** (`/hooks/useCopyToClipboard.ts`) - Copy text to clipboard functionality