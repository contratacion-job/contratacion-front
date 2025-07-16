import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ContratoService } from '../services/contrato.service';
import { TipoContratoService } from '../services/tipo-contrato.service';
import { DepartamentoService } from 'app/modules/organizacion/departamento.service';
import { ProveedorService } from 'app/modules/proveedores/services/proveedor.service';
import { Contrato, TipoContrato, Vigencia, Departamento, Proveedor } from 'app/models/Type';
import { ProveedorFormComponent } from 'app/modules/proveedores/proveedor-form/proveedor-form.component';
import { DepartamentoFormComponent } from 'app/modules/organizacion/departamento-list/departamento-list.component';
import { TipoContratoFormComponent } from '../tipo-contrato/tipo-contrato-form/tipo-contrato-form.component';

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
    MatIconModule
  ],
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.scss']
})
export class ContratoFormComponent implements OnInit {
  contratoForm: FormGroup;
  proveedores: Proveedor[] = [];
  tiposContrato: TipoContrato[] = [];
  vigenciasContrato: { id: number; vigencia: string }[] = [
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

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private tipoContratoService: TipoContratoService,
    private departamentoService: DepartamentoService,
    private proveedorService: ProveedorService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ContratoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contratoForm = this.fb.group({
      no_contrato: [null, [Validators.required, Validators.min(1)]],
      objeto: [''],
      vigencia_id: [null, [Validators.required, Validators.min(1)]],
      proveedor_id: [null, [Validators.required, Validators.min(1)]],
      tipo_contrato_id: [null, [Validators.required, Validators.min(1)]],
      departamento_id: [null, [Validators.required, Validators.min(1)]],
      fecha_entrada: [null, Validators.required],
      fecha_firmado: [null, Validators.required],
      fecha_vencido: [null, Validators.required],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      monto_vencimiento_cup: [0, [Validators.required, Validators.min(0)]],
      monto_vencimiento_cl: [0, [Validators.required, Validators.min(0)]],
      valor_usd: [0, [Validators.required, Validators.min(0)]],
      monto_vencimiento_usd: [0, [Validators.required, Validators.min(0)]],
      valor_monto_restante: [0, [Validators.required, Validators.min(0)]],
      observaciones: [''],
      no_contrato_contratacion: [null, [Validators.required, Validators.min(1)]],
      no_comite_contratacion: [null, [Validators.required, Validators.min(1)]],
      fecha_comite_contratacion: [null, Validators.required],
      no_acuerdo_comite_contratacion: [null, [Validators.required, Validators.min(1)]],
      fecha_acuerdo_comite_contratacion: [null, Validators.required],
      no_comite_administracion: [null, Validators.min(1)],
      fecha_comite_administracion: [null],
      no_acuerdo_comite_administracion: [null, Validators.min(1)],
      entidad: [''],
      estado: ['activo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProveedores();
    this.loadTiposContrato();
    this.loadDepartamentos();
  }

  private loadProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (data: Proveedor[]) => {
        // Filter active suppliers (estado === "activo")
        this.proveedores = data.filter(proveedor => proveedor.estado === "activo");
        console.log('Raw proveedores response:', data);
        console.log('Filtered proveedores (estado === "activo"):', this.proveedores);
        if (this.proveedores.length === 0) {
          console.warn('No active proveedores available.');
        }
      },
      error: (error) => {
        console.error('Error loading proveedores:', error);
        // TODO: Show user-friendly error (e.g., MatSnackBar)
      }
    });
  }

  private loadTiposContrato(): void {
    this.tipoContratoService.getTiposContrato().subscribe({
      next: (data) => {
        this.tiposContrato = data;
        console.log('TiposContrato loaded:', this.tiposContrato);
      },
      error: (error) => {
        console.error('Error loading tiposContrato:', error);
      }
    });
  }

