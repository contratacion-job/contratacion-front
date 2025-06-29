import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-bd',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './bd.component.html',
  styleUrls: ['./bd.component.scss']
})
export class BDComponent {
  selectedFile: File | null = null;

  importInProgress = false;
  importStatus: string | null = null;

  exportInProgress = false;
  exportStatus: string | null = null;

  restoreInProgress = false;
  restoreStatus: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.importStatus = null;
    }
  }

  importDatabase(): void {
    if (!this.selectedFile) {
      this.importStatus = 'Por favor, seleccione un archivo para importar.';
      return;
    }
    this.importInProgress = true;
    this.importStatus = null;

    // TODO: Implement actual import logic here, e.g., call backend API

    setTimeout(() => {
      this.importInProgress = false;
      this.importStatus = 'Importación completada con éxito.';
      this.selectedFile = null;
    }, 3000);
  }

  exportDatabase(): void {
    this.exportInProgress = true;
    this.exportStatus = null;

    // TODO: Implement actual export logic here, e.g., call backend API and download file

    setTimeout(() => {
      this.exportInProgress = false;
      this.exportStatus = 'Exportación completada con éxito.';
    }, 3000);
  }

  restoreDatabase(): void {
    this.restoreInProgress = true;
    this.restoreStatus = null;

    // TODO: Implement actual restore logic here, e.g., call backend API

    setTimeout(() => {
      this.restoreInProgress = false;
      this.restoreStatus = 'Restauración completada con éxito.';
    }, 3000);
  }
}
