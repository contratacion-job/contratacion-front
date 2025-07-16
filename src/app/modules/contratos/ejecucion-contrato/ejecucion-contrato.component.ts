import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Subject, forkJoin, Observable, of } from 'rxjs';
import { EjecucionService } from 'app/modules/dashboard/services/ejecucion.service';
import { SuplementoFormComponent } from 'app/modules/suplementos/suplemento-form/suplemento-form.component';
import { ContratoService } from '../services/contrato.service';
import { ProveedorService } from 'app/modules/proveedores/services/proveedor.service';
import { EjecucionContrato, Contrato, Proveedor } from '../../../models/Type';

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
    MatMenuModule,
    MatDividerModule,
    MatCheckboxModule,
  ],
  templateUrl: './ejecucion-contrato.component.html',
  styleUrls: ['./ejecucion-contrato.component.scss']
})
export class EjecucionContratoComponent implements OnInit, OnDestroy {
  data: EjecucionContrato[] = [];
  montoInicialCup: number = 0;
  totalEjecutadoCup: number = 0;
  montoRestanteCup: number = 0;
  montoInicialUsd: string = '0.00';
  totalEjecutadoUsd: string = '0.00';
  montoRestanteUsd: string = '0.00';
  proveedores: Proveedor[] = [];
  contratos: Contrato[] = [];

  columns = [
    { key: 'proveedor', label: 'Proveedor', nestedKey: 'nombre', editable: false },
    { key: 'contrato', label: 'Contrato', nestedKey: 'no_contrato', editable: false },
    { key: 'costo_cup', label: 'Costo (CUP)', type: 'currency', editable: true },
    { key: 'costo_usd', label: 'Costo (USD)', type: 'currency', editable: true },
    { key: 'trabajo_ejecutado', label: 'Trabajo Ejecutado', editable: true },
    { key: 'fecha_ejecucion', label: 'Fecha Ejecución', type: 'date', editable: true },
  ];

