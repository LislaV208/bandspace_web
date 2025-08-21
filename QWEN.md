# BandSpace Web Application - Qwen Context

## Project Overview

This is a Next.js 14 application for BandSpace, a collaborative music platform. The application allows users to share, manage, and collaborate on musical projects with their bands.

Key technologies used:
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color themes
- **UI Components**: shadcn/ui components with Radix UI primitives
- **State Management**: React Context API (Auth Context)
- **HTTP Client**: Custom API client with automatic token refresh
- **Authentication**: Email/password and Google OAuth

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable UI components (shadcn/ui)
- `contexts/` - React context providers (auth)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions, API client, and types
- `public/` - Static assets
- `styles/` - Global styles and Tailwind configuration

## Building and Running

### Development
```bash
npm run dev
```
Starts the development server on http://localhost:3000

### Production
```bash
npm run build
npm run start
```
Builds and starts the production server

### Linting
```bash
npm run lint
```

## Development Conventions

- **Component Structure**: Uses shadcn/ui component library with a consistent structure
- **Styling**: Tailwind CSS with custom color variables defined in `globals.css`
- **API Integration**: All API calls are handled through the `apiClient` in `lib/api.ts`
- **Authentication**: Managed through `AuthProvider` and `useAuth` hook
- **Routing**: Uses Next.js App Router with file-based routing in the `app/` directory
- **Type Safety**: Strong typing with TypeScript interfaces defined in `lib/types.ts`

## Key Features

- User authentication (login/register with email or Google)
- Project management (create, view, update, delete)
- Song management within projects (upload, update, delete)
- Collaborative features (invite users, accept/decline invitations)
- Responsive design with dark mode support