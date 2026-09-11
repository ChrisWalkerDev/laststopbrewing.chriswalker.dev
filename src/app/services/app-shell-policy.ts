import { type Route } from '@angular/router';

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
