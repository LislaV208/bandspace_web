# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` or `pnpm dev`
- **Build for production**: `npm run build` or `pnpm build`
- **Start production server**: `npm run start` or `pnpm start`
- **Run linter**: `npm run lint` or `pnpm lint`

## Project Architecture

### Framework & Tech Stack

- **Next.js 14** with App Router
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **shadcn/ui** components with Radix UI primitives
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Key Configuration Notes

- Build errors for TypeScript and ESLint are currently ignored in `next.config.mjs`
- Images are unoptimized in Next.js config
- Uses `@/*` path mapping for absolute imports
- pnpm is the package manager (evidenced by pnpm-lock.yaml)
- IDE is configured to prioritize ESLint over TypeScript errors via `.vscode/settings.json`
- Use `npm run lint` for consistent linting (matches IDE setup)

### Architecture Patterns

#### API Layer (`lib/api.ts`)

- Centralized API client with Bearer token authentication
- Backend API base URL: `https://bandspace-app-b8372bfadc38.herokuapp.com/api`
- Custom `ApiError` class for error handling
- Supports both JSON and FormData requests (for file uploads)

#### Authentication System

**Context & Session Management (`contexts/auth-context.tsx`)**
- React Context for global auth state management
- localStorage-based session persistence with key `bandspace_session`
- Auto-refresh token mechanism (every 50 minutes)
- Supports email/password and Google OAuth login

**Route Protection Architecture**
- **Layout-based authentication** using Next.js App Router route groups
- Public routes: `/` (root), `/auth/success`, `/auth/error` (Google OAuth redirects)
- Protected routes: All routes in `app/(authenticated)/` folder are automatically protected
- **NO manual `<AuthGuard>` components needed** - protection is handled at layout level
- Automatic redirect to `/` for unauthorized users accessing protected routes
- Prevents 401 API errors by ensuring authentication before component mounting

#### Type System (`lib/types.ts`)

- Core entities: `User`, `Project`, `Song`, `Session`, `ProjectInvitation`
- Songs include file metadata, duration, BPM, and lyrics
- Projects have slug-based routing

#### Component Structure

- `components/ui/` - shadcn/ui components
- `components/auth/` - Authentication-related components (including `AuthGuard`)
- `components/dashboard/` - Dashboard page components
- `components/project/` - Project-specific components with tabs
- `components/audio/` - Audio player components

#### App Structure (Next.js App Router)

**Public Routes (no authentication required):**
- `app/page.tsx` - Landing/home page
- `app/auth/success/page.tsx` - Google OAuth success redirect
- `app/auth/error/page.tsx` - Google OAuth error redirect
- `app/layout.tsx` - Root layout with theme provider

**Protected Routes (automatic authentication via layout):**
- `app/(authenticated)/layout.tsx` - Auth guard layout (wraps all protected routes)
- `app/(authenticated)/dashboard/page.tsx` - User dashboard
- `app/(authenticated)/project/[id]/page.tsx` - Individual project pages

**Adding New Protected Routes:**
- Simply create new pages/folders inside `app/(authenticated)/`
- No manual auth guards needed - protection is automatic

### Audio Features

- Custom audio player hooks (`hooks/use-audio-player.ts`)
- Support for song uploads with metadata (title, BPM, lyrics)
- File download functionality for songs

### UI/UX Patterns

- Dark/light theme support via `next-themes`
- Mobile-responsive design with custom mobile detection
- Toast notifications using Sonner
- File upload via react-dropzone
- Form validation with React Hook Form + Zod

### Development Notes

- Use existing patterns for new components (check similar components first)
- **Authentication**: All routes requiring authentication should be placed in `app/(authenticated)/` folder
- **NO manual auth guards needed** - layout-based protection handles authentication automatically
- Project-based collaboration model with invitations
- File uploads should use FormData with the uploadRequest method
- All forms should use React Hook Form with Zod validation
- **Strong TypeScript Usage**: Always add proper return types to method signatures

### Authentication Best Practices

- **New Protected Pages**: Create inside `app/(authenticated)/` folder - authentication is automatic
- **Public Pages**: Create in root `app/` folder (like landing page, auth callbacks)
- **AuthGuard Component**: Available at `components/auth/auth-guard.tsx` but typically not needed due to layout-based protection
- **useAuthGuard Hook**: Available at `hooks/use-auth-guard.ts` for custom auth logic if needed
- **API Calls**: All API calls in protected routes execute only after authentication is confirmed, preventing 401 errors

## Related Projects

### BandSpace Mobile App

- **Location**: `/Users/sebastianlisiecki/Flutter Projects/bandspace_mobile`
- **Framework**: Flutter/Dart
- **Purpose**: Mobile companion app for BandSpace
- When references are made to "aplikacja mobilna" or "mobile app", refer to code and design patterns from this Flutter project
- Key reference files:
  - `lib/core/theme/app_theme.dart` - Color palette and theme configuration
  - `lib/features/auth/screens/auth_screen.dart` - Authentication UI patterns
  - Mobile app uses the same backend API and follows similar design principles

### BandSpace Backend API

- **Location**: `/Users/sebastianlisiecki/bandspace-nestjs`
- **Framework**: NestJS/TypeScript
- **Purpose**: Backend API server for BandSpace ecosystem
- When references are made to "backend", "API", or "server", refer to code and implementation patterns from this NestJS project
- **API Base URL**: `https://bandspace-app-b8372bfadc38.herokuapp.com/api`
- Both web and mobile apps consume this same backend API
- Provides authentication, project management, file uploads, and collaboration features
