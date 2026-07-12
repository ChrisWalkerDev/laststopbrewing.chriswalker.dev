import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Captures unhandled errors from browser events and surfaces them in Angular's error handler
    provideBrowserGlobalErrorListeners(),
    // Opts into Angular's zoneless change detection (Angular 21 default — no zone.js required)
    provideZonelessChangeDetection(),
    // Registers the application route table (see app.routes.ts)
    provideRouter(routes),
  ],
};
