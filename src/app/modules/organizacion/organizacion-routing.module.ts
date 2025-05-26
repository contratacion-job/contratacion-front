import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { DepartamentoFormComponent } from './departamento-list/departamento-list.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';

const routes: Routes = [
  { path: 'departamentos', component: DepartamentoFormComponent },
  { path: 'trabajadores', component: TrabajadoresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizacionRoutingModule { }
