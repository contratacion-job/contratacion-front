import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratoListComponent } from './contrato-list/contrato-list.component';
import { EjecucionContratoComponent } from './ejecucion-contrato/ejecucion-contrato.component';
import { ExpiredContractsComponent } from './expired-contracts/expired-contracts.component';
import { ExpiredComponent } from './ejecucion-contrato/expired/expired.component';

const routes: Routes = [
    {
        path: 'list',
        component: ContratoListComponent
    },
    {
      path: 'ejecucion',
      component: EjecucionContratoComponent
  },
  {
    path: 'vencidos',
    component: ExpiredContractsComponent
},
{
  path: 'vencidas',
  component: ExpiredComponent
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratosRoutingModule { }
