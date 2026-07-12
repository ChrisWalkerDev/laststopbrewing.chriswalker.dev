import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AgeGateSessionService } from './age-gate-session.service';

describe('AgeGateSessionService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AgeGateSessionService],
    });
  });

  it('should default to unconfirmed when no stored decision exists', () => {
    const service = TestBed.inject(AgeGateSessionService);

    expect(service.getDecision()).toBe('unconfirmed');
  });

  it('should persist approved and denied decisions in sessionStorage', () => {
    const service = TestBed.inject(AgeGateSessionService);

    service.setDecision('approved');
    expect(service.getDecision()).toBe('approved');

    service.setDecision('denied');
    expect(service.getDecision()).toBe('denied');
  });

  it('should store and consume a same-origin requested destination', () => {
    const service = TestBed.inject(AgeGateSessionService);

    service.persistRequestedDestination('/products?source=campaign');

    expect(service.consumeRequestedDestination()).toBe('/products?source=campaign');
    expect(service.getRequestedDestination()).toBeNull();
  });

  it('should reject non-app destinations and fallback to root', () => {
    const service = TestBed.inject(AgeGateSessionService);

    service.persistRequestedDestination('https://example.org/phishing');

    expect(service.getRequestedDestination()).toBeNull();
    expect(service.consumeRequestedDestination()).toBe('/');
  });

  it('should not write decisions to localStorage', () => {
    const service = TestBed.inject(AgeGateSessionService);

    service.setDecision('approved');

    expect(localStorage.length).toBe(0);
  });

  it('should not write decisions to cookies', () => {
    const service = TestBed.inject(AgeGateSessionService);
    const cookieBefore = document.cookie;

    service.setDecision('approved');

    expect(document.cookie).toBe(cookieBefore);
  });

  it('should not send decision to server channels', () => {
    const service = TestBed.inject(AgeGateSessionService);
    const fetchSpy = vi.spyOn(window, 'fetch');

    service.setDecision('approved');

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
