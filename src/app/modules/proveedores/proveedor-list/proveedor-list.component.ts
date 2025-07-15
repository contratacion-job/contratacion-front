import { CatalogService } from './../../../services/catalog.service';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProveedorFormComponent } from '../proveedor-form/proveedor-form.component';
import { ProveedorService } from '../services/proveedor.service';
import { RepresentanteService } from '../services/representante.service';
import { ExportService } from 'app/services/export.service';

import { Proveedor, Representante } from 'app/models/Type';

@Component({
  selector: 'app-proveedor-list',
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
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.scss']
})
export class ProveedorListComponent implements OnInit {
  data: any[] = [];

  ministerios: any[] = [];
  municipios: any[] = [];
  mockMinisterio: any[] = []; // Agregar esta línea
  mockMunicipio: any[] = [];  // Agregar esta línea
  
  columns = [
    { key: 'nombre', label: 'Nombre', editable: true },
    { key: 'codigo', label: 'Código', editable: true },
    { key: 'estado', label: 'Estado', editable: false },
    // Removed tipo_empresa as it does not exist in Proveedor
    { key: 'representantes', label: 'Representantes', editable: false },
    { key: 'telefonos', label: 'Teléfonos', editable: true },
    { key: 'prefijo_provincia', label: 'Prefijo Provincia', editable: false },
    { key: 'provincia', label: 'Provincia', editable: false },
    { key: 'municipio', label: 'Municipio', nestedKey: 'nombre_municipio', editable: false, selectOptions: [] },
    { key: 'ministerio', label: 'Ministerio', nestedKey: 'nombre_ministerio', editable: false, selectOptions: [] },
    { key: 'createdAt', label: 'Creado', editable: false },
    { key: 'updatedAt', label: 'Actualizado', editable: false }
  ];

  // Helper method to get concatenated representantes names
  getRepresentantesNames(proveedor: any): string {
    if (!proveedor.representantes || !Array.isArray(proveedor.representantes)) {
      return 'Sin representantes';
    }
    return proveedor.representantes.map((r: any) => `${r.nombre} ${r.apellido}`).join(', ');
  }

  title = 'Proveedores';
  addButtonText = 'Agregar Proveedor';
  dataSource: MatTableDataSource<Proveedor>;
  displayedColumns: string[] = [];
  searchInputControl = new FormControl('');
  selectedRow: any = null;
  selectedRowForm: FormGroup;
  isLoading = false;
  pagination = { length: 0, page: 0, size: 10 };
  private _unsubscribeAll = new Subject<void>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  proveedoresConRepresentantes: any[] = [];

  constructor(
    private dialog: MatDialog,
    private proveedorService: ProveedorService,

    private CatalogService: CatalogService,
    private representanteService: RepresentanteService,
    private cdr: ChangeDetectorRef,
    private exportService: ExportService
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selectedRowForm = new FormGroup({});
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key).concat('details');
    
    // Cargar catálogos primero
    forkJoin({
      ministerios: this.CatalogService.getMinisterios(),
      municipios: this.CatalogService.getMunicipios()

    }).subscribe({
      next: (catalogs) => {
        // Procesar ministerios - viene como array de objetos con nombre y sigla
        this.ministerios = catalogs.ministerios?.data || [];
        this.columns.find(col => col.key === 'ministerio').selectOptions = this.ministerios;
        this.mockMinisterio = this.ministerios;
  
        // Procesar municipios - viene como objeto con claves numéricas y arrays de strings
        let municipiosArray: any[] = [];
        if (catalogs.municipios?.data) {
          let idCounter = 1;
          for (const [provinciaId, municipios] of Object.entries(catalogs.municipios.data)) {
            if (Array.isArray(municipios)) {
              municipios.forEach((nombreMunicipio: string) => {
                municipiosArray.push({
                  id: idCounter++,
                  provincia_id: Number(provinciaId),
                  nombre_municipio: nombreMunicipio
                });
              });
            }
          }
        }
        this.municipios = municipiosArray;
        this.columns.find(col => col.key === 'municipio').selectOptions = this.municipios;
        this.mockMunicipio = this.municipios;
  
        // Cargar proveedores después de tener los catálogos
        this.loadProveedores();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading catalogs:', error);
        // Cargar proveedores aunque falle la carga de catálogos
        this.loadProveedores();
      }
    });
   this.proveedorService.getDashboardproveedor();
    // Configurar búsqueda
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(value => {
        this.closeDetails();
        this.dataSource.filter = value?.trim().toLowerCase() || '';
        this.cdr.detectChanges();
        this.dataSource._updateChangeSubscription();
      });
  
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = [
        data.nombre || '',
        data.codigo || '',
        data.representante || '',
        data.telefonos || '',
        data.domicilio || '',
        this.getMunicipioName(data.municipio),
        this.getMinisterioName(data.ministerio)
      ].join(' ').toLowerCase();
      
