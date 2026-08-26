import { DESKTOP_MIN_WIDTH } from '../header.constants';

export function normalizeAppPath(url: string): string {
  const withoutQuery = url.split('?')[0] ?? '/';
  const withoutFragment = withoutQuery.split('#')[0] ?? '/';

  return withoutFragment.length === 0 ? '/' : withoutFragment;
}

export function isHeaderVisible(path: string, excludedRoutes: readonly string[]): boolean {
  return !excludedRoutes.includes(path as (typeof excludedRoutes)[number]);
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

  return Array.from(overlay.querySelectorAll<HTMLElement>(selector));
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
