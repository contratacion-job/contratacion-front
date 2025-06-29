import { Component, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { 
  EjecucionSuplemento, 
  Proveedor, 
  Contrato, 
  Suplemento, 
  Municipio, 
  Ministerio, 
  Departamento, 
  Vigencia, 
  TipoContrato,
  Provincia
} from 'app/models/Type';
import { EjecucionSuplementoFormComponent } from './ejecucion-suplemento-form/ejecucion-suplemento-form.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Helper type to make all properties optional and add missing ones
type PartialWithId<T> = Partial<T> & { id: number };

// Extended EjecucionSuplemento for mock data
interface EjecucionSuplementoMock extends Omit<EjecucionSuplemento, 'proveedor' | 'contrato' | 'suplemento' | 'fecha_creacion' | 'fecha_actualizacion' | 'usuario_creacion' | 'usuario_actualizacion' | 'estado'> {
  proveedor: Proveedor;
  contrato: Contrato;
  suplemento: Suplemento;
  fecha_creacion: Date | string;
  fecha_actualizacion: Date | string;
  usuario_creacion: string;
  usuario_actualizacion: string;
  estado: string;
}

// Mock data for testing
const mockProvincia: Provincia = {
  id: 1,
  nombre_provincia: 'La Habana'
};

const mockMunicipio: Municipio = { 
  id: 1, 
  nombre_municipio: 'La Habana Vieja',
  provincia_id: 1,
  provincia: mockProvincia
};

const mockMinisterio: Ministerio = { 
  id: 1, 
  nombre_ministerio: 'MINSAP',
  descripcion: 'Ministerio de Salud Pública'
};

const mockDepartamento: Departamento = { 
  id: 1, 
  nombre_departamento: 'Contratación',
  codigo: 'DEP-001',
  descripcion: 'Departamento de Contratación'
};

const mockVigencia: Vigencia = { 
  id: 1, 
  vigencia: 2024,
  alerta_vigencia: 1,
  tipo_vigencia: 'Anual',
  tipo_alerta_vigencia: 'ninguna'
};

const mockTipoContrato: TipoContrato = { 
  id: 1, 
  nombre_tipo_contrato: 'Servicios',
  descripcion: 'Contrato de servicios'
};

const mockProveedor: Proveedor = {
  id: 1,
  municipio_id: 1,
  ministerio_id: 1,
  nombre: 'Empresa de Prueba',
  codigo: 'PRUEBA001',
  telefonos: '555-1234',
  domicilio: 'Calle 123',
  municipio: mockMunicipio,
  ministerio: mockMinisterio,
  fechaCreacion: '2024-01-01',
  representantes: []
};

const mockContrato: Contrato = {
  id: 1,
  vigencia_id: 1,
  proveedor_id: 1,
  tipo_contrato_id: 1,
  no_contrato: 123,
  fecha_entrada: new Date('2024-01-01'),
  fecha_firmado: new Date('2024-01-01'),
  valor_cup: 10000,
  monto_vencimiento_cup: 10000,
  monto_vencimiento_cl: 100,
  valor_usd: 100,
  monto_vencimiento_usd: 100,
  observaciones: 'Contrato de prueba',
  no_contrato_contratacion: 123,
  fecha_comite_contratacion: new Date('2024-01-01'),
  no_comite_contratacion: 1,
  no_acuerdo_comite_contratacion: 1,
  fecha_comite_administracion: new Date('2024-01-01'),
  no_comite_administracion: 1,
  no_acuerdo_comite_administracion: 1,
  departamento_id: 1,
  fecha_vencido: new Date('2024-12-31'),
  valor_monto_restante: 10000,
  entidad: ['Entidad 1'],
  vigencia: mockVigencia,
  proveedor: mockProveedor,
  tipo_contrato: mockTipoContrato,
  departamento: mockDepartamento,
  estado: 'activo',
  fecha_creacion: new Date('2024-01-01'),
  fecha_actualizacion: new Date('2024-01-01'),
  usuario_creacion: 'system',
  usuario_actualizacion: 'system'
} as Contrato;

const mockSuplemento: Suplemento = {
  id: 1,
  vigencia_id: 1,
  proveedor_id: 1,
  tipo_contrato_id: 1,
  no_contrato_id: 1,
  departamento_id: 1,
  fecha_entrada: new Date('2024-01-01'),
  fecha_firmado: new Date('2024-01-01'),
  valor_cup: 5000,
  monto_vencimiento_cup: 5000,
  monto_vencimiento_cl: 50,
  valor_usd: 50,
  monto_vencimiento_usd: 50,
  observaciones: 'Suplemento de prueba',
  no_contrato_contratacion: 123,
  fecha_comite_contratacion: new Date('2024-01-01'),
  no_comite_contratacion: 1,
  no_acuerdo_comite_contratacion: 1,
  fecha_comite_administracion: new Date('2024-01-01'),
  no_comite_administracion: 1,
  no_acuerdo_comite_administracion: 1,
  fecha_vencido: new Date('2024-12-31'),
  valor_monto_restante: 5000,
  vigencia: mockVigencia,
  proveedor: mockProveedor,
  tipo_contrato: mockTipoContrato,
  departamento: mockDepartamento,
  fecha_creacion: new Date('2024-01-01'),
  fecha_actualizacion: new Date('2024-01-01'),
  usuario_creacion: 'system',
  usuario_actualizacion: 'system',
  estado: 'activo',
  no_suplemento: 1,
  no_contrato: 123
} as Suplemento;

const mockEjecucionSuplemento: EjecucionSuplementoMock[] = [
  {
    id: 1,
    no_suplemento_id: 1,
    no_contrato_id: 1,
    proveedor_id: 1,
    trabajo_ejecutado: 'Trabajo de prueba',
    costo_cup: 1000,
    costo_cl: 10,
    fecha_ejecucion: new Date('2024-01-01'),
    proveedor: mockProveedor,
    contrato: mockContrato,
    suplemento: mockSuplemento,
    fecha_creacion: new Date('2024-01-01'),
    fecha_actualizacion: new Date('2024-01-01'),
    usuario_creacion: 'system',
    usuario_actualizacion: 'system',
    estado: 'activo'
  },
  {
    id: 2,
    no_suplemento_id: 1,
    no_contrato_id: 1,
    proveedor_id: 1,
    trabajo_ejecutado: 'Trabajo de prueba 2',
    costo_cup: 2000,
    costo_cl: 20,
    fecha_ejecucion: new Date('2024-02-01'),
    proveedor: mockProveedor,
    contrato: mockContrato,
    suplemento: mockSuplemento,
    fecha_creacion: new Date('2024-01-01'),
    fecha_actualizacion: new Date('2024-01-01'),
    usuario_creacion: 'system',
    usuario_actualizacion: 'system',
    estado: 'activo'
  }
];

@Component({
  selector: 'app-ejecucion-suplemento',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  providers: [
    MatDatepicker,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ejecucion-suplemento.component.html',
  styleUrls: ['./ejecucion-suplemento.component.scss']
})
export class EjecucionSuplementoComponent implements AfterViewInit, OnDestroy {
  [x: string]: any;
  // Implement OnDestroy
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  ejecuciones: Partial<EjecucionSuplemento>[] = [];
  displayedColumns: string[] = ['no_suplemento', 'proveedor', 'contrato', 'trabajo_ejecutado', 'costo_cup', 'costo_cl', 'fecha_ejecucion', 'acciones'];
  dataSource: MatTableDataSource<Partial<EjecucionSuplemento>>;
  selectedEjecucion: Partial<EjecucionSuplemento> | null = null;
  selectedEjecucionForm: FormGroup = this._formBuilder.group({
    id: [''],
    no_suplemento_id: ['', Validators.required],
    proveedor_id: ['', Validators.required],
    no_contrato_id: ['', Validators.required],
    trabajo_ejecutado: ['', Validators.required],
    costo_cup: ['', [Validators.required, Validators.min(0)]],
    costo_cl: ['', [Validators.required, Validators.min(0)]],
    fecha_ejecucion: ['', Validators.required],
    proveedor: [null],
    contrato: [null],
    suplemento: [null]
  });
  isLoadingResults = true;
  isRateLimitReached = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchInputControl = new FormControl('');
  filterForm: FormGroup;

  constructor(
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {
    // Initialize dataSource with empty array first
    this.dataSource = new MatTableDataSource<Partial<EjecucionSuplemento>>([]);
    this.initFilterForm();
    
    // Load mock data (replace with actual API call in production)
    this.loadEjecuciones();
  }
  
  private loadEjecuciones(): void {
    // Simulate API call
    this.isLoadingResults = true;
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<Partial<EjecucionSuplemento>>(mockEjecucionSuplemento);
      this.dataSource.paginator = this._paginator;
      this.dataSource.sort = this._sort;
      this.resultsLength = mockEjecucionSuplemento.length;
      this.isLoadingResults = false;
    }, 500);
  }

  private initFilterForm(): void {
    this.filterForm = this._formBuilder.group({
      no_suplemento_id_filter: [''],
      proveedor_filter: [''],
      contrato_filter: [''],
      trabajo_ejecutado_filter: [''],
      costo_cup_filter: [''],
      costo_cl_filter: [''],
      fecha_ejecucion_filter: [''],
      no_contrato_filter: [''],
      valor_cup_filter: [''],
      valor_usd_filter: [''],
      fecha_entrada_filter: [''],
      fecha_firmado_filter: ['']
    });
  }

  private initSelectedEjecucionForm(): void {
    // Form is now initialized in the property declaration
  }

  ngAfterViewInit() {
    // Set up pagination and sorting
    if (this.dataSource) {
      this.dataSource.paginator = this._paginator;
      this.dataSource.sort = this._sort;
    }
  }


  openAddEjecucionDialog(): void {
    const dialogRef = this._matDialog.open(EjecucionSuplementoFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { action: 'new', ejecucion: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showMessage('Ejecución de suplemento guardada exitosamente');
        // Refresh the table or update the data source here
      }
    });
  }

  openEditEjecucionDialog(ejecucion: EjecucionSuplemento): void {
    const dialogRef = this._matDialog.open(EjecucionSuplementoFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { action: 'edit', ejecucion: { ...ejecucion } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showMessage('Ejecución de suplemento actualizada exitosamente');
        // Refresh the table or update the data source here
      }
    });
  }

  deleteEjecucion(ejecucion: EjecucionSuplemento): void {
    if (confirm(`¿Está seguro de eliminar la ejecución del suplemento ${ejecucion.no_suplemento_id}?`)) {
      // Call your service to delete the ejecucion
      // this.yourService.deleteEjecucion(ejecucion.id).subscribe(() => {
      //   this.showMessage('Ejecución de suplemento eliminada exitosamente');
      //   // Refresh the table or update the data source here
      // });
      this.showMessage('Ejecución de suplemento eliminada exitosamente');
    }
  }

  private showMessage(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
  applyFilters(): void {
    // Implementar la lógica de filtrado aquí
    this.showMessage('Filtros aplicados');
  }
  
  clearFilters(): void {
    this.searchInputControl.setValue('');
    this.showMessage('Filtros limpiados');
  }
  
  exportToCSV(): void {
    // Implementar la lógica de exportación aquí
    this.showMessage('Exportar a CSV no implementado');
  }

  onPageChange(event: any): void {
    // Handle page change event
    // If you need to fetch new data when page changes, you can do it here
    // For example:
    // this.pageIndex = event.pageIndex;
    // this.pageSize = event.pageSize;
    // this.loadEjecuciones();
  }

  toggleDetails(id: number): void {
    if (this.selectedEjecucion?.id === id) {
      this.selectedEjecucion = null;
    } else {
      const ejecucion = this.dataSource.data.find(e => e.id === id);
      this.selectedEjecucion = ejecucion || null;
      if (ejecucion) {
        this.selectedEjecucionForm.patchValue({
          id: ejecucion.id,
          no_suplemento_id: ejecucion.no_suplemento_id,
          proveedor_id: ejecucion.proveedor_id,
          no_contrato_id: ejecucion.no_contrato_id,
          trabajo_ejecutado: ejecucion.trabajo_ejecutado,
          costo_cup: ejecucion.costo_cup,
          costo_cl: ejecucion.costo_cl,
          fecha_ejecucion: ejecucion.fecha_ejecucion ? new Date(ejecucion.fecha_ejecucion).toISOString().substring(0, 10) : null,
          proveedor: ejecucion.proveedor,
          contrato: ejecucion.contrato,
          suplemento: ejecucion.suplemento
        });
      }
    }
  }

  onSaveEjecucion(): void {
    if (this.selectedEjecucionForm.invalid) {
      this.showMessage('Por favor complete todos los campos requeridos');
      return;
    }

    const formValue = this.selectedEjecucionForm.getRawValue();
    const updatedEjecucion: Partial<EjecucionSuplemento> = {
      ...this.selectedEjecucion,
      ...formValue,
      // Ensure dates are properly formatted
      fecha_ejecucion: formValue.fecha_ejecucion ? new Date(formValue.fecha_ejecucion) : null,
      // Preserve related objects
      proveedor: this.selectedEjecucion?.proveedor,
      contrato: this.selectedEjecucion?.contrato,
      suplemento: this.selectedEjecucion?.suplemento
    };

    // Here you would typically call a service to update the ejecucion
    console.log('Updating ejecucion:', updatedEjecucion);
    
    // For now, we'll just update the local data
    const index = this.dataSource.data.findIndex(e => e.id === updatedEjecucion.id);
    if (index > -1) {
      this.dataSource.data[index] = updatedEjecucion;
      this.dataSource._updateChangeSubscription();
      this.showMessage('Ejecución actualizada correctamente');
      this.selectedEjecucion = null; // Close the form after saving
    }
  }

  onCancelEdit(): void {
    this.selectedEjecucion = null;
  }
}
