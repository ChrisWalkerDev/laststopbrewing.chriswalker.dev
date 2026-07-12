import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AccessDeniedComponent } from './access-denied.component';
import { AgeGateSessionService } from '../../app/services/age-gate-session.service';

describe('AccessDeniedComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AccessDeniedComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create and show Access Denied heading', async () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Access Denied (21+)');
  });

  it('should approve and restore destination when DOB is 21+', () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);
    const router = TestBed.inject(Router);
    const session = TestBed.inject(AgeGateSessionService);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    session.persistRequestedDestination('/?from=denied');
    fixture.componentInstance['dobControl'].setValue('1990-01-01');

    fixture.componentInstance['verifyDateOfBirth']();

    expect(session.getDecision()).toBe('approved');
    expect(navigateSpy).toHaveBeenCalledWith('/?from=denied');
  });

  it('should keep denied decision when DOB is under 21', () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);
    const session = TestBed.inject(AgeGateSessionService);
    const today = new Date();
    const under21Dob = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    const dobIso = under21Dob.toISOString().slice(0, 10);

    fixture.componentInstance['dobControl'].setValue(dobIso);
    fixture.componentInstance['verifyDateOfBirth']();

    expect(session.getDecision()).toBe('denied');
    expect(fixture.componentInstance['dobControl'].value).toBe(dobIso);
    expect(fixture.componentInstance['statusMessage']()).toContain('Access remains denied');
  });

  it('should show validation error when DOB is invalid', () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);
    const session = TestBed.inject(AgeGateSessionService);

    fixture.componentInstance['dobControl'].setValue('not-a-date');
    fixture.componentInstance['verifyDateOfBirth']();

    expect(session.getDecision()).toBe('denied');
    expect(fixture.componentInstance['statusMessage']()).toContain(
      'Please enter a valid date of birth that is not in the future.'
    );
  });

  it('should show validation error when DOB is in the future', () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);
    const session = TestBed.inject(AgeGateSessionService);
    const futureYear = new Date().getFullYear() + 1;

    fixture.componentInstance['dobControl'].setValue(`${futureYear}-01-01`);
    fixture.componentInstance['verifyDateOfBirth']();

    expect(session.getDecision()).toBe('denied');
    expect(fixture.componentInstance['dobControl'].value).toBe(`${futureYear}-01-01`);
    expect(fixture.componentInstance['statusMessage']()).toContain(
      'Please enter a valid date of birth that is not in the future.'
    );
  });

  it('should prevent native submit and run DOB verification', () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);
    const verifySpy = vi.spyOn(fixture.componentInstance as never, 'verifyDateOfBirth' as never);
    const event = new SubmitEvent('submit', { cancelable: true });

    fixture.componentInstance['submitDateOfBirth'](event);

    expect(event.defaultPrevented).toBe(true);
    expect(verifySpy).toHaveBeenCalledTimes(1);
  });
});
