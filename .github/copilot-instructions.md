# testing Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-06-02

## Active Technologies
- TypeScript ~5.6.0 (pinned by Angular 21) (001-angular-minimal-setup)
- Angular 21.2.8 — standalone components, Angular Router, Angular Signals (001-angular-minimal-setup)
- N/A — static SPA, no backend, no persistence (001-angular-minimal-setup)
- TypeScript ~5.9.2 (Angular 21.1) + `@angular/platform-browser` `Title` service (already used — no new dep) (002-branding-title-favicon)
- [if applicable, e.g., PostgreSQL, CoreData, files or N/A] (002-branding-title-favicon)
- TypeScript `~5.9.2` (Angular 21.1) + Angular standalone stack (`@angular/core`, `@angular/router`, `@angular/platform-browser`), RxJS; no new third-party runtime dependencies (003-add-age-gate)
- Browser `sessionStorage` only for age decision + requested destination metadata; DOB storage is prohibited (003-add-age-gate)
- Browser `sessionStorage` for decision status and requested destination only; DOB is transient in-memory only (master)
- N/A (ephemeral UI state only) (005-sticky-header-nav)
- TypeScript ~5.9.2 (Angular 21.1) + Angular standalone stack (`@angular/core`, `@angular/router`, `@angular/platform-browser`), RxJS (006-beer-page)
- N/A (no persistence) (006-beer-page)
- Browser `sessionStorage` for existing age-gate decision and requested destination only; no new persistence (008-pre-specify-hook)

## Project Structure

```text
src/
├── app/          # Root shell component, app config, route definitions
├── pages/        # Page-level components (one folder per route)
├── styles/       # SCSS partials (_variables.scss, _reset.scss)
├── environments/ # Build-time config (no secrets)
└── assets/       # Static assets including _headers security file
.github/workflows/ # GitHub Actions CI pipeline
```

## Commands

```bash
npm start               # Dev server at http://localhost:4200
npm test                # Unit tests (Karma + Jasmine, headless Chrome)
npm run lint            # ESLint via @angular-eslint
npm run format:check    # Prettier format check (used in CI)
npm run build           # Production build (output: dist/)
```

## Code Style

TypeScript ~5.6.0: Follow Angular style guide. All components MUST be standalone with `ChangeDetectionStrategy.OnPush`. Use Angular Signals for state. No NgModules. SCSS for styles. Selector prefix: `app-`. ESLint + Prettier enforced in CI.

## Recent Changes
- 008-pre-specify-hook: Added TypeScript `~5.9.2` (Angular 21.1) + Angular standalone stack (`@angular/core`, `@angular/router`, `@angular/platform-browser`), RxJS
- 006-beer-page: Added TypeScript ~5.9.2 (Angular 21.1) + Angular standalone stack (`@angular/core`, `@angular/router`, `@angular/platform-browser`), RxJS
- 005-sticky-header-nav: Added TypeScript `~5.9.2` (Angular 21.1) + Angular standalone stack (`@angular/core`, `@angular/router`, `@angular/platform-browser`), RxJS

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
