import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-suplimento',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule],
  templateUrl: './dashboard-suplimento.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSuplimentoComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  totalSuplimentosChartOptions: ApexOptions;
  suplimentosByTypeChartOptions: ApexOptions;
  suplimentosByStatusChartOptions: ApexOptions;
  suplimentosByMonthChartOptions: ApexOptions;

  ngOnInit(): void {
    this.totalSuplimentosChartOptions = {
      chart: {
        type: 'radialBar',
        height: 200,
      },
      series: [60],
      labels: ['Total Suplimentos'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%',
          }
        }
      }
    };

    this.suplimentosByTypeChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Suplimentos',
        data: [30, 20, 10, 15]
      }],
      xaxis: {
        categories: ['Tipo X', 'Tipo Y', 'Tipo Z', 'Tipo W']
      }
    };

    this.suplimentosByStatusChartOptions = {
      chart: {
        type: 'pie',
        height: 200,
      },
      series: [50, 30, 20],
      labels: ['Activo', 'Pendiente', 'Cancelado']
    };

    this.suplimentosByMonthChartOptions = {
      chart: {
        type: 'area',
        height: 200,
      },
      series: [{
        name: 'Suplimentos',
        data: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
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
