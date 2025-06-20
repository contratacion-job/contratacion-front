import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioFormComponent } from './usuario-form.component';
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
import { } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService } from 'app/core/user/user.service';
import { Usuario } from 'app/models/Type';

@Component({
    selector: 'app-usuario-gestion',
    templateUrl: './usuario-gestion.component.html',
    styleUrls: ['./usuario-gestion.component.scss'],
    standalone: true,
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
        MatTooltipModule,
        MatDividerModule,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuarioGestionComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'username', 'roles', 'nombre', 'apellidos', 'cargo', 'correo', 'movil', 'extension', 'actions'];
    dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    totalUsuarios: number = 0;
    usuariosActivos: number = 0;
    usuariosInactivos: number = 0;
    totalAdministradores: number = 0;
    isLoading: boolean = false;

    pagination = {
        length: 0,
        page: 0,
        size: 10
    };


    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.loadUsers();

        this.searchInputControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.applyFilter();
            });

        // Configurar el ordenamiento
        this.dataSource.sortingDataAccessor = (item: Usuario, property: string) => {
            switch(property) {
                default: return item[property];
            }
        };

        // Configurar el filtro
        this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
            if (!filter) return true;

            const searchTerm = filter.toLowerCase().trim();
            const dataStr = [
                data.id?.toString() || '',
                data.username?.toLowerCase() || '',
                data.roles?.toLowerCase() || '',
                data.name?.toLowerCase() || '',
                data.apellidos?.toLowerCase() || '',
                data.cargo?.toLowerCase() || '',
                data.correo?.toLowerCase() || '',
                data.movil?.toString() || '',
                data.extension?.toString() || ''
            ].join(' ');

            return dataStr.includes(searchTerm);
        };
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe((users: any[]) => {
            const mappedUsers = users.map(user => ({
                id: parseInt(user.id, 10),
                username: user.username,
                roles: Array.isArray(user.roles) ? user.roles.join(', ') : user.roles,
                password: user.password || '',
                name: user.name || '',
                apellidos: user.apellidos || '',
                cargo: user.cargo || '',
                correo: user.correo || user.email || '',
                movil: user.movil || 0,
                extension: user.extension || 0
            }));
            this.dataSource.data = mappedUsers;
            this.totalUsuarios = mappedUsers.length;

            this.pagination.length = mappedUsers.length;

this.totalAdministradores = mappedUsers.filter(u => u.roles.includes('admin')).length;
this.isLoading = false;
this.cdr.detectChanges();

        });
    }

    applyFilter(filterValue?: string): void {
        if (filterValue === undefined) {
            filterValue = this.searchInputControl.value || '';
        }
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openAddUserDialog(): void {
        const dialogRef = this.dialog.open(UsuarioFormComponent, {
            width: '600px',
            data: null
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const newId = this.dataSource.data.length > 0 ? Math.max(...this.dataSource.data.map(u => u.id)) + 1 : 1;
                result.id = newId;
                this.dataSource.data = [...this.dataSource.data, result];
            }
        });
    }

    openEditUserDialog(user: Usuario): void {
        const dialogRef = this.dialog.open(UsuarioFormComponent, {
            width: '600px',
            data: user
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const data = this.dataSource.data;
                const index = data.findIndex(u => u.id === result.id);
                if (index !== -1) {
                    data[index] = result;
                    this.dataSource.data = [...data];
                }
            }
        });
    }

    deleteUser(user: Usuario): void {
        this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
    }
    exportToCSV(): void {
        if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
          return;
        }

        const csvRows = [];
        // Headers
        const headers = [
          'No. Contrato',
          'Proveedor',
          'Tipo de Contrato',
          'Departamento',
          'Valor (CUP)',
          'Valor (USD)',
          'Fecha Entrada',
          'Fecha Firmado',
          'Vigencia',
          'Tiempo Restante',
          'Estado',
          'Observaciones'
        ];
        csvRows.push(headers.join(','));



        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'contratos_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
}
