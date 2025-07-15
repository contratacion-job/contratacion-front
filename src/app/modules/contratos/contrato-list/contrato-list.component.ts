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

import { ExportService } from 'app/services/export.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { TipoContratoService } from '../services/tipo-contrato.service';
import { DepartamentoService } from 'app/modules/organizacion/services/departamento.service';
import { ProveedorService } from 'app/modules/proveedores/services/proveedor.service';
import { MatMenuTrigger } from '@angular/material/menu'; // Agregado MatMenuTrigger
import { MatCheckboxModule } from '@angular/material/checkbox'; // Agregado
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
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
    MatCheckboxModule
  ],
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss']
})
export class ContratoListComponent implements OnInit, AfterViewInit {
  data: Contrato[] = [];
  proveedores: Proveedor[] = [];
  tiposContrato: TipoContrato[] = [];
  vigencias: VigenciaContrato[] = [];
  departamentos: any[] = [];

  showFilters: boolean = false;

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.cdr.detectChanges();
  }

  isColumnVisible(columnKey: string): boolean {
    const column = this.columnSettings.find(col => col.key === columnKey);
    return column ? column.visible : false;
  }

  // Add a flag to check if departamentos is loaded as array
  isDepartamentosArray(): boolean {
    return Array.isArray(this.departamentos);
  }
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
  @ViewChild('columnMenuTrigger', { read: MatMenuTrigger }) columnMenuTrigger!: MatMenuTrigger;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  columnSettings = [
    { key: 'estado', label: 'Estado', visible: true, tooltip: 'Estado del contrato' },
    { key: 'no_contrato', label: 'No. Contrato', visible: true, tooltip: 'Número del contrato' },
    { key: 'proveedor', label: 'Proveedor', visible: true, tooltip: 'Nombre del proveedor' },
    { key: 'tipo_contrato', label: 'Tipo de Contrato', visible: true, tooltip: 'Tipo de contrato' },
    { key: 'departamento', label: 'Departamento', visible: true, tooltip: 'Departamento asociado' },
    { key: 'valor_cup', label: 'Valor (CUP)', visible: true, tooltip: 'Valor en CUP' },
    { key: 'valor_usd', label: 'Valor (USD)', visible: true, tooltip: 'Valor en USD' },
    { key: 'fecha_entrada', label: 'Fecha Entrada', visible: true, tooltip: 'Fecha de entrada' },
    { key: 'fecha_firmado', label: 'Fecha Firmado', visible: true, tooltip: 'Fecha de firmado' },
    { key: 'vigencia', label: 'Vigencia', visible: true, tooltip: 'Vigencia del contrato' },
    { key: 'tiempoRestante', label: 'Tiempo Restante', visible: true, tooltip: 'Tiempo restante del contrato' }
  ];

  // Remove old columns array
  // columns = [
  //   { key: 'no_contrato', label: 'No. Contrato', sortable: true },
  //   { key: 'proveedor', label: 'Proveedor', sortable: true },
  //   { key: 'tipo_contrato', label: 'Tipo de Contrato', sortable: true },
  //   { key: 'departamento', label: 'Departamento', sortable: true },
  //   { key: 'valor_cup', label: 'Valor (CUP)', sortable: true },
  //   { key: 'valor_usd', label: 'Valor (USD)', sortable: true },
  //   { key: 'fecha_entrada', label: 'Fecha Entrada', sortable: true },
  //   { key: 'fecha_firmado', label: 'Fecha Firmado', sortable: true },
  //   { key: 'vigencia', label: 'Vigencia', sortable: true }
  // ];

  getVisibleColumns() {
    return this.columnSettings.filter(column => column.visible);
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = [
      ...this.columnSettings.filter(col => col.visible).map(col => col.key),
      'details' // Mantener la columna de detalles al final
    ];
  }

  getGridColumns(): string {
    const visibleColumns = this.getVisibleColumns();
    const columnSizes = visibleColumns.map(() => 'minmax(120px, 1fr)');
    return `${columnSizes.join(' ')} 100px`; // 100px for details button column
  }


  getColumnValue(row: Contrato, columnKey: string): string | number {
    switch (columnKey) {
      case 'estado':
        return row.estado || '';
      case 'no_contrato':
        return row.no_contrato || '';
      case 'proveedor':
        return row.proveedor?.nombre || '';
      case 'tipo_contrato':
        return row.tipo_contrato?.nombre_tipo_contrato || '';
      case 'departamento':
        return row.departamento?.nombre_departamento || '';
      case 'valor_cup':
        return row.valor_cup !== undefined && row.valor_cup !== null ? `${row.valor_cup}` : '';
      case 'valor_usd':
        return row.valor_usd !== undefined && row.valor_usd !== null ? `${row.valor_usd}` : '';
      case 'fecha_entrada':
        return row.fecha_entrada ? new Date(row.fecha_entrada).toLocaleDateString() : '';
      case 'fecha_firmado':
        return row.fecha_firmado ? new Date(row.fecha_firmado).toLocaleDateString() : '';
      case 'vigencia':
        return row.vigencia?.vigencia ? row.vigencia.vigencia.toString() : '';
      case 'tiempoRestante':
        return (row as any).tiempoRestante || '';
      default:
        return '';
    }
  }

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
    private tipocontratoervice: TipoContratoService,
    private departamentoService: DepartamentoService,
    private proveedorService:ProveedorService,
    private dialog: MatDialog,
  private cdr: ChangeDetectorRef,
  private fb: FormBuilder,
  private exportService: ExportService
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
      fecha_entrada: [''],
      fecha_firmado: [''],
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
// Todas las columnas posibles

private convertToArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    // Check for common pagination/response wrapper properties
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.items && Array.isArray(data.items)) return data.items;
    if (data.results && Array.isArray(data.results)) return data.results;
    if (data.list && Array.isArray(data.list)) return data.list;
    if (data.content && Array.isArray(data.content)) return data.content;
    
    // If it's a plain object, convert values to array
    return Object.values(data);
  }
  return [];
}


  ngOnInit(): void {
    this.tiposContrato = [];
    this.vigencias = [];
    this.departamentos = [];
    this.proveedores = [];
  
    this.loadContratos();
  
    // Load tipos contrato
    this.tipocontratoervice.getTiposContrato().subscribe({
      next: (data) => {
        console.log('Tipos de contrato raw:', data);
        this.tiposContrato = this.convertToArray(data);
        console.log('Tipos de contrato converted:', this.tiposContrato);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading tipos contrato:', error);
        this.tiposContrato = [];
      }
    });
  
    // Load departamentos
    this.departamentoService.getDepartamentos().subscribe({
      next: (data) => {
        console.log('Departamentos raw:', data);
        this.departamentos = this.convertToArray(data);
        console.log('Departamentos converted:', this.departamentos);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading departamentos:', error);
        this.departamentos = [];
      }
    });
  
    // Load proveedores
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        console.log('Proveedores raw:', data);
        const proveedoresArray = this.convertToArray(data);
        this.proveedores = proveedoresArray.map((prov: any) => ({
          ...prov,
          municipio_id: prov.municipio_id || null,
          ministerio_id: prov.ministerio_id || null,
          fechaCreacion: prov.fechaCreacion ? new Date(prov.fechaCreacion) : null
        }));
        console.log('Proveedores converted:', this.proveedores);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading proveedores:', error);
        this.proveedores = [];
      }
    });
    this.contratoService.getDashboard().subscribe((data) => {
      console.log(data);
    });
    this.contratoService.getDashboardcontrato().subscribe((data) => {
      console.log(data);
    });
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
      next: (response: any) => {
        // The API might be returning an object with data property containing the array
        const contratosArray = Array.isArray(response) ? response : response.data || [];
        console.log(contratosArray);
        // Defensive check: ensure contratosArray is an array before filtering
        if (!Array.isArray(contratosArray)) {
          this.errorMessage = 'Error: contratos data is not an array.';
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        // Map contratos to ensure nested objects are properly assigned and typed
        const mappedContratos: Contrato[] = contratosArray.map(c => ({
          ...c,
          proveedor: c.Proveedor ? {
            id: c.Proveedor.id,
            nombre: c.Proveedor.nombre,
            codigo: c.Proveedor.codigo,
            estado: c.Proveedor.estado,
            ministerio: c.Proveedor.ministerio,
            municipio: c.Proveedor.municipio,
            municipio_id: c.Proveedor.municipio_id || null,
            ministerio_id: c.Proveedor.ministerio_id || null,
            domicilio: c.Proveedor.domicilio || null,
            fechaCreacion: c.Proveedor.fechaCreacion ? new Date(c.Proveedor.fechaCreacion) : null,
            prefijo_provincia: c.Proveedor.prefijo_provincia,
            provincia: c.Proveedor.provincia,
            telefonos: c.Proveedor.telefonos,
            tipo_empresa: c.Proveedor.tipo_empresa,
            representante_legal_id: c.Proveedor.representante_legal_id,
            updatedAt: c.Proveedor.updatedAt ? new Date(c.Proveedor.updatedAt) : null,
            createdAt: c.Proveedor.createdAt ? new Date(c.Proveedor.createdAt) : null
          } : null,
          departamento: c.Departamento ? {
            id: c.Departamento.id,
            nombre_departamento: c.Departamento.nombre,
            codigo: c.Departamento.codigo,
            descripcion: c.Departamento.descripcion,
            director: c.Departamento.director,
            email: c.Departamento.email,
            entidad_id: c.Departamento.entidad_id,
            estado: c.Departamento.estado,
            fecha_creacion: c.Departamento.fecha_creacion ? new Date(c.Departamento.fecha_creacion) : null,
            ministerio: c.Departamento.ministerio,
            presupuesto_anual: c.Departamento.presupuesto_anual,
            telefono: c.Departamento.telefono,
            updatedAt: c.Departamento.updatedAt ? new Date(c.Departamento.updatedAt) : null,
            createdAt: c.Departamento.createdAt ? new Date(c.Departamento.createdAt) : null
          } : null,
          tipo_contrato: c.TipoContrato ? {
            id: c.TipoContrato.id,
            codigo: c.TipoContrato.codigo,
            descripcion: c.TipoContrato.descripcion,
            documentos_requeridos: c.TipoContrato.documentos_requeridos,
            duracion_maxima: c.TipoContrato.duracion_maxima,
            estado: c.TipoContrato.estado,
            nivel_aprobacion: c.TipoContrato.nivel_aprobacion,
            nombre_tipo_contrato: c.TipoContrato.nombre,
            observaciones: c.TipoContrato.observaciones,
            requiere_aprobacion: c.TipoContrato.requiere_aprobacion,
            updatedAt: c.TipoContrato.updatedAt ? new Date(c.TipoContrato.updatedAt) : null,
            createdAt: c.TipoContrato.createdAt ? new Date(c.TipoContrato.createdAt) : null
          } : null,
          vigencia: c.vigencia ? { vigencia: c.vigencia } : (c.TipoContrato && c.TipoContrato.nombre ? { vigencia: c.TipoContrato.nombre } : null),
          tiempoRestante: this.calcularTiempoRestante(c),
          estado: c.estado,
          no_contrato: c.no_contrato,
          valor_cup: c.valor ? parseFloat(c.valor) : 0,
          valor_usd: c.valor_usd || 0,
          fecha_entrada: c.fecha_inicio ? new Date(c.fecha_inicio) : null,
          fecha_firmado: c.fecha_firmado ? new Date(c.fecha_firmado) : null,
          observaciones: c.observaciones || '',
          id: c.id
        }));
        const contratosFiltrados = mappedContratos.filter(c => c.estado !== 'Vencido');
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
onRightClick(event: MouseEvent) {
  event.preventDefault();  // Evita que aparezca el menú contextual estándar
  window.print();          // Abre el diálogo de impresión
}

print(): void {
  window.print();
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
  toggleColumn(columnKey: string): void {
    const column = this.columnSettings.find(col => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
      this.updateDisplayedColumns();
      this.cdr.detectChanges();
    }
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
    // Use any available date fields for calculation
    let fechaInicio: Date | null = (contrato as any).fecha_inicio ? new Date((contrato as any).fecha_inicio) : null;
    let fechaFin: Date | null = (contrato as any).fecha_fin ? new Date((contrato as any).fecha_fin) : null;

    if (fechaInicio && fechaFin) {
      const diffMs = fechaFin.getTime() - hoy.getTime();
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
    } else if (contrato.fecha_vencido) {
      const fechaVencimiento = new Date(contrato.fecha_vencido);
      const diffMs = fechaVencimiento.getTime() - hoy.getTime();
      if (diffMs < 0) {
        return 'Vencido';
      }
      // Similar calculation as above
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
    } else if (contrato.fecha_firmado && contrato.vigencia && contrato.vigencia.vigencia) {
      const fechaVencimiento = new Date(contrato.fecha_firmado);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + contrato.vigencia.vigencia);
      const diffMs = fechaVencimiento.getTime() - hoy.getTime();
      if (diffMs < 0) {
        return 'Vencido';
      }
      // Similar calculation as above
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
    } else {
      return 'N/A';
    }
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
          this.initSelectedContratoForm();
        }
        this.selectedContratoForm.patchValue({
          no_contrato: this.selectedContrato.no_contrato || '',
          proveedor: this.selectedContrato.proveedor || null,
          tipo_contrato: this.selectedContrato.tipo_contrato || null,
          departamento: this.selectedContrato.departamento || null,
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

  exportToPDF(): void {
    const columns = [
      { key: 'no_contrato', label: 'No. Contrato' },
      { key: 'proveedor', label: 'Proveedor' },
      { key: 'tipo_contrato', label: 'Tipo' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'valor_cup', label: 'Valor CUP' },
      { key: 'valor_usd', label: 'Valor USD' },
      { key: 'fecha_entrada', label: 'F. Entrada' },
      { key: 'estado', label: 'Estado' }
    ];

    // Preparar datos para exportar, mapeando valores anidados y formateando texto
    const data = this.dataSource.filteredData.map(contract => ({
      no_contrato: contract.no_contrato || '',
      proveedor: this.truncateText(contract.proveedor?.nombre || '', 20),
      tipo_contrato: this.truncateText(contract.tipo_contrato?.nombre_tipo_contrato || '', 15),
      departamento: this.truncateText(contract.departamento?.nombre_departamento || '', 15),
      valor_cup: this.formatNumber(contract.valor_cup || 0),
      valor_usd: this.formatNumber(contract.valor_usd || 0),
      fecha_entrada: this.formatDateForPDF(contract.fecha_entrada),
      estado: contract.estado || ''
    }));

    this.exportService.exportToPDF(data, columns, 'Reporte de Contratos', 'assets/images/logo/logo.jpg');
  }


  /**
   * Formatea números para mostrar en el PDF
   */
  private formatNumber(value: number): string {
    if (!value || value === 0) return '0';
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Formatea moneda para mostrar en el PDF
   */
  private formatCurrencyForPDF(value: number, currency: string): string {
    if (!value || value === 0) return `${currency} 0`;
    const formattedValue = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
    return `${currency} ${formattedValue}`;
  }

  /**
   * Formatea fechas para mostrar en el PDF
   */
  private formatDateForPDF(date: Date | string | null | undefined): string {
    if (!date) return '';

    try {
      let dateObj: Date;

      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else {
        return '';
      }

      // Verificar si la fecha es válida
      if (isNaN(dateObj.getTime())) {
        return '';
      }

      return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch {
      return '';
    }
  }

  /**
   * Formatea fechas para CSV
   */
  private formatDateForCSV(date: Date | string | null | undefined): string {
    if (!date) return '';

    try {
      let dateObj: Date;

      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else {
        return '';
      }

      // Verificar si la fecha es válida
      if (isNaN(dateObj.getTime())) {
        return '';
      }

      return dateObj.toLocaleDateString('es-ES');
    } catch {
      return '';
    }
  }

  /**
   * Trunca texto para que quepa en las celdas del PDF
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  exportToCSV(): void {
    const columns = [
      { key: 'no_contrato', label: 'No. Contrato' },
      { key: 'proveedor', label: 'Proveedor' },
      { key: 'tipo_contrato', label: 'Tipo de Contrato' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'valor_cup', label: 'Valor (CUP)' },
      { key: 'valor_usd', label: 'Valor (USD)' },
      { key: 'fecha_entrada', label: 'Fecha Entrada' },
      { key: 'fecha_firmado', label: 'Fecha Firmado' },
      { key: 'vigencia', label: 'Vigencia' },
      { key: 'tiempoRestante', label: 'Tiempo Restante' },
      { key: 'estado', label: 'Estado' },
      { key: 'observaciones', label: 'Observaciones' }
    ];

    const data = this.dataSource.filteredData.map(contract => ({
      no_contrato: contract.no_contrato,
      proveedor: contract.proveedor?.nombre || '',
      tipo_contrato: contract.tipo_contrato?.nombre_tipo_contrato || '',
      departamento: contract.departamento?.nombre_departamento || '',
      valor_cup: contract.valor_cup,
      valor_usd: contract.valor_usd,
      fecha_entrada: contract.fecha_entrada,
      fecha_firmado: contract.fecha_firmado,
      vigencia: contract.vigencia?.vigencia,
      tiempoRestante: (contract as any).tiempoRestante || '',
      estado: contract.estado || '',
      observaciones: contract.observaciones || ''
    }));

    this.exportService.exportToExcel(data, columns, 'contratos_export.csv');
  }
}

