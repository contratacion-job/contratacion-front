import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ContratoFormComponent } from '../contrato-form/contrato-form.component';
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
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { ContratoService } from '../services/contrato.service';
import { Contrato, Proveedor, TipoContrato, VigenciaContrato } from 'app/models/Type';
import { mockProveedor, mockTipoContrato, mockVigenciaContrato, mockDepartamento } from 'app/mock-api/contrato-fake/fake';

@Component({
  selector: 'app-contrato-list',
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
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss']
})
export class ContratoListComponent implements OnInit, AfterViewInit {
  data: Contrato[] = [];
  proveedores: Proveedor[] = [];
  tiposContrato: TipoContrato[] = [];
  vigencias: VigenciaContrato[] = [];
  estados = [
    { label: 'Activo', color: 'green' },
    { label: 'Casi a vencer', color: 'orange' },
    { label: 'Vencido', color: 'red' }
  ];

  columns = [
    { key: 'no_contrato', label: 'No. Contrato', editable: true },
    { key: 'proveedor', label: 'Proveedor', nestedKey: 'nombre', editable: true, selectOptions: this.proveedores },
    { key: 'tipo_contrato', label: 'Tipo de Contrato', nestedKey: 'tipo_contrato', editable: true, selectOptions: this.tiposContrato },
    { key: 'departamento', label: 'Departamento', nestedKey: 'nombre_dpto', editable: false },
    { key: 'valor_cup', label: 'Valor (CUP)', type: 'currency', editable: true },
    { key: 'fecha_firmado', label: 'Fecha Firmado', type: 'date', editable: true },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha_vencido', label: 'Fecha Vencido', type: 'date', editable: true }
  ];

  title = 'Contratos';
  addButtonText = 'Agregar Contrato';
  dataSource: MatTableDataSource<Contrato>;
  displayedColumns: string[] = [];
  searchInputControl = new FormControl('');
  selectedRow: Contrato | null = null;
  selectedRowForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private contratoService: ContratoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selectedRowForm = new FormGroup({
      no_contrato: new FormControl(''),
      proveedor: new FormControl(null),
      tipo_contrato: new FormControl(null),
      valor_cup: new FormControl(0),
      valor_usd: new FormControl(0),
      fecha_firmado: new FormControl(''),
      vigencia: new FormControl(null),
      observaciones: new FormControl(''),
      fecha_vencido: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.proveedores = mockProveedor;
    this.tiposContrato = mockTipoContrato;
    this.vigencias = mockVigenciaContrato;
    this.loadContratos();
    this.displayedColumns = this.columns.map(col => col.key).concat('details');

    this.searchInputControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.dataSource.filter = value?.trim().toLowerCase() || '';
        this.cdr.markForCheck();
      });

    this.dataSource.filterPredicate = (data: Contrato, filter: string) => {
      const searchStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          const value = this.getNestedValue(data, key, this.columns.find(col => col.key === key)?.nestedKey);
          return currentTerm + (value || '') + ' ';
        }, '')
        .toLowerCase();
      return searchStr.includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.markForCheck();
  }

  loadContratos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.contratoService.getContratos().subscribe({
      next: (contratos) => {
        console.log('Contratos received:', contratos);
        // Filter out invalid contracts
        this.data = contratos.filter(contract => {
          if (!contract.proveedor || !contract.proveedor.nombre) {
            console.warn(`Invalid proveedor for contract ID ${contract.id}:`, contract);
            return false;
          }
          return true;
        });
        this.dataSource.data = this.data;
        console.log('DataSource data:', this.dataSource.data);
        this.pagination.length = this.dataSource.data.length;
        // Transfer expired contracts
        this.contratoService.transferExpiredContratos().subscribe({
          next: (transferred) => {
            if (transferred.length > 0) {
              console.log('Transferred expired contracts:', transferred);
              // Reload contracts after transfer
              this.contratoService.getContratos().subscribe({
                next: (updatedContratos) => {
                  this.data = updatedContratos.filter(c => c.proveedor && c.proveedor.nombre);
                  this.dataSource.data = this.data;
                  this.pagination.length = this.dataSource.data.length;
                  this.cdr.markForCheck();
                }
              });
            }
          }
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching contratos:', error);
        this.errorMessage = 'Failed to load contracts. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackByFn(index: number, item: Contrato): number {
    return item.id;
  }

  getNestedValue(row: Contrato, key: string, nestedKey?: string): any {
    if (nestedKey && row[key]) {
      return row[key][nestedKey];
    }
    return row[key] || '';
  }

  toggleDetails(rowId: number): void {
    this.selectedRow = this.selectedRow?.id === rowId ? null : this.data.find(row => row.id === rowId) || null;
    this.selectedRowForm = new FormGroup({
      no_contrato: new FormControl(this.selectedRow?.no_contrato),
      proveedor: new FormControl(this.selectedRow?.proveedor),
      tipo_contrato: new FormControl(this.selectedRow?.tipo_contrato),
      valor_cup: new FormControl(this.selectedRow?.valor_cup),
      valor_usd: new FormControl(this.selectedRow?.valor_usd),
      fecha_firmado: new FormControl(this.selectedRow?.fecha_firmado),
      vigencia: new FormControl(this.selectedRow?.vigencia),
      observaciones: new FormControl(this.selectedRow?.observaciones),
      fecha_vencido: new FormControl(this.selectedRow?.fecha_vencido)
    });
    this.cdr.markForCheck();
  }

  openNewContratoDialog(): void {
    const dialogRef = this.dialog.open(ContratoFormComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContratos();
      }
    });
  }



  updateSelectedRecord(): void {
    if (this.selectedRow && this.selectedRowForm.valid) {
      const updatedContrato: Contrato = {
        ...this.selectedRowForm.value,
        id: this.selectedRow.id,
        departamento: this.selectedRow.departamento || mockDepartamento[0],
        estado: this.selectedRowForm.value.estado || this.selectedRow.estado || 'Activo',
        proveedor: this.selectedRowForm.value.proveedor || mockProveedor[0]
      };
      this.contratoService.updateContrato(this.selectedRow.id, updatedContrato).subscribe({
        next: () => {
          this.loadContratos(); // Reload to handle any estado changes
        }
      });
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      this.contratoService.deleteContrato(this.selectedRow.id).subscribe({
        next: () => {
          this.loadContratos();
          this.selectedRow = null;
          this.selectedRowForm.reset();
        }
      });
    }
  }
}