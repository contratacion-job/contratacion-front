import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
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
import { Subject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
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
  departamentos = mockDepartamento;
  estados = [
    { label: 'Activo', color: 'green' },
    { label: 'Casi a vencer', color: 'orange' },
    { label: 'Vencido', color: 'red' }
  ];

  montoInicialCup: number = 8000;
  totalEjecutadoCup: number = 6000;
  montoRestanteCup: number = 2000;

  montoInicialUsd: string = '-';
  totalEjecutadoUsd: string = '-';
  montoRestanteUsd: string = '-';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

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

  showAddForm: boolean = false;
  isAdding: boolean = false;
  newContratoForm: FormGroup;

  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  dataSource = new MatTableDataSource<Contrato>([]);
  noContracts: any = null;

  filterForm: FormGroup;

  displayedColumns = ['estado', 'no_contrato', 'proveedor', 'tipo_contrato', 'departamento', 'valor_cup', 'valor_usd', 'fecha_entrada', 'fecha_firmado', 'vigencia', 'details'];

  title = 'Contratos';
  addButtonText = 'Agregar Contrato';

  selectedContrato: Contrato | null = null;
  selectedContratoForm: FormGroup;

  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private contratoService: ContratoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Contrato>([]);

    this.initSelectedContratoForm();
    this.initNewContratoForm();

this.filterForm = this.fb.group({
      vigencia_id: [''],
      proveedor_id: [''],
      tipo_contrato_id: [''],
      departamento_id: [''],
      estado: [''],
      fecha_desde: [''],
      fecha_hasta: [''],
      valor_minimo: [''],
      valor_maximo: [''],
      no_contrato_filter: [''],
      valor_cup_filter: [''],
      valor_usd_filter: [''],
      fecha_entrada_filter: [''],
      fecha_firmado_filter: ['']
    });
  }
// Agregar esta propiedad a tu componente
showAdvancedFilters = false;

