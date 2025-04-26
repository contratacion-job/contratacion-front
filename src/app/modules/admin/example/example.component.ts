import { Component, ViewEncapsulation } from '@angular/core';
import { ContratoListComponent } from "../../contratos/contrato-list/contrato-list.component";

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [ContratoListComponent],
})
export class ExampleComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
