import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-contrato',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule],
  templateUrl: './dashboard-contrato.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class DashboardContratoComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // Chart options for total contracts
  totalContractsChartOptions: ApexOptions;

  // Chart options for contracts by type
  contractsByTypeChartOptions: ApexOptions;

  // Chart options for contracts by status
  contractsByStatusChartOptions: ApexOptions;

  // Chart options for contracts by month
  contractsByMonthChartOptions: ApexOptions;

  ngOnInit(): void {
    this.totalContractsChartOptions = {
      chart: {
        type: 'radialBar',
        height: 200,
      },
      series: [75], // example: 75 total contracts (percentage)
      labels: ['Total Contratos'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%',
          }
        }
      }
    };

    this.contractsByTypeChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Contratos',
        data: [40, 25, 10, 15]
      }],
      xaxis: {
        categories: ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D']
      }
    };

    this.contractsByStatusChartOptions = {
      chart: {
        type: 'pie',
        height: 200,
      },
      series: [44, 33, 23],
      labels: ['Activo', 'Pendiente', 'Cancelado']
    };

    this.contractsByMonthChartOptions = {
      chart: {
        type: 'area',
        height: 200,
      },
      series: [{
        name: 'Contratos',
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
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