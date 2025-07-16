import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Departamento } from 'app/models/Type';
import { CatalogService } from 'app/services/catalog.service';
import { EntidadService } from '../entidad-list/entidad.service';

// Validador personalizado para capitalización
function capitalizeValidator(control: AbstractControl): { [key: string]: any } | null {
  if (!control.value) return null;
  
  const value = control.value.toString();
  const firstChar = value.charAt(0);
  
  if (firstChar !== firstChar.toUpperCase()) {
    return { 'notCapitalized': { value: control.value } };
  }
  
  return null;
}

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './departamento-list.component.html',
  styleUrl: './departamento-list.component.scss'
})
export class DepartamentoFormComponent implements OnInit {
  departamentoForm: FormGroup;
  ministerios: any[] = [];
  entidad: any = null;
  loading = {
    entidad: true,
    ministerios: true
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DepartamentoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private catalogService: CatalogService,
    private entidadService: EntidadService
  ) {
    this.departamentoForm = this.fb.group({
      nombre: ['', [Validators.required, capitalizeValidator]],
      codigo: ['', [Validators.required, capitalizeValidator]],
      descripcion: ['', [capitalizeValidator]],
      ministerio: ['', [Validators.required]], // Agregado required
      entidad_id: [0],
      director: ['', [capitalizeValidator]]
    });
  }

  ngOnInit(): void {
    // Cargar entidad
    this.entidadService.getLogs().subscribe({
      next: (response) => {
        console.log('Entidad data:', response); // Debug
        this.loading.entidad = false;
        
        // Forzar el tipo para acceder a las propiedades
        const data = response as any;
        if (data && data.success && data.data) {
          this.entidad = data.data;
          this.departamentoForm.patchValue({ entidad_id: this.entidad.id });
        } else {
          this.entidad = { nombre: 'No se encontró entidad' };
        }
      },
      error: (error) => {
        console.error('Error loading entidad:', error);
        this.loading.entidad = false;
        this.entidad = { nombre: 'Error al cargar entidad' };
      }
    });

    // Cargar ministerios
    this.catalogService.getMinisterios().subscribe({
      next: (response) => {
        console.log('Ministerios data:', response); // Debug
        this.loading.ministerios = false;
        
        // Forzar el tipo para acceder a las propiedades
        const data = response as any;
        if (Array.isArray(data)) {
          this.ministerios = data;
        } else if (data && data.success && Array.isArray(data.data)) {
          this.ministerios = data.data;
        } else {
          this.ministerios = [];
        }
        
        console.log('Ministerios procesados:', this.ministerios); // Debug
      },
      error: (error) => {
        console.error('Error loading ministerios:', error);
        this.loading.ministerios = false;
        this.ministerios = [];
      }
    });
  }

  // Método para capitalizar automáticamente
  onInputChange(event: any, fieldName: string): void {
    const value = event.target.value;
    if (value) {
      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
      this.departamentoForm.get(fieldName)?.setValue(capitalizedValue, { emitEvent: false });
    }
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