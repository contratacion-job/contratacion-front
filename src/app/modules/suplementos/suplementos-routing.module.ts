import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuplementoDetailComponent } from './suplemento-detail/suplemento-detail.component';

const routes: Routes = [


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
