import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AgeGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const verified = sessionStorage.getItem('ageVerified') === 'true';
    if (!verified) {
      this.router.navigate(['/age-gate'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
    return true;
  }
}