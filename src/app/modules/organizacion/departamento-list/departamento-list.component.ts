import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Departamento } from 'app/models/Type';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './departamento-list.component.html',
  styleUrl: './departamento-list.component.scss'
})
export class DepartamentoFormComponent implements OnInit {
  departamentoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DepartamentoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departamentoForm = this.fb.group({
      nombre_dpto: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.departamentoForm.valid) {
      const newDepartamento: Departamento = {
        ...this.departamentoForm.value,
        id: Math.floor(Math.random() * 1000) // ID temporal
      };
      this.dialogRef.close(newDepartamento);
    }
  }
}