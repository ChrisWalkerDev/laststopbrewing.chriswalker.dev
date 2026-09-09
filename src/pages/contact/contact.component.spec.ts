import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();
  });

  it('renders the contact details and required form fields', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement | null;
    const requiredFields = fixture.nativeElement.querySelectorAll('[required]');
    const phoneLink = fixture.nativeElement.querySelector(
      '.contact-page__phone-link'
    ) as HTMLAnchorElement | null;

    expect(fixture.nativeElement.querySelector('h1')?.textContent?.trim()).toBe('Contact Us');
    expect(form).toBeTruthy();
    expect(requiredFields.length).toBe(4);
    expect(phoneLink?.getAttribute('href')).toBe('tel:+15024370024');
  });

  it('uses a stacked single-column form layout', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();

    const stylesText = Array.from(document.querySelectorAll('style'))
      .map((styleTag) => styleTag.textContent ?? '')
      .join('\n')
      .replace(/\s+/g, '');

    expect(stylesText).toContain('grid-template-columns:1fr');
    expect(stylesText).toContain('grid-column:1/-1');
    expect(stylesText).toContain('min-height:6rem');
  });

  it('shows validation messages when submitted without required fields', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.contact-page__error').length).toBe(4);
    expect(fixture.nativeElement.querySelector('.contact-page__confirmation')).toBeNull();
  });

  it('posts a valid submission to the email-service worker', async () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    fixture.componentInstance.contactForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '',
      message: 'Hello!',
    });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://email-service.chriswalker.dev/',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: window.location.origin,
        }),
        body: JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          phone: '',
          message: 'Hello!',
        }),
      })
    );
    expect(
      fixture.nativeElement.querySelector('.contact-page__confirmation')?.textContent
    ).toContain('Your message has been received.');
  });
});
