import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ContratoFormComponent } from '../contrato-form/contrato-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { ContratoService } from '../services/contrato.service';
import { Contrato, Proveedor, TipoContrato, VigenciaContrato } from 'app/models/Type';
import { mockProveedor, mockTipoContrato, mockVigenciaContrato, mockDepartamento } from 'app/mock-api/contrato-fake/fake';

@Component({
  selector: 'app-contrato-list',
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
    CurrencyPipe,
    DatePipe,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss']
})
export class ContratoListComponent implements OnInit, AfterViewInit {
  data: Contrato[] = [];
  proveedores: Proveedor[] = [];
  tiposContrato: TipoContrato[] = [];
  vigencias: VigenciaContrato[] = [];
  estados = [
    { label: 'Activo', color: 'green' },
    { label: 'Casi a vencer', color: 'orange' },
    { label: 'Vencido', color: 'red' }
  ];

  // Example financial summary properties
  montoInicialCup: number = 8000;
  totalEjecutadoCup: number = 6000;
  montoRestanteCup: number = 2000;

  montoInicialUsd: string = '-';
  totalEjecutadoUsd: string = '-';
  montoRestanteUsd: string = '-';

  tiempoRestante: string = '1 año y 362 días';

  columns = [
    { key: 'no_contrato', label: 'No. Contrato', sortable: true },
    { key: 'proveedor', label: 'Proveedor', sortable: true },
    { key: 'tipo_contrato', label: 'Tipo de Contrato', sortable: true },
    { key: 'departamento', label: 'Departamento', sortable: true },
    { key: 'valor_cup', label: 'Valor (CUP)', sortable: true },
    { key: 'valor_usd', label: 'Valor (USD)', sortable: true },
    { key: 'fecha_entrada', label: 'Fecha Entrada', sortable: true },
    { key: 'fecha_firmado', label: 'Fecha Firmado', sortable: true },
    { key: 'vigencia', label: 'Vigencia', sortable: true }
  ];

  // Method to get color class for tiempoRestante based on selectedRow's estado
  getTiempoRestanteColor(): string {
    if (!this.selectedRow) return '';
    switch (this.selectedRow.estado) {
      case 'Activo':
        return 'text-green-600';
      case 'Casi a vencer':
        return 'text-orange-600';
      case 'Vencido':
        return 'text-red-600';
      default:
        return '';
    }
  }

  // Add missing properties to fix template errors
  isLoading: boolean = false;
  searchInputControl = new FormControl('');
  dataSource = new MatTableDataSource<Contrato>([]);
  noContracts: any = null;

  displayedColumns = ['estado', 'no_contrato', 'proveedor', 'tipo_contrato', 'departamento', 'valor_cup', 'valor_usd', 'fecha_entrada', 'fecha_firmado', 'vigencia', 'details'];

  title = 'Contratos';
  addButtonText = 'Agregar Contrato';


