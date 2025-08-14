# Plan Implementacji - BandSpace Web App

## Przegląd Projektu

Ten dokument zawiera szczegółowy plan przepisania aplikacji webowej BandSpace na podstawie funkcjonalności aplikacji mobilnej. Wersja webowa będzie uproszczoną wersją aplikacji mobilnej, skupiającą się na kluczowych funkcjach współpracy muzycznej.

## Ścieżki Projektów

- **Aplikacja mobilna (Flutter)**: `/Users/sebastianlisiecki/Flutter Projects/bandspace_mobile`
- **Backend (NestJS)**: `/Users/sebastianlisiecki/bandspace-nestjs`
- **Aplikacja webowa (React + Vite)**: `/Users/sebastianlisiecki/bandspace/bandspace_web`

## Wytyczne UI/UX

**WAŻNE**: Wszystkie komponenty UI mają być wzorowane na aplikacji mobilnej Flutter. Należy:

- Używać identycznych kolorów z pliku `lib/core/theme/app_colors.dart` i `app_theme.dart`
- Zachować spójność w rozmiarach, odstępach i typografii
- Adaptować mobile-first komponenty na desktop-optimized wersje
- Utrzymać ten sam design language i feeling aplikacji
- Kolory główne to:
  - Primary: `#273486` (BandSpace Blue)
  - Background: `#111827` (bg-gray-900)
  - Surface: `#1F2937` (bg-gray-800)
  - Accent: `#2563EB` (bg-blue-600)
  - Text Primary: `#FFFFFF`
  - Text Secondary: `#D1D5DB`
  - Border: `#374151`

## Analiza Aktualnej Architektury

### Backend (NestJS)
- **Autoryzacja**: JWT z obsługą Google OAuth i email/hasło
- **Projekty**: CRUD operacje, zarządzanie członkami, zaproszenia
- **Utwory**: Upload plików audio, metadane, download URLs
- **Użytkownicy**: Zarządzanie profilem, zmiana hasła

### Aktualna Aplikacja Web
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: TailwindCSS v4 z pluginem Vite
- **HTTP Client**: Axios z interceptorami JWT
- **Routing**: React Router DOM v7 (do implementacji)
- **Testing**: Vitest + React Testing Library
- **Estado**: React hooks + Context API (do implementacji)

## Cele Projektu

### Funkcjonalności do Zaimplementowania
1. **Logowanie i rejestracja**
2. **Dashboard** - projekty użytkownika, tworzenie nowego projektu
3. **Szczegóły projektu** - wyświetlanie utworów w projekcie i upload nowych utworów
4. **Szczegóły utworu** - informacje o utworze oraz proste odtwarzanie pojedynczego utworu

### Uproszczenia względem aplikacji mobilnej
- Brak playlist - tylko pojedyncze odtwarzanie utworów
- Uproszczone zarządzanie członkami projektu
- Brak zaawansowanych funkcji offline
- Podstawowy interfejs użytkownika

## Plan Implementacji

### Faza 1: Przygotowanie Środowiska

#### 1.1 Przygotowanie Projektu ✅ UKOŃCZONE
- [x] Utworzenie projektu z Vite + React 19 + TypeScript
- [x] Konfiguracja TailwindCSS v4 z pluginem Vite
- [x] Instalacja zależności (axios, react-router-dom, vitest)
- [x] Ustawienie zmiennych środowiskowych dla NestJS API

#### 1.2 Struktura Projektu ✅ UKOŃCZONE
```
src/
├── lib/
│   ├── api/              # Komunikacja z NestJS API ✅
│   │   ├── auth.ts       # ✅ UKOŃCZONE
│   │   ├── projects.ts   # ✅ UKOŃCZONE
│   │   ├── songs.ts      # ✅ UKOŃCZONE
│   │   └── client.ts     # ✅ UKOŃCZONE
│   ├── components/       # Komponenty UI (struktura gotowa)
│   │   ├── auth/         # (do implementacji)
│   │   ├── dashboard/    # (do implementacji)
│   │   ├── project/      # (do implementacji)
│   │   ├── song/         # (do implementacji)
│   │   └── ui/           # (do implementacji)
│   ├── stores/          # React Context/hooks dla stanu aplikacji
│   │   ├── auth.ts      # (do implementacji)
│   │   ├── projects.ts  # (do implementacji)
│   │   └── songs.ts     # (do implementacji)
│   └── types/           # Definicje typów TypeScript ✅
│       ├── auth.ts      # ✅ UKOŃCZONE
│       ├── project.ts   # ✅ UKOŃCZONE
│       └── song.ts      # ✅ UKOŃCZONE
└── pages/               # Komponenty stron React
    ├── auth/            # (do implementacji)
    ├── dashboard/       # (do implementacji)
    ├── project/         # (do implementacji)
    └── song/            # (do implementacji)
```

