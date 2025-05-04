import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
// Importa los módulos que necesites

@NgModule({
    exports: [
        ButtonModule,
        TableModule,
        DialogModule,
        InputTextModule,
        // Exporta los módulos que quieras usar
    ]
})
export class PrimeNgModule { }