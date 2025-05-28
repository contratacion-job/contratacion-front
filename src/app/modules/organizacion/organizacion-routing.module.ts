import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{TrabajadoresComponent} from 'app/modules/organizacion/trabajadores/trabajadores.component'
import { ExampleComponent } from '../admin/example/example.component';

const routes: Routes = [
 {
        path: 'trabajadores',
        component: TrabajadoresComponent
    },
    {
      path: 'departamentos',
      component: ExampleComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizacionRoutingModule { }
