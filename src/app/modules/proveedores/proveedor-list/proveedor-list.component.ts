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
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { 
  mockContrato, 
  mockMinisterio, 
  mockMunicipio, 
  mockProveedor, 
  mockTipoContrato, 
  mockVigenciaContrato 
} from 'app/mock-api/contrato-fake/fake'; 
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
    MatDividerModule
  ],
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.scss']
})


export class ProveedorListComponent implements OnInit {
  data: any[] = mockProveedor;

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
      nombre: new FormControl(this.selectedRow?.nombre),
      codigo: new FormControl(this.selectedRow?.codigo),
      telefonos: new FormControl(this.selectedRow?.telefonos),
      domicilio: new FormControl(this.selectedRow?.domicilio),
      municipio: new FormControl(this.selectedRow?.municipio),
      ministerio: new FormControl(this.selectedRow?.ministerio)
    });
  }

  createRecord(): void {
    console.log('Crear nuevo proveedor');
    // Implement logic to add a new proveedor
  }

  updateSelectedRecord(): void {
    if (this.selectedRow) {
      const updatedData = { ...this.selectedRow, ...this.selectedRowForm.value };
      const index = this.data.findIndex(row => row.id === this.selectedRow.id);
      this.data[index] = updatedData;
      this.dataSource.data = [...this.data];
      console.log('Proveedor actualizado:', updatedData);
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      this.data = this.data.filter(row => row.id !== this.selectedRow.id);
      this.dataSource.data = this.data;
      this.selectedRow = null;
      this.pagination.length = this.data.length;
      console.log('Proveedor eliminado');
    }
  }
}

