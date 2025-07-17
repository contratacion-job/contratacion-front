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
import { Subject } from 'rxjs';
import { SuplementoDetailComponent } from '../suplemento-detail/suplemento-detail.component';
import { SuplementoService } from '../services/suplemento.service';
import { TipoContratoService } from 'app/modules/contratos/services/tipo-contrato.service';
import { DepartamentoService } from 'app/modules/organizacion/departamento.service';
import { ProveedorService } from 'app/modules/proveedores/services/proveedor.service';
import { ExportService } from 'app/services/export.service';

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
      private tipocontratoervice: TipoContratoService,
      private departamentoService: DepartamentoService,
        private proveedorService:ProveedorService,
    private fb: FormBuilder,
    private _matDialog: MatDialog,
    private suplementoService :SuplementoService,
    private exportService: ExportService
  ) {
    this.dataSource = new MatTableDataSource<Suplemento>([]);
    this.initSelectedSuplementoForm();

    this.filterForm = this.fb.group({
      contrato_id_filter: [''],
      monto_filter: [''],
      fecha_suplemento_filter: [''],
      estado_filter: [''],
      descripcion_filter: [''],
      observaciones_filter: [''],
      createdAt_filter: [''],
      updatedAt_filter: [''],
      documentos_filter: ['']
    });
  }


  openAddSuplementoDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(SuplementoFormComponent, {
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
    this.loadSuplementos();

    this.dataSource.sortingDataAccessor = (item: Suplemento, property: string) => {
      switch(property) {
        case 'proveedor': return item.proveedor?.nombre;
        case 'tipo_contrato': return item.tipo_contrato?.nombre_tipo_contrato;
        case 'departamento': return item.departamento?.nombre;
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
        data.departamento?.nombre?.toLowerCase() || '',
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
  
  
  loadSuplementos(): void {
    this.isLoading = true;
    this.errorMessage = '';

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
    this.suplementoService.getSuplementos().subscribe({
      next: (response) => {
        // The backend returns an array directly, not wrapped in data property
        const suplementosArray = this.convertToArray(response);
        // Map backend properties to expected properties
        const mappedSuplementos = suplementosArray.map((item: any) => ({
          id: item.id,
          no_contrato_contratacion: item.contrato_id ? item.contrato_id.toString() : 'N/A',
          proveedor: item.proveedor || null,
          tipo_contrato: item.tipo_contrato || null,
          departamento: item.departamento || null,
          valor_cup: item.monto ? parseFloat(item.monto) : 0,
          valor_usd: 0, // No data provided for USD value
          fecha_entrada: item.contrato_fecha_inicio || '',
          fecha_firmado: item.fecha_suplemento || '',
          vigencia: item.vigencia || null,
          fecha_vencido: item.fecha_vencido || '',
          observaciones: item.observaciones || '',
          // Add missing properties with default or null values to satisfy Suplemento type
          vigencia_id: item.vigencia_id || null,
          proveedor_id: item.proveedor_id || null,
          tipo_contrato_id: item.tipo_contrato_id || null,
          no_contrato_id: item.no_contrato_id || null,
          departamento_id: item.departamento_id || null,
          contrato_id: item.contrato_id || null,
          contrato_fecha_inicio: item.contrato_fecha_inicio || null,
          monto: item.monto || null,
          fecha_suplemento: item.fecha_suplemento || null,
          estado: item.estado || null,
          createdAt: item.createdAt || null,
          updatedAt: item.updatedAt || null,
          descripcion: item.descripcion || null,
          documentos: item.documentos || [],
          monto_vencimiento_cup: item.monto_vencimiento_cup || null,
          monto_vencimiento_cl: item.monto_vencimiento_cl || null,
          monto_vencimiento_usd: item.monto_vencimiento_usd || null,
          fecha_comite_contratacion: item.fecha_comite_contratacion || null,
          fecha_comite_evaluacion: item.fecha_comite_evaluacion || null,
          fecha_comite_juridico: item.fecha_comite_juridico || null,
          fecha_comite_tecnico: item.fecha_comite_tecnico || null,
          fecha_comite_finanzas: item.fecha_comite_finanzas || null,
          fecha_comite_aprobacion: item.fecha_comite_aprobacion || null,
          no_comite_contratacion: item.no_comite_contratacion || null,
          no_acuerdo_comite_contratacion: item.no_acuerdo_comite_contratacion || null,
          fecha_comite_administracion: item.fecha_comite_administracion || null,
          no_comite_administracion: item.no_comite_administracion || null,
          fecha_comite_finanzas_administracion: item.fecha_comite_finanzas_administracion || null,
          no_comite_finanzas_administracion: item.no_comite_finanzas_administracion || null,
          no_acuerdo_comite_administracion: item.no_acuerdo_comite_administracion || null,
          valor_monto_restante: item.valor_monto_restante || null
        }));
        this.dataSource.data = mappedSuplementos;
        this.pagination.length = mappedSuplementos.length;
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
      contrato_id: ['', Validators.required],
      monto: ['', Validators.required],
      fecha_suplemento: ['', Validators.required],
      estado: ['', Validators.required],
      descripcion: [''],
      observaciones: [''],
      createdAt: [''],
      updatedAt: [''],
      documentos: [[]]
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
  
  closeDetails(): void {
    this.selectedSuplemento = null;
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) {
      return '';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  exportToCSV(): void {
    const dataToExport = this.dataSource.filteredData || this.dataSource.data;

    if (!dataToExport || dataToExport.length === 0) {
      return;
    }

    const columns = [
      { key: 'no_contrato_contratacion', label: 'No. Contrato' },
      { key: 'proveedor', label: 'Proveedor' },
      { key: 'tipo_contrato', label: 'Tipo de Contrato' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'valor_cup', label: 'Valor (CUP)' },
      { key: 'valor_usd', label: 'Valor (USD)' },
      { key: 'fecha_entrada', label: 'Fecha Entrada' },
      { key: 'fecha_firmado', label: 'Fecha Firmado' },
      { key: 'vigencia', label: 'Vigencia' },
      { key: 'fecha_vencido', label: 'Fecha Vencido' },
      { key: 'observaciones', label: 'Observaciones' }
    ];

    const data = dataToExport.map(item => ({
      no_contrato_contratacion: item.no_contrato_contratacion,
      proveedor: item.proveedor?.nombre || '',
      tipo_contrato: item.tipo_contrato?.nombre_tipo_contrato || '',
      departamento: item.departamento?.nombre || '',
      valor_cup: item.valor_cup,
      valor_usd: item.valor_usd,
      fecha_entrada: item.fecha_entrada,
      fecha_firmado: item.fecha_firmado,
      vigencia: item.vigencia?.vigencia,
      fecha_vencido: item.fecha_vencido,
      observaciones: item.observaciones || ''
    }));

    this.exportService.exportToExcel(data, columns, 'suplementos_export.csv');
  }

  exportToPDF(): void {
    const columns = [
      { key: 'no_contrato_contratacion', label: 'No. Contrato' },
      { key: 'proveedor', label: 'Proveedor' },
      { key: 'tipo_contrato', label: 'Tipo de Contrato' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'valor_cup', label: 'Valor (CUP)' },
      { key: 'valor_usd', label: 'Valor (USD)' },
      { key: 'fecha_entrada', label: 'Fecha Entrada' },
      { key: 'fecha_firmado', label: 'Fecha Firmado' },
      { key: 'vigencia', label: 'Vigencia' },
      { key: 'fecha_vencido', label: 'Fecha Vencido' },
      { key: 'observaciones', label: 'Observaciones' }
    ];

    const dataToExport = this.dataSource.filteredData || this.dataSource.data;

    if (!dataToExport || dataToExport.length === 0) {
      return;
    }

    const data = dataToExport.map(item => ({
      no_contrato_contratacion: item.no_contrato_contratacion,
      proveedor: this.truncateText(item.proveedor?.nombre || '', 20),
      tipo_contrato: this.truncateText(item.tipo_contrato?.nombre_tipo_contrato || '', 15),
      departamento: this.truncateText(item.departamento?.nombre || '', 15),
      valor_cup: this.formatNumber(item.valor_cup),
      valor_usd: this.formatNumber(item.valor_usd),
      fecha_entrada: this.formatDateForPDF(item.fecha_entrada),
      fecha_firmado: this.formatDateForPDF(item.fecha_firmado),
      vigencia: item.vigencia?.vigencia,
      fecha_vencido: this.formatDateForPDF(item.fecha_vencido),
      observaciones: item.observaciones || ''
    }));

    this.exportService.exportToPDF(data, columns, 'Reporte de Suplementos', 'assets/images/logo/logo.jpg');
  }

  print(): void {
    window.print();
  }

  private formatNumber(value: number): string {
    if (!value || value === 0) return '0';
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

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




}
