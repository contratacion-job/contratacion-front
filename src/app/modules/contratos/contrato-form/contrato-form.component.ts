import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS ,DateAdapter} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContratoService } from '../services/contrato.service';
import { TipoContratoService } from '../services/tipo-contrato.service';
import { DepartamentoService } from 'app/modules/organizacion/departamento.service';
import { ProveedorService } from 'app/modules/proveedores/services/proveedor.service';
import { Contrato, TipoContrato, Vigencia, Departamento, Proveedor } from 'app/models/Type';
import { ProveedorFormComponent } from 'app/modules/proveedores/proveedor-form/proveedor-form.component';
import { DepartamentoFormComponent } from 'app/modules/organizacion/departamento-list/departamento-list.component';
import { TipoContratoFormComponent } from '../tipo-contrato/tipo-contrato-form/tipo-contrato-form.component';

// Define custom date formats
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.scss']
})
export class ContratoFormComponent implements OnInit {
  contratoForm: FormGroup;
  proveedores: Proveedor[] = [];
  tiposContrato: TipoContrato[] = [];
  vigenciasContrato: Vigencia[] = [
    { id: 1, vigencia: '3 meses' },
    { id: 2, vigencia: '6 meses' },
    { id: 3, vigencia: '1 año' },
    { id: 4, vigencia: '2 años' },
    { id: 5, vigencia: '3 años' },
    { id: 6, vigencia: '4 años' },
    { id: 7, vigencia: '5 años' },
    { id: 8, vigencia: '6 años' }
  ];
  departamentos: Departamento[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private tipoContratoService: TipoContratoService,
    private departamentoService: DepartamentoService,
    private proveedorService: ProveedorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ContratoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contrato?: Contrato }
  ) {
    this.contratoForm = this.fb.group({
      no_contrato: [null, [Validators.required, Validators.min(1)]],
      observaciones: ['', Validators.required],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      fecha_entrada: [null, Validators.required],
      fecha_vencido: [null, Validators.required],
      proveedor_id: [null, [Validators.required, Validators.min(1)]],
      tipo_contrato_id: [null, [Validators.required, Validators.min(1)]],
      departamento_id: [null, [Validators.required, Validators.min(1)]],
      estado: ['activo', Validators.required],
      vigencia_id: [null, [Validators.min(1)]],
      fecha_firmado: [null],
      monto_vencimiento_cup: [0, [Validators.min(0)]],
      monto_vencimiento_cl: [0, [Validators.min(0)]],
      valor_usd: [0, [Validators.min(0)]],
      monto_vencimiento_usd: [0, [Validators.min(0)]],
      valor_monto_restante: [0, [Validators.min(0)]],
      no_contrato_contratacion: [null, [Validators.min(1)]],
      no_comite_contratacion: [null, [Validators.min(1)]],
      fecha_comite_contratacion: [null],
      no_acuerdo_comite_contratacion: [null, [Validators.min(1)]],
      fecha_comite_administracion: [null],
      no_comite_administracion: [null, [Validators.min(1)]],
      no_acuerdo_comite_administracion: [null, [Validators.min(1)]],
      entidad: ['']
    });

    if (data?.contrato) {
      this.isEditMode = true;
      this.populateForm(data.contrato);
    }
  }

  ngOnInit(): void {
    this.loadProveedores();
    this.loadTiposContrato();
    this.loadDepartamentos();
    // Debug form control changes
    this.contratoForm.get('fecha_entrada')?.valueChanges.subscribe(value => {
      console.log('Fecha entrada changed:', value);
    });
    this.contratoForm.get('fecha_vencido')?.valueChanges.subscribe(value => {
      console.log('Fecha vencido changed:', value);
    });
    
  }



  private loadProveedores(): void {
    this.isLoading = true;
    this.proveedorService.getProveedores().subscribe({
      next: (response: any) => {
        console.log('Proveedores raw response:', response);
        const data = Array.isArray(response) ? response : response.data || [];
        console.log('Proveedores processed:', data);
        this.proveedores = data.filter((p: Proveedor) => p.id && p.nombre); // Validate data
        if (this.proveedores.length === 0) {
          this.snackBar.open('No se encontraron proveedores válidos.', 'Cerrar', { duration: 3000 });
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.snackBar.open('Error al cargar proveedores.', 'Cerrar', { duration: 3000 });
        console.error('Error loading proveedores:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadTiposContrato(): void {
    this.isLoading = true;
    this.tipoContratoService.getTiposContrato().subscribe({
      next: (data: TipoContrato[]) => {
        console.log('Tipos de contrato recibidos:', data);
        this.tiposContrato = data.filter((t: TipoContrato) => t.id && t.nombre_tipo_contrato);
        if (this.tiposContrato.length === 0) {
          this.snackBar.open('No se encontraron tipos de contrato válidos.', 'Cerrar', { duration: 3000 });
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.snackBar.open('Error al cargar tipos de contrato.', 'Cerrar', { duration: 3000 });
        console.error('Error loading tiposContrato:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadDepartamentos(): void {
    this.isLoading = true;
    this.departamentoService.getDepartamentos().subscribe({
      next: (response: any) => {
        console.log('Departamentos raw response:', response);
        const data = response.data || (Array.isArray(response) ? response : []);
        console.log('Departamentos processed:', data);
        this.departamentos = data.filter((d: Departamento) => d.id && d.nombre);
        if (this.departamentos.length === 0) {
          this.snackBar.open('No se encontraron departamentos válidos.', 'Cerrar', { duration: 3000 });
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.snackBar.open('Error al cargar departamentos.', 'Cerrar', { duration: 3000 });
        console.error('Error loading departamentos:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private formatDateForAPI(date: Date | string | null | undefined): string | null {
    if (!date) {
      console.warn('Date is null or undefined');
      return null;
    }
    if (typeof date === 'string') {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        console.warn(`Invalid date string: ${date}`);
        return null;
      }
      return parsed.toISOString().split('T')[0];
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    console.warn(`Invalid date object: ${date}`);
    return null;
  }

  onSubmit(): void {
    if (this.contratoForm.invalid) {
      this.contratoForm.markAllAsTouched();
      console.log('Form errors:', this.contratoForm.errors);
      console.log('Fecha entrada value:', this.contratoForm.get('fecha_entrada')?.value);
      console.log('Fecha vencido value:', this.contratoForm.get('fecha_vencido')?.value);
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const formValue = this.contratoForm.value;
    const entidadArray = formValue.entidad
      ? formValue.entidad.split(',').map((e: string) => e.trim()).filter((e: string) => e)
      : [];

    const contrato: Contrato = {
      id: this.isEditMode ? this.data.contrato?.id : undefined,
      no_contrato: parseInt(formValue.no_contrato, 10),
      observaciones: formValue.observaciones,
      valor_cup: parseFloat(formValue.valor_cup),
      fecha_entrada: this.formatDateForAPI(formValue.fecha_entrada),
      fecha_vencido: this.formatDateForAPI(formValue.fecha_vencido),
      proveedor_id: parseInt(formValue.proveedor_id, 10),
      tipo_contrato_id: parseInt(formValue.tipo_contrato_id, 10),
      departamento_id: parseInt(formValue.departamento_id, 10),
      estado: formValue.estado,
      vigencia_id: formValue.vigencia_id ? parseInt(formValue.vigencia_id, 10) : 0,
      fecha_firmado: this.formatDateForAPI(formValue.fecha_firmado),
      monto_vencimiento_cup: parseFloat(formValue.monto_vencimiento_cup || 0),
      monto_vencimiento_cl: parseFloat(formValue.monto_vencimiento_cl || 0),
      valor_usd: parseFloat(formValue.valor_usd || 0),
      monto_vencimiento_usd: parseFloat(formValue.monto_vencimiento_usd || 0),
      valor_monto_restante: parseFloat(formValue.valor_monto_restante || 0),
      no_contrato_contratacion: formValue.no_contrato_contratacion ? parseInt(formValue.no_contrato_contratacion, 10) : 0,
      no_comite_contratacion: formValue.no_comite_contratacion ? parseInt(formValue.no_comite_contratacion, 10) : 0,
      fecha_comite_contratacion: this.formatDateForAPI(formValue.fecha_comite_contratacion),
      no_acuerdo_comite_contratacion: formValue.no_acuerdo_comite_contratacion ? parseInt(formValue.no_acuerdo_comite_contratacion, 10) : 0,
      fecha_comite_administracion: this.formatDateForAPI(formValue.fecha_comite_administracion),
      no_comite_administracion: formValue.no_comite_administracion ? parseInt(formValue.no_comite_administracion, 10) : undefined,
      no_acuerdo_comite_administracion: formValue.no_acuerdo_comite_administracion ? parseInt(formValue.no_acuerdo_comite_administracion, 10) : undefined,
      entidad: entidadArray,
      vigencia: this.vigenciasContrato.find(v => v.id === parseInt(formValue.vigencia_id, 10)) || { id: 0, vigencia: '' },
      proveedor: this.proveedores.find(p => p.id === parseInt(formValue.proveedor_id, 10)) || {
        id: 0,
        municipio_id: 0,
        ministerio_id: 0,
        nombre: '',
        codigo: '',
        telefonos: '',
        domicilio: '',
        municipio: '',
        ministerio: '',
        fechaCreacion: '',
        estado: ''
      },
      tipo_contrato: this.tiposContrato.find(t => t.id === parseInt(formValue.tipo_contrato_id, 10)) || {
        id: 0,
        nombre_tipo_contrato: '',
        descripcion: ''
      },
      departamento: this.departamentos.find(d => d.id === parseInt(formValue.departamento_id, 10)) || {
        id: 0,
        nombre: '',
        codigo: '',
        descripcion: ''
      }
    };

    if (
      isNaN(contrato.no_contrato) ||
      isNaN(contrato.valor_cup) ||
      isNaN(contrato.proveedor_id) ||
      isNaN(contrato.tipo_contrato_id) ||
      isNaN(contrato.departamento_id) ||
      (formValue.vigencia_id && isNaN(contrato.vigencia_id)) ||
      (formValue.no_contrato_contratacion && isNaN(contrato.no_contrato_contratacion)) ||
      (formValue.no_comite_contratacion && isNaN(contrato.no_comite_contratacion)) ||
      (formValue.no_acuerdo_comite_contratacion && isNaN(contrato.no_acuerdo_comite_contratacion)) ||
      (formValue.no_comite_administracion && isNaN(contrato.no_comite_administracion)) ||
      (formValue.no_acuerdo_comite_administracion && isNaN(contrato.no_acuerdo_comite_administracion))
    ) {
      this.snackBar.open('Datos numéricos inválidos.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!contrato.fecha_entrada || !contrato.fecha_vencido) {
      this.snackBar.open('Fechas de entrada y vencimiento deben ser válidas.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const request = this.isEditMode
      ? this.contratoService.updateContrato(contrato.id!, contrato)
      : this.contratoService.createContrato(contrato);

    request.subscribe({
      next: (response) => {
        const message = this.isEditMode ? 'Contrato actualizado exitosamente.' : 'Contrato creado exitosamente.';
        this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(response);
      },
      error: (error) => {
        const status = error.status;
        let message = 'Error al procesar la solicitud.';
        if (status === 400) message = 'Error de validación en los datos.';
        else if (status === 401) message = 'No autorizado. Por favor, inicie sesión.';
        else if (status === 404 && this.isEditMode) message = 'Contrato no encontrado.';
        else if (status === 500) message = 'Error interno del servidor.';
        this.snackBar.open(message, 'Cerrar', { duration: 5000 });
        console.error('Error processing contract:', error);
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openNewProveedorDialog(): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(ProveedorFormComponent, {
      width: isMobile ? '90vw' : '750px',
      maxWidth: isMobile ? '100vw' : '90vw',
      height: isMobile ? '100vh' : '90vh',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      disableClose: true,
      autoFocus: false,
      hasBackdrop: !isMobile,
      position: isMobile ? { top: '0' } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.proveedores = [...this.proveedores, result];
        this.contratoForm.patchValue({ proveedor_id: result.id });
        this.snackBar.open('Proveedor creado exitosamente.', 'Cerrar', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  openNewDepartamentoDialog(): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(DepartamentoFormComponent, {
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
        this.departamentos = [...this.departamentos, result];
        this.contratoForm.patchValue({ departamento_id: result.id });
        this.snackBar.open('Departamento creado exitosamente.', 'Cerrar', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  openNewTipoContratoDialog(): void {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(TipoContratoFormComponent, {
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
        this.tiposContrato = [...this.tiposContrato, result];
        this.contratoForm.patchValue({ tipo_contrato_id: result.id });
        this.snackBar.open('Tipo de contrato creado exitosamente.', 'Cerrar', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

private populateForm(contrato: Contrato): void {
  // Función para convertir cualquier fecha a formato local (YYYY-MM-DD)
  const parseDate = (date: any): string | null => {
    if (!date) return null;
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    return d.toISOString().split('T')[0];
  };
  this.contratoForm.patchValue({
    // ... otros campos ...
    fecha_entrada: parseDate(contrato.fecha_entrada),
    fecha_vencido: parseDate(contrato.fecha_vencido),
    fecha_firmado: parseDate(contrato.fecha_firmado),
    fecha_comite_contratacion: parseDate(contrato.fecha_comite_contratacion),
    fecha_comite_administracion: parseDate(contrato.fecha_comite_administracion),
    // ... otros campos ...
  });
}
}