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
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { routes as appRoutes } from './app.routes';
import { isHeaderVisible, normalizeAppPath } from './services/app-shell-policy';
import { AgeGateSessionService } from './services/age-gate-session.service';

const CLOCK_TICK_MS = 30_000;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly currentPath = signal('/');
  private readonly ageGateSession = inject(AgeGateSessionService);
  readonly isAgeGateApproved = computed(() => this.ageGateSession.getDecision() === 'approved');
  readonly isHeaderVisible = computed(() => isHeaderVisible(this.currentPath(), appRoutes));
  
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.title.setTitle(environment.appTitle);
    this.currentPath.set(normalizeAppPath(this.router.url));
    this.initializeRouteListener();
  }

  closeApp(): void {
    this.router.navigate(['/']);
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
