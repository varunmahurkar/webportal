# Nurav AI - Frontend Overview

> **For AI/LLM Models:** Read this file completely before making any changes. Update this file when project structure, dependencies, or features change.

---

## Project Summary

Next.js 16 frontend for Nurav AI - an AI-powered chat application similar to Perplexity AI, ChatGPT, and Claude. Uses React 19, TypeScript, Tailwind CSS, and Supabase for authentication.

**Backend API:** `http://localhost:8000` (see `backend-architect/backend-overview.md`)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router + Turbopack |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4.18 | Utility-first styling |
| Radix UI | Various | Accessible UI primitives |
| Supabase | 2.90.1 | Authentication & database |
| Lucide React | 0.542.0 | Icon library (rounded style) |
| next-themes | 0.4.6 | Theme management |
| sonner | 2.0.7 | Toast notifications |

---

## Folder Structure

```
webportal/
├── app/                        # Next.js App Router
│   ├── (protected)/            # Authenticated routes (wrapped with ProtectedRoute)
│   │   └── profile/            # User profile page
│   ├── auth/
│   │   └── callback/           # OAuth callback handler
│   ├── core/                   # Core UI system
│   │   ├── color/              # Color system showcase page
│   │   ├── icons/              # Icon library showcase page
│   │   ├── typography/         # Typography showcase page
│   │   ├── Grid.tsx            # Grid, Flex, Box, Container, Stack components
│   │   ├── Typography.tsx      # Heading, Text, Paragraph components
│   │   ├── ThemeWrapper.tsx    # Theme provider (light/dark/custom)
│   │   ├── StickyBanner.tsx    # Announcement banner
│   │   ├── icons.ts            # Centralized icon exports
│   │   ├── layout.tsx          # Core pages layout
│   │   └── core.md             # Core components documentation
│   ├── globals.css             # Global styles & CSS variables
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main chat interface (/)
│   ├── page.module.css         # Home page styles
│   └── routes.md               # Route documentation (KEEP UPDATED)
│
├── components/                 # Reusable components
│   ├── auth/
│   │   ├── AuthModal.tsx       # Login/signup modal (OAuth, email, phone)
│   │   └── ProtectedRoute.tsx  # Auth guard wrapper
│   ├── chat/
│   │   ├── Sidebar.tsx         # Collapsible sidebar with conversations
│   │   ├── ChatLayout.tsx      # Main layout with sidebar + content
│   │   ├── ChatInput.tsx       # Message input with action buttons
│   │   ├── ChatMessage.tsx     # Message display with copy function
│   │   └── WelcomeScreen.tsx   # Initial screen with suggestions
│   ├── layout/                 # Layout components
│   └── ui/                     # Shadcn/Radix UI components
│
├── hooks/                      # Custom React hooks (ALL hooks go here)
│   ├── useAuth.tsx             # Authentication state & methods
│   ├── useChat.ts              # Chat functionality & streaming
│   └── useCopyToClipboard.ts   # Clipboard operations
│
├── lib/                        # Utilities and services
│   ├── api/                    # API client functions
│   ├── supabase/               # Supabase client configuration
│   │   └── client.ts           # Browser Supabase client
│   ├── types/                  # TypeScript type definitions
│   ├── api.ts                  # Main API configuration & fetch wrapper
│   ├── validation.ts           # Form validation utilities
│   └── utils.ts                # General utilities (cn function)
│
├── features/                   # Feature modules
│   └── search/                 # Search feature
│
├── scripts/                    # Utility scripts
│   ├── docker-update.sh
│   └── docker-health.sh
│
├── .env.local                  # Environment variables (DO NOT COMMIT)
├── .env.local.example          # Environment template
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
├── Dockerfile                  # Production Docker image
├── Dockerfile.dev              # Development Docker image
├── docker-compose.yml          # Docker services
└── CLAUDE.md                   # Coding standards for AI
```

---

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Main AI chat interface |
| `/auth/callback` | No | OAuth callback handler |
| `/profile` | Yes | User profile page |
| `/core/typography` | No | Typography system showcase |
| `/core/icons` | No | Icon library showcase |
| `/core/color` | No | Color system showcase |

> Update `app/routes.md` when adding new routes

---

## Core Components Usage

### ThemeWrapper
```tsx
import ThemeWrapper, { useTheme } from "@/app/core/ThemeWrapper";

const { config, updateTheme, isDark } = useTheme();
updateTheme({ mode: "dark" });
```

### Typography
```tsx
import { Heading, Text, Paragraph } from "@/app/core/Typography";

<Heading level={1}>Title</Heading>
<Paragraph variant="body-lg">Content</Paragraph>
```

### Grid System
```tsx
import { Grid, Flex, Box, Container, Stack } from "@/app/core/Grid";

<Container size="lg">
  <Grid columns={3} gap={4} autoLayout>
    <Grid.Item>Card</Grid.Item>
  </Grid>
</Container>
```

### Icons
```tsx
import { SearchIcon, SendIcon } from "@/app/core/icons";

<SearchIcon className="w-5 h-5" />
```

> See `app/core/core.md` for detailed documentation

---

## Authentication

### OAuth Providers
- Google
- GitHub
- Apple
- Discord

### Components
- `AuthModal` - Full auth modal with all methods
- `ProtectedRoute` - Wrap pages requiring auth
- `useAuth` hook - Access auth state anywhere

### Supabase Tables
- `auth_users_table` - User profiles (username, email, name, subscription, role)

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
npm run docker:dev   # Development containers
npm run docker:prod  # Production containers
npm run docker:stop  # Stop containers
npm run docker:logs  # View container logs
```

---

## Guidelines for AI Models

### Before Making Changes
1. Read this file completely
2. Check `app/routes.md` for existing routes
3. Check `app/core/core.md` for component usage
4. Check `CLAUDE.md` for coding standards

### Coding Standards
- Use TypeScript strictly
- Use Lucide React icons (rounded, no sharp corners)
- Use core components (Grid, Typography, ThemeWrapper) - no inconsistency
- Place ALL custom hooks in `/hooks` folder
- Keep state simple (useState, useContext) unless complex state needed
- Add comments for features and functionalities
- Use descriptive names (no generic names)
- Remove unused code

### When Adding Features
1. Use existing core components from `app/core/`
2. Create hooks in `hooks/` folder only
3. Add new routes to `app/routes.md`
4. Add new icons to `app/core/icons.ts`
5. Update `app/core/icons/page.tsx` for new icons
6. Update `app/core/color/page.tsx` for new colors

### Files to Update After Changes
- [ ] `frontend-overview.md` - This file (structure/features)
- [ ] `app/routes.md` - New/changed routes
- [ ] `app/core/icons.ts` - New icons used
- [ ] `app/core/icons/page.tsx` - Icon showcase
- [ ] `app/core/color/page.tsx` - New colors
- [ ] `CLAUDE.md` - Coding standards updates
- [ ] Docker files - If dependencies change

---

## Recent Changes Log

> Update this section when making significant changes

| Date | Change | Files Affected |
|------|--------|----------------|
| 2026-02-01 | Created frontend-overview.md | frontend-overview.md |

---

## API Integration

Backend runs at `http://localhost:8000`. Key endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/chat/` | Send chat message |
| POST | `/crawler/` | Crawl web content |
| POST | `/auth/` | Auth operations |
| GET | `/health` | Health check |

API client is configured in `lib/api.ts`

---

**Last Updated:** 2026-02-01
