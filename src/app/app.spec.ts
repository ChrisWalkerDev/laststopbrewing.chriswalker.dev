import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
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

  it('should render the phone status bar, main content, and dock landmarks', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header.phone-status-bar')).toBeTruthy();
    expect(compiled.querySelector('main#main-content')).toBeTruthy();
    expect(compiled.querySelector('footer.phone-dock')).toBeTruthy();
  });

  it('should display the current time and store open status in the status bar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const time = compiled.querySelector('.phone-status-bar__time');
    const status = compiled.querySelector('.phone-status-bar__store-status');

    expect(time?.textContent?.trim()).toMatch(/^\d{1,2}:\d{2}\s?(AM|PM)$/i);
    expect(status?.textContent?.trim()).toMatch(/^(Open|Closing Soon|Opening Soon|Closed)$/);
  });

  it('should contain skip-link with href="#main-content"', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const skipLink = compiled.querySelector('.skip-link') as HTMLAnchorElement;
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('should only show the Home dock button when on the home screen', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const dockButtons = Array.from(compiled.querySelectorAll('.phone-dock__button'));
    expect(dockButtons.length).toBe(1);
    expect(dockButtons[0].textContent?.trim()).toBe('Home');
  });

  it('should show a Close button when not on the home screen and navigate home when clicked', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    component.currentPath.set('/food');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector(
      '.phone-dock__button--close'
    ) as HTMLButtonElement | null;
    expect(closeButton).toBeTruthy();
    expect(closeButton?.textContent?.trim()).toBe('Close');

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    closeButton?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should hide the phone chrome on age-gate and access-denied routes', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    component.currentPath.set('/age-gate');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('header.phone-status-bar')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('footer.phone-dock')).toBeFalsy();

    component.currentPath.set('/access-denied');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('header.phone-status-bar')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('footer.phone-dock')).toBeFalsy();
  });
});
