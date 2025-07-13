import { EntidadService } from './entidad.service';
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
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entidad, Municipio, Provincia } from 'app/models/Type';
import { CatalogService } from 'app/services/catalog.service';

interface ApiEntidad {
    id: number;
    activo: boolean;
    codigo: string;
    createdAt: string;
    director_id: number | null;
    domicilio_legal: string;
    logo: string | null;
    logo_mime_type: string | null;
    logo_original_name: string | null;
    ministerio: string;
    municipio: string;
    nombre: string;
    provincia: string;
    telefonos: string;
    tipo_empresa: string;
    updatedAt: string;
}

interface ApiResponse {
    message: string;
    data: ApiEntidad[];
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

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
        MatSelectModule,
        NgIf,
        NgFor,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntidadListComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'nombre', 'codigo', 'domicilio_legal', 'telefonos', 'tipo_empresa', 'municipio', 'actions'];
    dataSource = new MatTableDataSource<Entidad>();
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    private _entidadesSubject = new BehaviorSubject<Entidad[]>([]);
    entidades$ = this._entidadesSubject.asObservable();
    
    isLoading = false;
    error: string = '';
    
    // Paginación del servidor
    serverPagination = {
        total: 0,
        currentPage: 1,
        totalPages: 0,
        limit: 50
    };
    
    pagination = {
        length: 0,
        page: 0,
        size: 10
    };
    
    editMode = false;
    selectedEntidad: Entidad | null = null;
    contactForm: FormGroup;
    
    // Opciones para selects
    tiposEmpresa = [
        'Empresa Estatal',
        'Empresa Mixta',
        'Empresa Privada',
        'Cooperativa',
        'Organización'
    ];
    
    ministerios = [
        'MINCIN',
        'MINAG',
        'MINSAP',
        'MINED',
        'MININT',
        'MINFAR'
    ];
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private entidadService: EntidadService,
        private catalogService:CatalogService,
        private _cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        @Inject(DOCUMENT) private _document: any
    ) {
 // Inicializar formulario vacío
 this.contactForm = this.fb.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    tipo_empresa: ['', Validators.required],
    ministerio: ['', Validators.required],
    telefonos: ['', Validators.required],
    provincia: ['', Validators.required],
    municipio: ['', Validators.required],
    domicilio_legal: ['', Validators.required],
    activo: [true],
    logo: [null]
  });

    }

    ngOnInit(): void {
        this.initializeForm();
        this.loadEntidades();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    initializeForm(): void {
        this.contactForm = this.fb.group({
            id: [null],
            nombre: ['', Validators.required],
            codigo: ['', Validators.required],
            domicilio_legal: ['', Validators.required],
            telefonos: ['', Validators.required],
            tipo_empresa: ['', Validators.required],
            ministerio: ['', Validators.required],
            municipio: ['', Validators.required],
            provincia: ['', Validators.required],
            activo: [true],
            logo: [null],
            director_id: [null]
        });
    }

    loadEntidades(): void {
        this.isLoading = true;
        this.error = '';
        
        console.log('Iniciando carga de entidades...');
        
        // Cargar catálogos primero
        this.loadCatalogos();
        
        this.entidadService.getLogs().subscribe({
            next: (response: any) => {
                console.log('Respuesta completa del servicio:', response);
                
                try {
                    let entidadesData: ApiEntidad[] = [];
                    
                    if (response && response.data) {
                        // Caso 1: response.data es un array
                        if (Array.isArray(response.data)) {
                            entidadesData = response.data;
                            console.log('Datos encontrados en response.data (array):', entidadesData);
                        } 
                        // Caso 2: response.data es un objeto único
                        else if (typeof response.data === 'object' && response.data !== null) {
                            entidadesData = [response.data];
                            console.log('Datos encontrados en response.data (objeto único):', entidadesData);
                        }
                        
                        if (response.pagination) {
                            this.serverPagination = {
                                total: response.pagination.total,
                                currentPage: response.pagination.page,
                                totalPages: response.pagination.pages,
                                limit: response.pagination.limit
                            };
                        }
                    } 
                    // Caso 3: response es directamente un array
                    else if (Array.isArray(response)) {
                        entidadesData = response;
                        console.log('Datos encontrados directamente en response:', entidadesData);
                    } 
                    // Caso 4: response es un objeto único
                    else if (typeof response === 'object' && response !== null) {
                        entidadesData = [response];
                        console.log('Datos encontrados directamente en response (objeto único):', entidadesData);
                    }
                    else {
                        console.error('Estructura de datos no reconocida:', response);
                        this.error = 'No se encontraron datos de entidades';
                        this.isLoading = false;
                        this._cdr.markForCheck();
                        return;
                    }
                    
                    console.log('Datos a transformar:', entidadesData);
                    
                    if (entidadesData.length === 0) {
                        console.log('No hay entidades para mostrar');
                        this._entidadesSubject.next([]);
                        this.dataSource.data = [];
                        this.pagination.length = 0;
                    } else {
                        const transformedData = this.transformApiData(entidadesData);
                        console.log('Datos transformados:', transformedData);
                        
                        this._entidadesSubject.next(transformedData);
                        this.dataSource.data = transformedData;
                        this.pagination.length = transformedData.length;
                        
                        // Configurar paginator y sort después de que los datos estén listos
                        setTimeout(() => {
                            if (this.paginator) {
                                this.dataSource.paginator = this.paginator;
                            }
                            if (this.sort) {
                                this.dataSource.sort = this.sort;
                            }
                        });
                    }
                    
                } catch (error) {
                    console.error('Error procesando datos:', error);
                    this.error = 'Error procesando los datos del servidor';
                }
                
                this.isLoading = false;
                this._cdr.markForCheck();
            },
            error: (error) => {
                console.error('Error al cargar entidades:', error);
                this.error = 'Error al cargar las entidades del servidor';
                this.isLoading = false;
                this._cdr.markForCheck();
            }
        });
    }
    
    loadCatalogos(): void {
        // Cargar tipos de empresa
        this.catalogService.getTiposEmpresa().subscribe({
            next: (data) => {
                console.log('Tipos de empresa:', data);
                if (data && Array.isArray(data)) {
                    this.tiposEmpresa = data.map(item => item.nombre || item);
                }
                this._cdr.markForCheck();
            },
            error: (error) => console.error('Error cargando tipos de empresa:', error)
        });
    
        // Cargar ministerios
        this.catalogService.getMinisterios().subscribe({
            next: (data) => {
                console.log('Ministerios:', data);
                if (data && Array.isArray(data)) {
                    this.ministerios = data.map(item => item.nombre || item);
                }
                this._cdr.markForCheck();
            },
            error: (error) => console.error('Error cargando ministerios:', error)
        });
    
        // Cargar provincias
        this.catalogService.getProvincias().subscribe({
            next: (data) => {
                console.log('Provincias:', data);
                // Procesar provincias si necesitas un select
                this._cdr.markForCheck();
            },
            error: (error) => console.error('Error cargando provincias:', error)
        });
    
        // Cargar municipios
        this.catalogService.getMunicipios().subscribe({
            next: (data) => {
                console.log('Municipios:', data);
                // Procesar municipios si necesitas un select
                this._cdr.markForCheck();
            },
            error: (error) => console.error('Error cargando municipios:', error)
        });
    }
    
    transformApiData(apiData: ApiEntidad[]): Entidad[] {
        console.log('Transformando datos API:', apiData);
        
        return apiData.map(item => {
            console.log('Transformando item:', item);
            
            // Crear provincia
            const provincia: Provincia = {
                id: 1, // Mock ID
                nombre_provincia: item.provincia || 'Sin provincia'
            };
            
            // Crear municipio con la estructura completa
            const municipio: Municipio = {
                id: 1, // Mock ID
                nombre_municipio: item.municipio || 'Sin municipio',
                provincia_id: 1, // Mock provincia_id
                provincia: provincia
            };
            
            const transformedItem: Entidad = {
                id: item.id,
                municipio_id: 1, // Mock municipio_id
                nombre_entidad: item.nombre,
                codigo_entidad: item.codigo,
                domicilio_legal: item.domicilio_legal,
                telefonos: item.telefonos,
                logo: item.logo,
                tipo_empresa: item.tipo_empresa,
                ministerio: item.ministerio,
                activo: item.activo,
                director_id: item.director_id,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                provincia: provincia,
                municipio: municipio
            };
            
            console.log('Item transformado:', transformedItem);
            return transformedItem;
        });
    }
    



        openEditEntidadDialog(entidad: Entidad): void {
            this.editMode = true;
            this.selectedEntidad = entidad;
            this.contactForm.patchValue({
                id: entidad.id,
                nombre: entidad.nombre_entidad,  // Mapear correctamente
                codigo: entidad.codigo_entidad,  // Mapear correctamente
                domicilio_legal: entidad.domicilio_legal,
                telefonos: entidad.telefonos,
                tipo_empresa: entidad.tipo_empresa,
                ministerio: entidad.ministerio,
                municipio: entidad.municipio?.nombre_municipio || '',
                provincia: entidad.provincia?.nombre_provincia || '',
                activo: entidad.activo,
                logo: entidad.logo,
                director_id: entidad.director_id
            });
            this._cdr.markForCheck();
        }
        

    saveEntidad(): void {
        if (this.contactForm.invalid) {
            return;
        }

        const formData = this.contactForm.value;
        
        if (this.editMode && this.selectedEntidad) {
            this.updateEntidad(formData);
        } else {
            this.createEntidad(formData);
        }
    }

    createEntidad(formData: any): void {
        console.log('Crear entidad:', formData);
        
        // Crear provincia
        const provincia: Provincia = {
            id: 1,
            nombre_provincia: formData.provincia
        };

        // Crear municipio
        const municipio: Municipio = {
            id: 1,
            nombre_municipio: formData.municipio,
            provincia_id: 1,
            provincia: provincia
        };
        
        const newEntidad: Entidad = {
            id: Date.now(),
            municipio_id: 1,
            nombre_entidad: formData.nombre,
            codigo_entidad: formData.codigo,
            domicilio_legal: formData.domicilio_legal,
            telefonos: formData.telefonos,
            logo: formData.logo,
            tipo_empresa: formData.tipo_empresa,
            ministerio: formData.ministerio,
            activo: formData.activo,
            director_id: formData.director_id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            provincia: provincia,
            municipio: municipio
        };
        
        const currentData = this._entidadesSubject.getValue();
        const updatedData = [...currentData, newEntidad];
        this._entidadesSubject.next(updatedData);
        this.dataSource.data = updatedData;
        this.pagination.length = updatedData.length;
        
        this.cancelEdit();
    }

    updateEntidad(formData: any): void {
        if (!this.selectedEntidad) return;
        
        console.log('Actualizar entidad:', formData);
        
        const currentData = this._entidadesSubject.getValue();
        const index = currentData.findIndex(e => e.id === this.selectedEntidad!.id);
        
        if (index !== -1) {
            // Crear provincia
            const provincia: Provincia = {
                id: 1,
                nombre_provincia: formData.provincia
            };

            // Crear municipio
            const municipio: Municipio = {
                id: 1,
                nombre_municipio: formData.municipio,
                provincia_id: 1,
                provincia: provincia
            };

            currentData[index] = {
                ...currentData[index],
                nombre_entidad: formData.nombre,
                codigo_entidad: formData.codigo,
                domicilio_legal: formData.domicilio_legal,
                telefonos: formData.telefonos,
                tipo_empresa: formData.tipo_empresa,
                ministerio: formData.ministerio,
                activo: formData.activo,
                logo: formData.logo,
                director_id: formData.director_id,
                updatedAt: new Date().toISOString(),
                provincia: provincia,
                municipio: municipio
            };
            
            this._entidadesSubject.next([...currentData]);
            this.dataSource.data = currentData;
        }
        
        this.cancelEdit();
    }

    cancelEdit(): void {
        this.editMode = false;
        this.selectedEntidad = null;
        this.contactForm.reset();
        this._cdr.markForCheck();
    }

    deleteEntidad(entidad: Entidad): void {
        if (confirm(`¿Está seguro de que desea eliminar la entidad "${entidad.nombre_entidad}"?`)) {
            // Aquí llamarías al servicio para eliminar la entidad
            console.log('Eliminar entidad:', entidad.id);
            
            const currentData = this._entidadesSubject.getValue();
            const filtered = currentData.filter(e => e.id !== entidad.id);
            this._entidadesSubject.next(filtered);
            this.dataSource.data = filtered;
            this.pagination.length = filtered.length;
            this._cdr.markForCheck();
        }
    }

    canAddEntidad(): boolean {
        // Permitir agregar entidades siempre (puedes cambiar esta lógica)
        return false;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    uploadLogo(files: FileList | null): void {
        if (!files || !files[0]) {
            return;
        }

        const file = files[0];
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor seleccione un archivo de imagen válido');
            return;
        }
        
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Máximo 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.contactForm.get('logo')?.setValue(reader.result as string);
            this.contactForm.markAsDirty();
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
  
    // Método mejorado para abrir el diálogo de agregar entidad
    openAddEntidadDialog(): void {
        this.editMode = false;
        this.selectedEntidad = null;
        
        // Resetear el formulario completamente
        this.contactForm.reset();
        
        // Establecer valores por defecto
        this.contactForm.patchValue({
            activo: true,
            nombre: '',
            codigo: '',
            tipo_empresa: '',
            ministerio: '',
            telefonos: '',
            provincia: '',
            municipio: '',
            domicilio_legal: '',
            logo: null,
            director_id: null
        });
        
        // Marcar el formulario como prístino
        this.contactForm.markAsPristine();
        this.contactForm.markAsUntouched();
        
        this._cdr.markForCheck();
    }
    
    // Método mejorado para alternar entre modo vista y edición
    toggleEditMode(enable: boolean): void {
        this.editMode = enable;
        
        if (enable && this.dataSource.data.length > 0) {
            // Cargar los datos de la entidad en el formulario para edición
            const entidad = this.dataSource.data[0];
            this.selectedEntidad = entidad;
            this.contactForm.patchValue({
                id: entidad.id,
                nombre: entidad.nombre_entidad,
                codigo: entidad.codigo_entidad,
                domicilio_legal: entidad.domicilio_legal,
                telefonos: entidad.telefonos,
                tipo_empresa: entidad.tipo_empresa,
                ministerio: entidad.ministerio,
                municipio: entidad.municipio?.nombre_municipio || '',
                provincia: entidad.provincia?.nombre_provincia || '',
                activo: entidad.activo,
                logo: entidad.logo,
                director_id: entidad.director_id
            });
        } else {
            // Limpiar al cancelar edición
            this.selectedEntidad = null;
            this.contactForm.reset();
            this.contactForm.patchValue({
                activo: true
            });
        }
        
        this._cdr.markForCheck();
    }
    
    /**
     * Get initials from name
     */
    getInitials(name: string): string {
        if (!name) return 'E';
        
        const words = name.split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    
    /**
     * Format date
     */
    formatDate(dateString: string): string {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    /**
     * Go back
     */
    goBack(): void {
        // Implementar navegación hacia atrás
        // Por ejemplo, usando Router o Location
        // this.location.back();
        // o
        // this.router.navigate(['/entidades']);
        
        // Por ahora, solo cerramos el modo edición si está activo
        if (this.editMode) {
            this.toggleEditMode(false);
        } else {
            // Aquí implementarías la navegación real
            console.log('Navegando hacia atrás...');
        }
    }
}
