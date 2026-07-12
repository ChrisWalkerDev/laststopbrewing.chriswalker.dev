import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AgeGateSessionService } from '../../app/services/age-gate-session.service';
import { ACCESS_DENIED_ROUTE, AGE_GATE_PROMPT } from '../../app/services/age-gate.types';

@Component({
  selector: 'app-age-gate',
  imports: [NgOptimizedImage],
  templateUrl: './age-gate.component.html',
  styleUrl: './age-gate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeGateComponent {
  private readonly router = inject(Router);
  private readonly session = inject(AgeGateSessionService);
  private readonly headingElement =
    viewChild<ElementRef<HTMLHeadingElement>>('ageGateHeadingElement');

  protected readonly promptText = signal(AGE_GATE_PROMPT);
  protected readonly brandIconWidthPx = signal(64);

  constructor() {
    afterNextRender(() => {
      this.syncBrandIconWidth();
    });
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    this.syncBrandIconWidth();
  }

  protected approveAccess(): void {
    this.session.setDecision('approved');
    const destination = this.session.consumeRequestedDestination();
    void this.router.navigateByUrl(destination);
  }

  protected denyAccess(): void {
    this.session.setDecision('denied');
    void this.router.navigateByUrl(ACCESS_DENIED_ROUTE);
  }

  private syncBrandIconWidth(): void {
    const headingWidth = this.headingElement()?.nativeElement.getBoundingClientRect().width;
    if (!headingWidth || headingWidth <= 0) {
      return;
    }

    this.brandIconWidthPx.set(Math.round(headingWidth / 2));
  }
}
