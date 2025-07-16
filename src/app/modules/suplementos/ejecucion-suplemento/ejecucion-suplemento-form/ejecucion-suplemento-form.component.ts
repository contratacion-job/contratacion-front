import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EjecucionSuplemento, Suplemento, Proveedor, Contrato } from 'app/models/Type';
import { mockProveedor, mockContrato } from 'app/mock-api/contrato-fake/fake';

export interface EjecucionSuplementoFormData {
  action: 'new' | 'edit';
  ejecucion: Partial<EjecucionSuplemento> | null;
}

@Component({
  selector: 'app-ejecucion-suplemento-form',
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
    // DatePipe is used in the template via the 'date' pipe
  ],
  templateUrl: './ejecucion-suplemento-form.component.html',
  styleUrls: ['./ejecucion-suplemento-form.component.scss']
})
export class EjecucionSuplementoFormComponent implements OnInit {
  ejecucionForm: FormGroup;
  isEditMode = false;
  
  // Mock data - replace with actual service calls
  suplementos: Suplemento[] = [];
  proveedores: Proveedor[] = mockProveedor;


  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<EjecucionSuplementoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EjecucionSuplementoFormData
  ) {
    this.isEditMode = data.action === 'edit';
    
    this.ejecucionForm = this._formBuilder.group({
      id: [null],
      no_suplemento_id: [null, Validators.required],
      proveedor_id: [null, Validators.required],
      no_contrato_id: [null, Validators.required],
      trabajo_ejecutado: ['', [Validators.required, Validators.maxLength(500)]],
      costo_cup: [0, [Validators.required, Validators.min(0)]],
      costo_cl: [0, [Validators.required, Validators.min(0)]],
      fecha_ejecucion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.ejecucion) {
      this.ejecucionForm.patchValue({
        ...this.data.ejecucion,
        fecha_ejecucion: this.data.ejecucion.fecha_ejecucion ? new Date(this.data.ejecucion.fecha_ejecucion) : new Date(),
        no_suplemento_id: this.data.ejecucion.no_suplemento_id,
        proveedor_id: this.data.ejecucion.proveedor?.id,
        no_contrato_id: this.data.ejecucion.contrato?.id
      });
    }
  }

  onSuplementoChange(suplementoId: number): void {
    // Find the selected suplemento and update related fields
    const suplemento = this.suplementos.find(s => s.id === suplementoId);
    if (suplemento) {
      this.ejecucionForm.patchValue({
        proveedor_id: suplemento.proveedor?.id,
        no_contrato_id: suplemento.no_contrato_contratacion
      });
    }
  }

  onSubmit(): void {
    if (this.ejecucionForm.invalid) {
      this.ejecucionForm.markAllAsTouched();
      return;
    }

    const formValue = this.ejecucionForm.value;
    const result: Partial<EjecucionSuplemento> = {
      ...formValue,
      id: this.isEditMode && this.data.ejecucion?.id ? this.data.ejecucion.id : undefined,
      proveedor: this.proveedores.find(p => p.id === formValue.proveedor_id),
    
      suplemento: this.suplementos.find(s => s.id === formValue.no_suplemento_id)
    };

    this._dialogRef.close(result);
  }

  onCancel(): void {
    this._dialogRef.close();
  }

  // Helper method to compare objects in select
  compareWithId(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}
