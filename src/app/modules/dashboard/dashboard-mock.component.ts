import { DecimalPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';

@Component({
    selector       : 'dashboard-mock',
    templateUrl    : './dashboard-mock.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule],
})
export class DashboardMockComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // Mock chart options for demo
    chartOptions: ApexOptions;

    ngOnInit(): void
    {
        // Initialize mock chart options
        this.chartOptions = {
            chart: {
                type: 'bar',
                height: 200,
            },
            series: [{
                name: 'Mock Data',
                data: [10, 20, 15, 30, 25]
            }],
            xaxis: {
                categories: ['Contrato', 'Proveedor', 'Suplimento', 'Ejecución', 'Otros']
            }
        };
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
