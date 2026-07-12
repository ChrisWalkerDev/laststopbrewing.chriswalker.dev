import { Injectable, inject } from '@angular/core';
import { AgeGateSessionService } from './age-gate-session.service';
import {
  ACCESS_DENIED_ROUTE,
  AGE_GATE_ROUTE,
  DEFAULT_ALLOWED_ROUTE,
  type RouteDecision,
} from './age-gate.types';

@Injectable({ providedIn: 'root' })
export class AgeGateRoutingService {
  private readonly session = inject(AgeGateSessionService);

  resolveNavigation(targetUrl: string): RouteDecision {
    const normalizedTarget = this.normalizeTarget(targetUrl);
    const currentDecision = this.session.getDecision();

    if (currentDecision === 'approved') {
      if (this.isRestrictedGateRoute(normalizedTarget)) {
        return { allow: false, redirectTo: this.session.consumeRequestedDestination() };
      }

      return { allow: true };
    }

    if (currentDecision === 'denied') {
      if (normalizedTarget === ACCESS_DENIED_ROUTE) {
        return { allow: true };
      }

      return { allow: false, redirectTo: ACCESS_DENIED_ROUTE };
    }

    if (normalizedTarget === AGE_GATE_ROUTE) {
      return { allow: true };
    }

    this.session.persistRequestedDestination(normalizedTarget);
    return { allow: false, redirectTo: AGE_GATE_ROUTE };
  }

  private isRestrictedGateRoute(url: string): boolean {
    return url === AGE_GATE_ROUTE || url === ACCESS_DENIED_ROUTE;
  }

  private normalizeTarget(rawTarget: string): string {
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
}
