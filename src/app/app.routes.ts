import { Routes } from '@angular/router';
import { AgeGateComponent } from './components/age-gate/age-gate.component';
import { AgeGuard } from './guards/age.guard';

export const routes: Routes = [
    { path: 'age-gate', component: AgeGateComponent },
    { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), canActivate: [AgeGuard]},
    { path: 'beers', loadComponent: () => import('./components/beers/beers').then(m => m.Beers), canActivate: [AgeGuard]},
    { path: 'food', loadComponent: () => import('./components/food/food').then(m => m.Food), canActivate: [AgeGuard]},
    { path: 'events', loadComponent: () => import('./components/events/events').then(m => m.Events), canActivate: [AgeGuard]},
    { path: 'about', loadComponent: () => import('./components/about/about').then(m => m.About), canActivate: [AgeGuard]},
    { path: 'contact', loadComponent: () => import('./components/contact/contact').then(m => m.Contact), canActivate: [AgeGuard]},
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
