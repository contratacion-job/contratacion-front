import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartamentoFormComponent } from './departamento-list/departamento-list.component';
import { LicenseComponent } from 'app/core/soporte/license/license.component';
import { BDComponent } from 'app/core/soporte/bd/bd.component';

import { EntidadListComponent } from './entidad-list/entidad-list.component';
import { SystemComponent } from './system/system.component';
import { DepartamentoComponent } from './municipio-list/municipio-list.component';

const routes: Routes = [

  {
    path: 'entidad',
    component: EntidadListComponent
},
 {
        path: 'trabajadores',
        loadChildren: () => import('./trabajadores/trabajadores.module').then(m => m.TrabajadoresModule)
    },
    {
      path: 'departamentos',
      component: DepartamentoComponent
  },
  {
    path: 'log',
    component: SystemComponent
},

  {
    path: 'licencia',
    component: LicenseComponent
},
{
  path: 'bd',
  component:  BDComponent
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizacionRoutingModule { }
