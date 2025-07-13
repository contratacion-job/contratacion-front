import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarModule } from 'primeng/progressbar';
import { LicenseService } from './license.service';
import { EntidadService } from 'app/modules/organizacion/entidad-list/entidad.service';
import { Licencia, Entidad } from 'app/models/Type';

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
  licenseData: Licencia | null = null;
  historialActivaciones: HistorialActivacion[];
  daysRemaining: number = 0;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private licenseService: LicenseService,
    private entidadService: EntidadService
  ) {
    // Datos de ejemplo para historial
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
    this.loadLicenseData();
  }

  loadLicenseData(): void {
    this.isLoading = true;
    this.error = '';

    // Cargar datos de entidad desde el servicio
    this.entidadService.getLogs().subscribe({
      next: (response: any) => {
        console.log('Respuesta de entidades:', response);
        
        try {
          let entidadesData = [];
          
          if (response && response.data && Array.isArray(response.data)) {
            entidadesData = response.data;
          } else if (Array.isArray(response)) {
            entidadesData = response;
          }

          if (entidadesData.length > 0) {
            // Usar la primera entidad como ejemplo
            const primeraEntidad = entidadesData[0];
            
            // Crear la licencia con datos reales de la entidad
            this.licenseData = {
              id: 1,
              entidad_id: primeraEntidad.id,
              numero_licencia: "ABC123-XYZ456",
              tipo_licencia: "Empresarial Pro",
              fecha_emision: new Date("2025-06-01"),
              fecha_vencimiento: new Date("2025-07-01"),
              estado: "Activa",
              observaciones: "Licencia renovada automáticamente",
              entidad: {
                id: primeraEntidad.id,
                municipio_id: 1,
                nombre_entidad: primeraEntidad.nombre,
                codigo_entidad: primeraEntidad.codigo,
                domicilio_legal: primeraEntidad.domicilio_legal,
                telefonos: primeraEntidad.telefonos,
                logo: primeraEntidad.logo,
                tipo_empresa: primeraEntidad.tipo_empresa,
                ministerio: primeraEntidad.ministerio,
                activo: primeraEntidad.activo,
                director_id: primeraEntidad.director_id,
                provincia: {
                  id: 1,
                  nombre_provincia: primeraEntidad.provincia
                },
                municipio: {
                  id: 1,
                  provincia_id: 1,
                  nombre_municipio: primeraEntidad.municipio,
                  provincia: {
                    id: 1,
                    nombre_provincia: primeraEntidad.provincia
                  }
                }
              }
            };

            this.calculateDaysRemaining();
          } else {
            this.error = 'No se encontraron entidades';
          }
        } catch (error) {
          console.error('Error procesando datos de entidad:', error);
          this.error = 'Error procesando los datos de la entidad';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos de entidad:', error);
        this.error = 'Error al cargar los datos de la entidad';
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  calculateDaysRemaining(): void {
    if (!this.licenseData) return;
    
    const today = new Date();
    const expiry = new Date(this.licenseData.fecha_vencimiento);
    const diffTime = expiry.getTime() - today.getTime();
    this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusColor(): string {
    if (this.daysRemaining > 15) return 'status-active';
    if (this.daysRemaining > 7) return 'status-warning';
    return 'status-danger';
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
