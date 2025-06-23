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
import { Suplemento, Proveedor, Contrato, Vigencia, TipoContrato, Departamento } from 'app/models/Type';
import { 
  mockProveedor, 
  mockContrato as mockContratos, 
  mockVigencia, 
  mockTipoContrato, 
  mockDepartamento 
} from 'app/mock-api/contrato-fake/fake';

@Component({
  selector: 'app-suplemento-detail',
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
    DatePipe
  ],
  templateUrl: './suplemento-detail.component.html',
  styleUrls: ['./suplemento-detail.component.scss']
})
export class SuplementoDetailComponent implements OnInit {
  suplementoForm: FormGroup;
  proveedores: any[] = mockProveedor;
  contratos: any[] = mockContratos;
  isEditMode = false;
  departamentos: any[] = [];
  tiposContrato: any[] = [];
  vigencias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SuplementoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { suplemento: Suplemento, action: 'new' | 'edit' }
  ) {
    this.suplementoForm = this.fb.group({
      id: [''],
      vigencia_id: ['', Validators.required],
      proveedor_id: ['', Validators.required],
      tipo_contrato_id: ['', Validators.required],
      no_contrato_id: ['', Validators.required],
      departamento_id: ['', Validators.required],
      no_contrato_contratacion: ['', Validators.required],
      fecha_entrada: ['', Validators.required],
      fecha_firmado: ['', Validators.required],
      valor_cup: [0, [Validators.required, Validators.min(0)]],
      monto_vencimiento_cup: [0],
      monto_vencimiento_cl: [0],
      valor_usd: [0],
      monto_vencimiento_usd: [0],
      fecha_vencido: ['', Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    // Load mock data for dropdowns
    this.vigencias = mockVigencia;
    this.tiposContrato = mockTipoContrato;
    this.departamentos = mockDepartamento;

    if (this.data?.action === 'edit' && this.data.suplemento) {
      this.isEditMode = true;
      const suplemento = this.data.suplemento;
      this.suplementoForm.patchValue({
        ...suplemento,
        fecha_entrada: suplemento.fecha_entrada ? new Date(suplemento.fecha_entrada) : null,
        fecha_firmado: suplemento.fecha_firmado ? new Date(suplemento.fecha_firmado) : null,
        fecha_vencido: suplemento.fecha_vencido ? new Date(suplemento.fecha_vencido) : null,
        vigencia_id: suplemento.vigencia?.id,
        proveedor_id: suplemento.proveedor?.id,
        tipo_contrato_id: suplemento.tipo_contrato?.id,
        departamento_id: suplemento.departamento?.id
      });
    }
  }

  onSubmit(): void {
    if (this.suplementoForm.invalid) {
      return;
    }
    this.dialogRef.close(this.suplementoForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.suplementoForm.controls;
  }
}
