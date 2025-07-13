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
import { TipoContratoService } from 'app/modules/contratos/services/tipo-contrato.service';
import { DepartamentoService } from 'app/modules/organizacion/departamento.service';
import { ProveedorService } from 'app/modules/proveedores/services/proveedor.service';
import { SuplementoService } from '../services/suplemento.service';

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
          private tipocontratoervice: TipoContratoService,
          private departamentoService: DepartamentoService,
            private proveedorService:ProveedorService,
            private suplementoService:SuplementoService,
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
    this.isLoadingResults = true;
    this.suplementoService.getEjecucionSuplementos().subscribe({
      next: (data: any) => {
         console.log('Data received:', data);
         console.log('Data type:', typeof data);
         console.log('Is array:', Array.isArray(data));
         
         // Handle different data structures
         let dataArray: any[] = [];
         
         if (Array.isArray(data)) {
           dataArray = data;
         } else if (data && data.data && Array.isArray(data.data)) {
           dataArray = data.data;
         } else if (data && data.results && Array.isArray(data.results)) {
           dataArray = data.results;
         } else if (data && typeof data === 'object') {
           // If it's a single object, wrap it in an array
           dataArray = [data];
         } else {
           console.error('Unexpected data structure:', data);
           dataArray = [];
         }
         
        // Filter out mock data if any
        const filteredData = dataArray.filter(item => item && !item['mock'] && item.id > 0);
        
        console.log('Filtered data:', filteredData);
        
        // Map the data to match the expected structure
        const mappedData = filteredData.map((item: any) => ({
          ...item,
          proveedor: item.Proveedor || item.proveedor || null,
          suplemento: item.Suplemento || item.suplemento || null
        }));
        
        console.log('Mapped data:', mappedData);
        
        this.dataSource = new MatTableDataSource<Partial<EjecucionSuplemento>>(mappedData);
        this.dataSource.paginator = this._paginator;
        this.dataSource.sort = this._sort;
        this.resultsLength = mappedData.length;
        this.isLoadingResults = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoadingResults = false;
        this.showMessage('Error al cargar ejecuciones de suplementos');
      }
    });
  }
  
  private initFilterForm(): void {
    this.filterForm = this._formBuilder.group({
      no_suplemento_id_filter: [''],
      proveedor_filter: [''],
      contrato_filter: [''],
      trabajo_ejecutado_filter: [''],
      suplemento_fecha_filter:[''],
      costo_usd_filter:[''],
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
  
    // Set up search functionality
    this.searchInputControl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        this.dataSource.filter = value?.trim().toLowerCase() || '';
      });
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
      this.suplementoService.deleteEjecucionSuplemento(ejecucion.id).subscribe({
        next: () => {
          this.showMessage('Ejecución de suplemento eliminada exitosamente');
          this.loadEjecuciones();
        },
        error: () => {
          this.showMessage('Error al eliminar la ejecución');
        }
      });
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
    // TODO: Implement filter logic using filterForm values and update dataSource accordingly
    this.showMessage('Filtros aplicados');
  }
  
  clearFilters(): void {
    this.filterForm.reset();
    this.loadEjecuciones();
    this.showMessage('Filtros limpiados');
  }
  
  exportToCSV(): void {
    // TODO: Implement export to CSV using current filtered data
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
        const ejecucionAny = ejecucion as any; // Cast to any to access backend properties
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
    const updatedEjecucion: any = {
      ...this.selectedEjecucion,
      ...formValue,
      fecha_ejecucion: formValue.fecha_ejecucion ? new Date(formValue.fecha_ejecucion) : null,
      proveedor: this.selectedEjecucion?.proveedor,
      contrato: this.selectedEjecucion?.contrato,
      suplemento: this.selectedEjecucion?.suplemento
    };

    if (updatedEjecucion.id) {
      this.suplementoService.updateEjecucionSuplemento(updatedEjecucion.id, updatedEjecucion).subscribe({
        next: (res) => {
          this.showMessage('Ejecución actualizada correctamente');
          this.loadEjecuciones();
          this.selectedEjecucion = null;
        },
        error: (err) => {
          this.showMessage('Error al actualizar la ejecución');
        }
      });
    } else {
      this.suplementoService.createEjecucionSuplemento(updatedEjecucion).subscribe({
        next: (res) => {
          this.showMessage('Ejecución creada correctamente');
          this.loadEjecuciones();
          this.selectedEjecucion = null;
        },
        error: (err) => {
          this.showMessage('Error al crear la ejecución');
        }
      });
    }
  }

  onCancelEdit(): void {
    this.selectedEjecucion = null;
  }
}
