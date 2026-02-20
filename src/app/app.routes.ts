import { Routes } from '@angular/router';
import { AgeGateComponent } from './components/age-gate/age-gate.component';
import { AgeGuard } from './guards/age.guard';

export const routes: Routes = [
    { path: 'age-gate', component: AgeGateComponent },
    { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), canActivate: [AgeGuard]},
];
