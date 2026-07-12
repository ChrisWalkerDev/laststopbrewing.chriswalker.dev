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

  it('should have pageTitle signal with default value "Welcome"', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component['pageTitle']()).toBe('Welcome');
  });

  it('should render <h1> with text "Welcome"', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Welcome');
  });

  it('should render section container used for route layout sizing contract', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section')).toBeTruthy();
  });

  it('should have no axe accessibility violations (WCAG 2.1 AA)', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toHaveLength(0);
  });
});
