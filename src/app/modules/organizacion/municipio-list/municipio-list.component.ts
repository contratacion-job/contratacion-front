import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './municipio-list.component.html',
  styleUrl: './municipio-list.component.scss'
})
export class MunicipioListComponent {

}
