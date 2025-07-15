import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { RepresentanteService } from '../../services/representante.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Representante, Suplemento } from 'app/models/Type';
import { Contrato } from 'app/models/Type';
import { ContratoService } from 'app/modules/contratos/services/contrato.service';
import { SuplementoService } from 'app/modules/suplementos/services/suplemento.service';
import { RepresentanteFormComponent } from '../representante-form.component';
import { ExportService } from 'app/services/export.service';

@Component({
  selector: 'app-representante-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  templateUrl: './representante-list.component.html',
  styleUrls: ['./representante-list.component.scss']
})
export class RepresentanteListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Representante> = new MatTableDataSource();
  suplementosDataSource: MatTableDataSource<Suplemento> = new MatTableDataSource();

  columnSettings = [
    { key: 'nombre', label: 'Nombre', visible: true, tooltip: 'Nombre completo del representante' },
    { key: 'apellido', label: 'Apellido', visible: true, tooltip: 'Apellido completo del representante' },
    { key: 'cargo', label: 'Cargo', visible: true, tooltip: 'Cargo del representante' },
    { key: 'telefono', label: 'Teléfono', visible: true, tooltip: 'Teléfono del representante' },
    { key: 'email', label: 'Email', visible: true, tooltip: 'Email del representante' },
    { key: 'estado', label: 'Estado', visible: true, tooltip: 'Estado del representante' },
    { key: 'proveedor_nombre', label: 'Proveedor', visible: true, tooltip: 'Nombre del proveedor' },
    { key: 'proveedor_codigo', label: 'Código Proveedor', visible: false, tooltip: 'Código del proveedor' },
    { key: 'tipo_empresa', label: 'Tipo Empresa', visible: false, tooltip: 'Tipo de empresa' },
    { key: 'ministerio', label: 'Ministerio', visible: true, tooltip: 'Ministerio del proveedor' },
    { key: 'provincia', label: 'Provincia', visible: false, tooltip: 'Provincia del proveedor' },
    { key: 'municipio', label: 'Municipio', visible: false, tooltip: 'Municipio del proveedor' },
    { key: 'numero_documento', label: 'Número Documento', visible: false, tooltip: 'Número de documento' },
    { key: 'tipo_documento', label: 'Tipo Documento', visible: false, tooltip: 'Tipo de documento' }
  ];

  displayedColumns: string[] = [
    'proveedor_nombre',
    'proveedor_codigo',
    'representante',
    'cargo',
    'telefono',
    'email',
    'estado',
    'tipo_empresa',
    'ministerio',
    'provincia',
    'municipio',
    'numero_documento',
    'acciones'
  ];

  displayedSuplementosColumns: string[] = ['no_suplemento', 'fecha_firmado', 'valor_cup', 'valor_usd', 'estado', 'acciones'];
  selection = new Set<number>();
  suplementoSelection = new Set<number>();

  isLoading = false;
  isSuplementosLoading = false;

  contratos: Contrato[] = [];
  suplementos: Suplemento[] = [];
  showSuplementos = false;
  selectedContratoId: number | null = null;
  searchControl = new FormControl('');
  selectedRowForm: FormGroup;

  @ViewChild('sort') sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('columnMenu', { read: MatMenuTrigger }) columnMenuTrigger!: MatMenuTrigger;
  pagination = {
    length: 0,
    page: 0,
    size: 10
  };

  selectedRow: Representante | null = null;

  constructor(
    private representanteService: RepresentanteService,
    private proveedorService: ProveedorService,
    private contratoService: ContratoService,
    private suplementoService: SuplementoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private exportService: ExportService
  ) {
    this.dataSource = new MatTableDataSource<Representante>([]);
    this.suplementosDataSource = new MatTableDataSource<Suplemento>([]);

    this.selectedRowForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      email: [''],
      cargo: [''],
      estado: ['']
    });
  }

  getGridColumns(): string {
    const visibleColumnsCount = this.columnSettings.filter(col => col.visible).length;
    // Assign a flexible width for each visible column
    const columnWidths = this.columnSettings
      .filter(col => col.visible)
      .map(() => 'minmax(150px, 1fr)')
      .join(' ');
    // Add fixed width for the actions column
    return `${columnWidths} minmax(100px, 100px)`;
  }

  getVisibleColumns() {
    return this.columnSettings.filter(col => col.visible);
  }

  closeColumnMenu(): void {
    if (this.columnMenuTrigger) {
      this.columnMenuTrigger.closeMenu();
    }
  }

  loadRepresentantes(): void {
    this.isLoading = true;
    this.representanteService.getRepresentantes().subscribe({
      next: (response: any) => {
        const representantes = Array.isArray(response) ? response : response.data || [];
        this.proveedorService.getProveedores().subscribe({
          next: (proveedores) => {
            representantes.forEach((rep: any) => {
              const proveedor = proveedores.find((p: any) => p.id === rep.proveedor_id);
              if (proveedor) {
                rep.Proveedor = {
                  id: proveedor.id,
                  nombre: proveedor.nombre || '',
                  codigo: proveedor.codigo || '',
                  tipo_empresa: '',
                  ministerio: typeof proveedor.ministerio === 'string' ? proveedor.ministerio : (proveedor.ministerio?.nombre_ministerio || ''),
                  provincia: proveedor.provincia || '',
                  municipio: typeof proveedor.municipio === 'string' ? proveedor.municipio : (proveedor.municipio?.nombre_municipio || ''),
                  telefonos: proveedor.telefonos || '',
                  prefijo_provincia: proveedor.prefijo_provincia || '',
                  estado: proveedor.estado || '',
                  representante_legal_id: proveedor.representante_legal_id,
                  createdAt: proveedor.createdAt || '',
                  updatedAt: proveedor.updatedAt || ''
                };
              } else {
                rep.Proveedor = null;
              }
            });

            this.dataSource.data = representantes;
            this.pagination.length = representantes.length;

            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
              this.dataSource.sort = this.sort;
            }

            if (this.selectedContratoId) {
              this.applyContratoFilter();
            }
            this.isLoading = false;
          },
          error: (error) => {
            this.showMessage('Error al cargar los proveedores', 'error');
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.showMessage('Error al cargar los representantes', 'error');
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource.data.length > 0) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    this.dataSource.connect().subscribe(() => {
      if (this.paginator && this.sort) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngOnInit(): void {
    this.setupFilter();
    this.loadRepresentantes();
    this.loadSuplementos();

    this.dataSource.filterPredicate = (data: Representante, filter: string) => {
      const searchStr = [
        data.Proveedor?.nombre || '',
        data.Proveedor?.codigo || '',
        data.nombre || '',
        data.apellido || '',
        data.cargo || '',
        data.telefono || '',
        data.email || '',
        data.estado || '',
        data.Proveedor?.tipo_empresa || '',
        data.Proveedor?.ministerio || '',
        data.Proveedor?.provincia || '',
        data.Proveedor?.municipio || '',
        data.numero_documento || '',
        data.tipo_documento || ''
      ].join(' ').toLowerCase();

      return searchStr.includes(filter);
    };
  }

  setupFilter(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm);
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.selectedContratoId) {
      this.applyContratoFilter();
    }
  }

  showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  applyContratoFilter(): void {
    if (this.selectedContratoId) {
      const originalData = [...this.dataSource.data];
      this.dataSource.data = originalData.filter(r => r['contrato_id'] === this.selectedContratoId);
    } else {
      this.loadRepresentantes();
    }
  }

  loadSuplementos(): void {
    this.isSuplementosLoading = true;
    this.suplementoService.getSuplementos().subscribe({
      next: (suplementos) => {
        this.suplementos = suplementos;
        this.suplementosDataSource.data = suplementos;
        this.suplementosDataSource.paginator = this.paginator;
        this.suplementosDataSource.sort = this.sort;
        this.isSuplementosLoading = false;
      },
      error: (error) => {
        this.showMessage('Error al cargar los suplementos', 'error');
        this.isSuplementosLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(RepresentanteFormComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadRepresentantes();
      }
    });
  }

  exportToPDF(): void {
    const columns = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellido', label: 'Apellido' },
      { key: 'cargo', label: 'Cargo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'email', label: 'Email' },
      { key: 'estado', label: 'Estado' },
      { key: 'proveedor_nombre', label: 'Proveedor' },
      { key: 'proveedor_codigo', label: 'Código Proveedor' },
      { key: 'tipo_empresa', label: 'Tipo Empresa' },
      { key: 'ministerio', label: 'Ministerio' },
      { key: 'provincia', label: 'Provincia' },
      { key: 'municipio', label: 'Municipio' },
      { key: 'numero_documento', label: 'Número Documento' },
      { key: 'tipo_documento', label: 'Tipo Documento' }
    ];

    const data = this.dataSource.filteredData.map(rep => ({
      nombre: rep.nombre || '',
      apellido: rep.apellido || '',
      cargo: rep.cargo || '',
      telefono: rep.telefono || '',
      email: rep.email || '',
      estado: rep.estado || '',
      proveedor_nombre: rep.Proveedor?.nombre || '',
      proveedor_codigo: rep.Proveedor?.codigo || '',
      tipo_empresa: rep.Proveedor?.tipo_empresa || '',
      ministerio: rep.Proveedor?.ministerio || '',
      provincia: rep.Proveedor?.provincia || '',
      municipio: rep.Proveedor?.municipio || '',
      numero_documento: rep.numero_documento || '',
      tipo_documento: rep.tipo_documento || ''
    }));

    this.exportService.exportToPDF(data, columns, 'Reporte de Representantes', 'assets/images/logo/logo.jpg');
  }
  print(): void {
    window.print();
  }
  

  exportToCSV(): void {
    const columns = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellido', label: 'Apellido' },
      { key: 'cargo', label: 'Cargo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'email', label: 'Email' },
      { key: 'estado', label: 'Estado' },
      { key: 'proveedor_nombre', label: 'Proveedor' },
      { key: 'proveedor_codigo', label: 'Código Proveedor' },
      { key: 'tipo_empresa', label: 'Tipo Empresa' },
      { key: 'ministerio', label: 'Ministerio' },
      { key: 'provincia', label: 'Provincia' },
      { key: 'municipio', label: 'Municipio' },
      { key: 'numero_documento', label: 'Número Documento' },
      { key: 'tipo_documento', label: 'Tipo Documento' }
    ];

    const data = this.dataSource.filteredData.map(rep => ({
      nombre: rep.nombre || '',
      apellido: rep.apellido || '',
      cargo: rep.cargo || '',
      telefono: rep.telefono || '',
      email: rep.email || '',
      estado: rep.estado || '',
      proveedor_nombre: rep.Proveedor?.nombre || '',
      proveedor_codigo: rep.Proveedor?.codigo || '',
      tipo_empresa: rep.Proveedor?.tipo_empresa || '',
      ministerio: rep.Proveedor?.ministerio || '',
      provincia: rep.Proveedor?.provincia || '',
      municipio: rep.Proveedor?.municipio || '',
      numero_documento: rep.numero_documento || '',
      tipo_documento: rep.tipo_documento || ''
    }));

    this.exportService.exportToExcel(data, columns, 'representantes_export.csv');
  }
}
