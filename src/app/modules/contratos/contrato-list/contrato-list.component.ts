import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule,MatIconRegistry } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { 
  mockContrato, 
  mockProveedor, 
  mockTipoContrato, 
  mockVigenciaContrato 
} from 'app/mock-api/contrato-fake/fake'; // Adjust import path as needed

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
    MatDividerModule
  ],
  templateUrl: './contrato-list.component.html',
  styleUrl: './contrato-list.component.scss'
})
export class ContratoListComponent implements OnInit {
    data: any[] = mockContrato;
    proveedores = mockProveedor;
    tiposContrato = mockTipoContrato;
    vigencias = mockVigenciaContrato;
  
    columns = [
      { key: 'no_contrato', label: 'No. Contrato', editable: true },
      { key: 'proveedor', label: 'Proveedor', nestedKey: 'nombre', editable: true, selectOptions: this.proveedores },
      { key: 'tipo_contrato', label: 'Tipo de Contrato', nestedKey: 'tipo_contrato', editable: true, selectOptions: this.tiposContrato },
      { key: 'valor_cup', label: 'Valor (CUP)', type: 'currency', editable: true },
      { key: 'fecha_firmado', label: 'Fecha Firmado', type: 'date', editable: true }
    ];
  
    title = 'Contratos';
    addButtonText = 'Agregar Contrato';
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = [];
    searchInputControl = new FormControl('');
    selectedRow: any = null;
    selectedRowForm: FormGroup;
    isLoading = false;
    pagination = { length: 0, page: 0, size: 10 };
  
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
  
    constructor() {
      this.dataSource = new MatTableDataSource([]);
      this.selectedRowForm = new FormGroup({});
    }
  
    ngOnInit(): void {
      this.displayedColumns = this.columns.map(col => col.key).concat('details');
      this.dataSource.data = this.data;
      this.pagination.length = this.data.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  
      this.searchInputControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(value => {
          this.dataSource.filter = value?.trim().toLowerCase() || '';
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
        no_contrato: new FormControl(this.selectedRow?.no_contrato),
        proveedor: new FormControl(this.selectedRow?.proveedor),
        tipo_contrato: new FormControl(this.selectedRow?.tipo_contrato),
        valor_cup: new FormControl(this.selectedRow?.valor_cup),
        valor_usd: new FormControl(this.selectedRow?.valor_usd),
        fecha_firmado: new FormControl(this.selectedRow?.fecha_firmado),
        vigencia: new FormControl(this.selectedRow?.vigencia),
        observaciones: new FormControl(this.selectedRow?.observaciones)
      });
    }
  
    createRecord(): void {
      console.log('Crear nuevo contrato');
      // Implement logic to add a new contract
    }
  
    updateSelectedRecord(): void {
      if (this.selectedRow) {
        const updatedData = { ...this.selectedRow, ...this.selectedRowForm.value };
        const index = this.data.findIndex(row => row.id === this.selectedRow.id);
        this.data[index] = updatedData;
        this.dataSource.data = [...this.data];
        console.log('Contrato actualizado:', updatedData);
      }
    }
  
    deleteSelectedRecord(): void {
      if (this.selectedRow) {
        this.data = this.data.filter(row => row.id !== this.selectedRow.id);
        this.dataSource.data = this.data;
        this.selectedRow = null;
        this.pagination.length = this.data.length;
        console.log('Contrato eliminado');
      }
    }
  }