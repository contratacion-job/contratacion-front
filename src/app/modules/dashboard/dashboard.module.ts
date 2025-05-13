import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratoDashboardComponent } from './dashboard-contrato.component';
import { DashboardProveedorComponent } from './dashboard-proveedor.component';
import { DashboardSuplimentoComponent } from './dashboard-suplimento.component';
import { DashboardEjecucionComponent } from './dashboard-ejecucion.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule
  ]
})
export class DashboardModule { }
