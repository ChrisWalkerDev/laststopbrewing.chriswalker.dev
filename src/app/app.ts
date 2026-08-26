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
import {
  getOverlayFocusableElements,
  getPrefersReducedMotionQuery,
  getViewportWidth,
  isHeaderVisible,
  normalizeAppPath,
} from './services/app-shell-policy';

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

  private previouslyFocusedElement: HTMLElement | null = null;

  readonly isMenuOpen = signal(false);
  readonly isDesktop = signal(
    getViewportWidth(typeof window !== 'undefined' ? window : null) >= DESKTOP_MIN_WIDTH
  );
  readonly prefersReducedMotion = signal(
    getPrefersReducedMotionQuery(typeof window !== 'undefined' ? window : null)
  );
  readonly currentPath = signal('/');

  readonly headerLinks = computed<HeaderNavLink[]>(() => PRIMARY_HEADER_LINKS);
  readonly isHeaderVisible = computed(() =>
    isHeaderVisible(this.currentPath(), this.excludedRoutes)
  );

  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  private removeResizeListener: (() => void) | undefined;
  private removeReducedMotionListener: (() => void) | undefined;

  constructor() {
    this.title.setTitle(environment.appTitle);
    this.currentPath.set(normalizeAppPath(this.router.url));
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
      this.restoreFocus();
      return;
    }

    queueMicrotask(() => this.restoreFocus());
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
    this.previouslyFocusedElement =
      this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
    this.isMenuOpen.set(true);

    queueMicrotask(() => this.focusFirstOverlayElement());
  }

  private initializeViewportListener(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const onResize = () => {
      const desktop =
        getViewportWidth(typeof window !== 'undefined' ? window : null) >= DESKTOP_MIN_WIDTH;
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
        this.currentPath.set(normalizeAppPath(this.router.url));

        if (this.isMenuOpen()) {
          this.closeMobileMenu('route');
        }
      });
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

  private restoreFocus(): void {
    const fallbackToggle = this.document.getElementById(
      this.mobileMenuToggleId
    ) as HTMLElement | null;
    const target = this.previouslyFocusedElement ?? fallbackToggle;

    target?.focus();
    this.previouslyFocusedElement = null;
  }

  private getOverlayFocusableElements(): HTMLElement[] {
    return getOverlayFocusableElements(this.document, this.mobileMenuId);
  }
}
