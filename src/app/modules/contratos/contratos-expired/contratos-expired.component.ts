import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Contrato } from 'app/models/Type';
import { ContratoService } from '../services/contrato.service';



@Component({
  selector: 'app-contratos-expired',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './contratos-expired.component.html',
  styleUrls: ['./contratos-expired.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContratosExpiredComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Contrato>;
  displayedColumns: string[] = ['no_contrato', 'proveedor', 'departamento', 'valor_total_cup', 'fecha_inicio', 'fecha_fin', 'acciones'];

  isLoading = false;
  errorMessage = '';
  searchInputControl: FormControl = new FormControl('');

  pagination = {
    length: 0,
    page: 0,
    size: 10
  };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private contratoService: ContratoService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<Contrato>([]);
  }

  ngOnInit(): void {
    this.loadExpiredContratos();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  setupSearch(): void {
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm: string) => {
        this.applyFilter(searchTerm?.trim() || '');
      });

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Contrato, filter: string) => {
      if (!filter) return true;

      const searchTerms = filter.toLowerCase().split(' ').filter(term => term.length > 0);
      const dataStr = [
        data.no_contrato?.toString() || '',
        data.proveedor?.nombre || '',
        data.departamento?.nombre_departamento || '',
      
      ].join(' ').toLowerCase();

      return searchTerms.every(term => dataStr.includes(term));
    };
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadExpiredContratos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.contratoService.getExpiredContratos().subscribe({
      next: (contratos: Contrato[]) => {
        this.dataSource.data = contratos;
        this.pagination.length = contratos.length;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading expired contracts:', error);
        this.errorMessage = 'Error al cargar los contratos vencidos';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex;
    this.pagination.size = event.pageSize;
    // Si tu API soporta paginación del lado del servidor, llama a loadExpiredContratos() aquí
  }

  restoreContrato(id: number): void {
    if (confirm('¿Está seguro de que desea restaurar este contrato?')) {
      this.contratoService.restoreContrato(id).subscribe({
        next: () => {
          this.loadExpiredContratos(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error restoring contract:', error);
          this.errorMessage = 'Error al restaurar el contrato';
          this.cdr.markForCheck();
        }
      });
    }
  }

  deleteContrato(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar permanentemente este contrato?')) {
      this.contratoService.deleteContrato(id).subscribe({
        next: () => {
          this.loadExpiredContratos(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error deleting contract:', error);
          this.errorMessage = 'Error al eliminar el contrato';
          this.cdr.markForCheck();
        }
      });
    }
  }

  trackByFn(index: number, item: Contrato): any {
    return item.id || index;
  }
}
