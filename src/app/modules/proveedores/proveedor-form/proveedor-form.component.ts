import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Proveedor } from 'app/models/Type';
import { RepresentanteFormComponent } from '../representante-form/representante-form.component';
import { RepresentanteService } from '../services/representante.service';
import { CatalogService } from 'app/services/catalog.service';

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
  representantes: any[] = [];
  tiposEmpresa: any[] = [];
  ministerios: any[] = [];
  municipios: any[] = [];
  provincias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private representanteService: RepresentanteService,
    private catalogService: CatalogService,
    public dialogRef: MatDialogRef<ProveedorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      nit: [''],
      direccion: ['', [Validators.required]],
      tipo_empresa: ['', [Validators.required]],
      telefono: ['', [Validators.required, this.telefonoValidator]],
      email: ['', [Validators.required, Validators.email]],
      representante_legal: ['', Validators.required],
      ministerio: [null, Validators.required],
      municipio: [null, Validators.required],
      provincia: [null, Validators.required],
      prefijo_provincia: ['', Validators.required],
      telefonos: ['', Validators.required],
      categoria: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.loadRepresentantes();
    this.loadTiposEmpresa();
    this.loadMinisterios();
    this.loadMunicipios();
    this.loadProvincias();
  }

  loadRepresentantes(): void {
    this.representanteService.getRepresentantes().subscribe({
      next: (response: any) => {
        this.representantes = Array.isArray(response) ? response : response.data || [];
      },
      error: () => {
        this.representantes = [];
      }
    });
  }

  loadTiposEmpresa(): void {
    // Commented out service call as per user request
    // const allowedTipos = ['estatal', 'mixta', 'privada', 'cooperativa'];
    // this.catalogService.getTiposEmpresa().subscribe({
    //   next: (response: any) => {
    //     let tipos = Array.isArray(response) ? response : response.data || [];
    //     // Filter or map to allowed values only
    //     this.tiposEmpresa = tipos.filter((tipo: any) => allowedTipos.includes(tipo.nombre.toLowerCase()));
    //   },
    //   error: () => {
    //     this.tiposEmpresa = [];
    //   }
    // });

    // Use hardcoded allowed types for now
    this.tiposEmpresa = [
      { nombre: 'estatal' },
      { nombre: 'mixta' },
      { nombre: 'privada' },
      { nombre: 'cooperativa' }
    ];
  }

  loadMinisterios(): void {
    this.catalogService.getMinisterios().subscribe({
      next: (response: any) => {
        this.ministerios = Array.isArray(response) ? response : response.data || [];
      },
      error: () => {
        this.ministerios = [];
      }
    });
  }

  loadMunicipios(): void {
    this.catalogService.getMunicipios().subscribe({
      next: (response: any) => {
        this.municipios = Array.isArray(response) ? response : response.data || [];
      },
      error: () => {
        this.municipios = [];
      }
    });
  }

  loadProvincias(): void {
    this.catalogService.getProvincias().subscribe({
      next: (response: any) => {
        this.provincias = Array.isArray(response) ? response : response.data || [];
      },
      error: () => {
        this.provincias = [];
      }
    });
  }

  openAddRepresentanteDialog(): void {
    const dialogRef = this.dialog.open(RepresentanteFormComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadRepresentantes();
      }
    });
  }

  telefonoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !value.startsWith('+53')) {
      return { telefonoInvalid: true };
    }
    return null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      const formValue = this.proveedorForm.value;
      // Only send the exact fields required for creation
      // Remove 'nit' property to avoid TS error, use 'codigo' as required by backend
      const newProveedor = {
        nombre: formValue.nombre,
        codigo: formValue.codigo,
        direccion: formValue.direccion,
        tipo_empresa: formValue.tipo_empresa,
        telefono: formValue.telefono,
        email: formValue.email,
        representante_legal: formValue.representante_legal,
        ministerio: formValue.ministerio,
        municipio: formValue.municipio,
        provincia: formValue.provincia,
        prefijo_provincia: formValue.prefijo_provincia,
        telefonos: formValue.telefonos,
        categoria: formValue.categoria,
      estado: formValue.estado
      };
      this.dialogRef.close(newProveedor);
    }
  }
  
}

