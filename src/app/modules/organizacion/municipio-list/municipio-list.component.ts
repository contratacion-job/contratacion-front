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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    ReactiveFormsModule
  ],
  templateUrl: './municipio-list.component.html',
  styleUrls: ['./municipio-list.component.scss']
})
export class DepartamentoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre_departamento', 'codigo', 'descripcion', 'actions'];
  dataSource = new MatTableDataSource<Departamento>([]);
  searchInputControl: FormControl = new FormControl();
  selectedRow: Departamento | null = null;
  selectedRowForm: FormGroup;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private departamentoService: DepartamentoService,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedRowForm = new FormGroup({
      nombre_departamento: new FormControl(''),
      codigo: new FormControl(''),
      descripcion: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.departamentoService.getDepartamentos().subscribe((data) => {
      this.dataSource.data = data;
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    this.dataSource.filterPredicate = (data: Departamento, filter: string) => {
      if (!filter) return true;
      const searchTerms = filter.toLowerCase().split(' ').filter(term => term.length > 0);
      const dataStr = [
        data.nombre_departamento,
        data.codigo,
        data.descripcion
      ].join(' ').toLowerCase();
      return searchTerms.every(term => dataStr.includes(term));
    };

    this.searchInputControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((query) => {
        this.dataSource.filter = query.trim().toLowerCase();
        this.closeDetails();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  toggleDetails(rowId: string): void {
    this.selectedRow = this.selectedRow?.nombre_departamento === rowId ? null : this.dataSource.data.find(row => row.nombre_departamento === rowId) || null;
    if (this.selectedRow) {
      this.selectedRowForm.setValue({
        nombre_departamento: this.selectedRow.nombre_departamento,
        codigo: this.selectedRow.codigo,
        descripcion: this.selectedRow.descripcion
      });
    }
    this.cdr.markForCheck();
  }

  closeDetails(): void {
    this.selectedRow = null;
  }

  openNewDepartamentoDialog(): void {
    // TODO: Implement dialog open logic here or reuse existing form component
    console.log('Open new departamento dialog');
  }

  updateSelectedRecord(): void {
    if (this.selectedRow && this.selectedRowForm.valid) {
      // Implement update logic here
    }
  }

  deleteSelectedRecord(): void {
    if (this.selectedRow) {
      // Implement delete logic here
    }
  }
}