// Y este método
toggleAdvancedFilters(): void {
  this.showAdvancedFilters = !this.showAdvancedFilters;
}
  ngOnInit(): void {
    this.proveedores = mockProveedor;
    this.tiposContrato = mockTipoContrato;
    this.vigencias = mockVigenciaContrato;
    this.loadContratos();

    this.dataSource.sortingDataAccessor = (item: Contrato, property: string) => {
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

this.dataSource.filterPredicate = (data: Contrato, filter: string) => {
      if (!filter) return true;

      const searchTerm = filter.toLowerCase().trim();
      const dataStr = [
        data.no_contrato?.toString() || '',
        data.proveedor?.nombre?.toLowerCase() || '',
        data.tipo_contrato?.nombre_tipo_contrato?.toLowerCase() || '',
        data.departamento?.nombre_departamento?.toLowerCase() || '',
        data.estado?.toLowerCase() || '',
        data.valor_cup?.toString() || '',
        data.valor_usd?.toString() || '',
        data.fecha_entrada || '',
        data.fecha_firmado || '',
        data.vigencia?.vigencia !== undefined ? data.vigencia.vigencia.toString() : '',
        data.observaciones?.toLowerCase() || '',
        typeof (data as any).tiempoRestante === 'string' ? (data as any).tiempoRestante.toLowerCase() : ''
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

  loadContratos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.contratoService.getContratos().subscribe({
      next: (contratos) => {
        const contratosFiltrados = contratos.filter(c => c.estado !== 'Vencido');
        contratosFiltrados.forEach(contrato => {
          (contrato as any).tiempoRestante = this.calcularTiempoRestante(contrato);
        });
        this.data = contratosFiltrados;
        this.dataSource.data = contratosFiltrados;
        this.pagination.length = contratosFiltrados.length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los contratos. Por favor, intente nuevamente.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  applyFilters(): void {
    const filters = this.filterForm.value;
    
    // Aplicar filtros usando los nuevos nombres de campos
    let filteredData = this.dataSource.data;
  
    
    if (filters.proveedor_id) {
      filteredData = filteredData.filter(contract => 
        contract.proveedor.id === filters.proveedor_id
      );
    }
    
    if (filters.tipo_contrato_id) {
      filteredData = filteredData.filter(contract => 
        contract.tipo_contrato?.id === filters.tipo_contrato_id
      );
    }
    
    if (filters.departamento_id) {
      filteredData = filteredData.filter(contract => 
        contract.departamento?.id === filters.departamento_id
      );
    }
    
    if (filters.valor_cup_filter) {
      filteredData = filteredData.filter(contract => 
        contract.valor_cup >= filters.valor_cup_filter
      );
    }
    
    if (filters.valor_usd_filter) {
      filteredData = filteredData.filter(contract => 
        contract.valor_usd >= filters.valor_usd_filter
      );
    }
    
    if (filters.fecha_entrada_filter) {
      filteredData = filteredData.filter(contract => 
        new Date(contract.fecha_entrada) >= new Date(filters.fecha_entrada_filter)
      );
    }
    
    if (filters.fecha_firmado_filter) {
      filteredData = filteredData.filter(contract => 
        new Date(contract.fecha_firmado) >= new Date(filters.fecha_firmado_filter)
      );
    }
    
    if (filters.vigencia_id) {
      filteredData = filteredData.filter(contract => 
        contract.vigencia.id === filters.vigencia_id
      );
    }
    
    if (filters.estado) {
      filteredData = filteredData.filter(contract => 
        contract.estado === filters.estado
      );
    }
    
    this.dataSource.filteredData = filteredData;
  }
  
  clearFilters(): void {
    this.filterForm.reset();
    this.dataSource.filteredData = this.dataSource.data;
  }

  initSelectedContratoForm(): void {
    this.selectedContratoForm = this.fb.group({
      no_contrato: ['', Validators.required],
      proveedor: [null, Validators.required],
      tipo_contrato: [null, Validators.required],
      departamento: [null, Validators.required],
      no_comite_contratacion: ['', Validators.required],
      fecha_comite_contratacion: ['', Validators.required],
      no_acuerdo_comite_contratacion: ['', Validators.required],
      fecha_acuerdo_comite_contratacion: ['', Validators.required],
      no_comite_administracion: ['', Validators.required],
      fecha_comite_administracion: ['', Validators.required],
      estado: ['', Validators.required],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      valor_usd: [0, [Validators.min(0)]],
      fecha_firmado: ['', Validators.required],
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
      this.sort.active = 'no_contrato';
      this.sort.direction = 'asc';
    }

    this.cdr.detectChanges();
  }

  calcularTiempoRestante(contrato: Contrato): string {
    const hoy = new Date();
    let fechaVencimiento: Date | null = null;

    if (contrato.fecha_vencido) {
      fechaVencimiento = new Date(contrato.fecha_vencido);
    } else if (contrato.fecha_firmado && contrato.vigencia && contrato.vigencia.vigencia) {
      fechaVencimiento = new Date(contrato.fecha_firmado);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + contrato.vigencia.vigencia);
    }

    if (!fechaVencimiento) {
      return 'N/A';
    }

    const diffMs = fechaVencimiento.getTime() - hoy.getTime();
    if (diffMs < 0) {
      return 'Vencido';
    }

    let remainingMs = diffMs;

    const msInYear = 1000 * 60 * 60 * 24 * 365;
    const msInMonth = 1000 * 60 * 60 * 24 * 30;
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const msInDay = 1000 * 60 * 60 * 24;

    const years = Math.floor(remainingMs / msInYear);
    remainingMs -= years * msInYear;

    const months = Math.floor(remainingMs / msInMonth);
    remainingMs -= months * msInMonth;

    const weeks = Math.floor(remainingMs / msInWeek);
    remainingMs -= weeks * msInWeek;

    const days = Math.floor(remainingMs / msInDay);

    let resultado = '';
    if (years > 0) {
      resultado += years + (years === 1 ? ' año' : ' años');
    }
    if (months > 0) {
      if (resultado.length > 0) resultado += ', ';
      resultado += months + (months === 1 ? ' mes' : ' meses');
    }
    if (weeks > 0) {
      if (resultado.length > 0) resultado += ', ';
      resultado += weeks + (weeks === 1 ? ' semana' : ' semanas');
    }
    if (days > 0) {
      if (resultado.length > 0) resultado += ' y ';
      resultado += days + (days === 1 ? ' día' : ' días');
    }
    return resultado || 'Menos de un día';
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
    if (this.selectedContrato?.id === rowId) {
      this.selectedContrato = null;
    } else {
      this.selectedContrato = this.data.find(row => row.id === rowId) || null;
      if (this.selectedContrato) {
        if (!this.selectedContratoForm) {
          this.initNewContratoForm();
        }
        this.selectedContratoForm.patchValue({
          no_contrato: this.selectedContrato.no_contrato || '',
          proveedor: this.selectedContrato.proveedor || null,
          tipo_contrato: this.selectedContrato.tipo_contrato || null,
          valor_cup: this.selectedContrato.valor_cup || 0,
          valor_usd: this.selectedContrato.valor_usd || 0,
          fecha_firmado: this.selectedContrato.fecha_firmado || '',
          vigencia: this.selectedContrato.vigencia || null,
          observaciones: this.selectedContrato.observaciones || '',
          fecha_vencido: this.selectedContrato.fecha_vencido || ''
        });
      }
    }
    this.cdr.detectChanges();
  }

  closeDetails(): void {
    this.selectedContrato = null;
  }

  openNewContratoDialog(): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(ContratoFormComponent, {
      width: isMobile ? '90vw' : '750px',
      maxWidth: isMobile ? '100vw' : '90vw',
      height: isMobile ? '100vh' : '90vh',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      disableClose: false,
      autoFocus: false,
      hasBackdrop: !isMobile,
      position: isMobile ? { top: '0' } : {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContratos();
      }
    });
  }

  initNewContratoForm(): void {
    this.newContratoForm = this.fb.group({
      no_contrato: ['', Validators.required],
      proveedor: [null, Validators.required],
      tipo_contrato: [null, Validators.required],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      valor_usd: [0, [Validators.min(0)]],
      fecha_firmado: ['', Validators.required],
      vigencia: [null, Validators.required],
      observaciones: [''],
      fecha_entrada: [new Date().toISOString().split('T')[0]]
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newContratoForm.reset();
      this.initNewContratoForm();
    }
    this.cdr.markForCheck();
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.newContratoForm.reset();
    this.initNewContratoForm();
  }

  addNewContrato(): void {
    if (this.newContratoForm.invalid) {
      this.newContratoForm.markAllAsTouched();
      return;
    }
    this.isAdding = true;
    const formValue = this.newContratoForm.value;
    const newContrato: Contrato = {
      ...formValue,
      id: 0,
      estado: 'Activo',
      departamento: mockDepartamento[0],
      fecha_entrada: new Date().toISOString().split('T')[0],
      fecha_vencido: this.calculateExpirationDate(formValue.fecha_firmado, formValue.vigencia.vigencia)
    };
    this.contratoService.createContrato(newContrato).subscribe({
      next: () => {
        this.isAdding = false;
        this.showAddForm = false;
        this.loadContratos();
        this.newContratoForm.reset();
        this.initNewContratoForm();
      },
      error: (error) => {
        console.error('Error al crear el contrato:', error);
        this.isAdding = false;
      }
    });
  }

  private calculateExpirationDate(fechaFirmado: string, vigenciaDias: number): string {
    if (!fechaFirmado || !vigenciaDias) return '';
    const fecha = new Date(fechaFirmado);
    fecha.setDate(fecha.getDate() + vigenciaDias);
    return fecha.toISOString().split('T')[0];
  }

  exportToCSV(): void {
    if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
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
      'Tiempo Restante',
      'Estado',
      'Observaciones'
    ];
    csvRows.push(headers.join(','));

    // Data
    this.dataSource.filteredData.forEach(contract => {
      const row = [
        contract.no_contrato,
        contract.proveedor?.nombre || '',
        contract.tipo_contrato?.nombre_tipo_contrato || '',
        contract.departamento?.nombre_departamento || '',
        contract.valor_cup,
        contract.valor_usd,
        contract.fecha_entrada,
        contract.fecha_firmado,
        contract.vigencia?.vigencia,
        (contract as any).tiempoRestante || '',
        contract.estado || '',
        contract.observaciones || ''
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
    a.download = 'contratos_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

