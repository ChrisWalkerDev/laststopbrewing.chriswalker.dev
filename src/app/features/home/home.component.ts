import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  slides = [
    {
      image: '/assets/icons/last_stop_brewing_logo.svg',
      title: 'test',
      description: 'test',
    },
    {
      image: '/assets/icons/last_stop_brewing_logo.svg',
      title: 'test',
      description: 'test',
    }
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

   nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    console.log('Current Slide Index:', this.currentIndex);
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    console.log('Current Slide Index:', this.currentIndex);
  }

}