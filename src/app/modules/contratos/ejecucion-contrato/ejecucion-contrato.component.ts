import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import {
  mockProveedor,
  mockContrato
} from 'app/mock-api/contrato-fake/fake';
import { EjecucionService } from 'app/modules/dashboard/services/ejecucion.service';
import { SuplementoFormComponent } from 'app/modules/suplementos/suplemento-form/suplemento-form.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-ejecucion-contrato',
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
    CurrencyPipe,
    DatePipe,
    MatMenuModule,
    MatDividerModule,

  ],
  templateUrl: './ejecucion-contrato.component.html',
  styleUrls: ['./ejecucion-contrato.component.scss']
})
export class EjecucionContratoComponent implements OnInit {
  data: any[] = [];
  montoInicialCup: number = 8000;
  totalEjecutadoCup: number = 6000;
  montoRestanteCup: number = 2000;

  montoInicialUsd: string = '-';
  totalEjecutadoUsd: string = '-';
  montoRestanteUsd: string = '-';
  columns = [
    { key: 'proveedor', label: 'Proveedor', nestedKey: 'nombre', editable: false, selectOptions: mockProveedor },
    { key: 'contrato', label: 'Contrato', nestedKey: 'no_contrato', editable: false, selectOptions: mockContrato },
    { key: 'costo_cup', label: 'Costo (CUP)', type: 'currency', editable: true },
    { key: 'costo_cl', label: 'Costo (CL)', type: 'currency', editable: true },
    { key: 'trabajo_ejecutado', label: 'Trabajo Ejecutado', editable: true },
    { key: 'fecha_ejecucion', label: 'Fecha Ejecución', type: 'date', editable: true }
  ];
  private _unsubscribeAll = new Subject<void>();
  title = 'Ejecución de Contratos';
  addButtonText = 'Agregar Ejecución';
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  searchInputControl = new FormControl('');
  selectedRow: any = null;
  selectedRowForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 

  constructor(private ejecucionService: EjecucionService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource([]);
    this.selectedRowForm = new FormGroup({});
    
  }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key).concat('details');
    this.loadEjecuciones();

    this.searchInputControl.valueChanges
    .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
    )
    .subscribe(value => {
        console.log('Search query:', value);
        this.dataSource.filter = value?.trim().toLowerCase() || '';
        console.log('Filtered data:', this.dataSource.filteredData);
        this.cdr.detectChanges(); // Force UI update
        this.dataSource._updateChangeSubscription(); // Ensure table updates
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

  loadEjecuciones(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.ejecucionService.getEjecuciones().subscribe({
      next: (ejecuciones) => {
        this.data = ejecuciones;
        this.dataSource.data = this.data;
        this.pagination.length = this.data.length;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading ejecuciones';
        this.isLoading = false;
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
      proveedor: new FormControl(this.selectedRow?.proveedor),
      contrato: new FormControl(this.selectedRow?.contrato),
      costo_cup: new FormControl(this.selectedRow?.costo_cup),
      costo_cl: new FormControl(this.selectedRow?.costo_cl),
      trabajo_ejecutado: new FormControl(this.selectedRow?.trabajo_ejecutado),
      fecha_ejecucion: new FormControl(this.selectedRow?.fecha_ejecucion)
    });
  }

  createRecord(): void {
    const dialogRef = this.dialog.open(SuplementoFormComponent, {
      width: '30%',
      height: '90%',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEjecuciones();
      }
    });
  }

  updateSelectedRecord(): void {
    if (this.selectedRow && this.selectedRowForm.valid) {
      const updatedEjecucion = { ...this.selectedRow, ...this.selectedRowForm.value };
this.ejecucionService.updateEjecucion(updatedEjecucion).subscribe({
        next: (ejecucion) => {
          this.loadEjecuciones();
        }
      });
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      this.ejecucionService.deleteEjecucion(this.selectedRow.id).subscribe({
        next: () => {
          this.loadEjecuciones();
          this.selectedRow = null;
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
      'Proveedor',
      'Contrato',
      'Costo (CUP)',
      'Costo (CL)',
      'Trabajo Ejecutado',
      'Fecha Ejecución'
    ];
    csvRows.push(headers.join(','));

    // Data
    this.dataSource.filteredData.forEach(ejecucion => {
      const row = [
        ejecucion.proveedor?.nombre || '',
        ejecucion.contrato?.no_contrato || '',
        ejecucion.costo_cup,
        ejecucion.costo_cl,
        ejecucion.trabajo_ejecutado || '',
        ejecucion.fecha_ejecucion || ''
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
    a.download = 'ejecuciones_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
