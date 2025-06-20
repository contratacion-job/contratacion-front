// File: src/app/modules/organizacion/entidad-list/entidad-list.component.ts
import { AsyncPipe, CommonModule, DOCUMENT, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entidad } from 'app/models/Type';
import { mockMunicipio, mockProvincia } from 'app/mock-api/contrato-fake/fake';



@Component({
    selector: 'app-entidad-list',
    templateUrl: './entidad-list.component.html',
    styleUrls: ['./entidad-list.component.scss'],
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
        MatTooltipModule,
        NgIf,
        NgFor,

    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntidadListComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'nombre_entidad', 'codigo_entidad', 'domicilio_legal', 'telefonos', 'tipo_empresa', 'municipio', 'actions'];
    dataSource = new MatTableDataSource<Entidad>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private _entidadesSubject = new BehaviorSubject<Entidad[]>([]);
    entidades$ = this._entidadesSubject.asObservable();

    isLoading = false;
    pagination = {
        length: 0,
        page: 0,
        size: 10
    };

    editMode = false;
    selectedEntidad: Entidad | null = null;
    contactForm: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _cdr: ChangeDetectorRef,
        private _fb: FormBuilder,
        @Inject(DOCUMENT) private _document: any
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.loadEntidades();

        // Initialize form
        this.contactForm = this._fb.group({
            id: [null],
            nombre_entidad: ['', Validators.required],
            codigo_entidad: [''],
            domicilio_legal: [''],
            telefonos: [''],
            municipio: [''], // This might need adjustment if municipio is an object
            logo: [null] // Add logo form control
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    loadEntidades(): void {
        // Mock data, replace with service call if needed
        const mockData: Entidad[] = [
            {
                id: 1,
                municipio_id: 101,
                nombre_entidad: 'Entidad Uno',
                codigo_entidad: 'E001',
                domicilio_legal: 'Calle 123, Ciudad',
                telefonos: '123456789',
                logo: '', // Add a placeholder for logo
                tipo_empresa: 'Empresa Estatal',
                  provincia: mockProvincia[3],
                 municipio: mockMunicipio[0]
            }
        ];
        this._entidadesSubject.next(mockData);
        this.dataSource.data = mockData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pagination.length = mockData.length;
        this.isLoading = false;
        this._cdr.markForCheck();
    }

    openAddEntidadDialog(): void {
        this.editMode = false;
        this.selectedEntidad = null;
        this.contactForm.reset();
        this._cdr.markForCheck();
        // Implement MatDialog to open a form for adding a new entity
        console.log('Open add entidad dialog');
    }

    openEditEntidadDialog(entidad: Entidad): void {
        this.editMode = true;
        this.selectedEntidad = entidad;
        this.contactForm.patchValue({
            id: entidad.id,
            nombre_entidad: entidad.nombre_entidad,
            codigo_entidad: entidad.codigo_entidad,
            domicilio_legal: entidad.domicilio_legal,
            telefonos: entidad.telefonos,
            municipio: entidad.municipio?.nombre_municipio || '', // Patching with name, consider patching with the object if form expects it
            logo: entidad.logo || null // Patch logo value
        });
        this._cdr.markForCheck();
    }

    updateEntidad(): void {
        if (this.contactForm.invalid) {
            return;
        }
        const updatedEntidad = this.contactForm.value;
        const currentData = this._entidadesSubject.getValue();
        const index = currentData.findIndex(e => e.id === updatedEntidad.id);
        if (index !== -1) {
            currentData[index] = {
                ...currentData[index],
                ...updatedEntidad,
                municipio: { id: currentData[index].municipio.id, nombre: updatedEntidad.municipio }
            };
            this._entidadesSubject.next([...currentData]);
            this.dataSource.data = currentData; // Update data source
            this.cancelEdit();
        }
    }

    cancelEdit(): void {
        this.editMode = false;
        this.selectedEntidad = null;
        this.contactForm.reset();
        this._cdr.markForCheck();
    }

    deleteEntidad(entidad: Entidad): void {
        const currentData = this._entidadesSubject.getValue();
        const filtered = currentData.filter(e => e.id !== entidad.id);
        this._entidadesSubject.next(filtered);
        this.dataSource.data = filtered; // Update data source
        this.pagination.length = filtered.length;
        this._cdr.markForCheck();
    }

    canAddEntidad(): boolean {
        return this._entidadesSubject.getValue().length === 0;
    }

    // Add trackBy function for ngFor performance optimization
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Upload logo
     *
     * @param files
     */
    uploadLogo(files: FileList | null): void {
        // Return if files or file[0] do not exist
        if (!files || !files[0]) {
            return;
        }

        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
            // Update the logo form control value
            this.contactForm.get('logo').setValue(reader.result as string);
            // Mark the form as dirty so the save button is enabled
            this.contactForm.markAsDirty();
            // Manually trigger change detection
            this._cdr.markForCheck();
        };
        reader.readAsDataURL(file);
    }

    /**
     * Remove logo
     */
    removeLogo(): void {
        // Set the logo form control value to null
        this.contactForm.get('logo').setValue(null);
        // Mark the form as dirty so the save button is enabled
        this.contactForm.markAsDirty();
        // Manually trigger change detection
        this._cdr.markForCheck();
    }
}
