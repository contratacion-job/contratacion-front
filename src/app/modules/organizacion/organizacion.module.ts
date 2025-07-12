import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: 'trabajadores',
    loadComponent: () => import('./trabajadores/trabajadores.component').then(c => c.TrabajadoresComponent)
  },
  {
    path: 'entidades',
    loadComponent: () => import('./entidad-list/entidad-list.component').then(c => c.EntidadListComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrganizacionModule { }
