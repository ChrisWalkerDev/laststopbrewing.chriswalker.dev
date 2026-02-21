import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'age-gate',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './age-gate.component.html',
  styleUrls: ['./age-gate.component.scss']
})
export class AgeGateComponent implements OnInit {

  loading = true;
  returnUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    const verified = sessionStorage.getItem('ageVerified') === 'true';
    if (verified) {
      this.router.navigateByUrl(this.returnUrl!);
    } else {
      this.loading = false;
    }
  }

  confirmYes(): void {
    sessionStorage.setItem('ageVerified', 'true');
    this.router.navigateByUrl(this.returnUrl!);
  }

  confirmNo(): void {
    window.location.href = 'https://google.com';
  }
}
