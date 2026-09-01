import { TestBed } from '@angular/core/testing';
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

  it('uses a compact two-column desktop form layout', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();

    const stylesText = Array.from(document.querySelectorAll('style'))
      .map((styleTag) => styleTag.textContent ?? '')
      .join('\n')
      .replace(/\s+/g, '');

    expect(stylesText).toContain('grid-template-columns:repeat(2,minmax(0,1fr))');
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

  it('shows a confirmation after a valid mock submission', () => {
    const fixture = TestBed.createComponent(ContactComponent);
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
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.contact-page__confirmation')?.textContent
    ).toContain('Your message has been received.');
  });
});