  selectedRow: Contrato | null = null;
  selectedRowForm: FormGroup;

  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private contratoService: ContratoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<Contrato>([]);
    this.selectedRowForm = new FormGroup({
      no_contrato: new FormControl(''),
      proveedor: new FormControl(null),
      tipo_contrato: new FormControl(null),
      valor_cup: new FormControl(0),
      valor_usd: new FormControl(0),
      fecha_firmado: new FormControl(''),
      vigencia: new FormControl(null),
      observaciones: new FormControl(''),
      fecha_vencido: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.proveedores = mockProveedor;
    this.tiposContrato = mockTipoContrato;
    this.vigencias = mockVigenciaContrato;
    this.loadContratos();

    // Configurar el ordenamiento
    this.dataSource.sortingDataAccessor = (item: Contrato, property: string) => {
      switch(property) {
        case 'proveedor': return item.proveedor?.nombre;
        case 'tipo_contrato': return item.tipo_contrato?.tipo_contrato;
        case 'departamento': return item.departamento?.nombre_dpto;
        case 'vigencia': return item.vigencia?.vigencia;
        case 'valor_cup': return item.valor_cup || 0;
        case 'valor_usd': return item.valor_usd || 0;
        case 'fecha_entrada': return item.fecha_entrada || '';
        case 'fecha_firmado': return item.fecha_firmado || '';
        default: return item[property];
      }
    };

    // Configurar el filtro
    this.dataSource.filterPredicate = (data: Contrato, filter: string) => {
      if (!filter) return true;

      const searchTerms = filter.toLowerCase().split(' ').filter(term => term.length > 0);
      const dataStr = [
        data.no_contrato,
        data.proveedor?.nombre,
        data.tipo_contrato?.tipo_contrato,
        data.departamento?.nombre_dpto,
        data.estado,
        data.valor_cup?.toString(),
        data.valor_usd?.toString(),
        data.fecha_entrada,
        data.fecha_firmado,
        data.vigencia?.vigencia?.toString()
      ].join(' ').toLowerCase();

      return searchTerms.every(term => dataStr.includes(term));
    };

    // Suscribirse a los cambios en el control de búsqueda
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.dataSource.filter = value?.trim() || '';
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    // Configurar paginator
    this.dataSource.paginator = this.paginator;
    if (this.paginator) {
      this.paginator.pageSize = 10;
      this.paginator.pageSizeOptions = [5, 10, 25, 50];
    }

    // Configurar sort
    this.dataSource.sort = this.sort;
    if (this.sort) {
      this.sort.active = 'no_contrato';
      this.sort.direction = 'asc';
    }

    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  loadContratos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.contratoService.getContratos().subscribe({
      next: (contratos) => {
        console.log('Contratos cargados:', contratos);
        this.data = contratos;
        this.dataSource.data = contratos;
        this.pagination.length = contratos.length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los contratos:', err);
        this.errorMessage = 'Error al cargar los contratos. Por favor, intente nuevamente.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  trackByFn(index: number, item: Contrato): number {
    return item.id;
  }

  getNestedValue(row: Contrato, key: string, nestedKey?: string): any {
    if (nestedKey && row[key]) {
      return row[key][nestedKey];
    }
    return row[key] || '';
  }

  toggleDetails(rowId: number): void {
    this.selectedRow = this.selectedRow?.id === rowId ? null : this.data.find(row => row.id === rowId) || null;
    this.selectedRowForm = new FormGroup({
      no_contrato: new FormControl(this.selectedRow?.no_contrato),
      proveedor: new FormControl(this.selectedRow?.proveedor),
      tipo_contrato: new FormControl(this.selectedRow?.tipo_contrato),
      valor_cup: new FormControl(this.selectedRow?.valor_cup),
      valor_usd: new FormControl(this.selectedRow?.valor_usd),
      fecha_firmado: new FormControl(this.selectedRow?.fecha_firmado),
      vigencia: new FormControl(this.selectedRow?.vigencia),
      observaciones: new FormControl(this.selectedRow?.observaciones),
      fecha_vencido: new FormControl(this.selectedRow?.fecha_vencido)
    });
    this.cdr.markForCheck();
  }

  openNewContratoDialog(): void {
    const dialogRef = this.dialog.open(ContratoFormComponent, {
      width: '40%',
      height: '90%',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContratos();
      }
    });
  }



  updateSelectedRecord(): void {
    if (this.selectedRow && this.selectedRowForm.valid) {
      const updatedContrato: Contrato = {
        ...this.selectedRowForm.value,
        id: this.selectedRow.id,
        departamento: this.selectedRow.departamento || mockDepartamento[0],
        estado: this.selectedRowForm.value.estado || this.selectedRow.estado || 'Activo',
        proveedor: this.selectedRowForm.value.proveedor || mockProveedor[0]
      };
      this.contratoService.updateContrato(this.selectedRow.id, updatedContrato).subscribe({
        next: () => {
          this.loadContratos(); // Reload to handle any estado changes
        }
      });
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      this.contratoService.deleteContrato(this.selectedRow.id).subscribe({
        next: () => {
          this.loadContratos();
          this.selectedRow = null;
          this.selectedRowForm.reset();
        }
      });
    }
  }
}