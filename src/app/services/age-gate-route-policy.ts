import {
  ACCESS_DENIED_ROUTE,
  AGE_GATE_ROUTE,
  DEFAULT_ALLOWED_ROUTE,
  type AgeVerificationDecision,
  type RouteDecision,
} from './age-gate.types';

export function normalizeAgeGateTarget(rawTarget: string): string {
  if (rawTarget.startsWith('//')) {
    return DEFAULT_ALLOWED_ROUTE;
  }

  try {
    const resolved = new URL(rawTarget, window.location.origin);
    if (resolved.origin !== window.location.origin) {
      return DEFAULT_ALLOWED_ROUTE;
    }

    const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
    return path.startsWith('/') ? path : DEFAULT_ALLOWED_ROUTE;
  } catch {
    return DEFAULT_ALLOWED_ROUTE;
  }
}

export function resolveAgeGateRouteDecision(
  targetUrl: string,
  decision: AgeVerificationDecision,
  consumeRequestedDestination: () => string | null,
  persistRequestedDestination: (destination: string) => void
): RouteDecision {
  const normalizedTarget = normalizeAgeGateTarget(targetUrl);

  if (decision === 'approved') {
    if (isRestrictedGateRoute(normalizedTarget)) {
      const requestedDestination = consumeRequestedDestination();
      return { allow: false, redirectTo: requestedDestination ?? DEFAULT_ALLOWED_ROUTE };
    }

    return { allow: true };
  }

  if (decision === 'denied') {
    if (normalizedTarget === ACCESS_DENIED_ROUTE) {
      return { allow: true };
    }

    return { allow: false, redirectTo: ACCESS_DENIED_ROUTE };
  }

  if (normalizedTarget === AGE_GATE_ROUTE) {
    return { allow: true };
  }

  persistRequestedDestination(normalizedTarget);
  return { allow: false, redirectTo: AGE_GATE_ROUTE };
}

export function isRestrictedGateRoute(target: string): boolean {
  return target === AGE_GATE_ROUTE || target === ACCESS_DENIED_ROUTE;
}
