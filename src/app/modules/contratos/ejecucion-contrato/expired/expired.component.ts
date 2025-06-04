import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-expired',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './expired.component.html',
  styleUrl: './expired.component.scss'
})
export class ExpiredComponent {

}
