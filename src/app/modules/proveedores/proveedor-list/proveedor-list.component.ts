import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProveedorFormComponent } from '../proveedor-form/proveedor-form.component';
import {  ProveedorService } from '../services/proveedor.service';
import { 
  mockMinisterio, 
  mockMunicipio 
} from 'app/mock-api/contrato-fake/fake'; 
import { Proveedor } from 'app/models/Type';
import { Subject } from 'rxjs';

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

  columns = [
    { key: 'nombre', label: 'Nombre', editable: true },
    { key: 'codigo', label: 'Código', editable: true },
    { key: 'telefonos', label: 'Teléfonos', editable: true },
    { key: 'domicilio', label: 'Domicilio', editable: true },
    { key: 'municipio', label: 'Municipio', nestedKey: 'nombre_municipio', editable: false, selectOptions: mockMunicipio },
    { key: 'ministerio', label: 'Ministerio', nestedKey: 'nombre_ministerio', editable: false, selectOptions: mockMinisterio }
  ];

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

  constructor(
    private dialog: MatDialog,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
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
    this.loadProveedores();

    this.searchInputControl.valueChanges
    .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
    )
    .subscribe(value => {
        console.log('Search query:', value);
        this.closeDetails();
        this.dataSource.filter = value?.trim().toLowerCase() || '';
        console.log('Filtered data:', this.dataSource.filteredData);
        this.cdr.detectChanges(); // Use detectChanges for immediate update
        this.dataSource._updateChangeSubscription(); // Force table update
    });

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          const value = this.getNestedValue(data, key, this.columns.find(col => col.key === key)?.nestedKey);
          return currentTerm + (value || '') + ' ';
        }, '')
        .toLowerCase();
      return searchStr.includes(filter);
    };
  }
  closeDetails(): void {
    this.selectedRow = null;
    this.cdr.detectChanges();
}

  loadProveedores(): void {
    this.isLoading = true;
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => {
        this.data = proveedores;
        this.dataSource.data = this.data;
        this.pagination.length = this.data.length;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
      ministerio: new FormControl(this.selectedRow?.ministerio)
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

    const csvRows = [];
    // Headers
    const headers = [
      'Nombre',
      'Código',
      'Teléfonos',
      'Domicilio',
      'Municipio',
      'Ministerio'
    ];
    csvRows.push(headers.join(','));

    // Data
    this.dataSource.filteredData.forEach(proveedor => {
      const row = [
        proveedor.nombre || '',
        proveedor.codigo || '',
        proveedor.telefonos || '',
        proveedor.domicilio || '',
        proveedor.municipio?.nombre_municipio || '',
        proveedor.ministerio?.nombre_ministerio || ''
      ];
      // Escape commas and quotes in values
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
    a.download = 'proveedores_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
