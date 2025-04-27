import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-proveedor',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule],
  templateUrl: './dashboard-proveedor.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class DashboardProveedorComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  totalProveedoresChartOptions: ApexOptions;
  proveedoresByTypeChartOptions: ApexOptions;
  proveedoresByStatusChartOptions: ApexOptions;
  proveedoresByMonthChartOptions: ApexOptions;

  ngOnInit(): void {
    this.totalProveedoresChartOptions = {
      chart: {
        type: 'radialBar',
        height: 200,
      },
      series: [90],
      labels: ['Total Proveedores'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%',
          }
        }
      }
    };

    this.proveedoresByTypeChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: [45, 30, 15, 20]
      }],
      xaxis: {
        categories: ['Tipo Alpha', 'Tipo Beta', 'Tipo Gamma', 'Tipo Delta']
      }
    };

    this.proveedoresByStatusChartOptions = {
      chart: {
        type: 'pie',
        height: 200,
      },
      series: [55, 25, 20],
      labels: ['Activo', 'Inactivo', 'Pendiente']
    };

    this.proveedoresByMonthChartOptions = {
      chart: {
        type: 'area',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84]
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
