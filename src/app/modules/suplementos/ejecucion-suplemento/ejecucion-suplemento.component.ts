import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EjecucionSuplemento, Suplemento, Proveedor, Contrato, Municipio, Ministerio, Departamento, Vigencia, TipoContrato } from 'app/models/Type';
import { EjecucionSuplementoFormComponent } from './ejecucion-suplemento-form/ejecucion-suplemento-form.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Minimal mock data for testing
const mockMunicipio: Municipio = { 
  id: 1, 
  nombre: 'Municipio 1',
  provincia_id: 1,
  codigo: 'MUN-001',
  activo: true,
  creado_por: 1,
  actualizado_por: 1,
  creado_en: new Date(),
  actualizado_en: new Date()
} as unknown as Municipio;

const mockMinisterio: Ministerio = { 
  id: 1, 
  nombre: 'Ministerio 1',
  codigo: 'MIN-001',
  activo: true,
  creado_por: 1,
  actualizado_por: 1,
  creado_en: new Date(),
  actualizado_en: new Date()
} as unknown as Ministerio;

const mockDepartamento: Departamento = { 
  id: 1, 
  nombre: 'Departamento 1',
  codigo: 'DEP-001',
  activo: true,
  creado_por: 1,
  actualizado_por: 1,
  creado_en: new Date(),
  actualizado_en: new Date()
} as unknown as Departamento;

const mockVigencia: Vigencia = { 
  id: 1, 
  nombre: '2023',
  fecha_inicio: new Date('2023-01-01'),
  fecha_fin: new Date('2023-12-31'),
  activa: true,
  creado_por: 1,
  actualizado_por: 1,
  creado_en: new Date(),
  actualizado_en: new Date()
} as unknown as Vigencia;

const mockTipoContrato: TipoContrato = { 
  id: 1, 
  nombre: 'Servicios',
  codigo: 'SERV',
  activo: true,
  creado_por: 1,
  actualizado_por: 1,
  creado_en: new Date(),
  actualizado_en: new Date()
} as unknown as TipoContrato;

const mockProveedor: Proveedor = {
  id: 1,
  nombre: 'Proveedor 1',
  codigo: 'PROV1',
  municipio_id: 1,
  municipio: mockMunicipio,
  ministerio_id: 1,
  ministerio: mockMinisterio,
  domicilio: 'Dirección 1',
  telefonos: '12345678',
  direccion: 'Dirección 1',
  email: 'proveedor@example.com',
  nit: '12345',
  representante: 'Representante',
  cargo_representante: 'Cargo',
  telefono_representante: '12345678',
  email_representante: 'representante@example.com',
  activo: true,
  fechaCreacion: new Date().toISOString(),
  fechaActualizacion: new Date().toISOString()
} as Proveedor;

const mockContrato: Contrato = {
  id: 1,
  no_contrato_contratacion: 'CON-001',
  objeto: 'Contrato de prueba 1',
  vigencia_id: 1,
  vigencia: mockVigencia,
  proveedor_id: 1,
  proveedor: mockProveedor,
  tipo_contrato_id: 1,
  tipo_contrato: mockTipoContrato,
  no_contrato: 'CON-001',
  fecha_firma: new Date(),
  fecha_vigencia: new Date(),
  monto_total: 10000,
  moneda: 'CUP',
  estado: 'Activo',
  descripcion: 'Descripción',
  observaciones: 'Sin observaciones',
  creado_por: 1,
  creado_en: new Date(),
  actualizado_por: 1,
  actualizado_en: new Date(),
  departamento_id: 1,
  departamento: mockDepartamento,
  fecha_entrada: new Date(),
  fecha_firmado: new Date(),
  fecha_vencido: new Date(),
  monto_cup: 10000,
  monto_usd: 0,
  monto_cl: 0,
  monto_vencimiento_cup: 0,
  monto_vencimiento_usd: 0,
  monto_vencimiento_cl: 0,
  valor_cup: 10000,
  valor_usd: 0,
  valor_cl: 0,
  fecha_comite_contratacion: new Date(),
  no_comite_contratacion: 'CC-001',
  no_acuerdo_comite_contratacion: 'ACC-001',
  fecha_comite_administracion: new Date(),
  no_comite_administracion: 'CA-001',
  no_acuerdo_comite_administracion: 'ACA-001',
  valor_monto_restante: 0
} as unknown as Contrato;

const mockSuplemento: Suplemento = {
  id: 1,
  no_contrato_contratacion: 'SUP-001',
  vigencia_id: 1,
  vigencia: mockVigencia,
  proveedor_id: 1,
  proveedor: mockProveedor,
  tipo_contrato_id: 1,
  tipo_contrato: mockTipoContrato,
  no_contrato_id: 1,
  contrato: mockContrato,
  fecha_entrada: new Date(),
  fecha_firmado: new Date(),
  fecha_vencido: new Date(),
  monto_cup: 1000,
  monto_usd: 0,
  monto_cl: 0,
  monto_vencimiento_cup: 0,
  monto_vencimiento_usd: 0,
  monto_vencimiento_cl: 0,
  estado: 'Activo',
  observaciones: 'Sin observaciones',
  creado_por: 1,
  creado_en: new Date(),
  actualizado_por: 1,
  actualizado_en: new Date(),
  departamento_id: 1,
  departamento: mockDepartamento,
  valor_cup: 1000,
  valor_usd: 0,
  valor_cl: 0,
  fecha_comite_contratacion: new Date(),
  no_comite_contratacion: 'COM-001',
  no_acuerdo_comite_contratacion: 'ACC-001',
  fecha_comite_administracion: new Date(),
  no_comite_administracion: 'CA-001',
  no_acuerdo_comite_administracion: 'ACA-001',
  valor_monto_restante: 0,
  fecha_aprobacion: new Date(),
  no_aprobacion: 'APR-001',
  fecha_notificacion: new Date(),
  no_notificacion: 'NOT-001',
  fecha_entrega: new Date(),
  no_entrega: 'ENT-001',
  fecha_recepcion: new Date(),
  no_recepcion: 'REC-001'
} as unknown as Suplemento;

// Mock data - replace with actual service calls
const mockEjecucionSuplemento: EjecucionSuplemento[] = [
  {
    id: 1,
    proveedor_id: 1,
    no_contrato_id: 1,
    no_suplemento_id: 1,
    costo_cup: 1000,
    costo_cl: 500,
    trabajo_ejecutado: 'Trabajo de prueba 1',
    fecha_ejecucion: new Date('2023-01-15'),
    proveedor: mockProveedor,
    contrato: mockContrato,
    suplemento: {
      ...mockSuplemento,
      contrato: mockContrato
    }
  } as EjecucionSuplemento
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
    MatFormFieldModule

  ],
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

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchInputControl = new FormControl('');

  
  constructor(
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngAfterViewInit() {
    // If you need to set up pagination or sorting, you can do it here
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
}
