import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoContrato } from 'app/models/Type';
import { TipoContratoFormComponent } from './tipo-contrato-form/tipo-contrato-form.component';
@Component({
  selector: 'app-tipo-contrato',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
],
  templateUrl: './tipo-contrato.component.html',
  styleUrl: './tipo-contrato.component.scss'
})
export class TipoContratoComponent implements OnInit {
  tipoContratoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TipoContratoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tipoContratoForm = this.fb.group({
      nombre_dpto: ['', [Validators.required]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.tipoContratoForm.valid) {
      const newTipoContrato: TipoContrato = {
        ...this.tipoContratoForm.value,
        id: Math.floor(Math.random() * 1000) // ID temporal
      };
      this.dialogRef.close(newTipoContrato);
    }
  }
}


