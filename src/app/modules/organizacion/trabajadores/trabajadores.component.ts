import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TrabajadoresService } from './trabajadores.service';
import { TrabajadorFormComponent } from './trabajador-form/trabajador-form.component';
import { Trabajador, TrabajadorDialogData } from '../../../models/Type';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.scss']
})
export class TrabajadoresComponent implements OnInit, OnDestroy, AfterViewInit {
  // Propiedades para la tabla
  dataSource: MatTableDataSource<Trabajador>;
  
  // Sistema de configuración de columnas igual al de representante-list
  columnSettings = [
    { key: 'nombre', label: 'Nombre', visible: true, tooltip: 'Nombre del trabajador' },
    { key: 'apellido', label: 'Apellido', visible: true, tooltip: 'Apellido del trabajador' },
    { key: 'email', label: 'Email', visible: true, tooltip: 'Email del trabajador' },
    { key: 'cargo', label: 'Cargo', visible: true, tooltip: 'Cargo del trabajador' },
    { key: 'departamento', label: 'Departamento', visible: true, tooltip: 'Departamento del trabajador' },
    { key: 'rol', label: 'Rol', visible: true, tooltip: 'Rol del trabajador' },
    { key: 'representante', label: 'Representante', visible: false, tooltip: 'Representante asignado' },
    { key: 'representante_legal', label: 'Representante Legal', visible: false, tooltip: 'Representante legal' },
    { key: 'representante_id', label: 'ID Representante', visible: false, tooltip: 'ID del representante' }
  ];

  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'cargo', 'departamento', 'rol', 'acciones'];
  
  // Propiedades de estado
  isLoading = false;
  searchInputControl = new FormControl('');
  
  // ViewChild para paginación y ordenamiento
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('columnMenu', { read: MatMenuTrigger }) columnMenuTrigger!: MatMenuTrigger;
  
  private destroy$ = new Subject<void>();

  constructor(
    private trabajadoresService: TrabajadoresService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  // Métodos copiados del sistema de representante-list
  getGridColumns(): string {
    const visibleColumnsCount = this.columnSettings.filter(col => col.visible).length;
    // Assign a flexible width for each visible column
    const columnWidths = this.columnSettings.filter(col => col.visible).map(() => 'minmax(150px, 1fr)').join(' ');
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

  print(): void {
    window.print();
  }

  ngOnInit(): void {
    this.loadTrabajadores();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    // Removed paginator and sort assignment here
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchInputControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.onSearch(searchTerm || '');
    });
  }

  loadTrabajadores(): void {
    this.isLoading = true;
    this.trabajadoresService.getTrabajadores().subscribe({
      next: (trabajadores) => {
        console.log(trabajadores)
        this.dataSource.data = trabajadores;
        // Assign paginator and sort here after data is set
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar trabajadores:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.isLoading = true;
      this.trabajadoresService.searchTrabajadores(searchTerm).subscribe({
        next: (trabajadores) => {
          this.dataSource.data = trabajadores;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loadTrabajadores();
    }
  }

  // Método para abrir diálogo de nuevo trabajador
  openNewTrabajadorDialog(): void {
    const dialogData: TrabajadorDialogData = {
      isEdit: false
    };

    const dialogRef = this.dialog.open(TrabajadorFormComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTrabajadores();
      }
    });
  }

  onEdit(trabajador: Trabajador): void {
    const dialogData: TrabajadorDialogData = {
      trabajador: trabajador,
      isEdit: true
    };

    const dialogRef = this.dialog.open(TrabajadorFormComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTrabajadores();
      }
    });
  }

  onDelete(trabajador: Trabajador): void {
    if (trabajador.id && confirm(`¿Eliminar a ${trabajador.nombre} ${trabajador.apellido}?`)) {
      this.isLoading = true;
      this.trabajadoresService.deleteTrabajador(trabajador.id).subscribe({
        next: () => {
          this.loadTrabajadores();
        },
        error: (error) => {
          console.error('Error al eliminar trabajador:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Métodos para exportación
  exportToExcel(): void {
    this.trabajadoresService.exportToExcel().subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'trabajadores.xlsx');
      },
      error: (error) => {
        console.error('Error al exportar a Excel:', error);
      }
    });
  }

  exportToPdf(): void {
    this.trabajadoresService.exportToPdf().subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'trabajadores.pdf');
      },
      error: (error) => {
        console.error('Error al exportar a PDF:', error);
      }
    });
  }

  // Método para exportar a CSV (implementación local)
  exportToCSV(): void {
    const csvData = this.convertToCSV(this.dataSource.data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, 'trabajadores.csv');
  }

  private convertToCSV(data: Trabajador[]): string {
    const headers = ['Nombre', 'Apellido', 'Email', 'Cargo', 'Teléfono', 'Rol'];
    const csvContent = [
      headers.join(','),
      ...data.map(trabajador => [
        trabajador.nombre,
        trabajador.apellido,
        trabajador.email,
        trabajador.cargo,
        trabajador.telefono || '',
        trabajador.rol
      ].join(','))
    ].join('\n');
    return csvContent;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Método para obtener el nombre del departamento
  getDepartamentoNombre(departamentoId: number): string {
    // Aquí puedes implementar la lógica para obtener el nombre del departamento
    // Por ahora retornamos un placeholder
    const departamentos = {
      1: 'Recursos Humanos',
      2: 'Tecnología',
      3: 'Finanzas',
      4: 'Operaciones',
      5: 'Marketing',
      6: 'Ventas'
    };
    return departamentos[departamentoId] || 'Sin asignar';
  }

  /**
   * Track by function for ngFor loops
   */
  trackByFn(index: number, item: Trabajador): any {
    return item.id || index;
  }

  /**
   * Quita las columnas relacionadas con representante de la vista
   */
  quitarColumnasRepresentante(): void {
    this.columnSettings.forEach(col => {
      if (col.key.includes('representante')) {
        col.visible = false;
      }
    });
    this.updateDisplayedColumns();
  }

  /**
   * Pone/muestra las columnas relacionadas con representante en la vista
   */
  ponerColumnasRepresentante(): void {
    this.columnSettings.forEach(col => {
      if (col.key.includes('representante')) {
        col.visible = true;
      }
    });
    this.updateDisplayedColumns();
  }

  /**
   * Actualiza las columnas mostradas basado en la configuración
   */
  private updateDisplayedColumns(): void {
    this.displayedColumns = [
      ...this.columnSettings.filter(col => col.visible).map(col => col.key),
      'acciones'
    ];
  }// Agregar estos métodos al componente

toggleColumn(columnKey: string): void {
  const column = this.columnSettings.find(col => col.key === columnKey);
  if (column) {
    column.visible = !column.visible;
    this.updateDisplayedColumns();
  }
}

getColumnValue(trabajador: Trabajador, columnKey: string): any {
  switch (columnKey) {
    case 'nombre':
      return trabajador.nombre;
    case 'apellido':
      return trabajador.apellido;
    case 'email':
      return trabajador.email;
    case 'cargo':
      return trabajador.cargo;

    case 'rol':
      return trabajador.rol;
  
    default:
      return 'N/A';
  }
}

}