### Faza 2: System Autoryzacji

#### 2.1 API Client ✅ UKOŃCZONE
- [x] Konfiguracja HTTP klienta z interceptorami
- [x] Obsługa JWT tokenów (access + refresh)
- [x] Automatyczne odświeżanie tokenów
- [x] Obsługa błędów API
- [x] API endpoints dla auth, projects, songs

#### 2.2 Komponenty Autoryzacji
- [ ] Formularz logowania (email/hasło)
- [ ] Formularz rejestracji
- [ ] Obsługa Google OAuth (opcjonalna w pierwszej fazie)
- [ ] Resetowanie hasła
- [ ] Store dla stanu autoryzacji

#### 2.3 Middleware i Ochrona Route
- [ ] Middleware sprawdzający autoryzację
- [ ] Przekierowania dla nieautoryzowanych użytkowników
- [ ] Persystencja sesji

### Faza 3: Dashboard

#### 3.1 Interfejs Główny
- [ ] Lista projektów użytkownika
- [ ] Przycisk tworzenia nowego projektu
- [ ] Podstawowe informacje o projektach (nazwa, liczba utworów)
- [ ] Responsywny design

#### 3.2 Zarządzanie Projektami
- [ ] Formularz tworzenia projektu
- [ ] Edycja nazwy i opisu projektu
- [ ] Usuwanie projektów
- [ ] Wyświetlanie zaproszeń do projektów

#### 3.3 Store i API Integration
- [ ] Svelte store dla projektów
- [ ] API calls dla CRUD operacji
- [ ] Optimistic updates dla lepszego UX

### Faza 4: Szczegóły Projektu

#### 4.1 Widok Projektu
- [ ] Lista utworów w projekcie
- [ ] Podstawowe informacje o utworach (tytuł, czas trwania)
- [ ] Upload nowych plików audio
- [ ] Zarządzanie członkami projektu

#### 4.2 Upload Utworów
- [ ] Drag & drop interface
- [ ] Walidacja plików audio
- [ ] Progress bar dla uploadu
- [ ] Formularz metadanych utworu

#### 4.3 Zarządzanie Członkami
- [ ] Lista członków projektu
- [ ] Zapraszanie nowych członków przez email
- [ ] Usuwanie członków (dla właściciela)
- [ ] Opuszczanie projektu

### Faza 5: Odtwarzacz Audio

#### 5.1 Komponenty Odtwarzacza
- [ ] Podstawowy player HTML5
- [ ] Kontrolki play/pause/stop
- [ ] Slider pozycji
- [ ] Wyświetlanie czasu trwania
- [ ] Kontrolka głośności

#### 5.2 Szczegóły Utworu
- [ ] Strona detali utworu
- [ ] Odtwarzacz zintegrowany ze stroną
- [ ] Metadane utworu
- [ ] Opcje edycji/usuwania

#### 5.3 Integracja z API
- [ ] Pobieranie URL-i do streamingu
- [ ] Obsługa autoryzacji dla plików audio
- [ ] Cache'owanie dla lepszej wydajności

### Faza 6: UI/UX i Responsive Design

#### 6.1 Design System
- [ ] Spójna paleta kolorów
- [ ] Typografia
- [ ] Komponenty UI (buttons, cards, modals)
- [ ] Loading states i error handling

#### 6.2 Responsive Layout
- [ ] Desktop-first approach (główny target to desktop)
- [ ] Tablet compatibility jako dodatkowa funkcjonalność
- [ ] Desktop-optimized navigation
- [ ] Mouse-optimized controls i interactions

#### 6.3 Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast compliance

## Endpointy API (NestJS Backend)

### Auth Endpoints
```
POST /auth/login           - Logowanie
POST /auth/register        - Rejestracja
POST /auth/logout          - Wylogowanie
POST /auth/refresh         - Odświeżenie tokenu
POST /auth/password/request-reset - Reset hasła
POST /auth/password/reset  - Potwierdzenie resetu hasła
GET  /auth/google          - Google OAuth (opcjonalnie)
POST /auth/google/mobile   - Google mobile login
```

### Projects Endpoints
```
GET    /projects           - Lista projektów użytkownika
POST   /projects           - Tworzenie projektu
GET    /projects/:id       - Szczegóły projektu
PATCH  /projects/:id       - Aktualizacja projektu
DELETE /projects/:id       - Usunięcie projektu
GET    /projects/:id/members - Członkowie projektu
DELETE /projects/:id/members/me - Opuszczenie projektu
```

