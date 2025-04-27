import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-ejecucion',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule],
  templateUrl: './dashboard-ejecucion.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class DashboardEjecucionComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  totalEjecucionChartOptions: ApexOptions;
  ejecucionByTypeChartOptions: ApexOptions;
  ejecucionByStatusChartOptions: ApexOptions;
  ejecucionByMonthChartOptions: ApexOptions;

  ngOnInit(): void {
    this.totalEjecucionChartOptions = {
      chart: {
        type: 'radialBar',
        height: 200,
      },
      series: [80],
      labels: ['Total Ejecución'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%',
          }
        }
      }
    };

    this.ejecucionByTypeChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Ejecución',
        data: [50, 20, 10, 15]
      }],
      xaxis: {
        categories: ['Tipo 1', 'Tipo 2', 'Tipo 3', 'Tipo 4']
      }
    };

    this.ejecucionByStatusChartOptions = {
      chart: {
        type: 'pie',
        height: 200,
      },
      series: [60, 25, 15],
      labels: ['En Proceso', 'Completado', 'Pendiente']
    };

    this.ejecucionByMonthChartOptions = {
      chart: {
        type: 'area',
        height: 200,
      },
      series: [{
        name: 'Ejecución',
        data: [8, 12, 18, 22, 28, 32, 36, 40, 44, 48, 52, 56]
      }],
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      }
    };
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
