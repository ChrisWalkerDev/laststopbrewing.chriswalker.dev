import { TestBed } from '@angular/core/testing';
import { axe } from 'vitest-axe';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should expose the brewery title in the page title signal', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component['pageTitle']()).toBe('Last Stop Brewing');
  });

  it('should render a hero heading and primary call-to-action links', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent?.trim()).toContain('Last Stop Brewing');
    expect(compiled.querySelectorAll('a').length).toBeGreaterThanOrEqual(2);
  });

  it('should render a decorative scroll cue below the hero', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const scrollCues = fixture.nativeElement.querySelectorAll(
      '.home-page__scroll-cue'
    ) as NodeListOf<HTMLElement>;

    expect(scrollCues).toHaveLength(1);
    expect(scrollCues[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('should render multiple full-view sections for the brewery experience', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('section.home-page__section').length).toBeGreaterThanOrEqual(
      3
    );
  });

  it('should size sections to the viewport below the fixed header', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const stylesText = Array.from(document.querySelectorAll('style'))
      .map((styleTag) => styleTag.textContent ?? '')
      .join('\n');

    expect(stylesText).toContain('min-height: calc(100dvh - var(--header-height))');
  });

  it('should start the first post-hero gradient dark at the bottom left', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const stylesText = Array.from(document.querySelectorAll('style'))
      .map((styleTag) => styleTag.textContent ?? '')
      .join('\n')
      .replace(/\s+/g, '');

    expect(stylesText).toContain('linear-gradient(45deg,#111111,var(--color-primary))');
  });

  it('should keep all sections visible while prioritizing the Monday beer section on Monday dates', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    const mondaySections = component['getVisibleSections'](new Date('2026-08-31T12:00:00'));

    expect(mondaySections.some((section) => section.id === 'beer')).toBe(true);
    expect(mondaySections.some((section) => section.id === 'live-music')).toBe(true);
    expect(mondaySections[0]?.id).toBe('beer');
  });

  it('should prioritize the live music section for Thursday through Saturday dates', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    const thursdaySections = component['getVisibleSections'](new Date('2026-09-03T12:00:00'));
    const fridaySections = component['getVisibleSections'](new Date('2026-09-04T12:00:00'));
    const saturdaySections = component['getVisibleSections'](new Date('2026-09-05T12:00:00'));

    expect(thursdaySections[0]?.id).toBe('live-music');
    expect(fridaySections[0]?.id).toBe('live-music');
    expect(saturdaySections[0]?.id).toBe('live-music');
  });

  it('should support a configurable day-based section ordering map', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    component['sectionOrderByDay'].set({
      monday: ['section1', 'section2'],
      tuesday: ['section2', 'section1'],
    });

    expect(component['sectionOrderByDay']().monday).toEqual(['section1', 'section2']);
    expect(component['sectionOrderByDay']().tuesday).toEqual(['section2', 'section1']);
  });

  it('should have no axe accessibility violations (WCAG 2.1 AA)', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toHaveLength(0);
  });
});
