import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Departamento } from 'app/models/Type';
import { DepartamentoService } from '../departamento.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DepartamentoFormComponent } from '../departamento-list/departamento-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExportService } from 'app/services/export.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './municipio-list.component.html',
  styleUrls: ['./municipio-list.component.scss']
})
export class DepartamentoComponent implements OnInit, AfterViewInit {
  
  // Configuración de columnas
  columnSettings = [
    { key: 'nombre_departamento', label: 'Nombre', visible: true, tooltip: 'Nombre del departamento' },
    { key: 'codigo', label: 'Código', visible: true, tooltip: 'Código del departamento' },
    { key: 'descripcion', label: 'Descripción', visible: true, tooltip: 'Descripción del departamento' },
    { key: 'director', label: 'Director', visible: false, tooltip: 'Director del departamento' },
    { key: 'estado', label: 'Estado', visible: true, tooltip: 'Estado del departamento' },
    { key: 'fecha_creacion', label: 'Fecha Creación', visible: false, tooltip: 'Fecha de creación' },
    { key: 'ministerio', label: 'Ministerio', visible: false, tooltip: 'Ministerio al que pertenece' },
    { key: 'presupuesto_anual', label: 'Presupuesto', visible: false, tooltip: 'Presupuesto anual' },
    { key: 'telefono', label: 'Teléfono', visible: false, tooltip: 'Teléfono del departamento' }
  ];

  // Columnas mostradas (se actualiza dinámicamente)
  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource<Departamento>([]);
  searchInputControl: FormControl = new FormControl();
  selectedRow: Departamento | null = null;
  selectedRowForm: FormGroup;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('columnMenuTrigger', { read: MatMenuTrigger }) columnMenuTrigger!: MatMenuTrigger;

  constructor(
    private departamentoService: DepartamentoService,
    private cdr: ChangeDetectorRef,
    private exportService: ExportService,
    private dialog: MatDialog
  ) {
    this.selectedRowForm = new FormGroup({
      id: new FormControl(''),
      nombre_departamento: new FormControl(''),
      codigo: new FormControl(''),
      descripcion: new FormControl(''),
      director: new FormControl(''),
      estado: new FormControl(''),
      fecha_creacion: new FormControl(''),
      ministerio: new FormControl(''),
      presupuesto_anual: new FormControl(''),
      telefono: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.isLoading = true;
    
    this.departamentoService.getDepartamentos().subscribe((data) => {
      this.dataSource.data = data.data;
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    this.dataSource.filterPredicate = (data: Departamento, filter: string) => {
      if (!filter) return true;
      const searchTerms = filter.toLowerCase().split(' ').filter(term => term.length > 0);
      const dataStr = [
        data.nombre,
        data.codigo,
        data.descripcion,
      ].join(' ').toLowerCase();
      return searchTerms.every(term => dataStr.includes(term));
    };

    this.searchInputControl.valueChanges.pipe(debounceTime(300)).subscribe((query) => {
      this.dataSource.filter = query.trim().toLowerCase();
      this.closeDetails();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  // Predicates for row definitions
  isRegularRow = (index: number, item: any) => true;
  isDetailRow = (index: number, item: any) => false;

  // Método para obtener columnas visibles
  getVisibleColumns() {
    return this.columnSettings.filter(col => col.visible);
  }

  // Método para actualizar columnas mostradas
  updateDisplayedColumns(): void {
    this.displayedColumns = [
      'index',
      ...this.getVisibleColumns().map(col => col.key),
      'actions'
    ];
  }

  // Método para alternar visibilidad de columnas
  toggleColumn(columnKey: string): void {
    const column = this.columnSettings.find(col => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
      this.updateDisplayedColumns();
      this.cdr.detectChanges();
    }
  }

  // Método para obtener valor de columna
  getColumnValue(element: any, columnKey: string): any {
    switch (columnKey) {
      case 'estado':
        return element[columnKey] === 'activo' ? 'Activo' : 'Inactivo';
      case 'fecha_creacion':
        return element[columnKey] ? new Date(element[columnKey]).toLocaleDateString() : '-';
      case 'presupuesto_anual':
        return element[columnKey] ? `$${Number(element[columnKey]).toLocaleString()}` : '-';
      case 'descripcion':
        return element[columnKey] || 'Sin descripción';
      default:
        return element[columnKey] || '-';
    }
  }

  // Método helper para verificar si una fila está seleccionada
  isRowSelected(element: any): boolean {
    if (!this.selectedRow) return false;
    
    const selectedId = this.selectedRow.id || this.selectedRow.nombre;
    const elementId = element.id || element.nombre_departamento;
    
    return selectedId === elementId;
  }

  // Actualizar el método toggleDetails para manejar mejor los identificadores
  toggleDetails(departamento: any): void {
    // Usar nombre_departamento como identificador único si no hay id
    const identifier = departamento.id || departamento.nombre_departamento;
    const currentIdentifier = this.selectedRow?.id || this.selectedRow?.nombre;
    
    if (currentIdentifier === identifier) {
      this.selectedRow = null;
    } else {
      this.selectedRow = departamento;
      this.selectedRowForm.patchValue(departamento);
    }
  }

  closeDetails(): void {
    this.selectedRow = null;
  }

  openNewDepartamentoDialog(): void {
    const dialogRef = this.dialog.open(DepartamentoFormComponent, {
      width: '30%',
      height: '90%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departamentoService.createDepartamento(result).subscribe({
          next: (createdDepartamento) => {
            this.dataSource.data = [...this.dataSource.data, createdDepartamento];
            this.departamentoService.getDepartamentos().subscribe((data) => {
              this.dataSource.data = data.data;
              this.isLoading = false;
              this.cdr.detectChanges();
            });
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error creating departamento:', error);
          }
        });
      }
    });
  }

  updateSelectedRecord(): void {
    if (this.selectedRow && this.selectedRowForm.valid) {
      // Implement update logic here
      console.log('Updating record:', this.selectedRowForm.value);
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      // Implement delete logic here
      console.log('Deleting record:', this.selectedRow);
    }
  }

  exportToPDF(): void {
    const visibleColumns = this.getVisibleColumns().map(col => ({
      key: col.key,
      label: col.label
    }));
    
    const data = this.dataSource.filteredData.map(departamento => {
      const row: any = {};
      visibleColumns.forEach(col => {
        row[col.key] = this.getColumnValue(departamento, col.key);
      });
      return row;
    });

    this.exportService.exportToPDF(
      data,
      visibleColumns,
      'Lista de Departamentos',
      'departamentos'
    );
  }

  exportToExcel(): void {
    const visibleColumns = this.getVisibleColumns().map(col => ({
      key: col.key,
      label: col.label
    }));
    
    const data = this.dataSource.filteredData.map(departamento => {
      const row: any = {};
      visibleColumns.forEach(col => {
        row[col.key] = this.getColumnValue(departamento, col.key);
      });
      return row;
    });

    this.exportService.exportToExcel(data, visibleColumns, 'departamentos');
  }

  print(): void {
    const data = this.getFilteredData();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }

  private getFilteredData(): Departamento[] {
    if (this.dataSource.filteredData) {
      return this.dataSource.filteredData;
    }
    return this.dataSource.data;
  }
}