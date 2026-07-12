import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AgeGateComponent } from '../pages/age-gate/age-gate.component';
import { HomeComponent } from '../pages/home/home.component';
import { AgeGateRoutingService } from './services/age-gate-routing.service';

const ageGateInterceptor: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const routing = inject(AgeGateRoutingService);
  const decision = routing.resolveNavigation(state.url);

  if (decision.allow) {
    return true;
  }

  return router.parseUrl(decision.redirectTo ?? '/age-gate');
};

export const routes: Routes = [
  { path: 'age-gate', component: AgeGateComponent, canActivate: [ageGateInterceptor] },
  {
    path: 'food',
    loadComponent: () => import('../pages/food').then((module) => module.FoodComponent),
    canActivate: [ageGateInterceptor],
  },
  {
    path: 'beer',
    loadComponent: () =>
      import('../pages/beer/beer.component').then((module) => module.BeerComponent),
    canActivate: [ageGateInterceptor],
  },
  {
    path: 'about',
    loadComponent: () => import('../pages/about').then((module) => module.AboutComponent),
    canActivate: [ageGateInterceptor],
  },
  {
    path: 'location',
    loadComponent: () => import('../pages/location').then((module) => module.LocationComponent),
    canActivate: [ageGateInterceptor],
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('../pages/access-denied/access-denied.component').then(
        (module) => module.AccessDeniedComponent
      ),
    canActivate: [ageGateInterceptor],
  },
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [ageGateInterceptor] },
  { path: '**', redirectTo: '' },
];
