import { type Route } from '@angular/router';
import { DESKTOP_MIN_WIDTH } from '../header.constants';

export function normalizeAppPath(url: string): string {
  const withoutQuery = url.split('?')[0] ?? '/';
  const withoutFragment = withoutQuery.split('#')[0] ?? '/';

  return withoutFragment.length === 0 ? '/' : withoutFragment;
}

export function isHeaderVisible(path: string, routes: readonly Route[]): boolean {
  const normalizedPath = normalizeAppPath(path);
  const matchingRoute = findMatchingRoute(routes, normalizedPath);

  return !matchingRoute?.data?.['hideHeader'];
}

function findMatchingRoute(routes: readonly Route[], path: string): Route | undefined {
  for (const route of routes) {
    if (routeMatchesPath(route, path)) {
      return route;
    }

    if (route.children?.length) {
      const nestedMatch = findMatchingRoute(route.children, path);
      if (nestedMatch) {
        return nestedMatch;
      }
    }
  }

  return undefined;
}

function routeMatchesPath(route: Route, path: string): boolean {
  const routePath = route.path ?? '';
  const normalizedRoutePath = routePath.length === 0 ? '/' : `/${routePath}`;

  return normalizedRoutePath === path;
}

export function getOverlayFocusableElements(document: Document, overlayId: string): HTMLElement[] {
  const overlay = document.getElementById(overlayId);
  if (!overlay) {
    return [];
  }

  const selector = [
    'a[href]',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
  ].join(', ');

  return Array.from(overlay.querySelectorAll<HTMLElement>(selector)).filter((element) => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      !element.hasAttribute('disabled') &&
      !element.getAttribute('aria-hidden')
    );
  });
}

export function getViewportWidth(windowRef: Window | null): number {
  if (!windowRef) {
    return DESKTOP_MIN_WIDTH;
  }

  return windowRef.innerWidth;
}

export function getPrefersReducedMotionQuery(windowRef: Window | null): boolean {
  if (!windowRef || typeof windowRef.matchMedia !== 'function') {
    return false;
  }

  return windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