      return searchStr.includes(filter);
    };
  }
  getMunicipioName(municipio: any): string {
    if (!municipio) return 'N/A';
    if (typeof municipio === 'string') {
      // Si es string, ya es el nombre del municipio
      return municipio;
    }
    return municipio.nombre_municipio || 'N/A';
  }
  
  getMinisterioName(ministerio: any): string {
    if (!ministerio) return 'N/A';
    if (typeof ministerio === 'string') {
      // Si es string, buscar en el catálogo para obtener el nombre completo
      const found = this.ministerios.find(m => m.sigla === ministerio || m.nombre === ministerio);
      return found ? found.nombre : ministerio;
    }
    return ministerio.nombre || 'N/A';
  }
  
  closeDetails(): void {
    this.selectedRow = null;
    this.cdr.detectChanges();
  }

  loadProveedores(): void {
    this.isLoading = true;

    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => {
        console.log('Proveedores received from service:', proveedores);
        this.data = proveedores;
        this.dataSource.data = this.data;

        this.pagination.length = this.data.length;

        // Asignar sort y paginator después de asignar data
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        // Forzar actualización de la tabla
        this.dataSource._updateChangeSubscription();

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading proveedores:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  getNestedValue(row: any, key: string, nestedKey?: string): any {
    if (nestedKey && row[key]) {
      return row[key][nestedKey];
    }
    return row[key] || '';
  }

  toggleDetails(rowId: number): void {
    this.selectedRow = this.selectedRow?.id === rowId ? null : this.data.find(row => row.id === rowId);
    this.selectedRowForm = new FormGroup({
      nombre: new FormControl(this.selectedRow?.nombre),
      codigo: new FormControl(this.selectedRow?.codigo),
      telefonos: new FormControl(this.selectedRow?.telefonos),
      domicilio: new FormControl(this.selectedRow?.domicilio),
      municipio: new FormControl(this.selectedRow?.municipio),
      ministerio: new FormControl(this.selectedRow?.ministerio),
      representante: new FormControl(this.selectedRow?.representante)
    });
    this.cdr.markForCheck();
  }

  createRecord(): void {
    this.addNewProveedor();
  }

  addNewProveedor(): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(ProveedorFormComponent, {
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
        this.proveedorService.createProveedor(result).subscribe({
          next: (newProveedor) => {
            this.loadProveedores();
          },
          error: (error) => {
            console.error('Error creating proveedor:', error);
          }
        });
      }
    });
  }

  updateSelectedRecord(): void {
    if (this.selectedRow) {
      const updatedData = { ...this.selectedRow, ...this.selectedRowForm.value };
      this.proveedorService.updateProveedor(this.selectedRow.id, updatedData).subscribe({
        next: () => {
          this.loadProveedores();
          this.selectedRow = null;
        },
        error: (error) => {
          console.error('Error updating proveedor:', error);
        }
      });
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      this.proveedorService.deleteProveedor(this.selectedRow.id).subscribe({
        next: () => {
          this.loadProveedores();
          this.selectedRow = null;
        },
        error: (error) => {
          console.error('Error deleting proveedor:', error);
        }
      });
    }
  }

  exportToCSV(): void {
    if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      return;
    }

    const columns = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'codigo', label: 'Código' },
      { key: 'estado', label: 'Estado' },
      { key: 'representantes', label: 'Representantes' },
      { key: 'telefonos', label: 'Teléfonos' },
      { key: 'prefijo_provincia', label: 'Prefijo Provincia' },
      { key: 'provincia', label: 'Provincia' },
      { key: 'municipio', label: 'Municipio' },
      { key: 'ministerio', label: 'Ministerio' },
      { key: 'createdAt', label: 'Creado' },
      { key: 'updatedAt', label: 'Actualizado' }
    ];

    const data = this.dataSource.filteredData.map(proveedor => ({
      nombre: proveedor.nombre || '',
      codigo: proveedor.codigo || '',
      estado: proveedor.estado || '',
      representantes: this.getRepresentantesNames(proveedor),
      telefonos: proveedor.telefonos || '',
      prefijo_provincia: proveedor.prefijo_provincia || '',
      provincia: proveedor.provincia || '',
      municipio: typeof proveedor.municipio === 'string' ? proveedor.municipio : proveedor.municipio?.nombre_municipio || '',
      ministerio: typeof proveedor.ministerio === 'string' ? proveedor.ministerio : proveedor.ministerio?.nombre_ministerio || '',
      createdAt: proveedor.createdAt || '',
      updatedAt: proveedor.updatedAt || ''
    }));

    this.exportService.exportToExcel(data, columns, 'proveedores_export.csv');
  }

  exportToPDF(): void {
    if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const columns = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'codigo', label: 'Código' },
      { key: 'telefonos', label: 'Teléfonos' },
      { key: 'domicilio', label: 'Domicilio' },
      { key: 'municipio', label: 'Municipio' },
      { key: 'ministerio', label: 'Ministerio' }
    ];

    const data = this.dataSource.filteredData.map(proveedor => ({
      nombre: this.truncateText(proveedor.nombre || '', 25),
      codigo: proveedor.codigo || '',
      telefonos: this.truncateText(proveedor.telefonos || '', 20),
      domicilio: this.truncateText(proveedor.domicilio || '', 30),
      municipio: typeof proveedor.municipio === 'string' ? proveedor.municipio : proveedor.municipio?.nombre_municipio || '',
      ministerio: typeof proveedor.ministerio === 'string' ? proveedor.ministerio : proveedor.ministerio?.nombre_ministerio || ''
    }));

    this.exportService.exportToPDF(data, columns, 'Reporte de Proveedores', 'assets/images/logo/logo.jpg');
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
}
