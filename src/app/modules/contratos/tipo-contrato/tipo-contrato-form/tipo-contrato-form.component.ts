import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TipoContrato } from 'app/models/Type';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContratoService } from '../../services/contrato.service';
import { MatDialog } from '@angular/material/dialog';
import { TipoContratoComponent } from '../tipo-contrato.component';
@Component({
  selector: 'app-tipo-contrato-form',
  standalone: true,
  imports: [    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule],
  templateUrl: './tipo-contrato-form.component.html',
  styleUrl: './tipo-contrato-form.component.scss'
})
export class TipoContratoFormComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre_departamento', 'descripcion', 'actions'];
  dataSource = new MatTableDataSource<TipoContrato>([]);
  searchInputControl: FormControl = new FormControl();
  selectedRow: TipoContrato | null = null;
  selectedRowForm: FormGroup;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private departamentoService: ContratoService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.selectedRowForm = new FormGroup({
      nombre_departamento: new FormControl(''),
      codigo: new FormControl(''),
      descripcion: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.departamentoService.getTipoContratos().subscribe((data) => {
      this.dataSource.data = data;
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    this.dataSource.filterPredicate = (data: TipoContrato, filter: string) => {
      if (!filter) return true;
      const searchTerms = filter.toLowerCase().split(' ').filter(term => term.length > 0);
      const dataStr = [
        data.nombre_tipo_contrato,
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
    this.selectedRow = this.selectedRow?.nombre_tipo_contrato === rowId ? null : this.dataSource.data.find(row => row.nombre_tipo_contrato === rowId) || null;
    if (this.selectedRow) {
      this.selectedRowForm.setValue({
        nombre_departamento: this.selectedRow.nombre_tipo_contrato,
        descripcion: this.selectedRow.descripcion
      });
    }
    this.cdr.markForCheck();
  }

  closeDetails(): void {
    this.selectedRow = null;
  }

  openNewFormDialog(): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(TipoContratoComponent, {
      width: isMobile ? '90vw' : '750px',
      maxWidth: isMobile ? '100vw' : '90vw',
      height: isMobile ? '100vh' : '90vh',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      disableClose: false,
      autoFocus: false,
      hasBackdrop: !isMobile,
      position: isMobile ? { top: '0' } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.departamentoService.getTipoContratos().subscribe((data) => {
          this.dataSource.data = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
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
