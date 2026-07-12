import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AgeGateComponent } from './age-gate.component';
import { AgeGateSessionService } from '../../app/services/age-gate-session.service';
import { ACCESS_DENIED_ROUTE } from '../../app/services/age-gate.types';

describe('AgeGateComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AgeGateComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render exact prompt and YES/NO controls', async () => {
    const fixture = TestBed.createComponent(AgeGateComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Are you 21 or older?');
    expect(element.querySelector('button')?.textContent?.trim()).toBe('YES');
    expect(element.querySelectorAll('button')[1]?.textContent?.trim()).toBe('NO');
  });

  it('should set approved decision and restore destination on YES', () => {
    const fixture = TestBed.createComponent(AgeGateComponent);
    const router = TestBed.inject(Router);
    const session = TestBed.inject(AgeGateSessionService);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    session.persistRequestedDestination('/?from=age-gate');

    fixture.componentInstance['approveAccess']();

    expect(session.getDecision()).toBe('approved');
    expect(navigateSpy).toHaveBeenCalledWith('/?from=age-gate');
  });

  it('should set denied decision and navigate to /access-denied on NO', () => {
    const fixture = TestBed.createComponent(AgeGateComponent);
    const router = TestBed.inject(Router);
    const session = TestBed.inject(AgeGateSessionService);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentInstance['denyAccess']();

    expect(session.getDecision()).toBe('denied');
    expect(navigateSpy).toHaveBeenCalledWith(ACCESS_DENIED_ROUTE);
  });
});
