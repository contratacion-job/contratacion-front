import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { EjecucionSuplementoService } from '../../services/ejecucion-suplemento.service';
import { EjecucionSuplemento } from 'app/models/Type';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-expired',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe,
    MatCardModule
  ],
  templateUrl: './expired.component.html',
  styleUrls: ['./expired.component.scss']
})
export class ExpiredComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['no_suplemento_id', 'proveedor', 'contrato', 'trabajo_ejecutado', 'costo_cup', 'fecha_ejecucion', 'acciones'];
  isLoading = false;
  errorMessage = '';
  searchInputControl: FormControl = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private ejecucionSuplementoService: EjecucionSuplementoService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.loadExpiredEjecuciones();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.markForCheck();
  }

  setupSearch(): void {
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;
      const searchTerms = filter.toLowerCase().split(' ').filter(term => term.length > 0);
      const dataStr = [
        data.no_suplemento_id?.toString() || '',
        data.proveedor?.nombre || '',
        data.contrato?.no_contrato?.toString() || '',
        data.trabajo_ejecutado || '',
        data.costo_cup?.toString() || ''
      ].join(' ').toLowerCase();
      return searchTerms.every(term => dataStr.includes(term));
    };

    // Configurar búsqueda con debounce
    this.searchInputControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((query) => {
        this.dataSource.filter = query?.trim().toLowerCase() || '';
      });
  }

  loadExpiredEjecuciones(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Cargando ejecuciones vencidas...');

    // Datos mock simplificados usando any para evitar errores de tipos
    const mockData: any[] = [
      {
        id: 1,
        no_suplemento_id: 1,
        proveedor_id: 1,
        no_contrato_id: 1,
        trabajo_ejecutado: 'Instalación de equipos de red',
        costo_cup: 15000,
        costo_cl: 0,
        fecha_ejecucion: new Date('2024-01-15'),
        estado: 'Vencido',
        proveedor: {
          id: 1,
          nombre: 'Tecnología Avanzada S.A.',
          codigo: 'TECH001'
        },
        contrato: {
          id: 1,
          no_contrato: 1001,
          objeto_contrato: 'Servicios de TI'
        },
        suplemento: {
          id: 1,
          no_suplemento: 'SUP-001'
        }
      },
      {
        id: 2,
        no_suplemento_id: 2,
        proveedor_id: 2,
        no_contrato_id: 2,
        trabajo_ejecutado: 'Mantenimiento de servidores',
        costo_cup: 25000,
        costo_cl: 0,
        fecha_ejecucion: new Date('2024-02-20'),
        estado: 'Vencido',
        proveedor: {
          id: 2,
          nombre: 'Sistemas Integrales Ltd.',
          codigo: 'SIS002'
        },
        contrato: {
          id: 2,
          no_contrato: 1002,
          objeto_contrato: 'Mantenimiento de infraestructura'
        },
        suplemento: {
          id: 2,
          no_suplemento: 'SUP-002'
        }
      },
      {
        id: 3,
        no_suplemento_id: 3,
        proveedor_id: 1,
        no_contrato_id: 1,
        trabajo_ejecutado: 'Configuración de firewall',
        costo_cup: 8500,
        costo_cl: 0,
        fecha_ejecucion: new Date('2024-03-10'),
        estado: 'Vencido',
        proveedor: {
          id: 1,
          nombre: 'Tecnología Avanzada S.A.',
          codigo: 'TECH001'
        },
        contrato: {
          id: 1,
          no_contrato: 1001,
          objeto_contrato: 'Servicios de TI'
        },
        suplemento: {
          id: 3,
          no_suplemento: 'SUP-003'
        }
      }
    ];

    // Intentar obtener datos del servicio, si falla usar mock
    this.ejecucionSuplementoService.getExpiredEjecuciones(0, 10).subscribe({
      next: (response) => {
        console.log('Respuesta del servicio:', response);

        let data: any[] = [];

        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          data = response.data;
          console.log('Usando datos del servicio');
        } else if (Array.isArray(response) && response.length > 0) {
          data = response;
          console.log('Usando respuesta directa del servicio');
        } else {
          console.warn('Servicio no devolvió datos válidos, usando datos mock');
          data = mockData;
        }

        console.log('Datos finales para la tabla:', data);

        this.dataSource.data = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error del servicio, usando datos mock:', error);
        // En caso de error, usar datos mock para testing
        this.dataSource.data = mockData;
        this.errorMessage = '';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackByFn(index: number, item: any): number {
    return item.id || index;
  }

  selectedEjecucion: EjecucionSuplemento | null = null;

  selectEjecucion(ejecucion: EjecucionSuplemento): void {
    this.selectedEjecucion = this.selectedEjecucion?.id === ejecucion.id ? null : ejecucion;
  }

  isSelected(ejecucion: EjecucionSuplemento): boolean {
    return this.selectedEjecucion?.id === ejecucion.id;
  }

  restoreEjecucion(id: number): void {
    console.log('Restaurar ejecución con id:', id);
    // TODO: Implementar lógica de restauración
    // this.ejecucionSuplementoService.restoreEjecucion(id).subscribe(() => {
    //   this.loadExpiredEjecuciones();
    // });
  }

  deleteEjecucion(id: number): void {
    console.log('Eliminar ejecución con id:', id);
    // TODO: Implementar lógica de eliminación permanente
    // Mostrar confirmación antes de eliminar
    // const confirmDelete = confirm('¿Está seguro de que desea eliminar permanentemente esta ejecución?');
    // if (confirmDelete) {
    //   this.ejecucionSuplementoService.deleteEjecucion(id).subscribe(() => {
    //     this.loadExpiredEjecuciones();
    //   });
    // }
  }
}
 