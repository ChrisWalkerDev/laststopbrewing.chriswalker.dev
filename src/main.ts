import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AgeGateComponent } from './app/core/age-gate/age-gate.component';
import { AgeGuard } from './app/guards/age.guard';

const routes: Routes = [
    { path: 'age-gate', component: AgeGateComponent },
    { path: '', loadComponent: () => import('./app/features/home/home.component').then(m => m.HomeComponent), canActivate: [AgeGuard]},
    { path: 'beers', loadComponent: () => import('./app/features/beers/beers').then(m => m.Beers), canActivate: [AgeGuard]},
    { path: 'food', loadComponent: () => import('./app/features/food/food').then(m => m.Food), canActivate: [AgeGuard]},
    { path: 'events', loadComponent: () => import('./app/features/events/events').then(m => m.Events), canActivate: [AgeGuard]},
    { path: 'about', loadComponent: () => import('./app/features/about/about').then(m => m.About), canActivate: [AgeGuard]},
    { path: 'contact', loadComponent: () => import('./app/features/contact/contact').then(m => m.Contact), canActivate: [AgeGuard]},
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations()
  ]
};

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
