import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Trabajador, Departamento } from 'app/models/Type';
import { TrabajadoresService } from './trabajadores.service';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-trabajadores',
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
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.scss']
})
export class TrabajadoresComponent implements OnInit, AfterViewInit {
  trabajadores: Trabajador[] = [];
  departamentos: Departamento[] = [];
  dataSource = new MatTableDataSource<Trabajador>([]);
  filterForm: FormGroup;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedTrabajador: Trabajador | null = null;
  selectedTrabajadorForm: FormGroup;
  newTrabajadorForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  displayedColumns = ['id', 'nombre', 'apellido', 'cargo', 'departamento', 'email', 'createdAt', 'updatedAt', 'timeZone', 'details'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private trabajadoresService: TrabajadoresService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Trabajador>([]);
    this.initSelectedTrabajadorForm();
    this.initNewTrabajadorForm();

    this.filterForm = this.fb.group({
      nombre_filter: [''],
      apellido_filter: [''],
      cargo_filter: [''],
      departamento_id: [''],
      email_filter: ['']
    });
  }

  openNewTrabajadorDialog(): void {
    this.newTrabajadorForm.reset();
    this.selectedTrabajador = null;
    // Optionally, you can implement a dialog popup here for adding trabajador
    // For now, just show the add form inline or handle accordingly
  }

  ngOnInit(): void {
    this.loadTrabajadores();

    this.dataSource.sortingDataAccessor = (item: Trabajador, property: string) => {
      switch (property) {
        case 'departamento': return item.departamento?.nombre_departamento;
        default: return item[property];
      }
    };

    this.dataSource.filterPredicate = (data: Trabajador, filter: string) => {
      if (!filter) return true;
      const searchTerm = filter.toLowerCase().trim();
      const dataStr = [
        data.nombre?.toLowerCase() || '',
        data.apellido?.toLowerCase() || '',
        data.cargo?.toLowerCase() || '',
        data.departamento?.nombre_departamento?.toLowerCase() || '',
        data.email?.toLowerCase() || '',
        data.timeZone?.toLowerCase() || ''
      ].join(' ');
      return dataStr.includes(searchTerm);
    };

    this.searchInputControl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
      .subscribe(query => {
        this.closeDetails();
        this.dataSource.filter = query ? query.trim().toLowerCase() : '';
        this.cdr.detectChanges();
      });

    this.filterForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
      .subscribe(() => {
        this.applyFilters();
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
      this.sort.active = 'nombre';
      this.sort.direction = 'asc';
    }
    this.cdr.detectChanges();
  }

  loadTrabajadores(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.trabajadoresService.getTrabajadores().subscribe({
      next: (trabajadores) => {
        this.trabajadores = trabajadores;
        this.dataSource.data = trabajadores;
        this.pagination.length = trabajadores.length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los trabajadores. Por favor, intente nuevamente.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filteredData = this.dataSource.data;

    if (filters.nombre_filter) {
      filteredData = filteredData.filter(t =>
        t.nombre.toLowerCase().includes(filters.nombre_filter.toLowerCase())
      );
    }
    if (filters.apellido_filter) {
      filteredData = filteredData.filter(t =>
        t.apellido.toLowerCase().includes(filters.apellido_filter.toLowerCase())
      );
    }
    if (filters.cargo_filter) {
      filteredData = filteredData.filter(t =>
        t.cargo.toLowerCase().includes(filters.cargo_filter.toLowerCase())
      );
    }
    if (filters.departamento_id) {
      filteredData = filteredData.filter(t =>
        t.departamento?.id === filters.departamento_id
      );
    }
    if (filters.email_filter) {
      filteredData = filteredData.filter(t =>
        t.email.toLowerCase().includes(filters.email_filter.toLowerCase())
      );
    }

    this.dataSource.filteredData = filteredData;
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.dataSource.filteredData = this.dataSource.data;
  }

  initSelectedTrabajadorForm(): void {
    this.selectedTrabajadorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cargo: ['', Validators.required],
      departamento: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      timeZone: ['', Validators.required]
    });
  }

  initNewTrabajadorForm(): void {
    this.newTrabajadorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cargo: ['', Validators.required],
      departamento: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      timeZone: ['', Validators.required]
    });
  }

