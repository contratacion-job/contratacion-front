import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedor, Ministerio, Municipio } from 'app/models/Type';
import { mockMinisterio, mockMunicipio } from 'app/mock-api/contrato-fake/fake';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss']
})
export class ProveedorFormComponent implements OnInit {
  proveedorForm: FormGroup;
  ministerios: Ministerio[] = mockMinisterio;
  municipios: Municipio[] = mockMunicipio;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProveedorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      telefonos: ['', [Validators.required]],
      domicilio: ['', [Validators.required]],
      municipio: [null, [Validators.required]],
      ministerio: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      const newProveedor: Proveedor = {
        ...this.proveedorForm.value,
        id: Math.floor(Math.random() * 1000) // Generamos un ID temporal
      };
      this.dialogRef.close(newProveedor);
    }
  }
}
