# Nurav AI Routes

## Application Routes

- **/** - Main AI chat interface with sidebar and chat input
- **/share/[id]** - Public read-only shared conversation view (generated via Share button)
- **/core/typography** - Typography system showcase
- **/core/icons** - Icon library showcase with all Lucide React icons
- **/core/color** - Color system showcase with theme switching
- **/tools** - Interactive tools showcase and playground with all available AI tools grouped by niche

## Authentication Routes

- **/auth/callback** - OAuth callback handler for Supabase authentication

## Protected Routes (Authenticated)

- **/profile** - User profile page displaying data from auth_users_table (username, email, name, subscription status, role, verification status, timestamps)

## Chat Interface Components

The main page (`/`) uses a modern chat interface with:

### Components

- **Sidebar** (`/components/chat/Sidebar.tsx`) - Collapsible sidebar with conversations, theme toggle, settings
- **ChatLayout** (`/components/chat/ChatLayout.tsx`) - Main layout wrapper with sidebar and content area
- **ChatInput** (`/components/chat/ChatInput.tsx`) - Modern input with attachment, image, search, code, and voice icons
- **ChatMessage** (`/components/chat/ChatMessage.tsx`) - Message display with copy functionality
- **WelcomeScreen** (`/components/chat/WelcomeScreen.tsx`) - Initial screen with suggestions

### Features

- Collapsible sidebar with conversation history
- Theme toggle (light/dark/custom mode)
- Modern chat input with multiple action buttons
- Keyboard shortcuts (Ctrl+B for sidebar, Ctrl+Shift+N for new chat)
- Responsive design for mobile devices
- Pre-send mode selector (Fast / Research / Deep) in input toolbar
- Personalization toggle (KG + memory context injection)
- Prompt Templates modal (10 built-in templates + save custom prompts)
- Export response as Markdown (.md file download)
- Share conversation link (copy permalink to clipboard)
- Branch conversation from any message point
- Research Timeline (chronological source view for dated citations)
- Contradiction Detector (heuristic signal for conflicting sources)
- Citation Source Graph (SVG radial map of source clusters)
- Collections / Notebooks (group conversations into research folders, localStorage)
- Confidence badge on assistant responses (green ≥85%, yellow 65-84%, orange <65%)
- Live data widgets for stock/crypto/weather inline in responses
- Auto Table of Contents for long responses

## Core Components

- **Grid System** (`/app/core/Grid.tsx`) - CSS Grid and Flexbox layout components
- **Typography** (`/app/core/Typography.tsx`) - Responsive typography system
- **ThemeWrapper** (`/app/core/ThemeWrapper.tsx`) - Theme management with light/dark/custom modes
- **Icons** (`/app/core/icons.ts`) - Centralized Lucide React icon exports

## Hooks

- **useCopyToClipboard** (`/hooks/useCopyToClipboard.ts`) - Copy text to clipboard
- **useAuth** (`/hooks/useAuth.tsx`) - Authentication state management
- **useExport** (`/hooks/useExport.ts`) - Export messages as Markdown or PDF (browser print)
- **usePromptTemplates** (`/hooks/usePromptTemplates.ts`) - Manage saved prompt templates (localStorage + 10 built-ins)
- **useCollections** (`/hooks/useCollections.ts`) - Collections/notebooks for grouping conversations (localStorage)

## Authentication System

### Components
- **AuthModal** (`/components/auth/AuthModal.tsx`) - Modal with OAuth, email, phone auth
- **ProtectedRoute** (`/components/auth/ProtectedRoute.tsx`) - Route protection wrapper

### OAuth Providers
- Google, GitHub, Apple, Discord

### Supabase Integration
- Client: `/lib/supabase/client.ts`
