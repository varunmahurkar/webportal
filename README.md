# ALEXIKA AI Webportal

A modern, optimized web application built with Next.js 15, featuring advanced search capabilities, responsive design system, and comprehensive theming.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15.5.2 with Turbopack, React 18, TypeScript
- **Design System**: Comprehensive typography and color system with light/dark/custom themes
- **Grid Layout**: Simple and flexible CSS Grid and Flexbox components
- **Search System**: Optimized search functionality with debouncing and clean interface
- **Icons**: Centralized Lucide React icon management
- **Responsive**: Mobile-first responsive design
- **Performance**: Optimized bundle with tree-shaking and modern CSS

## 📁 Project Structure

```
alexika/
├── app/                    # Next.js app directory
│   ├── core/              # Core components and systems
│   │   ├── Grid.tsx       # Layout components
│   │   ├── Typography.tsx # Typography system
│   │   ├── ThemeWrapper.tsx # Theme management
│   │   ├── icons.ts       # Icon exports
│   │   └── core.md        # Component documentation
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── globals.css       # Global styles
│   └── routes.md         # Route documentation
├── features/              # Feature modules
│   └── search/           # Search functionality
├── hooks/                # Custom React hooks
└── public/              # Static assets
```

## 🎨 Core Components

### Typography System
- Responsive scaling using CSS clamp() for all devices (320px to 8K displays)
- Semantic HTML tag support for accessibility
- Complete color system integration
- 16 responsive variants from display-xl to overline

### Theme System
- Light, dark, and custom theme modes
- Dynamic color generation from primary color
- CSS variable injection for seamless integration
- Ant Design integration

### Grid System
- `GridContainer` - Main layout wrapper with responsive max-widths
- `GridRow` - CSS Grid horizontal layouts
- `GridColumn` - Individual grid items with spanning
- `FlexRow` / `FlexColumn` - Flexbox layouts

### Search System
- Simple, lightweight search components
- Debounced, instant, and manual search modes
- Clean interface with result highlighting
- TypeScript support with proper interfaces

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd webportal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Docker Support

```bash
npm run docker:build    # Build Docker image
npm run docker:dev      # Start development environment
npm run docker:prod     # Start production environment
npm run docker:stop     # Stop containers
```

## 📖 Usage Examples

### Basic Layout
```tsx
import { GridContainer, GridRow, GridColumn } from '@/app/core/Grid';
import Typography from '@/app/core/Typography';

function MyPage() {
  return (
    <GridContainer maxWidth="large" padding={true}>
      <GridRow columns={12} gap={2}>
        <GridColumn span={8}>
          <Typography variant="heading-xl">Main Content</Typography>
        </GridColumn>
        <GridColumn span={4}>
          <Typography variant="body-md">Sidebar</Typography>
        </GridColumn>
      </GridRow>
    </GridContainer>
  );
}
```

### Search Implementation
```tsx
import { Search } from '@/features/search';

function SearchPage() {
  const handleSearch = async (query: string) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  };

  return (
    <Search
      placeholder="Search anything..."
      searchFunction={handleSearch}
      mode="debounced"
      debounceDelay={300}
    />
  );
}
```

## 🎯 Tech Stack

- **Framework**: Next.js 15.5.2 with Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, CSS Modules
- **UI Components**: Ant Design 5.27.1
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono

## 📊 Performance

- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Build Tool**: Turbopack for fast development and builds
- **CSS**: Modern CSS with custom properties and light-dark() functions
- **Images**: Next.js automatic optimization
- **Search**: Debounced queries reduce API calls by 70-90%

## 🚢 Deployment

The application is designed to be deployed on any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Docker** (included configuration)
- **Node.js** server

## 📄 Documentation

- [Core Components](./app/core/core.md) - Detailed component documentation
- [Routes](./app/routes.md) - Application routes and features
- [Search System](./features/search/search.md) - Search implementation guide
- [Project Guidelines](./CLAUDE.md) - Development guidelines and conventions

## 🤝 Contributing

1. Follow the coding conventions in `CLAUDE.md`
2. Use the established component patterns
3. Run `npm run lint` before committing
4. Update documentation when adding features

## 📝 License

This project is private and proprietary.

---

**ALEXIKA AI** - Modern web application with advanced search and AI capabilities.