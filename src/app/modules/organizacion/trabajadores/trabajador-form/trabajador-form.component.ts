import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TrabajadoresService, DepartamentoSimple } from '../trabajadores.service';
import { Trabajador, TrabajadorDialogData } from '../../../../models/Type';

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
    MatIconModule
  ],
  templateUrl: './trabajador-form.component.html',
  styleUrls: ['./trabajador-form.component.scss']
})
export class TrabajadorFormComponent implements OnInit {
  trabajadorForm: FormGroup;
  departamentos$: Observable<DepartamentoSimple[]>;
  
  // Propiedades para el template
  isEdit: boolean;
  
  // Roles disponibles
  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'empleado', label: 'Empleado' }
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
    }
  }

  private initForm(): void {
    this.trabajadorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      telefono_movil: [''],
      cargo: ['', Validators.required],
      departamento_id: ['', Validators.required],
      rol: ['', Validators.required],
      contrasena: [!this.isEdit ? 'temporal123' : '']
    });
  }

  // Getters para acceder a los controles del formulario
  get nombre() { return this.trabajadorForm.get('nombre'); }
  get apellido() { return this.trabajadorForm.get('apellido'); }
  get usuario() { return this.trabajadorForm.get('usuario'); }
  get email() { return this.trabajadorForm.get('email'); }
  get telefono() { return this.trabajadorForm.get('telefono'); }
  get telefono_movil() { return this.trabajadorForm.get('telefono_movil'); }
  get cargo() { return this.trabajadorForm.get('cargo'); }
  get departamento_id() { return this.trabajadorForm.get('departamento_id'); }
  get rol() { return this.trabajadorForm.get('rol'); }

  onSubmit(): void {
    if (this.trabajadorForm.valid) {
      const trabajadorData: Trabajador = this.trabajadorForm.value;
      
      if (this.isEdit && this.data.trabajador?.id) {
        this.trabajadoresService.updateTrabajador(this.data.trabajador.id, trabajadorData)
          .subscribe({
            next: (result) => {
              this.dialogRef.close(result);
            },
            error: (error) => {
              console.error('Error al actualizar trabajador:', error);
            }
          });
      } else {
        this.trabajadoresService.createTrabajador(trabajadorData)
          .subscribe({
            next: (result) => {
              this.dialogRef.close(result);
            },
            error: (error) => {
              console.error('Error al crear trabajador:', error);
            }
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}