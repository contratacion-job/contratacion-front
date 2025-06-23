import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { RepresentanteListComponent } from './representante-form/representante-list/representante-list.component';

const routes: Routes = [


  {
    path: 'lista',
    component: ProveedorListComponent
  },
  
  {
    path: 'representantes',
    component: RepresentanteListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
