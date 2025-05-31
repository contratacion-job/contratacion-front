import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-bd',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatProgressBarModule],
  templateUrl: './bd.component.html',
  styleUrl: './bd.component.scss'
})
export class BDComponent {

}
