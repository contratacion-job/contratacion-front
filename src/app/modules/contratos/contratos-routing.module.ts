import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratoListComponent } from './contrato-list/contrato-list.component';
import { EjecucionContratoComponent } from './ejecucion-contrato/ejecucion-contrato.component';

const routes: Routes = [
    {
        path: 'tipos',
        component: ContratoListComponent
    },
    {
      path: 'contratos',
      component: EjecucionContratoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratosRoutingModule { }
