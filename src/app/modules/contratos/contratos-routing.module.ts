import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratoListComponent } from './contrato-list/contrato-list.component';
import { EjecucionContratoComponent } from './ejecucion-contrato/ejecucion-contrato.component';
import { ExpiredContractsComponent } from './expired-contracts/expired-contracts.component';

const routes: Routes = [
    {
        path: 'tipos',
        component: ContratoListComponent
    },
    {
      path: 'contratos',
      component: EjecucionContratoComponent
  }, {
    path: 'vencidos',
    component: ExpiredContractsComponent
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratosRoutingModule { }
