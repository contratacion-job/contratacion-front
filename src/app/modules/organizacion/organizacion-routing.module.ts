import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{TrabajadoresComponent} from 'app/modules/organizacion/trabajadores/trabajadores.component'

import { DepartamentoFormComponent } from './departamento-list/departamento-list.component';
import { LicenseComponent } from 'app/core/soporte/license/license.component';
import { BDComponent } from 'app/core/soporte/bd/bd.component';
import { DepartamentoComponent } from './municipio-list/municipio-list.component';
import { EntidadListComponent } from './entidad-list/entidad-list.component';

const routes: Routes = [

  {
    path: 'entidad',
    component: EntidadListComponent
},
 {
        path: 'trabajadores',
        component: TrabajadoresComponent
    },
    {
      path: 'departamentos',
      component: DepartamentoComponent
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
