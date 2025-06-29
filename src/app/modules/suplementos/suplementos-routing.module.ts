import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuplementoDetailComponent } from './suplemento-detail/suplemento-detail.component';
import { SuplementoListComponent } from './suplemento-list/suplemento-list.component';
import { EjecucionSuplementoComponent } from './ejecucion-suplemento/ejecucion-suplemento.component';
import { ExpiredComponent } from './ejecucion-suplemento/expired/expired.component';
import { SuplementosExpiredComponent } from './suplementos-expired/suplementos-expired.component';

const routes: Routes = [

    {
      path: 'list',
      component: SuplementoListComponent
    },
    {
      path: 'ejecucion',
      component: EjecucionSuplementoComponent
    },
    {
      path: 'vencidas',
      component: SuplementosExpiredComponent
    },

    {
      path: 'vencidos',
      component: ExpiredComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuplementosRoutingModule { }
