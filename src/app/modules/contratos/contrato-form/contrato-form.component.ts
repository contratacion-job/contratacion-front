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
    const today = new Date();
    this.contratoForm = this.fb.group({
      no_contrato: [null, [Validators.required, Validators.min(1)]],
      observaciones: [''], // made optional
      valor: [0, [Validators.required, Validators.min(0)]], // renamed from valor_cup
      remanente: [0, [Validators.required, Validators.min(0)]], // new required field
      monto: [0, [Validators.required, Validators.min(0)]], // new required field
      fecha_inicio: [today, Validators.required],
      fecha_fin: [null, Validators.required],
      proveedor_id: [null, [Validators.required, Validators.min(1)]],
      tipo_contrato_id: [null, [Validators.required, Validators.min(1)]],
      departamento_id: [null, [Validators.required, Validators.min(1)]],
      estado: ['vigente', Validators.required],
      vigencia_id: [null, [Validators.required, Validators.min(1)]],
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
    }, { validators: this.validateFechaFinAfterFechaInicioValidator.bind(this) });
  }

  validateFechaVencidoAfterFechaEntrada(group: FormGroup) {
    const fechaEntrada = group.get('fecha_entrada')?.value;
    const fechaVencido = group.get('fecha_vencido')?.value;
    if (fechaEntrada && fechaVencido) {
      const fechaEntradaDate = new Date(fechaEntrada);
      const fechaVencidoDate = new Date(fechaVencido);
      if (fechaVencidoDate <= fechaEntradaDate) {
        return { fechaVencidoBeforeFechaEntrada: true };
      }
    }
    return null;
  
  }

  ngOnInit(): void {
    this.loadProveedores();
    this.loadTiposContrato();
    this.loadDepartamentos();
    // Debug form control changes
    this.contratoForm.get('fecha_entrada')?.valueChanges.subscribe(value => {
      console.log('Fecha entrada changed:', value);
      // Update min date for fecha_vencido picker if needed
      this.contratoForm.get('fecha_vencido')?.updateValueAndValidity();
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

  let parsedDate: Date;

  if (typeof date === 'string') {
    parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date string: ${date}`);
      return null;
    }
  } else if (date instanceof Date && !isNaN(date.getTime())) {
    parsedDate = date;
  } else {
    console.warn(`Invalid date object: ${date}`);
    return null;
  }

  return parsedDate.toISOString().split('T')[0];
}

private populateForm(contrato: Contrato): void {
  const parseDate = (date: any): string | null => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn(`Invalid date in populateForm: ${date}`);
      return null;
    }
    return d.toISOString().split('T')[0];
  };

  this.contratoForm.patchValue({
    no_contrato: contrato.no_contrato,
    observaciones: contrato.observaciones,
    valor_cup: contrato.valor_cup,
    fecha_entrada: parseDate(contrato.fecha_entrada),
    fecha_vencido: parseDate(contrato.fecha_vencido),
    proveedor_id: contrato.proveedor_id,
    tipo_contrato_id: contrato.tipo_contrato_id,
    departamento_id: contrato.departamento_id,
    estado: contrato.estado,
    vigencia_id: contrato.vigencia_id,
    fecha_firmado: parseDate(contrato.fecha_firmado),
    monto_vencimiento_cup: contrato.monto_vencimiento_cup,
    monto_vencimiento_cl: contrato.monto_vencimiento_cl,
    valor_usd: contrato.valor_usd,
    monto_vencimiento_usd: contrato.monto_vencimiento_usd,
    valor_monto_restante: contrato.valor_monto_restante,
    no_contrato_contratacion: contrato.no_contrato_contratacion,
    no_comite_contratacion: contrato.no_comite_contratacion,
    fecha_comite_contratacion: parseDate(contrato.fecha_comite_contratacion),
    no_acuerdo_comite_contratacion: contrato.no_acuerdo_comite_contratacion,
    fecha_comite_administracion: parseDate(contrato.fecha_comite_administracion),
    no_comite_administracion: contrato.no_comite_administracion,
    no_acuerdo_comite_administracion: contrato.no_acuerdo_comite_administracion,
    entidad: contrato.entidad?.join(', ') || '',
  });
}

  onSubmit(): void {
    console.log('Raw form values:', this.contratoForm.getRawValue());
    if (this.contratoForm.invalid) {
      console.log('Form errors:', this.contratoForm.errors);
      Object.keys(this.contratoForm.controls).forEach(key => {
        const control = this.contratoForm.get(key);
        if (control?.invalid) {
          console.log(`Field ${key} errors:`, control.errors);
        }
      });
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    const formValue = this.contratoForm.value;

    // Prepare contract data object
    const contratoData = {
      no_contrato: formValue.no_contrato,
      observaciones: formValue.observaciones,
      valor_cup: formValue.valor_cup,
      fecha_entrada: this.formatDateForAPI(formValue.fecha_entrada),
      fecha_vencido: this.formatDateForAPI(formValue.fecha_vencido),
      proveedor_id: formValue.proveedor_id,
      tipo_contrato_id: formValue.tipo_contrato_id,
      departamento_id: formValue.departamento_id,
      estado: formValue.estado,
      vigencia_id: formValue.vigencia_id,
      fecha_firmado: this.formatDateForAPI(formValue.fecha_firmado),
      monto_vencimiento_cup: formValue.monto_vencimiento_cup,
      monto_vencimiento_cl: formValue.monto_vencimiento_cl,
      valor_usd: formValue.valor_usd,
      monto_vencimiento_usd: formValue.monto_vencimiento_usd,
      valor_monto_restante: formValue.valor_monto_restante,
      no_contrato_contratacion: formValue.no_contrato_contratacion,
      no_comite_contratacion: formValue.no_comite_contratacion,
      fecha_comite_contratacion: this.formatDateForAPI(formValue.fecha_comite_contratacion),
      no_acuerdo_comite_contratacion: formValue.no_acuerdo_comite_contratacion,
      fecha_comite_administracion: this.formatDateForAPI(formValue.fecha_comite_administracion),
      no_comite_administracion: formValue.no_comite_administracion,
      no_acuerdo_comite_administracion: formValue.no_acuerdo_comite_administracion,
      entidad: formValue.entidad ? formValue.entidad.split(',').map((e: string) => e.trim()) : [],
      // Add full related objects
      proveedor: this.proveedores.find(p => p.id === formValue.proveedor_id) || null,
      tipo_contrato: this.tiposContrato.find(t => t.id === formValue.tipo_contrato_id) || null,
      departamento: this.departamentos.find(d => d.id === formValue.departamento_id) || null,
      vigencia: this.vigenciasContrato.find(v => v.id === formValue.vigencia_id) || null
    };

    if (this.isEditMode && this.data?.contrato?.id) {
      // Update existing contract
      this.contratoService.updateContrato(this.data.contrato.id, contratoData).subscribe({
        next: (response) => {
          this.snackBar.open('Contrato actualizado exitosamente.', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
          this.dialogRef.close(response);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al actualizar el contrato:', error);
          this.snackBar.open('Error al actualizar el contrato.', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Create new contract
      this.contratoService.createContrato(contratoData).subscribe({
        next: (response) => {
          this.snackBar.open('Contrato creado exitosamente.', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
          this.dialogRef.close(response);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al crear el contrato:', error);
          this.snackBar.open('Error al crear el contrato.', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
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

  validateFechaFinAfterFechaInicioValidator(group: FormGroup) {
    const fechaInicio = group.get('fecha_inicio')?.value;
    const fechaFin = group.get('fecha_fin')?.value;
    if (fechaInicio && fechaFin) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      if (fechaFinDate <= fechaInicioDate) {
        return { fechaFinBeforeFechaInicio: true };
      }
    }
    return null;
  }
}
