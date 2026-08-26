import { Injectable, inject } from '@angular/core';
import { AgeGateSessionService } from './age-gate-session.service';
import { type RouteDecision } from './age-gate.types';
import { resolveAgeGateRouteDecision } from './age-gate-route-policy';

@Injectable({ providedIn: 'root' })
export class AgeGateRoutingService {
  private readonly session = inject(AgeGateSessionService);

  resolveNavigation(targetUrl: string): RouteDecision {
    return resolveAgeGateRouteDecision(
      targetUrl,
      this.session.getDecision(),
      () => this.session.consumeRequestedDestination(),
      (destination) => this.session.persistRequestedDestination(destination)
    );
  }
}
