import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly submitted = signal(false);
  protected readonly submitError = signal<string | null>(null);

  private readonly emailServiceUrl = 'https://email-service.chriswalker.dev/';

  readonly contactForm = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected async submit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const payload = this.contactForm.getRawValue();
    this.submitError.set(null);
    this.submitted.set(false);

    try {
      const response = await fetch(this.emailServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: window.location.origin,
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || result.success !== true) {
        throw new Error(result.error ?? 'Unable to send your message right now.');
      }

      this.contactForm.reset();
      this.submitted.set(true);
    } catch (error) {
      this.submitError.set(
        error instanceof Error ? error.message : 'Unable to send your message right now.'
      );
    }
  }
}
