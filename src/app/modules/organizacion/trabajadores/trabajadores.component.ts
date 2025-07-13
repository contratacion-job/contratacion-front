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
      ReactiveFormsModule
    ],
    templateUrl: './trabajadores.component.html',
    styleUrls: ['./trabajadores.component.scss']
  })
  export class TrabajadoresComponent implements OnInit, OnDestroy, AfterViewInit {
    // Propiedades para la tabla
    dataSource: MatTableDataSource<Trabajador>;
    displayedColumns: string[] = ['nombre', 'apellido', 'email', 'cargo', 'departamento', 'rol', 'acciones'];
    
    // Propiedades de estado
    isLoading = false;
    searchInputControl = new FormControl('');
    
    // ViewChild para paginación y ordenamiento
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    private destroy$ = new Subject<void>();

    constructor(
      private trabajadoresService: TrabajadoresService,
      private dialog: MatDialog,
      private cdr: ChangeDetectorRef
    ) {
      this.dataSource = new MatTableDataSource([]);
    }

    ngOnInit(): void {
      this.loadTrabajadores();
      this.setupSearch();
    }

    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

    private setupSearch(): void {
      this.searchInputControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(searchTerm => {
          this.onSearch(searchTerm || '');
        });
    }

    loadTrabajadores(): void {
      this.isLoading = true;
      this.trabajadoresService.getTrabajadores().subscribe({
        next: (trabajadores) => {
          console.log(trabajadores)
          this.dataSource.data = trabajadores;
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
  }