  selectedColumns: string[] = this.columns.map(col => col.key);
  private _unsubscribeAll = new Subject<void>();
  title = 'Ejecución de Contratos';
  addButtonText = 'Agregar Ejecución';
  dataSource: MatTableDataSource<EjecucionContrato>;
  displayedColumns: string[] = [];
  searchInputControl = new FormControl('');
  selectedRow: EjecucionContrato | null = null;
  selectedRowForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private ejecucionService: EjecucionService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private contratoService: ContratoService,
    private proveedorService: ProveedorService
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selectedRowForm = new FormGroup({});
  }

  ngOnInit(): void {
    // Load saved column preferences from local storage (optional)
    const savedColumns = localStorage.getItem('ejecucionContratoColumns');
    if (savedColumns) {
      this.selectedColumns = JSON.parse(savedColumns);
    }
    this.updateDisplayedColumns();
    this.loadInitialData();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Starting loadInitialData');
    forkJoin([
      this.ejecucionService.getEjecuciones(),
      this.contratoService.getContratos(),
      this.proveedorService.getProveedores().pipe(
        catchError((error) => {
          console.error('Error fetching proveedores:', error);
          return of([]);
        })
      )
    ]).subscribe({
      next: ([ejecuciones, contratos, proveedores]) => {
        console.log('Ejecuciones response:', ejecuciones);
        console.log('Contratos response:', contratos);
        console.log('Proveedores response:', proveedores);

        this.data = ejecuciones;
        this.contratos = contratos;
        this.proveedores = proveedores;

        console.log('Assigned this.data:', this.data);
        console.log('Assigned this.contratos:', this.contratos);
        console.log('Assigned this.proveedores:', this.proveedores);

        if (this.data.length > 0) {
          this.enrichDataWithContractAndProvider().subscribe({
            next: (enrichedData) => {
              console.log('Enriched data:', enrichedData);
              this.data = enrichedData;
              this.dataSource.data = enrichedData;
              console.log('dataSource.data:', this.dataSource.data);
              this.pagination.length = this.data.length;
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.calculateTotals();
              this.isLoading = false;
              this.cdr.markForCheck();
              console.log('Data loaded, change detection triggered');
            },
            error: (error) => {
              console.error('Error enriching data:', error);
              this.errorMessage = 'Error enriching data';
              this.isLoading = false;
              this.cdr.markForCheck();
            }
          });
        } else {
          console.log('No ejecuciones to enrich, setting empty data');
          this.dataSource.data = [];
          this.pagination.length = 0;
          this.calculateTotals();
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error in loadInitialData:', error);
        this.errorMessage = 'Error loading initial data';
        this.data = [];
        this.dataSource.data = [];
        this.pagination.length = 0;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private enrichDataWithContractAndProvider(): Observable<EjecucionContrato[]> {
    if (!Array.isArray(this.data)) {
      console.error('this.data is not an array:', this.data);
      return of([]);
    }

    console.log('Enriching data for', this.data.length, 'ejecuciones');
    const contractRequests = this.data.map(ejecucion =>
      ejecucion.Contrato
        ? of(ejecucion.Contrato)
        : this.contratoService.getContratoById(ejecucion.contrato_id).pipe(
            catchError((error) => {
              console.error(`Error fetching contrato ${ejecucion.contrato_id}:`, error);
              return of({ id: ejecucion.contrato_id, no_contrato: 'Unknown' });
            })
          )
    );
    const providerRequests = this.data.map(ejecucion =>
      ejecucion.Proveedor
        ? of(ejecucion.Proveedor)
        : this.proveedorService.getProveedor(ejecucion.proveedor_id).pipe(
            catchError((error) => {
              console.error(`Error fetching proveedor ${ejecucion.proveedor_id}:`, error);
              return of({ id: ejecucion.proveedor_id, nombre: 'Unknown' });
            })
          )
    );

    return forkJoin([
      forkJoin(contractRequests),
      forkJoin(providerRequests)
    ]).pipe(
      map(([contratos, proveedores]) => {
        const enriched = this.data.map((ejecucion, index) => ({
          ...ejecucion,
          Contrato: contratos[index] || { id: ejecucion.contrato_id, no_contrato: 'Unknown' },
          Proveedor: proveedores[index] || { id: ejecucion.proveedor_id, nombre: 'Unknown' }
        } as EjecucionContrato));
        console.log('Enriched data result:', enriched);
        return enriched;
      })
    );
  }

  private calculateTotals(): void {
    this.totalEjecutadoCup = this.data.reduce((sum, ejecucion) => sum + parseFloat(ejecucion.costo_cup || '0'), 0);
    this.totalEjecutadoUsd = this.data.reduce((sum, ejecucion) => sum + parseFloat(ejecucion.costo_usd || '0'), 0).toFixed(2);
    this.montoInicialCup = this.totalEjecutadoCup + this.montoRestanteCup; // Adjust as needed
    this.montoRestanteCup = this.montoInicialCup - this.totalEjecutadoCup;
    this.montoInicialUsd = '0.00'; // Update if available
    this.montoRestanteUsd = '0.00'; // Update if available
  }

  private setupSearch(): void {
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(value => {
        this.dataSource.filter = value?.trim().toLowerCase() || '';
        this.cdr.markForCheck();
        this.dataSource._updateChangeSubscription();
      });

    this.dataSource.filterPredicate = (data: EjecucionContrato, filter: string) => {
      const searchStr = this.selectedColumns
        .reduce((currentTerm: string, key: string) => {
          const value = this.getNestedValue(data, key, this.columns.find(col => col.key === key)?.nestedKey);
          return currentTerm + (value || '') + ' ';
        }, '')
        .toLowerCase();
      return searchStr.includes(filter);
    };
  }

  trackByFn(index: number, item: EjecucionContrato): number {
    return item.id;
  }

  getNestedValue(row: EjecucionContrato, key: string, nestedKey?: string): any {
    if (nestedKey && row[key]) {
      return row[key][nestedKey] || '';
    }
    return row[key] || '';
  }

  toggleDetails(rowId: number): void {
    this.selectedRow = this.selectedRow?.id === rowId ? null : this.data.find(row => row.id === rowId) || null;
    this.selectedRowForm = new FormGroup({
      proveedor: new FormControl({ value: this.selectedRow?.Proveedor?.nombre || 'Sin proveedor', disabled: true }),
      contrato: new FormControl({ value: this.selectedRow?.Contrato?.no_contrato || 'Sin contrato', disabled: true }),
      costo_cup: new FormControl(this.selectedRow?.costo_cup),
      costo_usd: new FormControl(this.selectedRow?.costo_usd),
      trabajo_ejecutado: new FormControl(this.selectedRow?.trabajo_ejecutado),
      fecha_ejecucion: new FormControl(this.selectedRow?.fecha_ejecucion)
    });
    this.cdr.markForCheck();
  }

  createRecord(): void {
    const dialogRef = this.dialog.open(SuplementoFormComponent, {
      width: '30%',
      height: '90%',
      disableClose: false,
      data: { mode: 'create', contratos: this.contratos, proveedores: this.proveedores }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ejecucionService.addEjecucion(result).subscribe({
          next: () => this.loadInitialData(),
          error: (error) => {
            console.error('Error creating ejecucion:', error);
            this.errorMessage = 'Error creating ejecucion';
            this.cdr.markForCheck();
          }
        });
      }
    });
  }

  updateSelectedRecord(): void {
    if (this.selectedRow && this.selectedRowForm.valid) {
      const updatedEjecucion: EjecucionContrato = {
        ...this.selectedRow,
        costo_cup: this.selectedRowForm.get('costo_cup')?.value,
        costo_usd: this.selectedRowForm.get('costo_usd')?.value,
        trabajo_ejecutado: this.selectedRowForm.get('trabajo_ejecutado')?.value,
        fecha_ejecucion: this.selectedRowForm.get('fecha_ejecucion')?.value
      };
      this.ejecucionService.updateEjecucion(updatedEjecucion).subscribe({
        next: () => {
          this.loadInitialData();
          this.selectedRow = null;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error updating ejecucion:', error);
          this.errorMessage = 'Error updating ejecucion';
          this.cdr.markForCheck();
        }
      });
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      this.ejecucionService.deleteEjecucion(this.selectedRow.id).subscribe({
        next: () => {
          this.loadInitialData();
          this.selectedRow = null;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error deleting ejecucion:', error);
          this.errorMessage = 'Error deleting ejecucion';
          this.cdr.markForCheck();
        }
      });
    }
  }

  exportToCSV(): void {
    if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      console.log('No data to export');
      return;
    }

    const csvRows = [];
    const headers = this.selectedColumns.map(key => this.columns.find(col => col.key === key)?.label || key);
    csvRows.push(headers.join(','));

    this.dataSource.filteredData.forEach(ejecucion => {
      const row = this.selectedColumns.map(key => {
        if (key === 'proveedor') return ejecucion.Proveedor?.nombre || 'Sin proveedor';
        if (key === 'contrato') return ejecucion.Contrato?.no_contrato || 'Sin contrato';
        if (key === 'costo_cup') return ejecucion.costo_cup;
        if (key === 'costo_usd') return ejecucion.costo_usd;
        if (key === 'trabajo_ejecutado') return ejecucion.trabajo_ejecutado || '';
        if (key === 'fecha_ejecucion') return ejecucion.fecha_ejecucion || '';
        return '';
      });
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

  printTable(): void {
    window.print();
  }

  toggleColumn(columnKey: string): void {
    if (this.selectedColumns.includes(columnKey)) {
      this.selectedColumns = this.selectedColumns.filter(key => key !== columnKey);
    } else {
      this.selectedColumns.push(columnKey);
    }
    // Save column preferences to local storage (optional)
    localStorage.setItem('ejecucionContratoColumns', JSON.stringify(this.selectedColumns));
    this.updateDisplayedColumns();
    this.cdr.markForCheck();
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = [...this.selectedColumns, 'details'];
  }
}