import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TrabajadoresService } from './trabajadores.service';

// Rutas del módulo
const routes = [
  {
    path: '',
    loadComponent: () => import('./trabajadores.component').then(c => c.TrabajadoresComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    TrabajadoresService
  ]
})
export class TrabajadoresModule { }
