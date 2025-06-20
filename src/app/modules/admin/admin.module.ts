import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioGestionComponent } from './usuarios/UsuarioGestionComponent';

import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: 'usuarios',
        component: UsuarioGestionComponent
    },


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
