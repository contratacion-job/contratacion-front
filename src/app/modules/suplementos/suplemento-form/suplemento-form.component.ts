import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProveedorFormComponent } from '../../proveedores/proveedor-form/proveedor-form.component';
import { ContratoFormComponent } from '../../contratos/contrato-form/contrato-form.component';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-suplemento-form',
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
  templateUrl: './suplemento-form.component.html',
  styleUrls: ['./suplemento-form.component.scss']
})
export class SuplementoFormComponent implements OnInit {
  form: FormGroup;
  proveedores = [];
  contratos = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SuplementoFormComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      proveedor: ['', Validators.required],
      contrato: ['', Validators.required],
      costo_cup: ['', Validators.required],
      costo_cl: ['', Validators.required],
      trabajo_ejecutado: ['', Validators.required],
      fecha_ejecucion: ['', Validators.required]
    });
  }

  openNewProveedorDialog(): void {
    const dialogRef = this.dialog.open(ProveedorFormComponent, {
      width: '40%',
      height: '60%',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.proveedores.push(result);
      }
    });
  }

  openNewContratoDialog(): void {
    const dialogRef = this.dialog.open(ContratoFormComponent, {
      width: '40%',
      height: '90%',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar lista de contratos
    this.contratos.push(result);
      }
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}