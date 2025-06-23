import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Proveedor, Ministerio, Municipio, Representante } from 'app/models/Type';
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
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss']
})
export class ProveedorFormComponent implements OnInit {
  proveedorForm: FormGroup;
  ministerios: Ministerio[] = mockMinisterio;
  municipios: Municipio[] = mockMunicipio;
  
  get representantesArray(): FormArray {
    return this.proveedorForm.get('representantes') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ProveedorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      telefonos: ['', [Validators.required]],
      domicilio: ['', [Validators.required]],
      municipio: [null, [Validators.required]],
      ministerio: [null, [Validators.required]],
      tipo: ['', [Validators.required]],
      categoria: [''],
      representantes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Add an empty representative form group if none exists
    if (this.representantesArray.length === 0) {
      this.addRepresentante();
    }
  }

  createRepresentante(representante?: Representante): FormGroup {
    return this.fb.group({
      id: [representante?.id || ''],
      nombre: [representante?.nombre || '', Validators.required],
      cargo: [representante?.cargo || '', Validators.required],
      telefono: [representante?.telefono || '', Validators.required],
      email: [representante?.email || '', [Validators.required, Validators.email]]
    });
  }

  addRepresentante(representante?: Representante): void {
    this.representantesArray.push(this.createRepresentante(representante));
  }

  removeRepresentante(index: number): void {
    this.representantesArray.removeAt(index);
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
