// shared/components/dialog-header/dialog-header.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">{{ title }}</h2>
      <button 
        mat-icon-button 
        class="close-button"
        mat-dialog-close
        [attr.aria-label]="'Cerrar ' + title">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  
})
export class DialogHeaderComponent {
  @Input() title: string = 'Diálogo';
}