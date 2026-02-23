import { Component } from '@angular/core';

@Component({
  selector: 'app-food',
  imports: [],
  templateUrl: './food.html',
  styleUrl: './food.scss',
})
export class Food {

  imageUrls: string[] = [
    'assets/Last_Stop_Menu_v2_1.png',
    'assets/Last_Stop_Menu_v2_2.png',
  ];

}
