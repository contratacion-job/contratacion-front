import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Usuario } from 'app/models/Type';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-usuario-form',
    templateUrl: './usuario-form.component.html',
    standalone: true,
    imports: [CommonModule,
        ReactiveFormsModule ,
         MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class UsuarioFormComponent {
    userForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UsuarioFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Usuario | null
    ) {
        this.userForm = this.fb.group({
            username: [data?.username || '', Validators.required],
            roles: [data?.roles || '', Validators.required],
            password: ['', data ? [] : Validators.required], // required only for new user
            name: [data?.name || '', Validators.required],
            apellidos: [data?.apellidos || '', Validators.required],
            cargo: [data?.cargo || '', Validators.required],
            correo: [data?.correo || '', [Validators.required, Validators.email]],
            movil: [data?.movil || '', Validators.required],
            extension: [data?.extension || '', Validators.required],
        });
    }

    save() {
        if (this.userForm.valid) {
            const user: Usuario = {
                id: this.data?.id || 0,
                ...this.userForm.value
            };
            this.dialogRef.close(user);
        }
    }

    cancel() {
        this.dialogRef.close(null);
    }
}
