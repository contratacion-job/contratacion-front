import { RouterModule, Routes } from '@angular/router';
import { ContratoDashboardComponent } from './dashboard-contrato.component';
import { DashboardProveedorComponent } from './dashboard-proveedor.component';
import { DashboardSuplimentoComponent } from './dashboard-suplimento.component';
import { DashboardEjecucionComponent } from './dashboard-ejecucion.component';
import { NgModule } from '@angular/core';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard-contrato',
    component: ContratoDashboardComponent,
  },
  {
    path: 'dashboard-proveedor',
    component: DashboardProveedorComponent,
  },
  {
    path: 'dashboard-suplimento',
    component: DashboardSuplimentoComponent,
  },
  {
    path: 'dashboard-ejecucion',
    component: DashboardEjecucionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

