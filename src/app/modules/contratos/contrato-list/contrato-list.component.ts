import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
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


  selectedRow: Contrato | null = null;
  selectedRowForm: FormGroup;

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
    this.selectedRowForm = this.fb.group({
      no_contrato: ['', Validators.required],
      proveedor: [null, Validators.required],
      tipo_contrato: [null, Validators.required],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      valor_usd: [0, Validators.min(0)],
      fecha_firmado: ['', Validators.required],
      vigencia: [null, Validators.required],
      observaciones: [''],
      fecha_vencido: ['']
    });
    
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
  closeDetails(): void
    {
        this.selectedRow = null;
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