  toggleDetails(trabajadorId: number): void {
    if (this.selectedTrabajador?.id === trabajadorId) {
      this.selectedTrabajador = null;
    } else {
      this.selectedTrabajador = this.trabajadores.find(t => t.id === trabajadorId) || null;
      if (this.selectedTrabajador) {
        this.selectedTrabajadorForm.patchValue({
          nombre: this.selectedTrabajador.nombre,
          apellido: this.selectedTrabajador.apellido,
          cargo: this.selectedTrabajador.cargo,
          departamento: this.selectedTrabajador.departamento,
          email: this.selectedTrabajador.email,
          timeZone: this.selectedTrabajador.timeZone
        });
      }
    }
    this.cdr.detectChanges();
  }

  closeDetails(): void {
    this.selectedTrabajador = null;
  }

  addNewTrabajador(): void {
    if (this.newTrabajadorForm.invalid) {
      this.newTrabajadorForm.markAllAsTouched();
      return;
    }
    const formValue = this.newTrabajadorForm.value;
    const newTrabajador: Trabajador = {
      id: 0,
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      cargo: formValue.cargo,
      departamentoId: formValue.departamento.id,
      departamento: formValue.departamento,
      email: formValue.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeZone: formValue.timeZone
    };
    this.trabajadoresService.createTrabajador(newTrabajador).subscribe({
      next: () => {
        this.loadTrabajadores();
        this.newTrabajadorForm.reset();
      },
      error: (error) => {
        console.error('Error al crear el trabajador:', error);
      }
    });
  }

  updateSelectedTrabajador(): void {
    if (!this.selectedTrabajador) return;
    if (this.selectedTrabajadorForm.invalid) {
      this.selectedTrabajadorForm.markAllAsTouched();
      return;
    }
    const formValue = this.selectedTrabajadorForm.value;
    const updatedTrabajador: Trabajador = {
      ...this.selectedTrabajador,
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      cargo: formValue.cargo,
      departamento: formValue.departamento,
      departamentoId: formValue.departamento.id,
      email: formValue.email,
      timeZone: formValue.timeZone,
      updatedAt: new Date()
    };
    this.trabajadoresService.updateTrabajador(updatedTrabajador).subscribe({
      next: () => {
        this.loadTrabajadores();
        this.selectedTrabajador = null;
      },
      error: (error) => {
        console.error('Error al actualizar el trabajador:', error);
      }
    });
  }

  deleteSelectedTrabajador(): void {
    if (!this.selectedTrabajador) return;
    this.trabajadoresService.deleteTrabajador(this.selectedTrabajador.id).subscribe({
      next: () => {
        this.loadTrabajadores();
        this.selectedTrabajador = null;
      },
      error: (error) => {
        console.error('Error al eliminar el trabajador:', error);
      }
    });
  }

  trackByFn(index: number, item: Trabajador): number {
    return item.id;
  }

  exportToCSV(): void {
    if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      return;
    }
    const csvRows = [];
    const headers = ['ID', 'Nombre', 'Apellido', 'Cargo', 'Departamento', 'Email', 'Fecha Creación', 'Fecha Actualización', 'Zona Horaria'];
    csvRows.push(headers.join(','));
    this.dataSource.filteredData.forEach(trabajador => {
      const row = [
        trabajador.id,
        trabajador.nombre,
        trabajador.apellido,
        trabajador.cargo,
        trabajador.departamento?.nombre_departamento || '',
        trabajador.email,
        trabajador.createdAt.toISOString(),
        trabajador.updatedAt.toISOString(),
        trabajador.timeZone
      ];
      const escapedRow = row.map(value => {
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(escapedRow.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trabajadores_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
