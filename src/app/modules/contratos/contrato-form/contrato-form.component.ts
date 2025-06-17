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
import { Contrato, TipoContrato, VigenciaContrato, Proveedor, Departamento } from 'app/models/Type';
import { mockProveedor, mockTipoContrato, mockVigenciaContrato, mockDepartamento } from 'app/mock-api/contrato-fake/fake';
import { MatIconModule } from '@angular/material/icon';
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
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ContratoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contratoForm = this.fb.group({
      no_contrato: ['', [Validators.required]],
      vigencia: [null, [Validators.required]],
      proveedor: [null, [Validators.required]],
      tipo_contrato: [null, [Validators.required]],
      departamento: [null, [Validators.required]],
      fecha_entrada: [null, [Validators.required]],
      fecha_firmado: [null, [Validators.required]],
      fecha_vencido: [null, [Validators.required]],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      valor_cl: [0, [Validators.required, Validators.min(0)]],
      valor_usd: [0, [Validators.required, Validators.min(0)]],
      observaciones: [''],
      no_comite_contratacion: ['', [Validators.required]],
      fecha_comite_contratacion: [null, [Validators.required]],
      no_acuerdo_comite_contratacion: ['', [Validators.required]],
      fecha_acuerdo_comite_contratacion: [null, [Validators.required]],
      no_comite_administracion: [''],
      fecha_comite_administracion: [null],
      estado: ['Activo']
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.contratoForm.valid) {
      const newContrato: Contrato = {
        ...this.contratoForm.value,
        estado: 'Activo'
      };

      this.contratoService.createContrato(newContrato).subscribe({
        next: (createdContrato) => {
          this.dialogRef.close(createdContrato);
        },
        error: (error) => {
          console.error('Error creating contract:', error);
        }
      });
    }
  }
  openNewProveedorDialog() {
      const isMobile = window.innerWidth <= 768; //
    const dialogRef = this.dialog.open(ProveedorFormComponent, {
   width: isMobile ? '90vw' : '750px',  // Ancho completo en móvil, fijo en desktop
    maxWidth: isMobile ? '100vw' : '90vw', // Máximo ancho
    height: isMobile ? '100vh' : '90vh',   // Altura completa en móvil, 90% en desktop
    maxHeight: '100vh',                   // No más alto que la pantalla
    panelClass: 'full-screen-dialog',     // Clase CSS personalizada
    disableClose: false,                   // Evitar cierre accidental
    autoFocus: false,                     // Mejor manejo del foco
    hasBackdrop: !isMobile,               // Fondo oscuro solo en desktop
    position: isMobile ? { top: '0' } : {} // Posición superior en móvil
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    
      }
    });
  }
  
  openNewDepartamentoDialog() {
    const isMobile = window.innerWidth <= 768; //
    const dialogRef = this.dialog.open(DepartamentoFormComponent, {
     width: isMobile ? '90vw' : '750px',  // Ancho completo en móvil, fijo en desktop
    maxWidth: isMobile ? '100vw' : '90vw', // Máximo ancho
    height: isMobile ? '100vh' : '90vh',   // Altura completa en móvil, 90% en desktop
    maxHeight: '100vh',                   // No más alto que la pantalla
    panelClass: 'full-screen-dialog',     // Clase CSS personalizada
    disableClose: false,                   // Evitar cierre accidental
    autoFocus: false,                     // Mejor manejo del foco
    hasBackdrop: !isMobile,               // Fondo oscuro solo en desktop
    position: isMobile ? { top: '0' } : {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Agregar el nuevo departamento a la lista
        this.departamentos = [...this.departamentos, result];
        // Seleccionar el nuevo departamento
        this.contratoForm.patchValue({
          departamento: result
        });
      }
    });
  }
    openNewTipoContratoDialog() {
   const isMobile = window.innerWidth <= 768; //
    const dialogRef = this.dialog.open(TipoContratoFormComponent, {
     width: isMobile ? '90vw' : '750px',  // Ancho completo en móvil, fijo en desktop
    maxWidth: isMobile ? '100vw' : '90vw', // Máximo ancho
    height: isMobile ? '100vh' : '90vh',   // Altura completa en móvil, 90% en desktop
    maxHeight: '100vh',                   // No más alto que la pantalla
    panelClass: 'full-screen-dialog',     // Clase CSS personalizada
    disableClose: false,                   // Evitar cierre accidental
    autoFocus: false,                     // Mejor manejo del foco
    hasBackdrop: !isMobile,               // Fondo oscuro solo en desktop
    position: isMobile ? { top: '0' } : {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Agregar el nuevo departamento a la lista
        this.tiposContrato = [...this.tiposContrato, result];
        // Seleccionar el nuevo departamento
        this.contratoForm.patchValue({
          tiposContrato: result
        });
      }
    });
  }
}
