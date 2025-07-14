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
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material/menu';

import { RepresentanteService } from '../../services/representante.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Representante, Suplemento } from 'app/models/Type';
import { Contrato } from 'app/models/Type';
import { ContratoService } from 'app/modules/contratos/services/contrato.service';
import { SuplementoService } from 'app/modules/suplementos/services/suplemento.service';
import { RepresentanteFormComponent } from '../representante-form.component';

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
  // Columnas para la tabla de representantes
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
  // Columnas para la tabla de suplementos
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
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Representante>([]);
    this.suplementosDataSource = new MatTableDataSource<Suplemento>([]);
    
    // Inicializar el formulario de edición
    this.selectedRowForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      email: [''],
      cargo: [''],
      estado: ['']
    });
  }

  closeColumnMenu(): void {
    this.columnMenuTrigger.closeMenu();
  }
  loadRepresentantes(): void {
    this.isLoading = true;
    this.representanteService.getRepresentantes().subscribe({
      next: (response: any) => {
        console.log('Raw representantes response:', response);
        const representantes = Array.isArray(response) ? response : response.data || [];
        this.proveedorService.getProveedores().subscribe({
          next: (proveedores) => {
            // Mapear el objeto completo del proveedor con propiedades correctas
            representantes.forEach((rep: any) => {
              const proveedor = proveedores.find((p: any) => p.id === rep.proveedor_id);
              if (proveedor) {
                rep.Proveedor = {
                  id: proveedor.id,
                  nombre: proveedor.nombre || '',
                  codigo: proveedor.codigo || '',
                  tipo_empresa: '', // No existe en Proveedor, asignar vacío
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
            
            console.log('Representantes con Proveedor completo:', representantes);
            this.dataSource.data = representantes;
            this.pagination.length = representantes.length;
            
            // Configurar la tabla después de cargar los datos
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
            console.error('Error al cargar los proveedores', error);
            this.showMessage('Error al cargar los proveedores', 'error');
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar los representantes', error);
        this.showMessage('Error al cargar los representantes', 'error');
        this.isLoading = false;
      }
    });
  }
  
  ngAfterViewInit(): void {
    // Configurar paginator y sort después de que la vista esté lista
    if (this.dataSource.data.length > 0) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    
    // También configurar cuando los datos cambien
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

  loadContratos(): void {
    this.contratoService.getContratos().subscribe({
      next: (contratos) => {
        this.contratos = contratos;
      },
      error: (error) => {
        console.error('Error al cargar los contratos', error);
        this.showMessage('Error al cargar los contratos', 'error');
      }
    });
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
        console.error('Error al cargar los suplementos', error);
        this.showMessage('Error al cargar los suplementos', 'error');
        this.isSuplementosLoading = false;
      }
    });
  }

  toggleSuplementos(): void {
    this.showSuplementos = !this.showSuplementos;
    if (this.showSuplementos && this.suplementos.length === 0) {
      this.loadSuplementos();
    }
  }

  toggleDetails(id: number): void {
    if (this.selectedRow && this.selectedRow.id === id) {
      this.selectedRow = null;
    } else {
      const found = this.dataSource.data.find(r => r.id === id);
      this.selectedRow = found ? found : null;
      
      if (this.selectedRow) {
        this.selectedRowForm.patchValue({
          nombre: this.selectedRow.nombre,
          apellido: this.selectedRow.apellido,
          telefono: this.selectedRow.telefono,
          email: this.selectedRow.email,
          cargo: this.selectedRow.cargo,
          estado: this.selectedRow.estado
        });
      }
    }
  }

  updateSelectedRecord(): void {
    if (this.selectedRow && this.selectedRowForm.valid) {
      const updatedData = {
        ...this.selectedRow,
        ...this.selectedRowForm.value
      };
      
      this.representanteService.updateRepresentante(this.selectedRow.id, updatedData).subscribe({
        next: () => {
          this.showMessage('Representante actualizado correctamente');
          this.loadRepresentantes();
          this.selectedRow = null;
        },
        error: (error) => {
          console.error('Error al actualizar el representante', error);
          this.showMessage('Error al actualizar el representante', 'error');
        }
      });
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      this.deleteRepresentante(this.selectedRow.id);
      this.selectedRow = null;
    }
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

  showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  deleteRepresentante(id: number): void {
    if (confirm('¿Está seguro de eliminar este representante?')) {
      this.isLoading = true;
      this.representanteService.deleteRepresentante(id).subscribe({
        next: () => {
          this.loadRepresentantes();
          this.showMessage('Representante eliminado correctamente');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al eliminar el representante', error);
          this.showMessage('Error al eliminar el representante', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  deleteSelected(): void {
    if (confirm(`¿Está seguro de eliminar los ${this.selection.size} representantes seleccionados?`)) {
      this.isLoading = true;
      const deleteRequests = Array.from(this.selection).map(id =>
        this.representanteService.deleteRepresentante(id).toPromise()
      );

      Promise.all(deleteRequests).then(() => {
        this.selection.clear();
        this.loadRepresentantes();
        this.showMessage(`${this.selection.size} representantes eliminados correctamente`);
        this.isLoading = false;
      }).catch(error => {
        console.error('Error al eliminar los representantes', error);
        this.showMessage('Error al eliminar los representantes', 'error');
        this.isLoading = false;
      });
    }
  }

  private applyContratoFilter(): void {
    if (this.selectedContratoId) {
      const originalData = [...this.dataSource.data];
      this.dataSource.data = originalData.filter(r => r['contrato_id'] === this.selectedContratoId);
    } else {
      this.loadRepresentantes();
    }
  }

  onContratoChange(): void {
    this.applyContratoFilter();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

getVisibleColumns() {
  return this.columnSettings.filter(column => column.visible);
}

// Método para generar las columnas del grid
getGridColumns(): string {
  const visibleColumns = this.getVisibleColumns();
  const columnSizes = visibleColumns.map(() => 'minmax(120px, 1fr)');
  return `${columnSizes.join(' ')} 200px`; // 200px para la columna de acciones
}

// Método para obtener el valor de una columna
getColumnValue(representante: any, columnKey: string): string {
  switch (columnKey) {
    case 'nombre':
      return representante.nombre || '';
    case 'apellido':
      return representante.apellido || '';
    case 'cargo':
      return representante.cargo || '';
    case 'telefono':
      return representante.telefono || '';
    case 'email':
      return representante.email || '';
    case 'estado':
      return representante.estado || '';
    case 'proveedor_nombre':
      return representante.Proveedor?.nombre || '';
    case 'proveedor_codigo':
      return representante.Proveedor?.codigo || '';
    case 'tipo_empresa':
      return representante.Proveedor?.tipo_empresa || '';
    case 'ministerio':
      return representante.Proveedor?.ministerio || '';
    case 'provincia':
      return representante.Proveedor?.provincia || '';
    case 'municipio':
      return representante.Proveedor?.municipio || '';
    case 'numero_documento':
      return representante.numero_documento || '';
    case 'tipo_documento':
      return representante.tipo_documento || '';
    default:
      return '';
  }
}

// Método para alternar visibilidad de columnas
toggleColumn(columnKey: string): void {
  const column = this.columnSettings.find(col => col.key === columnKey);
  if (column) {
    column.visible = !column.visible;
  }
}
exportToCSV(){

}
exportToPDF(){
  
}
}