  private loadDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe({
      next: (response) => {
        this.departamentos = response.data;
        console.log('Departamentos loaded:', this.departamentos);
      },
      error: (error) => {
        console.error('Error loading departamentos:', error);
      }
    });
  }

  private formatDateForAPI(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.contratoForm.valid) {
      const formValue = this.contratoForm.value;

      // Convert string inputs to numbers
      const vigenciaId = parseInt(formValue.vigencia_id, 10);
      const proveedorId = parseInt(formValue.proveedor_id, 10);
      const tipoContratoId = parseInt(formValue.tipo_contrato_id, 10);
      const departamentoId = parseInt(formValue.departamento_id, 10);
      const noContrato = parseInt(formValue.no_contrato, 10);
      const noContratoContratacion = parseInt(formValue.no_contrato_contratacion, 10);
      const noComiteContratacion = parseInt(formValue.no_comite_contratacion, 10);
      const noAcuerdoComiteContratacion = parseInt(formValue.no_acuerdo_comite_contratacion, 10);
      const noComiteAdministracion = formValue.no_comite_administracion ? parseInt(formValue.no_comite_administracion, 10) : null;
      const noAcuerdoComiteAdministracion = formValue.no_acuerdo_comite_administracion ? parseInt(formValue.no_acuerdo_comite_administracion, 10) : null;
      const valorCup = parseFloat(formValue.valor_cup);
      const montoVencimientoCup = parseFloat(formValue.monto_vencimiento_cup);
      const montoVencimientoCl = parseFloat(formValue.monto_vencimiento_cl);
      const valorUsd = parseFloat(formValue.valor_usd);
      const montoVencimientoUsd = parseFloat(formValue.monto_vencimiento_usd);
      const valorMontoRestante = parseFloat(formValue.valor_monto_restante);

      // Split entidad string into array
      const entidadArray = formValue.entidad ? formValue.entidad.split(',').map((e: string) => e.trim()).filter((e: string) => e) : [];

      // Find selected objects
      const selectedVigencia = this.vigenciasContrato.find(v => v.id === vigenciaId);
      const selectedProveedor = this.proveedores.find(p => p.id === proveedorId);
      const selectedTipoContrato = this.tiposContrato.find(t => t.id === tipoContratoId);
      const selectedDepartamento = this.departamentos.find(d => d.id === departamentoId);

      // Validate selections
      if (!selectedVigencia || !selectedProveedor || !selectedTipoContrato || !selectedDepartamento) {
        console.error('Required selection missing:', {
          vigencia: selectedVigencia,
          proveedor: selectedProveedor,
          tipo_contrato: selectedTipoContrato,
          departamento: selectedDepartamento
        });
        // TODO: Show user-friendly error (e.g., MatSnackBar)
        return;
      }

      // Validate number conversions
      if (isNaN(vigenciaId) || isNaN(proveedorId) || isNaN(tipoContratoId) || isNaN(departamentoId) ||
          isNaN(noContrato) || isNaN(noContratoContratacion) || isNaN(noComiteContratacion) || 
          isNaN(noAcuerdoComiteContratacion) || isNaN(valorCup) || isNaN(montoVencimientoCup) || 
          isNaN(montoVencimientoCl) || isNaN(valorUsd) || isNaN(montoVencimientoUsd) || 
          isNaN(valorMontoRestante) || 
          (noComiteAdministracion !== null && isNaN(noComiteAdministracion)) || 
          (noAcuerdoComiteAdministracion !== null && isNaN(noAcuerdoComiteAdministracion))) {
        console.error('Invalid number conversion:', {
          vigencia_id: vigenciaId,
          proveedor_id: proveedorId,
          tipo_contrato_id: tipoContratoId,
          departamento_id: departamentoId,
          no_contrato: noContrato,
          no_contrato_contratacion: noContratoContratacion,
          no_comite_contratacion: noComiteContratacion,
          no_acuerdo_comite_contratacion: noAcuerdoComiteContratacion,
          no_comite_administracion: noComiteAdministracion,
          no_acuerdo_comite_administracion: noAcuerdoComiteAdministracion,
          valor_cup: valorCup,
          monto_vencimiento_cup: montoVencimientoCup,
          monto_vencimiento_cl: montoVencimientoCl,
          valor_usd: valorUsd,
          monto_vencimiento_usd: montoVencimientoUsd,
          valor_monto_restante: valorMontoRestante
        });
        // TODO: Show user-friendly error
        return;
      }

      const contrato: Contrato = {
        id: undefined,
        vigencia_id: vigenciaId,
        proveedor_id: proveedorId,
        tipo_contrato_id: tipoContratoId,
        no_contrato: noContrato,
        fecha_entrada: formValue.fecha_entrada,
        fecha_firmado: formValue.fecha_firmado,
        valor_cup: valorCup,
        monto_vencimiento_cup: montoVencimientoCup,
        monto_vencimiento_cl: montoVencimientoCl,
        valor_usd: valorUsd,
        monto_vencimiento_usd: montoVencimientoUsd,
        observaciones: formValue.observaciones || '',
        no_contrato_contratacion: noContratoContratacion,
        fecha_comite_contratacion: formValue.fecha_comite_contratacion,
        no_comite_contratacion: noComiteContratacion,
        no_acuerdo_comite_contratacion: noAcuerdoComiteContratacion,
        fecha_comite_administracion: formValue.fecha_comite_administracion,
        no_comite_administracion: noComiteAdministracion,
        no_acuerdo_comite_administracion: noAcuerdoComiteAdministracion,
        departamento_id: departamentoId,
        fecha_vencido: formValue.fecha_vencido,
        valor_monto_restante: valorMontoRestante,
        entidad: entidadArray,
        vigencia: { id: selectedVigencia.id, vigencia: selectedVigencia.vigencia },
        proveedor: selectedProveedor,
        tipo_contrato: selectedTipoContrato,
        departamento: selectedDepartamento,
        estado: formValue.estado
      };

      console.log('Sending to API:', contrato);

      this.contratoService.createContrato(contrato).subscribe({
        next: (createdContrato) => {
          console.log('Contract created successfully:', createdContrato);
          this.dialogRef.close(createdContrato);
        },
        error: (error) => {
          console.error('Error creating contract:', error);
          // TODO: Add user-friendly error message (e.g., MatSnackBar)
        }
      });
    } else {
      Object.keys(this.contratoForm.controls).forEach(key => {
        this.contratoForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid:', this.contratoForm.errors);
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
      if (result && result.estado === 'activo') {
        this.proveedores = [...this.proveedores, result].filter(p => p.estado === 'activo');
        this.contratoForm.patchValue({ proveedor_id: result.id });
        console.log('New proveedor added:', result);
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
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}