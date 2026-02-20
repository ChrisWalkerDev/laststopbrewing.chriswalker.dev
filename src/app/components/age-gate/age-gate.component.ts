import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const verified = sessionStorage.getItem('ageVerified') === 'true';
    if (verified) {
      this.router.navigate(['/']);
    } else {
      this.loading = false;
    }
  }

  confirmYes(): void {
    sessionStorage.setItem('ageVerified', 'true');
    this.router.navigate(['/']);
  }

  confirmNo(): void {
    window.location.href = 'https://google.com';
  }
}
