import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  BEER_EMBED_FALLBACK_TIMEOUT_MS,
  BEER_EMBED_SRC,
  BEER_EMBED_TITLE,
  BEER_FALLBACK_LINK_LABEL,
  BEER_FALLBACK_TEXT,
} from './beer.constants';

@Component({
  selector: 'app-beer',
  templateUrl: './beer.component.html',
  styleUrl: './beer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeerComponent {
  protected readonly embedSrc: SafeResourceUrl;
  protected readonly embedTitle = BEER_EMBED_TITLE;
  protected readonly fallbackText = BEER_FALLBACK_TEXT;
  protected readonly fallbackLinkLabel = BEER_FALLBACK_LINK_LABEL;

  protected readonly showFallback = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  private fallbackTimerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.embedSrc = this.sanitizer.bypassSecurityTrustResourceUrl(BEER_EMBED_SRC);

    afterNextRender(() => {
      this.fallbackTimerId = setTimeout(() => {
        this.showFallback.set(true);
      }, BEER_EMBED_FALLBACK_TIMEOUT_MS);
    });

    this.destroyRef.onDestroy(() => {
      if (this.fallbackTimerId) {
        clearTimeout(this.fallbackTimerId);
      }
    });
  }

  protected onIframeLoad(): void {
    if (this.fallbackTimerId) {
      clearTimeout(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }

    this.showFallback.set(false);
  }

  protected onIframeError(): void {
    if (this.fallbackTimerId) {
      clearTimeout(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }

    this.showFallback.set(true);
  }
}
