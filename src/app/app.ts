import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { routes as appRoutes } from './app.routes';
import { isHeaderVisible, normalizeAppPath } from './services/app-shell-policy';
import { formatClockTime, getCurrentTimeInShelbyvilleKy, getStoreState, StoreState } from './services/location-hours';

const CLOCK_TICK_MS = 30_000;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly currentPath = signal('/');
  readonly isHome = computed(() => this.currentPath() === '/');
  readonly isHeaderVisible = computed(() => isHeaderVisible(this.currentPath(), appRoutes));

  private readonly now = signal(new Date());
  
  readonly currentTime = computed(() => formatClockTime(this.now()));
  readonly storeState = computed<StoreState>(() => getStoreState());
  readonly storeStateStyle = computed<string>(() => getStoreState().toString().replace(' ', '-').toLowerCase());

  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.title.setTitle(environment.appTitle);
    this.currentPath.set(normalizeAppPath(this.router.url));
    this.initializeClock();
    this.initializeRouteListener();
  }

  closeApp(): void {
    this.router.navigate(['/']);
  }

  private initializeClock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const windowRef = this.document.defaultView;
    if (!windowRef) {
      return;
    }

    const intervalId = windowRef.setInterval(() => this.now.set(getCurrentTimeInShelbyvilleKy()), CLOCK_TICK_MS);
    this.destroyRef.onDestroy(() => windowRef.clearInterval(intervalId));
  }

  private initializeRouteListener(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.currentPath.set(normalizeAppPath(this.router.url)));
  }
}
