import { Routes } from '@angular/router';

export const organizacionRoutes: Routes = [
  {
    path: 'trabajadores',
    loadComponent: () => import('./trabajadores/trabajadores.component').then(c => c.TrabajadoresComponent)
  },
  {
    path: 'entidades',
    loadComponent: () => import('./entidad-list/entidad-list.component').then(c => c.EntidadListComponent)
  },
  // otras rutas...
];