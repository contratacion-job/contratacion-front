import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Contrato } from 'app/models/Type';
import { ContratoService } from '../services/contrato.service';

// Importa tu servicio y modelos


@Component({
  selector: 'app-vencido-ejecucion-contrato',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
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
  searchInputControl: FormControl = new FormControl('');

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

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex;
    this.pagination.size = event.pageSize;
    this.loadVencidoEjecucionContratos();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
