import { TestBed } from '@angular/core/testing';
import { axe } from 'vitest-axe';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();
  });

  it('should create the about page scaffold', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render five sections in the expected order', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const titles = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.about-page__section-title'
      ) as NodeListOf<HTMLElement>
    ).map((element) => element.textContent?.trim());

    expect(titles).toEqual(['The Brewery', 'Jon', 'Mike', 'Hunter', 'Hunter']);
  });

  it('should render expected role subtitles for each section', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const subtitles = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.about-page__section-subtitle'
      ) as NodeListOf<HTMLElement>
    ).map((element) => element.textContent?.trim());

    expect(subtitles).toEqual(['About the brewery', 'Owner', 'Owner', 'Owner', 'Brewer']);
  });

  it('should render one section image per section with non-empty alt text', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const images = Array.from(
      fixture.nativeElement.querySelectorAll('.about-page__image') as NodeListOf<HTMLImageElement>
    );

    expect(images.length).toBe(5);
    expect(images.every((image) => image.alt.trim().length > 0)).toBe(true);
    expect(images[0].getAttribute('src')).toContain('assets/about/brewery-20260701.png');
    expect(images[1].getAttribute('src')).toContain('assets/about/jon-owner-20260701.png');
  });

  it('should place image markup before text markup in each section for mobile-first flow', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const sections = Array.from(
      fixture.nativeElement.querySelectorAll('.about-page__section') as NodeListOf<HTMLElement>
    );

    expect(
      sections.every((section) => {
        const firstChildClass = section.firstElementChild?.className ?? '';
        const mediaWithinWrapperClass =
          section.firstElementChild?.firstElementChild?.className ?? '';

        return (
          String(firstChildClass).includes('about-page__section-inner') &&
          String(mediaWithinWrapperClass).includes('about-page__media')
        );
      })
    ).toBe(true);
  });

  it('should expose semantic section landmarks for screen readers', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const rootSection = fixture.nativeElement.querySelector('.about-page') as HTMLElement | null;
    const sectionItems = fixture.nativeElement.querySelectorAll(
      '.about-page__section'
    ) as NodeListOf<HTMLElement>;

    expect(rootSection).toBeTruthy();
    expect(rootSection?.getAttribute('aria-labelledby')).toBe('about-page-heading');
    expect(sectionItems.length).toBe(5);
    expect(
      Array.from(sectionItems).every((item) =>
        item.getAttribute('aria-labelledby')?.startsWith('about-section-title-')
      )
    ).toBe(true);
  });

  it('should include smooth scrolling and full-screen section styles', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const stylesText = Array.from(document.querySelectorAll('style'))
      .map((styleTag) => styleTag.textContent ?? '')
      .join('\n');

    expect(stylesText).toContain('scroll-behavior: smooth');
    expect(stylesText).toContain('min-height: calc(100dvh - var(--header-height))');
  });

  it('should have no axe accessibility violations (WCAG 2.1 AA)', async () => {
    const fixture = TestBed.createComponent(AboutComponent);
    await fixture.whenStable();
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toHaveLength(0);
  });
});
