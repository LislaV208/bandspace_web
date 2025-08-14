# Plan Implementacji - BandSpace Web App

## Przegląd Projektu

Ten dokument zawiera szczegółowy plan przepisania aplikacji webowej BandSpace na podstawie funkcjonalności aplikacji mobilnej. Wersja webowa będzie uproszczoną wersją aplikacji mobilnej, skupiającą się na kluczowych funkcjach współpracy muzycznej.

## Ścieżki Projektów

- **Aplikacja mobilna (Flutter)**: `/Users/sebastianlisiecki/Flutter Projects/bandspace_mobile`
- **Backend (NestJS)**: `/Users/sebastianlisiecki/bandspace-nestjs`
- **Aplikacja webowa (SvelteKit)**: `/Users/sebastianlisiecki/svelte_projects/bandspace`

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

### Istniejąca Aplikacja Web
- **Framework**: SvelteKit
- **Styling**: TailwindCSS
- **Baza danych**: Obecnie Supabase (do zastąpienia przez NestJS API)
- **Struktura**: Komponentowa architektura z routingiem

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

#### 1.1 Czyszczenie i Przygotowanie Projektu
- [ ] Usunięcie integracji z Supabase
- [ ] Aktualizacja zależności
- [ ] Konfiguracja TypeScript
- [ ] Ustawienie zmiennych środowiskowych dla NestJS API

#### 1.2 Struktura Projektu
```
src/
├── lib/
│   ├── api/              # Komunikacja z NestJS API
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── songs.ts
│   │   └── client.ts
│   ├── components/       # Komponenty UI
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── project/
│   │   ├── song/
│   │   └── ui/
│   ├── stores/          # Svelte stores dla stanu aplikacji
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   └── songs.ts
│   └── types/           # Definicje typów TypeScript
│       ├── auth.ts
│       ├── project.ts
│       └── song.ts
└── routes/              # Routing SvelteKit
    ├── auth/
    ├── dashboard/
    ├── project/
    └── song/
```

### Faza 2: System Autoryzacji

#### 2.1 API Client
- [ ] Konfiguracja HTTP klienta z interceptorami
- [ ] Obsługa JWT tokenów (access + refresh)
- [ ] Automatyczne odświeżanie tokenów
- [ ] Obsługa błędów API

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
- **SvelteKit** - Framework aplikacji
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Svelte Stores** - State management
- **Vite** - Build tool

### Komunikacja z Backend
- **Fetch API** - HTTP requests
- **JWT** - Authentication
- **FormData** - File uploads
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

- **Tydzień 1-2**: Faza 1-2 (środowisko + autoryzacja)
- **Tydzień 3**: Faza 3 (dashboard)
- **Tydzień 4**: Faza 4 (szczegóły projektu)
- **Tydzień 5**: Faza 5 (odtwarzacz)
- **Tydzień 6**: Faza 6 (UI/UX + testy)

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