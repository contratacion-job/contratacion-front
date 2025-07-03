import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioFormComponent } from './usuario-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService } from 'app/core/user/user.service';
import { Usuario } from 'app/models/Type';
import autoTable from 'jspdf-autotable';

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

    selectedUser: any = null; // Usuario seleccionado para mostrar detalles
    selectedUserForm: FormGroup;
    
    

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
    ) {
        this.selectedUserForm = this.fb.group({
            id: [''],
            username: [''],
            nombre: [''],
            apellidos: [''],
            estado: [''],
            fecha_creacion: [''],
            correo: [''],
            movil: [''],
            extension: [''],
            cargo: [''],
            departamento: [''],
            ultimo_acceso: [''],
            roles: [[]],
            observaciones: [''],
            password: [''],
            confirm_password: ['']
          });
    }

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
                data.id?.toString()  ,
                data.username?.toLowerCase()  ,
                data.roles?.toLowerCase()  ,
                data.name?.toLowerCase()  ,
                data.apellidos?.toLowerCase() ,
                data.cargo?.toLowerCase()  ,
                data.correo?.toLowerCase()  ,
                data.movil?.toString() ,
                data.extension?.toString() 
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
                password: user.password ,
                name: user.name  ,
                apellidos: user.apellidos  ,
                cargo: user.cargo,
                correo: user.correo  ,
                movil: user.movil  ,
                extension: user.extension  
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
            filterValue = this.searchInputControl.value  ;
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
    exportToPDF(includeDetails: boolean = false): void {
        if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
          return;
        }
      
        const doc = new jsPDF('l', 'mm', 'a4');
        
        // Document setup
        this.setupPDFDocument(doc);
        
        if (includeDetails) {
          this.generateDetailedPDF(doc);
        } else {
          this.generateSummaryPDF(doc);
        }
      
        // Save with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        doc.save(`usuarios_${includeDetails ? 'detallado' : 'resumen'}_${timestamp}.pdf`);
      }
      
      private setupPDFDocument(doc: jsPDF): void {
        doc.setProperties({
          title: 'Lista de Usuarios',
          subject: 'Reporte de Usuarios del Sistema',
          author: 'Sistema de Gestión',
          creator: 'Sistema de Gestión'
        });
      }
      
      private generateSummaryPDF(doc: jsPDF): void {
        // Add header
        this.addPDFHeader(doc, 'Lista de Usuarios - Resumen');
        
        // Add statistics
        this.addPDFStatistics(doc);
        
        // Add main table
        const tableColumns = ['ID', 'Username', 'Nombre Completo', 'Cargo', 'Correo'];
        const tableRows = this.dataSource.filteredData.map(user => [
          user.id?.toString() || '',
          user.username || '',
          `${user.name || ''} ${user.apellidos || ''}`.trim(),
          user.cargo || '',
          user.correo || '',
    
        ]);
      
        autoTable(doc, {
          head: [tableColumns],
          body: tableRows,
          startY: 55,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
      
        this.addPDFFooter(doc);
      }
      
      private generateDetailedPDF(doc: jsPDF): void {
        this.addPDFHeader(doc, 'Lista de Usuarios - Detallado');
        this.addPDFStatistics(doc);
      
        let yPosition = 60;
        
        this.dataSource.filteredData.forEach((user, index) => {
          if (yPosition > 180) { // Check if we need a new page
            doc.addPage();
            yPosition = 20;
          }
      
          // User card
          doc.setFillColor(250, 250, 250);
          doc.rect(14, yPosition, 267, 35, 'F');
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`${user.name} ${user.apellidos}`, 16, yPosition + 8);
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(`ID: ${user.id} | Username: ${user.username}`, 16, yPosition + 15);
          doc.text(`Cargo: ${user.cargo} `, 16, yPosition + 22);
          doc.text(`Correo: ${user.correo} | Móvil: ${user.movil}`, 16, yPosition + 29);
          
          yPosition += 40;
        });
      
        this.addPDFFooter(doc);
      }
      
      private addPDFHeader(doc: jsPDF, title: string): void {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 20);
      
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const currentDate = new Date().toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
        doc.text(`Generado el: ${currentDate}`, 14, 28);
      }
      
      private addPDFStatistics(doc: jsPDF): void {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Estadísticas:', 14, 38);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total: ${this.totalUsuarios}`, 14, 45);
        doc.text(`Activos: ${this.usuariosActivos}`, 80, 45);
        doc.text(`Inactivos: ${this.usuariosInactivos}`, 150, 45);
        doc.text(`Administradores: ${this.totalAdministradores}`, 220, 45);
      }
      
      private addPDFFooter(doc: jsPDF): void {
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.width - 30,
            doc.internal.pageSize.height - 10
          );
        }
      }
      
    exportToCSV(): void {
        if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
          return;
        }

        // Prepare CSV export logic here (if needed)

        const csvRows = [];
        // Headers
        const headers = [
          'ID',
          'Username',
          'Roles',
          'Nombre',
          'Apellidos',
          'Cargo',
          'Correo',
          'Móvil',
          'Extensión'
        ];
        csvRows.push(headers.join(','));

        // Data
        this.dataSource.filteredData.forEach(user => {
          const row = [
            user.id,
            user.username,
            user.roles,
            user.name,
            user.apellidos,
            user.cargo,
            user.correo,
            user.movil,
            user.extension
          ];
          // Escape commas and quotes in values
          const escapedRow = row.map(value => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          });
          csvRows.push(escapedRow.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
// Cambia el tipo del parámetro de string a number
toggleDetails(userId: number): void {
    console.log('Toggle details for user:', userId);
    
    // Si ya está seleccionado el mismo usuario, lo deseleccionamos
    if (this.selectedUser?.id === userId) {
      this.selectedUser = null;
      return;
    }
  
    // Buscar el usuario en los datos
    const user = this.dataSource.data.find(u => u.id === userId);
    
    if (user) {
      this.selectedUser = user;
      
      // Llenar el formulario con los datos del usuario
      this.selectedUserForm.patchValue({
        id: user.id,
        username: user.username,
        nombre: user.name,
        apellidos: user.apellidos,


        correo: user.correo,
        movil: user.movil,
        extension: user.extension,
        cargo: user.cargo,

        roles: Array.isArray(user.roles) ? user.roles : (user.roles ? user.roles.split(',') : []),
     
        password: '',
        confirm_password: ''
      });
    }
  }
  

       // Funciones para los botones del formulario
  updateSelectedUser(): void {
    if (this.selectedUserForm.valid) {
      const formData = this.selectedUserForm.value;
      console.log('Updating user:', formData);
      // Aquí implementas la lógica para actualizar el usuario
    }
  }

  deleteSelectedUser(): void {
    if (this.selectedUser) {
      console.log('Deleting user:', this.selectedUser.id);
      // Aquí implementas la lógica para eliminar el usuario
      // Después de eliminar, cerrar los detalles
      this.selectedUser = null;
    }
  }
}