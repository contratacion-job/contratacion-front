import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarModule } from 'primeng/progressbar';
@Component({
  selector: 'app-license',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatProgressBarModule,ProgressBarModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class LicenseComponent {

}
