# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (Vite dev server on http://localhost:5173)
- `npm run build` - Build for production (TypeScript + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Environment Setup
- Copy `.env.example` to `.env` and configure:
  - `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000)
  - `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

## Project Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7.x with Hot Module Replacement
- **Styling**: TailwindCSS v4 with first-party Vite plugin
- **HTTP Client**: Axios with interceptors for auth (to be added)
- **Routing**: React Router DOM (to be added)
- **Testing**: Vitest (to be added)
- **Linting**: ESLint with React and TypeScript rules

### Project Structure (Planned)
```
src/
├── lib/
│   ├── api/              # API communication layer
│   │   ├── client.ts     # Axios instance with auth interceptors
│   │   ├── auth.ts       # Authentication endpoints
│   │   ├── projects.ts   # Project CRUD operations
│   │   └── songs.ts      # Song management endpoints
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Authentication forms
│   │   ├── dashboard/    # Dashboard components
│   │   ├── project/      # Project management UI
│   │   ├── song/         # Song player and management
│   │   └── ui/           # Generic UI components
│   ├── stores/           # State management (to be added)
│   └── types/            # TypeScript type definitions
│       ├── auth.ts       # User and authentication types
│       ├── project.ts    # Project and member types
│       └── song.ts       # Song and upload types
└── pages/                # Page components
    ├── auth/             # Login/register pages
    ├── dashboard/        # Main dashboard
    ├── project/          # Project detail views
    └── song/             # Song detail views
```

### TailwindCSS v4 Configuration
- **Import**: Uses single `@import "tailwindcss"` in index.css
- **Plugin**: Configured via `@tailwindcss/vite` in vite.config.ts
- **Theme**: Custom BandSpace colors (to be configured in tailwind.config.js)

### UI Theme (BandSpace Colors)
- **Primary**: `#273486` (BandSpace Blue)
- **Background**: `#111827` (bg-gray-900)
- **Surface**: `#1F2937` (bg-gray-800)
- **Accent**: `#2563EB` (bg-blue-600)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#D1D5DB`
- **Border**: `#374151`

## Backend Integration (Planned)

### Expected API Endpoints
The app expects a NestJS backend with these endpoints:

**Authentication**:
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - Logout

**Projects**:
- `GET /projects` - User's projects
- `POST /projects` - Create project
- `GET /projects/:id` - Project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

**Songs**:
- `GET /projects/:id/songs` - Project songs
- `POST /projects/:id/songs` - Upload song
- `GET /projects/:id/songs/:songId` - Song details
- `DELETE /projects/:id/songs/:songId` - Delete song

### Data Flow (Planned)
1. Authentication state managed via localStorage
2. API client automatically adds Bearer tokens to requests
3. Failed auth (401) triggers token refresh attempt
4. If refresh fails, user redirected to login

## Development Notes

### Current State
- ✅ Vite + React 19 + TypeScript setup
- ✅ TailwindCSS v4 with Vite plugin
- ✅ ESLint configuration
- ⏳ Project structure (needs creation)
- ⏳ Dependencies (axios, react-router-dom, etc.)
- ⏳ Custom TailwindCSS theme
- ⏳ API client implementation
- ⏳ UI components and pages

### Implementation Status
Based on `PLAN_IMPLEMENTACJI_WEBOWA_BANDSPACE.md`, this is a web port of a Flutter mobile app. Next steps:
1. Add missing dependencies (axios, react-router-dom, etc.)
2. Create project folder structure
3. Implement TypeScript types
4. Setup API client with JWT auth
5. Configure custom TailwindCSS theme
6. Build UI components matching mobile app design

### Key Implementation Requirements
1. **Design Consistency**: UI must match the Flutter mobile app's design language
2. **Desktop-First**: Optimized for desktop use, unlike mobile-first approach
3. **Simplified Features**: Web version has reduced functionality vs mobile app
4. **Authentication**: JWT with refresh token flow
5. **File Uploads**: Drag & drop for audio files with progress tracking