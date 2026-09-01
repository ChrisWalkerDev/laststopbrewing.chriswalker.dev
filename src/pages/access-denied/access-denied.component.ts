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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgeGateSessionService } from '../../app/services/age-gate-session.service';

@Component({
  selector: 'app-access-denied',
  imports: [ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {
  private readonly router = inject(Router);
  private readonly session = inject(AgeGateSessionService);
  private readonly headingElement = viewChild<ElementRef<HTMLHeadingElement>>(
    'accessDeniedHeadingElement'
  );

  protected readonly dobControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly statusMessage = signal('');
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

  protected submitDateOfBirth(event: SubmitEvent): void {
    event.preventDefault();
    this.verifyDateOfBirth();
  }

  protected verifyDateOfBirth(): void {
    if (this.dobControl.invalid) {
      this.dobControl.markAsTouched();
      this.session.setDecision('denied');
      this.statusMessage.set('Please enter your date of birth to continue.');
      return;
    }

    const submittedDob = this.dobControl.value;
    const today = new Date();
    if (!this.isValidPastOrPresentDate(submittedDob, today)) {
      this.dobControl.markAsTouched();
      this.session.setDecision('denied');
      this.statusMessage.set('Please enter a valid date of birth that is not in the future.');
      return;
    }

    const isEligible = this.isAtLeastTwentyOne(submittedDob, today);

    if (isEligible) {
      this.session.setDecision('approved');
      this.statusMessage.set('');

      // Remove DOB from component state immediately after successful evaluation.
      this.dobControl.reset('', { emitEvent: false });

      const destination = this.session.consumeRequestedDestination();
      void this.router.navigateByUrl(destination);
      return;
    }

    this.session.setDecision('denied');
    this.statusMessage.set('Access remains denied. You must be 21 or older.');
  }

  private isAtLeastTwentyOne(dobIso: string, today: Date): boolean {
    const dob = this.parseIsoDate(dobIso);
    if (!dob || dob > today) {
      return false;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const monthDelta = today.getMonth() - dob.getMonth();
    const beforeBirthday = monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate());

    if (beforeBirthday) {
      age -= 1;
    }

    return age >= 21;
  }

  private isValidPastOrPresentDate(dobIso: string, today: Date): boolean {
    const dob = this.parseIsoDate(dobIso);
    return !!dob && dob <= today;
  }

  private parseIsoDate(dobIso: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobIso);
    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(`${dobIso}T00:00:00`);

    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  private syncBrandIconWidth(): void {
    const headingWidth = this.headingElement()?.nativeElement.getBoundingClientRect().width;
    if (!headingWidth || headingWidth <= 0) {
      return;
    }

    this.brandIconWidthPx.set(Math.round(headingWidth / 2));
  }
}
