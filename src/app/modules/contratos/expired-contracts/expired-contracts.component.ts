import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContratoService } from '../services/contrato.service';
import { Contrato } from 'app/models/Type';

@Component({
  selector: 'app-expired-contracts',
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
    DatePipe
  ],
  templateUrl: './expired-contracts.component.html',
  styleUrls: ['./expired-contracts.component.scss']
})
export class ExpiredContractsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Contrato>;
  displayedColumns: string[] = ['no_contrato', 'proveedor', 'tipo_contrato', 'valor_cup', 'fecha_firmado', 'fecha_vencido', 'acciones'];
  isLoading = false;
  errorMessage = '';
  pagination = { length: 0, page: 0, size: 10 };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private contratoService: ContratoService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.loadExpiredContracts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.markForCheck();
  }

  loadExpiredContracts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.contratoService.getExpiredContratos().subscribe({
      next: (contratos) => {
        console.log('Expired contracts received:', contratos);
        this.dataSource.data = contratos.filter(c => c.proveedor && c.proveedor.nombre);
        console.log('Expired DataSource data:', this.dataSource.data);
        this.pagination.length = this.dataSource.data.length;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching expired contracts:', error);
        this.errorMessage = 'Failed to load expired contracts. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackByFn(index: number, item: Contrato): number {
    return item.id;
  }

  restoreContrato(id: number): void {
    this.contratoService.restoreContrato(id).subscribe({
      next: () => {
        this.loadExpiredContracts();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error restoring contrato:', error);
        this.errorMessage = 'Failed to restore contract. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  deleteContrato(id: number): void {
    this.contratoService.deleteContrato(id).subscribe({
      next: () => {
        this.loadExpiredContracts();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error deleting contrato:', error);
        this.errorMessage = 'Failed to delete contract. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}