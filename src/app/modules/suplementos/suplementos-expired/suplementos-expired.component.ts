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
import { SuplementoService } from '../services/suplemento.service';
import { Suplemento } from 'app/models/Type';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-suplementos-expired',
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
  templateUrl: './suplementos-expired.component.html',
  styleUrls: ['./suplementos-expired.component.scss']
})
export class SuplementosExpiredComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['no_suplemento', 'proveedor', 'tipo_suplemento', 'valor_cup', 'fecha_inicio', 'fecha_vencido', 'acciones'];
  isLoading = false;
  errorMessage = '';
  searchInputControl: FormControl = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private suplementoService: SuplementoService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.loadSuplementosVencidos();
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
        data.no_suplemento || '',
        data.proveedor?.nombre || '',
        data.tipo_suplemento?.nombre || '',
        data.valor_cup?.toString() || ''
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

  loadSuplementosVencidos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Cargando suplementos vencidos...');

    // Datos mock para suplementos vencidos
    const mockData: any[] = [
      {
        id: 1,
        no_suplemento: 'SUP-001',
        proveedor_id: 1,
        tipo_suplemento_id: 1,
        valor_cup: 50000,
        valor_usd: 0,
        fecha_inicio: new Date('2024-01-01'),
        fecha_vencido: new Date('2024-01-31'),
        estado: 'Vencido',
        proveedor: {
          id: 1,
          nombre: 'Tecnología Avanzada S.A.',
          codigo: 'TECH001'
        },
        tipo_suplemento: {
          id: 1,
          nombre: 'Servicios de TI',
          descripcion: 'Servicios tecnológicos'
        }
      },
      {
        id: 2,
        no_suplemento: 'SUP-002',
        proveedor_id: 2,
        tipo_suplemento_id: 2,
        valor_cup: 75000,
        valor_usd: 0,
        fecha_inicio: new Date('2024-02-01'),
        fecha_vencido: new Date('2024-02-28'),
        estado: 'Vencido',
        proveedor: {
          id: 2,
          nombre: 'Sistemas Integrales Ltd.',
          codigo: 'SIS002'
        },
        tipo_suplemento: {
          id: 2,
          nombre: 'Mantenimiento',
          descripcion: 'Servicios de mantenimiento'
        }
      },
      {
        id: 3,
        no_suplemento: 'SUP-003',
        proveedor_id: 3,
        tipo_suplemento_id: 1,
        valor_cup: 35000,
        valor_usd: 0,
        fecha_inicio: new Date('2024-03-01'),
        fecha_vencido: new Date('2024-03-15'),
        estado: 'Vencido',
        proveedor: {
          id: 3,
          nombre: 'Consultoría Digital Corp.',
          codigo: 'CDC003'
        },
        tipo_suplemento: {
          id: 1,
          nombre: 'Servicios de TI',
          descripcion: 'Servicios tecnológicos'
        }
      },
      {
        id: 4,
        no_suplemento: 'SUP-004',
        proveedor_id: 1,
        tipo_suplemento_id: 3,
        valor_cup: 120000,
        valor_usd: 0,
        fecha_inicio: new Date('2024-04-01'),
        fecha_vencido: new Date('2024-04-30'),
        estado: 'Vencido',
        proveedor: {
          id: 1,
          nombre: 'Tecnología Avanzada S.A.',
          codigo: 'TECH001'
        },
        tipo_suplemento: {
          id: 3,
          nombre: 'Capacitación',
          descripcion: 'Servicios de formación'
        }
      }
    ];

    // Intentar obtener datos del servicio, si falla usar mock
    this.suplementoService.getSuplementosVencidos(0, 10).subscribe({
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

  restoreSuplemento(id: number): void {
    console.log('Restaurar suplemento con id:', id);
    // TODO: Implementar lógica de restauración
    // this.suplementoService.restoreSuplemento(id).subscribe(() => {
    //   this.loadSuplementosVencidos();
    // });
  }

  deleteSuplemento(id: number): void {
    console.log('Eliminar suplemento con id:', id);
    // TODO: Implementar lógica de eliminación permanente
    // Mostrar confirmación antes de eliminar
    // const confirmDelete = confirm('¿Está seguro de que desea eliminar permanentemente este suplemento?');
    // if (confirmDelete) {
    //   this.suplementoService.deleteSuplemento(id).subscribe(() => {
    //     this.loadSuplementosVencidos();
    //   });
    // }
  }
}
