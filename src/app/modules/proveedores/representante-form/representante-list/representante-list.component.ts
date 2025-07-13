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

import { RepresentanteService } from '../../services/representante.service';
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

  // Columnas para la tabla de representantes
  displayedColumns: string[] = ['select', 'nombre', 'apellido', 'cargo', 'telefono', 'email', 'activo', 'acciones'];

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


  pagination = {
    length: 0,
    page: 0,
    size: 10
  };

  selectedRow: Representante | null = null;

  constructor(
    private representanteService: RepresentanteService,
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.loadRepresentantes();
    this.loadSuplementos();
    this.setupFilter();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
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
        data.numero_documento || ''
      ].join(' ').toLowerCase();
      
      return searchStr.includes(filter);
    };
  }

  loadRepresentantes(): void {
    this.isLoading = true;
    this.representanteService.getRepresentantes().subscribe({
      next: (representantes) => {
        console.log('Representantes cargados:', representantes);
        console.log('=== DEBUG: Datos recibidos ===');
      console.log('Total representantes:', representantes.length);
      console.log('Primer representante:', representantes[0]);
      console.log('Estructura del primer representante:', Object.keys(representantes[0] || {}));
        this.dataSource.data = representantes;
        this.pagination.length = representantes.length;
        if (this.selectedContratoId) {
          this.applyContratoFilter();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los representantes', error);
        this.showMessage('Error al cargar los representantes', 'error');
        this.isLoading = false;
      }
    });
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
        // Poblar el formulario con los datos del representante seleccionado
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
}