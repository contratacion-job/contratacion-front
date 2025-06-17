import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
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
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // Eliminar la propiedad tiempoRestante general

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



  // Propiedades para el formulario de adición
  showAddForm: boolean = false;
  isAdding: boolean = false;
  newContratoForm: FormGroup;

  // Propiedades existentes
  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  dataSource = new MatTableDataSource<Contrato>([]);
  noContracts: any = null;

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

    // Formulario para edición
 this.initSelectedContratoForm();

    // Inicializar formulario para nuevo contrato
    this.initNewContratoForm();
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

    // Configurar el filtro
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
    data.vigencia?.vigencia?.toString()?.toLowerCase() || '',
    data.observaciones?.toLowerCase() || '',
    (data as any).tiempoRestante?.toLowerCase() || ''
].join(' ');

return dataStr.includes(searchTerm);
};

    // Suscribirse a los cambios en el control de búsqueda
this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
        )
        .subscribe((query) => {
          console.log('Search query:', query);
          this.closeDetails();
          this.dataSource.filter = query ? query.trim().toLowerCase() : '';
          console.log('Filtered data:', this.dataSource.filteredData);
          this.cdr.detectChanges();
        });
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

  // Nuevo método para agregar contrato inline
  private generateTempId(): string {
        return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

  loadContratos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.contratoService.getContratos().subscribe({
      next: (contratos) => {
        console.log('Contratos cargados:', contratos);
        // Calcular tiempo restante individual para cada contrato
        contratos.forEach(contrato => {
          (contrato as any).tiempoRestante = this.calcularTiempoRestante(contrato);
        });
        this.data = contratos;
        this.dataSource.data = contratos;
        this.pagination.length = contratos.length;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('DataSource data:', this.dataSource.data);
      },
      error: (err) => {
        console.error('Error al cargar los contratos:', err);
        this.errorMessage = 'Error al cargar los contratos. Por favor, intente nuevamente.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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

  calcularTiempoRestante(contrato: Contrato): string {
    const hoy = new Date();
    let fechaVencimiento: Date | null = null;

    if (contrato.fecha_vencido) {
      fechaVencimiento = new Date(contrato.fecha_vencido);
    } else if (contrato.fecha_firmado && contrato.vigencia && contrato.vigencia.vigencia) {
      // Suponiendo que vigencia.vigencia está en días
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
  console.log('toggleDetails called with rowId:', rowId);
  console.log('selectedContratoForm exists:', !!this.selectedContratoForm);

  // Si ya está seleccionado el mismo contrato, lo cerramos
  if (this.selectedContrato?.id === rowId) {
    this.selectedContrato = null;
  } else {
    // Buscar el contrato en los datos
    this.selectedContrato = this.data.find(row => row.id === rowId) || null;
    console.log('Found contract:', this.selectedContrato);

    if (this.selectedContrato) {
      // Verificar que el formulario existe antes de hacer patchValue
      if (!this.selectedContratoForm) {
        console.error('selectedContratoForm is not initialized');
        this.initNewContratoForm(); // Re-inicializar si es necesario
      }

      // Actualizar el formulario con los datos del contrato seleccionado
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

  console.log('selectedContrato after toggle:', this.selectedContrato);
  this.cdr.detectChanges();
}


// Update the closeDetails method
closeDetails(): void {
  this.selectedContrato = null;
}

 openNewContratoDialog(): void {
  // Configuración del diálogo responsivo
  const isMobile = window.innerWidth <= 768; // Umbral para móviles

  const dialogRef = this.dialog.open(ContratoFormComponent, {
    width: isMobile ? '90vw' : '750px',  // Ancho completo en móvil, fijo en desktop
    maxWidth: isMobile ? '100vw' : '90vw', // Máximo ancho
    height: isMobile ? '100vh' : '90vh',   // Altura completa en móvil, 90% en desktop
    maxHeight: '100vh',                   // No más alto que la pantalla
    panelClass: 'full-screen-dialog',     // Clase CSS personalizada
    disableClose: false,                   // Evitar cierre accidental
    autoFocus: false,                     // Mejor manejo del foco
    hasBackdrop: !isMobile,               // Fondo oscuro solo en desktop
    position: isMobile ? { top: '0' } : {} // Posición superior en móvil
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadContratos();
    }
  });
}




  // Métodos para el formulario de adición
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

    // Obtener los valores del formulario
    const formValue = this.newContratoForm.value;

    // Crear el objeto contrato con los valores del formulario
    const newContrato: Contrato = {
      ...formValue,
      id: 0, // El backend asignará el ID
      estado: 'Activo',
      departamento: mockDepartamento[0], // Valor por defecto
      fecha_entrada: new Date().toISOString().split('T')[0],
      fecha_vencido: this.calculateExpirationDate(formValue.fecha_firmado, formValue.vigencia.vigencia)
    };

    this.contratoService.createContrato(newContrato).subscribe({
      next: (response) => {
        this.isAdding = false;
        this.showAddForm = false;
        this.loadContratos();
        this.newContratoForm.reset();
        this.initNewContratoForm();
        // Mostrar mensaje de éxito
        // this.snackBar.open('Contrato creado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al crear el contrato:', error);
        this.isAdding = false;
        // Mostrar mensaje de error
        // this.snackBar.open('Error al crear el contrato', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Método auxiliar para calcular la fecha de vencimiento
  private calculateExpirationDate(fechaFirmado: string, vigenciaDias: number): string {
    if (!fechaFirmado || !vigenciaDias) return '';

    const fecha = new Date(fechaFirmado);
    fecha.setDate(fecha.getDate() + vigenciaDias);
    return fecha.toISOString().split('T')[0];
  }
}

