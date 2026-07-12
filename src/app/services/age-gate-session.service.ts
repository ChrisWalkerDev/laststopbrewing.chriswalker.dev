import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ACCESS_DENIED_ROUTE,
  AGE_GATE_DECISION_KEY,
  AGE_GATE_DESTINATION_KEY,
  AGE_GATE_ROUTE,
  DEFAULT_ALLOWED_ROUTE,
  type AgeVerificationDecision,
} from './age-gate.types';

@Injectable({ providedIn: 'root' })
export class AgeGateSessionService {
  private readonly platformId = inject(PLATFORM_ID);

  getDecision(): AgeVerificationDecision {
    const decision = this.readValue(AGE_GATE_DECISION_KEY);
    if (decision === 'approved' || decision === 'denied') {
      return decision;
    }

    return 'unconfirmed';
  }

  setDecision(decision: Extract<AgeVerificationDecision, 'approved' | 'denied'>): void {
    this.writeValue(AGE_GATE_DECISION_KEY, decision);
  }

  clearDecision(): void {
    this.removeValue(AGE_GATE_DECISION_KEY);
  }

  persistRequestedDestination(requestedUrl: string): void {
    const safeDestination = this.sanitizeDestination(requestedUrl);
    if (!safeDestination) {
      return;
    }

    this.writeValue(AGE_GATE_DESTINATION_KEY, safeDestination);
  }

  getRequestedDestination(): string | null {
    return this.sanitizeDestination(this.readValue(AGE_GATE_DESTINATION_KEY));
  }

  consumeRequestedDestination(fallback: string = DEFAULT_ALLOWED_ROUTE): string {
    const requestedDestination = this.getRequestedDestination();
    this.clearRequestedDestination();

    return requestedDestination ?? fallback;
  }

  clearRequestedDestination(): void {
    this.removeValue(AGE_GATE_DESTINATION_KEY);
  }

  sanitizeDestination(candidate: string | null | undefined): string | null {
    if (!candidate || !this.isBrowser()) {
      return null;
    }

    if (candidate.startsWith('//')) {
      return null;
    }

    try {
      const resolved = new URL(candidate, window.location.origin);
      if (resolved.origin !== window.location.origin) {
        return null;
      }

      const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
      if (!path.startsWith('/')) {
        return null;
      }

      if (
        path === AGE_GATE_ROUTE ||
        path.startsWith(`${AGE_GATE_ROUTE}?`) ||
        path === ACCESS_DENIED_ROUTE ||
        path.startsWith(`${ACCESS_DENIED_ROUTE}?`)
      ) {
        return DEFAULT_ALLOWED_ROUTE;
      }

      return path;
    } catch {
      return null;
    }
  }

  private readValue(key: string): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeValue(key: string, value: string): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Fail closed: if sessionStorage is unavailable, behavior falls back to unconfirmed.
    }
  }

  private removeValue(key: string): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      sessionStorage.removeItem(key);
    } catch {
      // Best-effort cleanup; failures keep flow fail-closed.
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
