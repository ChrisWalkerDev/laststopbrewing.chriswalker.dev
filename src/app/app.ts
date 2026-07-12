import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import {
  DESKTOP_MIN_WIDTH,
  EXCLUDED_HEADER_ROUTES,
  HEADER_OVERLAY_ID,
  HEADER_TOGGLE_ID,
  MOBILE_BREAKPOINT_PX,
  PRIMARY_HEADER_LINKS,
} from './header.constants';
import { HeaderNavLink } from './header-nav-link.model';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly mobileBreakpoint = MOBILE_BREAKPOINT_PX;
  readonly mobileMenuId = HEADER_OVERLAY_ID;
  readonly mobileMenuToggleId = HEADER_TOGGLE_ID;
  readonly excludedRoutes = EXCLUDED_HEADER_ROUTES;

  readonly isMenuOpen = signal(false);
  readonly isDesktop = signal(this.getViewportWidth() >= DESKTOP_MIN_WIDTH);
  readonly prefersReducedMotion = signal(this.prefersReducedMotionQuery());
  readonly currentPath = signal('/');

  readonly headerLinks = computed<HeaderNavLink[]>(() => PRIMARY_HEADER_LINKS);
  readonly isHeaderVisible = computed(
    () => !this.excludedRoutes.includes(this.currentPath() as (typeof this.excludedRoutes)[number])
  );

  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  private removeResizeListener: (() => void) | undefined;
  private removeReducedMotionListener: (() => void) | undefined;

  constructor() {
    this.title.setTitle(environment.appTitle);
    this.currentPath.set(this.normalizePath(this.router.url));
    this.initializeViewportListener();
    this.initializeReducedMotionListener();
    this.initializeRouteCloseListener();
    this.destroyRef.onDestroy(() => {
      this.removeResizeListener?.();
      this.removeReducedMotionListener?.();
    });
  }

  toggleMobileMenu(): void {
    if (this.isMenuOpen()) {
      this.closeMobileMenu('toggle');
      return;
    }

    if (this.isDesktop()) {
      return;
    }

    this.openMobileMenu();
  }

  closeMobileMenu(source: 'toggle' | 'route' | 'resize' | 'escape' | 'backdrop'): void {
    if (!this.isMenuOpen()) {
      return;
    }

    this.isMenuOpen.set(false);

    if (source !== 'route' && source !== 'resize') {
      this.restoreToggleFocus();
      return;
    }

    queueMicrotask(() => this.restoreToggleFocus());
  }

  onOverlayBackdropClick(event: MouseEvent): void {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (!event.target.classList.contains('app-mobile-overlay')) {
      return;
    }

    this.closeMobileMenu('backdrop');
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMobileMenu('escape');
      return;
    }

    if (event.key === 'Tab') {
      this.trapOverlayFocus(event);
    }
  }

  onMobileRouteSelected(): void {
    this.closeMobileMenu('route');
  }

  private openMobileMenu(): void {
    this.isMenuOpen.set(true);

    queueMicrotask(() => this.focusFirstOverlayElement());
  }

  private initializeViewportListener(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const onResize = () => {
      const desktop = this.getViewportWidth() >= DESKTOP_MIN_WIDTH;
      const wasDesktop = this.isDesktop();

      this.isDesktop.set(desktop);

      if (desktop && !wasDesktop && this.isMenuOpen()) {
        this.closeMobileMenu('resize');
      }
    };

    window.addEventListener('resize', onResize);
    this.removeResizeListener = () => window.removeEventListener('resize', onResize);
  }

  private initializeReducedMotionListener(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => this.prefersReducedMotion.set(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange);
      this.removeReducedMotionListener = () => mediaQuery.removeEventListener('change', onChange);
      return;
    }

    mediaQuery.addListener(onChange);
    this.removeReducedMotionListener = () => mediaQuery.removeListener(onChange);
  }

  private initializeRouteCloseListener(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.currentPath.set(this.normalizePath(this.router.url));

        if (this.isMenuOpen()) {
          this.closeMobileMenu('route');
        }
      });
  }

  private normalizePath(url: string): string {
    const withoutQuery = url.split('?')[0] ?? '/';
    const withoutFragment = withoutQuery.split('#')[0] ?? '/';

    return withoutFragment.length === 0 ? '/' : withoutFragment;
  }

  private trapOverlayFocus(event: KeyboardEvent): void {
    const focusableElements = this.getOverlayFocusableElements();

    if (focusableElements.length === 0) {
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (activeElement === first || !activeElement) {
        event.preventDefault();
        last.focus();
      }

      return;
    }

    if (activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusFirstOverlayElement(): void {
    const focusableElements = this.getOverlayFocusableElements();
    if (focusableElements.length === 0) {
      return;
    }

    focusableElements[0].focus();
  }

  private restoreToggleFocus(): void {
    const toggle = this.document.getElementById(this.mobileMenuToggleId) as HTMLElement | null;
    toggle?.focus();
  }

  private getOverlayFocusableElements(): HTMLElement[] {
    const overlay = this.document.getElementById(this.mobileMenuId);
    if (!overlay) {
      return [];
    }

    const selector = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
    ].join(', ');

    return Array.from(overlay.querySelectorAll<HTMLElement>(selector));
  }

  private getViewportWidth(): number {
    if (typeof window === 'undefined') {
      return DESKTOP_MIN_WIDTH;
    }

    return window.innerWidth;
  }

  private prefersReducedMotionQuery(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
