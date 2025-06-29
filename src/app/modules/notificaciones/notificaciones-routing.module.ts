import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentroMensajesComponent } from './centro-mensajes/centro-mensajes.component';

const routes: Routes = [

 {
      path: 'correo',
      component: CentroMensajesComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificacionesRoutingModule { }
