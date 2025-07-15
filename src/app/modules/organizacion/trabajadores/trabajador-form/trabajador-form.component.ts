import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

import { TrabajadoresService } from '../trabajadores.service';
import { RestrictInputDirective } from '../../../../shared/directives/restrict-input.directive';
import { CapitalizeInputDirective } from '../../../../shared/directives/capitalize-input.directive';

export interface DepartamentoSimple {
  id: number;
  nombre: string;
}

export interface Trabajador {
  id?: number;
  nombre: string;
  apellido: string;
  usuario: string;
  email: string;
  telefono?: string;
  telefono_movil?: string;
  cargo: string;
  departamento_id: number;
  rol: string;
}

export interface TrabajadorDialogData {
  isEdit: boolean;
  trabajador?: Trabajador;
}

@Component({
  selector: 'app-trabajador-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    RestrictInputDirective,
    CapitalizeInputDirective
  ],
  templateUrl: './trabajador-form.component.html',
  styleUrls: ['./trabajador-form.component.scss']
})
export class TrabajadorFormComponent implements OnInit {
  trabajadorForm: FormGroup;
  departamentos$: Observable<DepartamentoSimple[]>;
  
  // Propiedades para el template
  isEdit: boolean;
  
  // Roles disponibles según la especificación
  roles = [
    { 
      value: 'visor', 
      label: 'Visor',
      description: 'Solo visualiza información, puede imprimir y exportar'
    },
    { 
      value: 'operador', 
      label: 'Operador',
      description: 'Agrega y modifica contratos y suplementos (sin eliminar)'
    },
    { 
      value: 'ejecutor', 
      label: 'Ejecutor',
      description: 'Ejecuta contratos, maneja facturas de cobro'
    },
    { 
      value: 'administrador', 
      label: 'Administrador',
      description: 'Elimina contratos, modifica Mi Entidad, backup BD'
    },
    
  ];

  constructor(
    private fb: FormBuilder,
    private trabajadoresService: TrabajadoresService,
    public dialogRef: MatDialogRef<TrabajadorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrabajadorDialogData
  ) {
    this.isEdit = data.isEdit;
    this.initForm();
  }

  private initForm(): void {
    this.trabajadorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]*$/)]], // Solo números
      telefono_movil: ['', [Validators.pattern(/^[+]?[0-9]*$/)]], // Solo números y +
      cargo: ['', [Validators.required]],
      departamento_id: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      contrasena: ['']
    });

    // Si no es edición, hacer la contraseña requerida
    if (!this.isEdit) {
      this.trabajadorForm.get('contrasena')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }
  
  ngOnInit(): void {
    this.departamentos$ = this.trabajadoresService.getDepartamentos();
    
    if (this.isEdit && this.data.trabajador) {
      this.trabajadorForm.patchValue({
        nombre: this.data.trabajador.nombre,
        apellido: this.data.trabajador.apellido,
        usuario: this.data.trabajador.usuario,
        email: this.data.trabajador.email,
        telefono: this.data.trabajador.telefono,
        telefono_movil: this.data.trabajador.telefono_movil,
        cargo: this.data.trabajador.cargo,
        departamento_id: this.data.trabajador.departamento_id,
        rol: this.data.trabajador.rol
      });
    } else {
      // Si es nuevo, inicializar telefono_movil con +53
      this.trabajadorForm.get('telefono_movil')?.setValue('+53');
      this.trabajadorForm.get('telefono')?.setValue('+22');
    }
  }

  // Getters para facilitar el acceso a los controles en el template
  get nombre() { return this.trabajadorForm.get('nombre'); }
  get apellido() { return this.trabajadorForm.get('apellido'); }
  get usuario() { return this.trabajadorForm.get('usuario'); }
  get email() { return this.trabajadorForm.get('email'); }
  get telefono() { return this.trabajadorForm.get('telefono'); }
  get telefono_movil() { return this.trabajadorForm.get('telefono_movil'); }
  get cargo() { return this.trabajadorForm.get('cargo'); }
  get departamento_id() { return this.trabajadorForm.get('departamento_id'); }
  get rol() { return this.trabajadorForm.get('rol'); }
  get contrasena() { return this.trabajadorForm.get('contrasena'); }

  onSubmit(): void {
    if (this.trabajadorForm.valid) {
      const formData = this.trabajadorForm.value;
      this.dialogRef.close(formData);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.trabajadorForm.controls).forEach(key => {
        this.trabajadorForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