### Songs Endpoints
```
GET    /projects/:id/songs - Lista utworów w projekcie
POST   /projects/:id/songs - Upload nowego utworu
GET    /projects/:id/songs/:songId - Szczegóły utworu
PATCH  /projects/:id/songs/:songId - Aktualizacja utworu
DELETE /projects/:id/songs/:songId - Usunięcie utworu
GET    /projects/:id/songs/:songId/download-url - URL do streamingu
```

### Invitations Endpoints
```
POST /projects/:id/invitations - Wysłanie zaproszenia
GET  /projects/:id/invitations - Lista zaproszeń projektu
GET  /invitations/:id - Szczegóły zaproszenia
POST /invitations/:id/accept - Akceptacja zaproszenia
POST /invitations/:id/reject - Odrzucenie zaproszenia
GET  /user/invitations - Zaproszenia użytkownika
```

### Users Endpoints
```
GET   /users/me    - Profil użytkownika
PATCH /users/me    - Aktualizacja profilu
DELETE /users/me   - Usunięcie konta
```

## Technologie

### Frontend
- **React 19** - Framework aplikacji z nowoczesnych hooks
- **TypeScript** - Type safety
- **Vite 7.x** - Build tool z HMR
- **TailwindCSS v4** - Styling z pluginem Vite
- **React Router DOM v7** - Routing (do implementacji)
- **React Context/hooks** - State management (do implementacji)
- **Vitest** - Testing framework

### Komunikacja z Backend
- **Axios** - HTTP requests z interceptorami
- **JWT** - Authentication z auto-refresh
- **FormData** - File uploads z progress tracking
- **EventSource/WebSocket** - Real-time updates (opcjonalnie)

## Struktura Routingu

```
/ (root)                  -> przekierowanie do /dashboard lub /auth
/auth                     -> strona logowania/rejestracji
/auth/reset-password      -> resetowanie hasła
/dashboard               -> główna strona z projektami
/project/:id             -> szczegóły projektu
/project/:id/song/:songId -> szczegóły utworu
/profile                 -> profil użytkownika
```

## Zmienne Środowiskowe

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=...
```

## Timeline

- **✅ Faza 1**: Przygotowanie środowiska (UKOŃCZONE)
  - React 19 + Vite + TypeScript setup
  - TailwindCSS v4 configuration
  - Project structure creation
  - Dependencies installation

- **✅ Faza 2**: API Foundation (UKOŃCZONE)
  - Axios client with JWT interceptors
  - API endpoints for auth, projects, songs
  - TypeScript types definition
  - Environment variables setup

- **🔄 W TRAKCIE**: Faza 3 (komponenty autoryzacji)
- **📋 KOLEJNE**: Faza 4 (dashboard)
- **📋 KOLEJNE**: Faza 5 (szczegóły projektu)
- **📋 KOLEJNE**: Faza 6 (odtwarzacz audio)
- **📋 KOLEJNE**: Faza 7 (UI/UX + testy)

## Status Implementacji (Styczeń 2025)

### ✅ Ukończone
- **Środowisko deweloperskie**: React 19 + Vite + TypeScript
- **Build system**: Vite 7.x z HMR i fast refresh
- **Styling**: TailwindCSS v4 z pluginem Vite i motywem BandSpace
- **HTTP Client**: Axios z interceptorami JWT i auto-refresh
- **Struktura projektu**: Wszystkie foldery i podstawowe pliki
- **TypeScript types**: Kompletne definicje dla auth, projects, songs
- **API Layer**: Wszystkie endpointy z obsługą błędów
- **Environment setup**: Zmienne środowiskowe i konfiguracja

### 🔄 W trakcie
- **Komponenty autoryzacji**: Formularze login/register
- **Routing**: React Router DOM setup
- **State management**: React Context providers

### 📋 Do zrobienia
- **UI Components**: auth, dashboard, project, song components
- **Pages**: wszystkie strony aplikacji
- **Audio player**: HTML5 audio z kontrolkami
- **File upload**: drag & drop z progress bar
- **Testing**: unit i integration testy
- **Error handling**: user-friendly error states
- **Loading states**: skeleton screens i spinners

## Kryteria Sukcesu

1. **Funkcjonalność**:
   - Logowanie/rejestracja działają poprawnie
   - Dashboard wyświetla projekty użytkownika
   - Upload utworów działa bez problemów
   - Odtwarzacz prawidłowo odtwarza pliki audio

2. **Jakość kodu**:
   - TypeScript bez błędów
   - Komponenty są reusable i dobrze zorganizowane
   - API calls są prawidłowo obsługiwane

3. **UX**:
   - Aplikacja jest responsywna
   - Loading states są informacyjne
   - Error handling jest przyjazny użytkownikowi

4. **Performance**:
   - Szybkie ładowanie stron
   - Optymalizacja obrazów i zasobów
   - Efektywne zarządzanie stanem