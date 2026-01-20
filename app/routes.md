# Nurav AI Routes

## Application Routes

- **/** - Main AI chat interface with sidebar and chat input
- **/core/typography** - Typography system showcase
- **/core/icons** - Icon library showcase with all Lucide React icons
- **/core/color** - Color system showcase with theme switching

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
- Keyboard shortcuts (Ctrl+B for sidebar)
- Responsive design for mobile devices

## Core Components

- **Grid System** (`/app/core/Grid.tsx`) - CSS Grid and Flexbox layout components
- **Typography** (`/app/core/Typography.tsx`) - Responsive typography system
- **ThemeWrapper** (`/app/core/ThemeWrapper.tsx`) - Theme management with light/dark/custom modes
- **Icons** (`/app/core/icons.ts`) - Centralized Lucide React icon exports

## Hooks

- **useCopyToClipboard** (`/hooks/useCopyToClipboard.ts`) - Copy text to clipboard
- **useAuth** (`/hooks/useAuth.tsx`) - Authentication state management

## Authentication System

### Components
- **AuthModal** (`/components/auth/AuthModal.tsx`) - Modal with OAuth, email, phone auth
- **ProtectedRoute** (`/components/auth/ProtectedRoute.tsx`) - Route protection wrapper

### OAuth Providers
- Google, GitHub, Apple, Discord

### Supabase Integration
- Client: `/lib/supabase/client.ts`
