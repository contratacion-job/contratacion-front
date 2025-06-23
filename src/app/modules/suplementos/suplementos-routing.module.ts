import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuplementoDetailComponent } from './suplemento-detail/suplemento-detail.component';
import { SuplementoListComponent } from './suplemento-list/suplemento-list.component';
import { EjecucionSuplementoComponent } from './ejecucion-suplemento/ejecucion-suplemento.component';

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
      component: SuplementoDetailComponent
    },

    {
      path: 'vencidos',
      component: SuplementoDetailComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuplementosRoutingModule { }
