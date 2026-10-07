import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeSceneService } from '../../app/core/three/home-scene.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  const homeScene = {
    attach: vi.fn().mockResolvedValue(undefined),
    detach: vi.fn(),
    error: signal<string | null>(null),
  };

  beforeEach(async () => {
    homeScene.attach.mockClear();
    homeScene.detach.mockClear();
    homeScene.error.set(null);
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), { provide: HomeSceneService, useValue: homeScene }],
    }).compileComponents();
  });

  it('attaches the scene container and detaches when the component is destroyed', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    expect(homeScene.attach).toHaveBeenCalledOnce();
    expect(homeScene.attach.mock.calls[0][0]).toBe(
      fixture.nativeElement.querySelector('.home-page__scene')
    );

    fixture.destroy();
    expect(homeScene.detach).toHaveBeenCalledOnce();
  });

  it('hides the fallback navigation when there is no scene error', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.home-page__navigation')).toBeNull();
    expect(fixture.nativeElement.querySelector('.home-page__error')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.home-page__scene')?.getAttribute('aria-hidden')
    ).toBe('true');
  });

  it('shows keyboard-accessible fallback navigation only when the scene has an error', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    homeScene.error.set('The 3D home scene could not be loaded.');
    fixture.detectChanges();

    const links = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.home-page__navigation a'
      ) as NodeListOf<HTMLAnchorElement>
    );
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/beer',
      '/food',
      '/about',
      '/location',
      '/contact',
    ]);
    expect(fixture.nativeElement.querySelector('.home-page__error')?.textContent).toContain(
      'could not be loaded'
    );
    expect(
      fixture.nativeElement.querySelector('.home-page__scene')?.getAttribute('aria-hidden')
    ).toBe('true');
  });
});
