import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AgeGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const verified = sessionStorage.getItem('ageVerified') === 'true';
    if (!verified) {
      this.router.navigate(['/age-gate']);
      return false;
    }
    return true;
  }
}