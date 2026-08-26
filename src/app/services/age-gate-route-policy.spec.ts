import { ACCESS_DENIED_ROUTE, AGE_GATE_ROUTE } from './age-gate.types';
import { normalizeAgeGateTarget, resolveAgeGateRouteDecision } from './age-gate-route-policy';

describe('age gate route policy', () => {
  it('should normalize unsafe targets to the default route', () => {
    expect(normalizeAgeGateTarget('//evil.example')).toBe('/');
    expect(normalizeAgeGateTarget('https://evil.example/beer')).toBe('/');
  });

  it('should redirect unconfirmed visitors to the age gate and persist the destination', () => {
    let persistedDestination: string | null = null;
    const persistRequestedDestination = (destination: string): void => {
      persistedDestination = destination;
    };

    const decision = resolveAgeGateRouteDecision(
      '/beer?source=launch',
      'unconfirmed',
      () => null,
      persistRequestedDestination
    );

    expect(decision).toEqual({ allow: false, redirectTo: AGE_GATE_ROUTE });
    expect(persistedDestination).toBe('/beer?source=launch');
  });

  it('should redirect denied visitors away from protected routes', () => {
    const decision = resolveAgeGateRouteDecision(
      '/food',
      'denied',
      () => null,
      () => undefined
    );

    expect(decision).toEqual({ allow: false, redirectTo: ACCESS_DENIED_ROUTE });
  });
});
