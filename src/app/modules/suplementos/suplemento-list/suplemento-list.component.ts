import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { SuplementoFormComponent } from '../suplemento-form/suplemento-form.component';

import { Suplemento, Proveedor, TipoContrato, Vigencia, Departamento } from 'app/models/Type';
import { mockProveedor, mockTipoContrato, mockVigenciaContrato, mockDepartamento } from 'app/mock-api/contrato-fake/fake';
import { Subject } from 'rxjs';
import { SuplementoDetailComponent } from '../suplemento-detail/suplemento-detail.component';
import { SuplementoService } from '../services/suplemento.service';

@Component({
  selector: 'app-suplemento-list',
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
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './suplemento-list.component.html',
  styleUrls: ['./suplemento-list.component.scss']
})
export class SuplementoListComponent implements OnInit, AfterViewInit {
  data: Suplemento[] = [];
  proveedores: Proveedor[] = [];
  tiposContrato: TipoContrato[] = [];
  vigencias: Vigencia[] = [];
  departamentos: Departamento[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  columns = [
    { key: 'no_contrato_contratacion', label: 'No. Contrato', sortable: true },
    { key: 'proveedor', label: 'Proveedor', sortable: true },
    { key: 'tipo_contrato', label: 'Tipo de Contrato', sortable: true },
    { key: 'departamento', label: 'Departamento', sortable: true },
    { key: 'valor_cup', label: 'Valor (CUP)', sortable: true },
    { key: 'valor_usd', label: 'Valor (USD)', sortable: true },
    { key: 'fecha_entrada', label: 'Fecha Entrada', sortable: true },
    { key: 'fecha_firmado', label: 'Fecha Firmado', sortable: true },
    { key: 'vigencia', label: 'Vigencia', sortable: true },
    { key: 'fecha_vencido', label: 'Fecha Vencido', sortable: true }
  ];

  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  dataSource = new MatTableDataSource<Suplemento>([]);

  filterForm: FormGroup;

  displayedColumns = ['no_contrato_contratacion', 'proveedor', 'tipo_contrato', 'departamento', 'valor_cup', 'valor_usd', 'fecha_entrada', 'fecha_firmado', 'vigencia', 'fecha_vencido', 'details'];

  selectedSuplemento: Suplemento | null = null;
  selectedSuplementoForm: FormGroup;

  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private _matDialog: MatDialog,
    private suplementoService :SuplementoService
  ) {
    this.dataSource = new MatTableDataSource<Suplemento>([]);
    this.initSelectedSuplementoForm();

    this.filterForm = this.fb.group({
      vigencia_id: [''],
      proveedor_id: [''],
      tipo_contrato_id: [''],
      departamento_id: [''],
      fecha_entrada_filter: [''],
      fecha_firmado_filter: [''],
      valor_cup_filter: [''],
      valor_usd_filter: ['']
    });
  }


  openAddSuplementoDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(SuplementoDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        action: 'new',
        suplemento: null
      }
    });
    // Handle dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the suplementos list if a new suplemento was added
        this.loadSuplementos();
      }
    });
  }

  /**
   * Open the dialog to edit an existing suplemento
   */
  openEditSuplementoDialog(suplemento: Suplemento): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(SuplementoFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        action: 'edit',
        suplemento: suplemento
      }
    });

    // Handle dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the suplementos list if the suplemento was updated
        this.loadSuplementos();
      }
    });
  }

  /**
   * Delete a suplemento
   */
  deleteSuplemento(suplemento: Suplemento): void {
    // Show confirmation dialog
    const confirmation = confirm(`¿Está seguro de eliminar el suplemento #${suplemento.id}?`);

    if (confirmation) {
      // Here you would typically call your service to delete the suplemento
      // For now, we'll just log it
      console.log('Deleting suplemento:', suplemento.id);

      // After successful deletion, refresh the list
      this.loadSuplementos();
    }
  }

  ngOnInit(): void {
    this.proveedores = mockProveedor;
    this.tiposContrato = mockTipoContrato;
    this.vigencias = mockVigenciaContrato;
    this.departamentos = mockDepartamento;
    this.loadSuplementos();

    this.dataSource.sortingDataAccessor = (item: Suplemento, property: string) => {
      switch(property) {
        case 'proveedor': return item.proveedor?.nombre;
        case 'tipo_contrato': return item.tipo_contrato?.nombre_tipo_contrato;
        case 'departamento': return item.departamento?.nombre_departamento;
        case 'vigencia': return item.vigencia?.vigencia;
        case 'valor_cup': return item.valor_cup || 0;
        case 'valor_usd': return item.valor_usd || 0;
        case 'fecha_entrada': return item.fecha_entrada || '';
        case 'fecha_firmado': return item.fecha_firmado || '';
        default: return item[property];
      }
    };

    this.dataSource.filterPredicate = (data: Suplemento, filter: string) => {
      if (!filter) return true;

      const searchTerm = filter.toLowerCase().trim();
      const dataStr = [
        data.no_contrato_contratacion?.toString() || '',
        data.proveedor?.nombre?.toLowerCase() || '',
        data.tipo_contrato?.nombre_tipo_contrato?.toLowerCase() || '',
        data.departamento?.nombre_departamento?.toLowerCase() || '',
        data.valor_cup?.toString() || '',
        data.valor_usd?.toString() || '',
        data.fecha_entrada || '',
        data.fecha_firmado || '',
        data.vigencia?.vigencia !== undefined ? data.vigencia.vigencia.toString() : '',
        data.observaciones?.toLowerCase() || ''
      ].join(' ');

      return dataStr.includes(searchTerm);
    };

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
      )
      .subscribe((query) => {
        this.closeDetails();
        this.dataSource.filter = query ? query.trim().toLowerCase() : '';
        this.cdr.detectChanges();
      });

    this.filterForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadSuplementos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.suplementoService.getSuplementos().subscribe({
      next: (suplementos) => {
        this.dataSource.data = suplementos;
        this.pagination.length = suplementos.length;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar suplementos. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  initSelectedSuplementoForm(): void {
    this.selectedSuplementoForm = this.fb.group({
      no_contrato_contratacion: ['', Validators.required],
      proveedor: [null, Validators.required],
      tipo_contrato: [null, Validators.required],
      departamento: [null, Validators.required],
      fecha_entrada: ['', Validators.required],
      fecha_firmado: ['', Validators.required],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      valor_usd: [0, [Validators.min(0)]],
      vigencia: [null, Validators.required],
      observaciones: [''],
      fecha_vencido: ['']
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.paginator) {
      this.paginator.pageSize = 10;
      this.paginator.pageSizeOptions = [5, 10, 25, 50];
    }

    this.dataSource.sort = this.sort;
    if (this.sort) {
      this.sort.active = 'no_contrato_contratacion';
      this.sort.direction = 'asc';
    }

    this.cdr.detectChanges();
  }

  trackByFn(index: number, item: Suplemento): number {
    return item.id;
  }

// 1. Corregir el método toggleDetails()
toggleDetails(rowId: number): void {
  if (this.selectedSuplemento?.id === rowId) {
    this.selectedSuplemento = null;
  } else {
    // CAMBIO: Usar dataSource.data en lugar de this.data
    this.selectedSuplemento = this.dataSource.data.find(row => row.id === rowId) || null;
    if (this.selectedSuplemento) {
      if (!this.selectedSuplementoForm) {
        this.initSelectedSuplementoForm();
      }
      this.selectedSuplementoForm.patchValue({
        no_contrato_contratacion: this.selectedSuplemento.no_contrato_contratacion || '',
        proveedor: this.selectedSuplemento.proveedor || null,
        tipo_contrato: this.selectedSuplemento.tipo_contrato || null,
        departamento: this.selectedSuplemento.departamento || null, // AGREGADO: faltaba departamento
        fecha_entrada: this.selectedSuplemento.fecha_entrada || '', // AGREGADO: faltaba fecha_entrada
        valor_cup: this.selectedSuplemento.valor_cup || 0,
        valor_usd: this.selectedSuplemento.valor_usd || 0,
        fecha_firmado: this.selectedSuplemento.fecha_firmado || '',
        vigencia: this.selectedSuplemento.vigencia || null,
        observaciones: this.selectedSuplemento.observaciones || '',
        fecha_vencido: this.selectedSuplemento.fecha_vencido || ''
      });
    }
  }
  this.cdr.detectChanges();
}

// 2. Eliminar la propiedad data ya que no se usa
// REMOVER esta línea de la clase:
// data: Suplemento[] = [];

// 3. Corregir el método applyFilters() para usar la funcionalidad correcta de MatTableDataSource
applyFilters(): void {
  const filters = this.filterForm.value;

  // Crear un filtro personalizado
  this.dataSource.filterPredicate = (data: Suplemento, filter: string) => {
    // Aplicar filtros específicos
    if (filters.proveedor_id && data.proveedor?.id !== filters.proveedor_id) {
      return false;
    }
    if (filters.tipo_contrato_id && data.tipo_contrato?.id !== filters.tipo_contrato_id) {
      return false;
    }
    if (filters.departamento_id && data.departamento?.id !== filters.departamento_id) {
      return false;
    }
    if (filters.vigencia_id && data.vigencia?.id !== filters.vigencia_id) {
      return false;
    }
    if (filters.valor_cup_filter && data.valor_cup < filters.valor_cup_filter) {
      return false;
    }
    if (filters.valor_usd_filter && data.valor_usd < filters.valor_usd_filter) {
      return false;
    }
    if (filters.fecha_entrada_filter && new Date(data.fecha_entrada) < new Date(filters.fecha_entrada_filter)) {
      return false;
    }
    if (filters.fecha_firmado_filter && new Date(data.fecha_firmado) < new Date(filters.fecha_firmado_filter)) {
      return false;
    }

    return true;
  };

  // Disparar el filtro
  this.dataSource.filter = JSON.stringify(filters);
  this.cdr.detectChanges();
}

// 4. Corregir el método clearFilters()
clearFilters(): void {
  this.filterForm.reset();
  this.dataSource.filter = '';
  this.cdr.detectChanges();
}

// 5. Corregir el método exportToCSV()
exportToCSV(): void {
  // Usar los datos filtrados del dataSource
  const dataToExport = this.dataSource.filteredData || this.dataSource.data;

  if (!dataToExport || dataToExport.length === 0) {
    return;
  }

  const csvRows = [];
  // Headers
  const headers = [
    'No. Contrato',
    'Proveedor',
    'Tipo de Contrato',
    'Departamento',
    'Valor (CUP)',
    'Valor (USD)',
    'Fecha Entrada',
    'Fecha Firmado',
    'Vigencia',
    'Fecha Vencido',
    'Observaciones'
  ];
  csvRows.push(headers.join(','));

  // Data
  dataToExport.forEach(item => {
    const row = [
      item.no_contrato_contratacion,
      item.proveedor?.nombre || '',
      item.tipo_contrato?.nombre_tipo_contrato || '',
      item.departamento?.nombre_departamento || '',
      item.valor_cup,
      item.valor_usd,
      item.fecha_entrada,
      item.fecha_firmado,
      item.vigencia?.vigencia,
      item.fecha_vencido,
      item.observaciones || ''
    ];
    // Escape commas and quotes in values
    const escapedRow = row.map(value => {
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(escapedRow.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'suplementos_export.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}
  closeDetails(): void {
    this.selectedSuplemento = null;
  }


}
