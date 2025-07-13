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
import { Router } from '@angular/router';
import { ContratoService } from '../services/contrato.service';
import { Contrato, TipoContrato, VigenciaContrato, Departamento } from 'app/models/Type';
import { Proveedor } from 'app/modules/proveedores/services/proveedor.service';
import { mockProveedor, mockTipoContrato, mockVigenciaContrato, mockDepartamento } from 'app/mock-api/contrato-fake/fake';
import { MatIconModule } from '@angular/material/icon';
import { ProveedorFormComponent } from 'app/modules/proveedores/proveedor-form/proveedor-form.component';
import { DepartamentoFormComponent } from 'app/modules/organizacion/departamento-list/departamento-list.component';
import { TipoContratoFormComponent } from '../tipo-contrato/tipo-contrato-form/tipo-contrato-form.component';
import { TipoContratoService } from '../services/tipo-contrato.service';
import { DepartamentoService } from 'app/modules/organizacion/departamento.service';
import { ProveedorService } from 'app/modules/proveedores/services/proveedor.service';

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
  styleUrl: './contrato-form.component.scss'
})
export class ContratoFormComponent implements OnInit {

  contratoForm: FormGroup;
  proveedores: Proveedor[] = mockProveedor;
  tiposContrato: TipoContrato[] = mockTipoContrato;
  vigenciasContrato: VigenciaContrato[] = mockVigenciaContrato;
  departamentos: Departamento[] = mockDepartamento;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private tipocontratoervice: TipoContratoService,
    private departamentoService: DepartamentoService,
    private proveedorService: ProveedorService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ContratoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contratoForm = this.fb.group({
      no_contrato: ['' ],
      objeto: ['' ], // Added objeto field
      vigencia: [null, ],
      proveedor: [null, [Validators.required]],
      tipo_contrato: [null, [Validators.required]],
      departamento: [null, [Validators.required]],
      fecha_entrada: [null, [Validators.required]],
      fecha_firmado: [null, [Validators.required]],
      fecha_vencido: [null, ],
      valor_cup: [0, [ Validators.min(0)]],
      valor_cl: [0, [ Validators.min(0)]],
      valor_usd: [0, [ Validators.min(0)]],
      observaciones: [''],
      no_comite_contratacion: ['' ],
      fecha_comite_contratacion: [null ],
      no_acuerdo_comite_contratacion: [''],
      fecha_acuerdo_comite_contratacion: [null],
      no_comite_administracion: [''],
      fecha_comite_administracion: [null],
      estado: ['activo'] // Changed default to lowercase 'activo'
    });
  }

  ngOnInit(): void {
    this.loadProveedores();
    this.loadTiposContrato();
    this.loadDepartamentos();
  }

  private loadProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (error) => {
        console.error('Error loading proveedores:', error);
      }
    });
  }

  private loadTiposContrato(): void {
    this.tipocontratoervice.getTiposContrato().subscribe({
      next: (data) => {
        this.tiposContrato = data;
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
      },
      error: (error) => {
        console.error('Error loading departamentos:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Helper method to calculate total value
  private calculateTotalValue(): number {
    const valorCup = this.contratoForm.get('valor_cup')?.value || 0;
    const valorCl = this.contratoForm.get('valor_cl')?.value || 0;
    const valorUsd = this.contratoForm.get('valor_usd')?.value || 0;
    
    // You can implement your own logic for currency conversion here
    // For now, just sum all values (you might want to convert to a base currency)
    return valorCup + valorCl + valorUsd;
  }

  // Helper method to format date for API
  private formatDateForAPI(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  onSubmit(): void {
    if (this.contratoForm.valid) {
      const formValue = this.contratoForm.value;

      // Map form data to Contrato interface
      const contrato: Contrato = {
        id: 0, // or undefined/null if id is generated by backend
        vigencia_id: formValue.vigencia?.id || 0,
        proveedor_id: formValue.proveedor?.id || 0,
        tipo_contrato_id: formValue.tipo_contrato?.id || 0,
        no_contrato: formValue.no_contrato,
        fecha_entrada: formValue.fecha_entrada,
        fecha_firmado: formValue.fecha_firmado,
        valor_cup: formValue.valor_cup,
        monto_vencimiento_cup: 0, // default or calculate if needed
        monto_vencimiento_cl: 0,  // default or calculate if needed
        valor_usd: formValue.valor_usd,
        monto_vencimiento_usd: 0, // default or calculate if needed
        observaciones: formValue.observaciones,
        no_contrato_contratacion: formValue.no_comite_contratacion,
        fecha_comite_contratacion: formValue.fecha_comite_contratacion,
      no_comite_contratacion: formValue.no_comite_contratacion,
      no_acuerdo_comite_contratacion: formValue.no_acuerdo_comite_contratacion,
      no_comite_administracion: formValue.no_comite_administracion,
      fecha_comite_administracion: formValue.fecha_comite_administracion,
      no_acuerdo_comite_administracion: 0, // Add default or map if available
        departamento_id: formValue.departamento?.id || 0,
        fecha_vencido: formValue.fecha_vencido,
        valor_monto_restante: 0, // default or calculate if needed
        entidad: [], // default empty or fill if needed
        vigencia: formValue.vigencia,
        proveedor: formValue.proveedor,
        tipo_contrato: formValue.tipo_contrato,
        departamento: formValue.departamento,
        estado: formValue.estado
      };

      console.log('Sending to API:', contrato); // For debugging

      this.contratoService.createContrato(contrato).subscribe({
        next: (createdContrato) => {
          console.log('Contract created successfully:', createdContrato);
          this.dialogRef.close(createdContrato);
        },
        error: (error) => {
          console.error('Error creating contract:', error);
          // You might want to show a user-friendly error message here
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contratoForm.controls).forEach(key => {
        this.contratoForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid:', this.contratoForm.errors);
    }
  }

  openNewProveedorDialog() {
    const isMobile = window.innerWidth <= 768;
    const dialogRef = this.dialog.open(ProveedorFormComponent, {
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
        // Add new proveedor to the list and select it
        this.proveedores = [...this.proveedores, result];
        this.contratoForm.patchValue({
          proveedor: result
        });
      }
    });
  }

  openNewDepartamentoDialog() {
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
        this.contratoForm.patchValue({
          departamento: result
        });
      }
    });
  }

  openNewTipoContratoDialog() {
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
        this.contratoForm.patchValue({
          tipo_contrato: result
        });
      }
    });
  }
}