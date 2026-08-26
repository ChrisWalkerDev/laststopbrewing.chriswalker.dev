import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { environment } from '../environments/environment';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set document title from environment.appTitle', () => {
    TestBed.createComponent(App);
    const title = TestBed.inject(Title);
    expect(title.getTitle()).toBe(environment.appTitle);
  });

  it('should render sticky-shell landmarks', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header.app-header')).toBeTruthy();
    expect(compiled.querySelector('main#main-content')).toBeTruthy();
  });

  it('should preserve 80x80 brand image dimensions in header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const brandImage = fixture.nativeElement.querySelector(
      '.app-brand img'
    ) as HTMLImageElement | null;
    expect(brandImage).toBeTruthy();
    expect(brandImage?.getAttribute('width')).toBe('80');
    expect(brandImage?.getAttribute('height')).toBe('80');
  });

  it('should not include Beer-only overflow workaround in global styles', () => {
    const stylesText = Array.from(document.querySelectorAll('style'))
      .map((styleTag) => styleTag.textContent ?? '')
      .join('\n');

    expect(stylesText).not.toContain(':has(app-beer)');
  });

  it('should contain skip-link with href="#main-content"', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const skipLink = compiled.querySelector('.skip-link') as HTMLAnchorElement;
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('should render only primary desktop header links', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    expect(component.isHeaderVisible()).toBe(true);

    const desktopLinks = Array.from(
      fixture.nativeElement.querySelectorAll('.app-desktop-nav a')
    ) as HTMLAnchorElement[];

    expect(desktopLinks.length).toBe(5);
    expect(desktopLinks[0].textContent?.trim()).toBe('Home');
    expect(desktopLinks[1].textContent?.trim()).toBe('Food');
    expect(desktopLinks[2].textContent?.trim()).toBe('Beer');
    expect(desktopLinks[3].textContent?.trim()).toBe('Location');
    expect(desktopLinks[4].textContent?.trim()).toBe('About');
  });

  it('should hide header on age-gate and access-denied routes', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    component.currentPath.set('/age-gate');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('header.app-header')).toBeFalsy();

    component.currentPath.set('/access-denied');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('header.app-header')).toBeFalsy();
  });

  it('should open and close mobile menu with toggle button', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    component.isDesktop.set(false);

    fixture.detectChanges();
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector('.app-mobile-toggle') as HTMLButtonElement;
    expect(toggle).toBeTruthy();

    toggle.click();
    fixture.detectChanges();
    expect(component.isMenuOpen()).toBeTruthy();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    fixture.detectChanges();
    expect(component.isMenuOpen()).toBeFalsy();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should close overlay on Escape and restore focus to toggle', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    component.isDesktop.set(false);

    fixture.detectChanges();
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector('.app-mobile-toggle') as HTMLButtonElement;
    toggle.focus();
    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.app-mobile-overlay') as HTMLElement;
    expect(overlay).toBeTruthy();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    overlay.dispatchEvent(event);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isMenuOpen()).toBeFalsy();
    expect(document.activeElement).toBe(toggle);
  });

  it('should close overlay on backdrop click', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    component.isDesktop.set(false);

    fixture.detectChanges();
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector('.app-mobile-toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.app-mobile-overlay') as HTMLElement;
    overlay.click();
    fixture.detectChanges();

    expect(component.isMenuOpen()).toBeFalsy();
  });

  it('should expose reduced-motion class when preference is enabled', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    component.prefersReducedMotion.set(true);

    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.debugElement.query(By.css('.app-header'));
    expect(header.nativeElement.classList.contains('reduced-motion')).toBeTruthy();
  });
});
