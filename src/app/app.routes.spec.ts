import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AgeGateRoutingService } from './services/age-gate-routing.service';
import { AgeGateSessionService } from './services/age-gate-session.service';
import { routes } from './app.routes';

describe('app routes age-gate behavior', () => {
  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter(routes), AgeGateSessionService, AgeGateRoutingService],
    });
  });

  it('should register dedicated /age-gate and /access-denied routes', () => {
    expect(routes.some((route) => route.path === 'age-gate')).toBe(true);
    expect(routes.some((route) => route.path === 'food')).toBe(true);
    expect(routes.some((route) => route.path === 'beer')).toBe(true);
    expect(routes.some((route) => route.path === 'about')).toBe(true);
    expect(routes.some((route) => route.path === 'location')).toBe(true);
    expect(routes.some((route) => route.path === 'contact')).toBe(true);
    expect(routes.some((route) => route.path === 'access-denied')).toBe(true);
  });

  it('should configure /food as a lazy-loaded protected route', () => {
    const foodRoute = routes.find((route) => route.path === 'food');

    expect(foodRoute).toBeTruthy();
    expect(typeof foodRoute?.loadComponent).toBe('function');
    expect(foodRoute?.component).toBeUndefined();
    expect(Array.isArray(foodRoute?.canActivate)).toBe(true);
    expect(foodRoute?.canActivate?.length).toBeGreaterThan(0);
  });

  it('should configure /beer as a lazy-loaded protected route', () => {
    const beerRoute = routes.find((route) => route.path === 'beer');

    expect(beerRoute).toBeTruthy();
    expect(typeof beerRoute?.loadComponent).toBe('function');
    expect(beerRoute?.component).toBeUndefined();
    expect(Array.isArray(beerRoute?.canActivate)).toBe(true);
    expect(beerRoute?.canActivate?.length).toBeGreaterThan(0);
  });

  it('should configure /about as a lazy-loaded protected route', () => {
    const aboutRoute = routes.find((route) => route.path === 'about');

    expect(aboutRoute).toBeTruthy();
    expect(typeof aboutRoute?.loadComponent).toBe('function');
    expect(aboutRoute?.component).toBeUndefined();
    expect(Array.isArray(aboutRoute?.canActivate)).toBe(true);
    expect(aboutRoute?.canActivate?.length).toBeGreaterThan(0);
  });

  it('should configure /location as a lazy-loaded protected route', () => {
    const locationRoute = routes.find((route) => route.path === 'location');

    expect(locationRoute).toBeTruthy();
    expect(typeof locationRoute?.loadComponent).toBe('function');
    expect(locationRoute?.component).toBeUndefined();
    expect(Array.isArray(locationRoute?.canActivate)).toBe(true);
    expect(locationRoute?.canActivate?.length).toBeGreaterThan(0);
  });

  it('should configure /contact as a lazy-loaded protected route', () => {
    const contactRoute = routes.find((route) => route.path === 'contact');

    expect(contactRoute).toBeTruthy();
    expect(typeof contactRoute?.loadComponent).toBe('function');
    expect(contactRoute?.component).toBeUndefined();
    expect(Array.isArray(contactRoute?.canActivate)).toBe(true);
    expect(contactRoute?.canActivate?.length).toBeGreaterThan(0);
  });

  it('should configure /access-denied as a lazy-loaded route', () => {
    const accessDeniedRoute = routes.find((route) => route.path === 'access-denied');

    expect(accessDeniedRoute).toBeTruthy();
    expect(typeof accessDeniedRoute?.loadComponent).toBe('function');
    expect(accessDeniedRoute?.component).toBeUndefined();
  });

  it('should redirect unconfirmed entry to /age-gate and preserve destination', () => {
    const routing = TestBed.inject(AgeGateRoutingService);
    const session = TestBed.inject(AgeGateSessionService);

    const result = routing.resolveNavigation('/?source=deep-link');

    expect(result.allow).toBe(false);
    expect(result.redirectTo).toBe('/age-gate');
    expect(session.consumeRequestedDestination()).toBe('/?source=deep-link');
  });

  it('should enforce age-gate decisions through Angular route guards', async () => {
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    const session = TestBed.inject(AgeGateSessionService);

    await harness.navigateByUrl('/food?source=deep-link');
    expect(router.url).toBe('/age-gate');
    expect(session.getRequestedDestination()).toBe('/food?source=deep-link');

    session.setDecision('approved');
    await harness.navigateByUrl('/food');
    expect(router.url).toBe('/food');

    session.setDecision('denied');
    await harness.navigateByUrl('/beer');
    expect(router.url).toBe('/access-denied');
  });

  it('should block denied state from protected routes and allow /access-denied', () => {
    const routing = TestBed.inject(AgeGateRoutingService);
    const session = TestBed.inject(AgeGateSessionService);
    session.setDecision('denied');

    const blocked = routing.resolveNavigation('/');
    const blockedFood = routing.resolveNavigation('/food');
    const blockedBeer = routing.resolveNavigation('/beer');
    const blockedAbout = routing.resolveNavigation('/about');
    const blockedLocation = routing.resolveNavigation('/location');
    const blockedContact = routing.resolveNavigation('/contact');
    const allowed = routing.resolveNavigation('/access-denied');

    expect(blocked.allow).toBe(false);
    expect(blocked.redirectTo).toBe('/access-denied');
    expect(blockedFood.allow).toBe(false);
    expect(blockedFood.redirectTo).toBe('/access-denied');
    expect(blockedBeer.allow).toBe(false);
    expect(blockedBeer.redirectTo).toBe('/access-denied');
    expect(blockedAbout.allow).toBe(false);
    expect(blockedAbout.redirectTo).toBe('/access-denied');
    expect(blockedLocation.allow).toBe(false);
    expect(blockedLocation.redirectTo).toBe('/access-denied');
    expect(blockedContact.allow).toBe(false);
    expect(blockedContact.redirectTo).toBe('/access-denied');
    expect(allowed.allow).toBe(true);
  });

  it('should allow approved users to navigate to /food', () => {
    const routing = TestBed.inject(AgeGateRoutingService);
    const session = TestBed.inject(AgeGateSessionService);
    session.setDecision('approved');

    const decision = routing.resolveNavigation('/food');

    expect(decision.allow).toBe(true);
    expect(decision.redirectTo).toBeUndefined();
  });

  it('should allow approved users to navigate to /location', () => {
    const routing = TestBed.inject(AgeGateRoutingService);
    const session = TestBed.inject(AgeGateSessionService);
    session.setDecision('approved');

    const decision = routing.resolveNavigation('/location');

    expect(decision.allow).toBe(true);
    expect(decision.redirectTo).toBeUndefined();
  });

  it('should skip /age-gate after YES in same session and re-gate on new session', () => {
    const routing = TestBed.inject(AgeGateRoutingService);
    const session = TestBed.inject(AgeGateSessionService);
    session.setDecision('approved');

    const sameSession = routing.resolveNavigation('/age-gate');
    expect(sameSession.allow).toBe(false);
    expect(sameSession.redirectTo).toBe('/');

    session.clearDecision();
    const newSession = routing.resolveNavigation('/');
    expect(newSession.allow).toBe(false);
    expect(newSession.redirectTo).toBe('/age-gate');
  });

  it('should keep median route decision overhead under 50 ms', () => {
    const routing = TestBed.inject(AgeGateRoutingService);
    const session = TestBed.inject(AgeGateSessionService);
    session.setDecision('approved');

    const durations: number[] = [];
    for (let index = 0; index < 300; index += 1) {
      const start = performance.now();
      routing.resolveNavigation('/catalog?category=all');
      durations.push(performance.now() - start);
    }

    const sorted = [...durations].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
    expect(median < 50).toBe(true);
  });
});
