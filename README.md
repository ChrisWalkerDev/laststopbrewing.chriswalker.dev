# Angular Website

A production-ready Angular 21 static SPA with minimal dependencies, strict type checking, WCAG 2.1 AA accessibility, and a GitHub Actions CI pipeline.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | `^20.19.0 \|\| ^22.12.0 \|\| >=24.0.0` (`.nvmrc` = 22) |
| npm | `^10` |
| Git | Any recent version |
| Angular CLI | `^21` (`npm install -g @angular/cli`) |

## Setup

```bash
git clone <repo-url>
cd <repo-folder>
nvm use          # sets Node version from .nvmrc
npm ci           # install exact dependencies
npm start        # dev server at http://localhost:4200
```

## Daily Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server at `http://localhost:4200` |
| `npm test` | Run tests once (headless Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format all source files |
| `npm run format:check` | Prettier format check (used in CI) |

## Production Build

```bash
npm run build -- --configuration=production
# Output: dist/angular-website/browser/
```

The production build uses `src/environments/environment.production.ts` via `fileReplacements` in `angular.json`. No source maps are emitted (`sourceMap: false`).

## Project Structure

```
src/
├── index.html                          # App entry point (lang="en", title)
├── main.ts                             # Angular bootstrap
├── styles.scss                         # Global stylesheet entry (@use reset, variables)
├── app/
│   ├── app.ts                          # Root shell component (OnPush, RouterOutlet)
│   ├── app.html                        # Skip-link + router-outlet template
│   ├── app.scss                        # Skip-link WCAG 2.1 AA styles
│   ├── app.config.ts                   # Application providers
│   ├── app.routes.ts                   # Route definitions
│   ├── app.routes.spec.ts              # Route interception behavior tests
│   └── app.spec.ts                     # Root component unit tests
│   └── services/
│       ├── age-gate.types.ts           # Age-gate constants/types
│       ├── age-gate-session.service.ts # sessionStorage + destination safety logic
│       ├── age-gate-session.service.spec.ts
│       └── age-gate-routing.service.ts # Route-level decision helper
├── pages/
│   ├── age-gate/
│   │   ├── age-gate.component.ts
│   │   ├── age-gate.component.html
│   │   ├── age-gate.component.scss
│   │   └── age-gate.component.spec.ts
│   ├── access-denied/
│   │   ├── access-denied.component.ts
│   │   ├── access-denied.component.html
│   │   ├── access-denied.component.scss
│   │   └── access-denied.component.spec.ts
│   └── home/
│       ├── home.component.ts           # Home page component (OnPush, signal)
│       ├── home.component.html         # Home page template (ARIA section/h1)
│       ├── home.component.scss         # Home page styles
│       └── home.component.spec.ts      # Home component unit tests
├── environments/
│   ├── environment.model.ts            # EnvironmentConfig interface
│   ├── environment.ts                  # Dev values (production: false)
│   └── environment.production.ts      # Prod values (production: true)
└── styles/
    ├── _reset.scss                     # Minimal CSS reset
    └── _variables.scss                 # CSS custom property tokens
```

## Age Gate Routing

The application enforces a dedicated 21+ age gate at route level:

- First unconfirmed navigation redirects to `/age-gate`.
- Selecting `YES` stores `approved` in `sessionStorage` and restores requested destination.
- Selecting `NO` stores `denied` and redirects to `/access-denied`.
- Denied users remain blocked from protected routes until DOB re-verification confirms age >= 21.
- Age decision is never persisted to `localStorage`, cookies, or server channels.

## Sticky Header Navigation

The app shell now includes a sticky responsive header with clear desktop/mobile behavior:

- Desktop (`>=769px`): `favicon.ico` appears on the left and primary links appear on the right.
- Mobile (`<=768px`): `favicon.ico` appears on the left and a borderless, three-layer image toggle appears on the right.
- Mobile menu opens as a full-viewport overlay while the sticky header remains visible above it.
- Mobile menu closes on route selection, `Escape`, backdrop tap, and desktop-resize transition.
- Focus is trapped inside the open mobile overlay and returns to the hamburger toggle on close.
- Header nav intentionally excludes `/age-gate` and `/access-denied` routes.
- `prefers-reduced-motion` is honored by minimizing transition animation while preserving behavior.

## Security Headers

`public/_headers` defines HTTP security headers deployed to CDN edge (Netlify/Vercel `_headers` format):

- `Content-Security-Policy`: default-src 'self'; disallows inline scripts
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: geolocation, microphone, camera all empty
- `Cache-Control: no-cache` on `index.html`

For other hosting platforms (Apache, Nginx, IIS), apply equivalent headers in server configuration.

## Dependency Justification

### Runtime Dependencies

| Package | Justification |
|---------|--------------|
| `@angular/common` | Angular core utilities (pipes, directives) |
| `@angular/compiler` | JIT compiler — required at runtime for template rendering |
| `@angular/core` | Angular DI, Signals, lifecycle hooks |
| `@angular/forms` | Peer dependency of Angular router |
| `@angular/platform-browser` | Browser platform bootstrapping |
| `@angular/router` | Client-side routing (FR-005) |
| `rxjs` | Required peer of Angular core — Observable streams |
| `tslib` | TypeScript helper functions (eliminates duplicate helpers) |

**Third-party runtime deps (non-Angular ecosystem):** 0

### Dev Dependencies

| Package | Justification |
|---------|--------------|
| `@angular/build` | Angular CLI builder (`@angular/build:application`) |
| `@angular/cli` | Scaffolding and `ng` commands |
| `@angular/compiler-cli` | AOT compilation and type checking |
| `@eslint/js` | ESLint base recommended rules (required by flat config) |
| `angular-eslint` | Angular-specific ESLint rules + template accessibility |
| `eslint` | Linting engine |
| `eslint-config-prettier` | Disables ESLint rules that conflict with Prettier |
| `jsdom` | DOM environment for Vitest unit tests |
| `prettier` | Opinionated code formatter (enforced in CI) |
| `typescript` | TypeScript compiler |
| `typescript-eslint` | TypeScript-aware ESLint rules |
| `vitest` | Fast Vite-native test runner (replaces Karma in Angular 21) |

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
