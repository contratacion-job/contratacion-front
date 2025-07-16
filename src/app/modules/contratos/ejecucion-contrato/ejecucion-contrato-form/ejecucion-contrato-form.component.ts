import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Contrato, Proveedor } from 'app/models/Type';

@Component({
  selector: 'app-ejecucion-contrato-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule, MatDialogContent, MatDialogActions],template: `
    <h2 mat-dialog-title>Crear Ejecución</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>Contrato</mat-label>
          <mat-select formControlName="contrato_id">
            <mat-option *ngFor="let contrato of data.contratos" [value]="contrato.id">
              {{ contrato.no_contrato }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Proveedor</mat-label>
          <mat-select formControlName="proveedor_id">
            <mat-option *ngFor="let proveedor of data.proveedores" [value]="proveedor.id">
              {{ proveedor.nombre }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Costo (CUP)</mat-label>
          <span matPrefix>CUP</span>
          <input matInput type="number" step="0.01" formControlName="costo_cup">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Costo (USD)</mat-label>
          <span matPrefix>USD</span>
          <input matInput type="number" step="0.01" formControlName="costo_usd">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Trabajo Ejecutado</mat-label>
          <input matInput formControlName="trabajo_ejecutado">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Fecha Ejecución</mat-label>
          <input matInput type="date" formControlName="fecha_ejecucion">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado">
            <mat-option value="pendiente">Pendiente</mat-option>
            <mat-option value="en_proceso">En Proceso</mat-option>
            <mat-option value="completado">Completado</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.valid">Guardar</button>
    </mat-dialog-actions>
  `
})

export class EjecucionContratoFormComponent {
form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EjecucionContratoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; contratos: Contrato[]; proveedores: Proveedor[] }
  ) {
    this.form = new FormGroup({
      contrato_id: new FormControl('', Validators.required),
      proveedor_id: new FormControl('', Validators.required),
      costo_cup: new FormControl('', [Validators.required, Validators.min(0)]),
      costo_usd: new FormControl('0.00'),
      trabajo_ejecutado: new FormControl('', Validators.required),
      fecha_ejecucion: new FormControl('', Validators.required),
      estado: new FormControl('pendiente', Validators.required)
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}