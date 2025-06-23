import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RepresentanteService } from '../services/representante.service';
import { Entidad } from 'app/models/Type';

@Component({
  selector: 'app-representante-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './representante-form.component.html',
  styleUrls: ['./representante-form.component.scss']
})
export class RepresentanteFormComponent implements OnInit {
  form: FormGroup;
  entidades: Entidad[] = [];

  constructor(
    private fb: FormBuilder,
    private representanteService: RepresentanteService,
    private dialogRef: MatDialogRef<RepresentanteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],
      cargo: [''],
      entidad: [null, Validators.required]
    });

    this.loadEntidades();

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  loadEntidades(): void {
    // Aquí puedes cargar las entidades desde un servicio o dejar vacío si no hay datos
    this.entidades = [];
  }

  save(): void {
    if (this.form.valid) {
      const representanteData = this.form.value;
      if (this.data && this.data.id) {
        this.representanteService.updateRepresentante(this.data.id, representanteData).subscribe({
          next: () => {
            this.dialogRef.close('saved');
          },
          error: (error) => {
            console.error('Error updating representante', error);
          }
        });
      } else {
        this.representanteService.createRepresentante(representanteData).subscribe({
          next: () => {
            this.dialogRef.close('saved');
          },
          error: (error) => {
            console.error('Error creating representante', error);
          }
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}