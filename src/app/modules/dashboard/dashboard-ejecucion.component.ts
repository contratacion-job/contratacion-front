import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { mockContrato, mockEjecucionContrato } from 'app/mock-api/contrato-fake/fake';


@Component({
  selector: 'app-dashboard-ejecucion',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule],
  templateUrl: './dashboard-ejecucion.component.html',
  styleUrls: ['./dashboard-ejecucion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardEjecucionComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  totalEjecucionChartOptions: ApexOptions;
  ejecucionByTypeChartOptions: ApexOptions;
  ejecucionByStatusChartOptions: ApexOptions;
  ejecucionByMonthChartOptions: ApexOptions;

  // Nuevas gráficas
  contratosTopEjecucionesChartOptions: ApexOptions;
  suplementosTopEjecucionesChartOptions: ApexOptions;
  top10ProveedoresMayorMontoChartOptions: ApexOptions;
  top10ProveedoresMenorMontoChartOptions: ApexOptions;
  top10ProveedoresContratoSuplementoMayorMontoChartOptions: ApexOptions;
  top10ProveedoresContratoSuplementoMenorMontoChartOptions: ApexOptions;

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

    // Nuevas gráficas con datos simulados

    this.contratosTopEjecucionesChartOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{
        name: 'Ejecuciones',
        data: [15, 12, 10, 8, 7, 6, 5, 4, 3, 2]
      }],
      xaxis: {
        categories: mockContrato.slice(0, 10).map(c => c.no_contrato)
      },
      title: { text: 'Contratos con mayor cantidad de Ejecuciones' }
    };

    this.suplementosTopEjecucionesChartOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{
        name: 'Ejecuciones',
        data: [14, 13, 11, 9, 7, 6, 5, 4, 3, 1]
      }],
      xaxis: {
        categories: mockContrato.slice(0, 10).map(c => c.no_contrato) // Suplementos asociados a contratos
      },
      title: { text: 'Suplementos con mayor cantidad de Ejecuciones' }
    };

    this.top10ProveedoresMayorMontoChartOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{
        name: 'Monto Ejecutado',
        data: mockEjecucionContrato.slice(0, 10).map(e => e.costo_cup)
      }],
      xaxis: {
        categories: mockEjecucionContrato.slice(0, 10).map(e => e.proveedor.nombre)
      },
      title: { text: 'Top 10 Proveedores con mayor monto Ejecutado' }
    };

    this.top10ProveedoresMenorMontoChartOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{
        name: 'Monto Ejecutado',
        data: mockEjecucionContrato.slice(-10).map(e => e.costo_cup)
      }],
      xaxis: {
        categories: mockEjecucionContrato.slice(-10).map(e => e.proveedor.nombre)
      },
      title: { text: 'Top 10 Proveedores con menor monto Ejecutado' }
    };

    this.top10ProveedoresContratoSuplementoMayorMontoChartOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{
        name: 'Monto Ejecutado',
        data: [100000, 90000, 85000, 80000, 75000, 70000, 65000, 60000, 55000, 50000]
      }],
      xaxis: {
        categories: mockContrato.slice(0, 10).map(c => `${c.no_contrato} - Sup1`)
      },
      title: { text: 'Top 10 Proveedores con Contrato y Suplemento mayor monto Ejecutado' }
    };

    this.top10ProveedoresContratoSuplementoMenorMontoChartOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{
        name: 'Monto Ejecutado',
        data: [5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000]
      }],
      xaxis: {
        categories: mockContrato.slice(0, 10).map(c => `${c.no_contrato} - Sup1`)
      },
      title: { text: 'Top 10 Proveedores con Contrato y Suplemento menor monto Ejecutado' }
    };
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}