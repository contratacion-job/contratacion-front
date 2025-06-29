import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ContratoService } from '../../services/contrato.service';
import { Contrato } from 'app/models/Type';

@Component({
  selector: 'app-vencido-ejecucion-contrato',
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
    MatCardModule
  ],
  templateUrl: './vencido-ejecucion-contrato.component.html',
  styleUrls: ['./vencido-ejecucion-contrato.component.scss']
})
export class VencidoEjecucionContratoComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Contrato>;
  displayedColumns: string[] = ['no_contrato', 'proveedor', 'tipo_contrato', 'valor_cup', 'fecha_inicio', 'fecha_vencido', 'acciones'];
  isLoading = false;
  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };
  searchInputControl = new FormControl('');

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private contratoService: ContratoService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.loadVencidoEjecucionContratos();

    this.searchInputControl.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.markForCheck();
  }

  loadVencidoEjecucionContratos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.contratoService.getVencidoEjecucionContratos(this.pagination.page, this.pagination.size).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.pagination.length = response.total;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar contratos vencidos.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  trackByFn(index: number, item: Contrato): number {
    return item.id;
  }

  restoreContrato(id: number): void {
    this.contratoService.restoreContrato(id).subscribe({
      next: () => {
        this.loadVencidoEjecucionContratos();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = 'Failed to restore contract. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  deleteContrato(id: number): void {
    this.contratoService.deleteContrato(id).subscribe({
      next: () => {
        this.loadVencidoEjecucionContratos();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete contract. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
