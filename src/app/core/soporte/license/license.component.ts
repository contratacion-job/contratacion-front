import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarModule } from 'primeng/progressbar';
import { LicenseService } from './license.service';
import { Licencia ,Entidad} from 'app/models/Type';

// Interfaces
export interface HistorialActivacion {
  serie: string;
  fecha: string;
  usuario: string;
}
@Component({
  selector: 'app-license',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, ProgressBarModule],
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LicenseComponent implements OnInit {
  activeTab: string = 'estado';
  licenseData: Licencia;
  historialActivaciones: HistorialActivacion[];
  daysRemaining: number = 0;

  constructor() {
    // Datos de ejemplo
    this.licenseData = {
      id: 1,
      entidad_id: 123,
      numero_licencia: "ABC123-XYZ456",
      tipo_licencia: "Empresarial Pro",
      fecha_emision: new Date("2025-06-01"),
      fecha_vencimiento: new Date("2025-07-01"),
      estado: "Activa",
      observaciones: "Licencia renovada automáticamente",
      entidad: {
        id: 123,
        municipio_id: 1,
        nombre_entidad: "Mi Sistema ERP",
        codigo_entidad: "ERP001",
        domicilio_legal: "Av. Principal 123, Centro",
        telefonos: "555-0123, 555-0124",
        logo: "assets/logo.jpg",
        tipo_empresa: "PRIVADA",
        provincia: {
          id: 1,
          nombre_provincia: "Provincia Central"
        },
        municipio: {
          id: 1,
          provincia_id: 1,
          nombre_municipio: "Ciudad Capital",
          provincia: {
            id: 1,
            nombre_provincia: "Provincia Central"
          }
        }
      }
    };

    this.historialActivaciones = [
      {
        serie: "SN987654320",
        fecha: "1 de ene. 2024",
        usuario: "juan.perez@empresa.com"
      },
      {
        serie: "SN876543210",
        fecha: "15 de dic. 2023",
        usuario: "admin@empresa.com"
      }
    ];
  }

  ngOnInit(): void {
    this.calculateDaysRemaining();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  calculateDaysRemaining(): void {
    const today = new Date();
    const expiry = new Date(this.licenseData.fecha_vencimiento);
    const diffTime = expiry.getTime() - today.getTime();
    this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusColor(): string {
    if (this.daysRemaining > 15) return 'status-active';    // Green for more than 15 days
    if (this.daysRemaining > 7) return 'status-warning';    // Orange for 8-15 days
    return 'status-danger';                                 // Red for 7 or fewer days
  }

  getStatusIcon(): string {
    if (this.daysRemaining > 7) return 'check-circle';
    return 'alert-circle';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  onRenovar(): void {
    console.log('Renovar licencia');
    // Implementar lógica de renovación
  }

  onDescargarLicencia(): void {
    console.log('Descargar licencia');
    // Implementar lógica de descarga
  }
}