import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule
} from 'ng-apexcharts';
import { Contrato } from 'app/models/Type';
import { ContratoService } from '../contratos/services/contrato.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

export interface ExtendedContrato extends Contrato {
  monto_total: number;
}

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contrato-dashboard',
  standalone: true,
  providers: [ContratoService],
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard-contrato.component.html',
  styleUrls: ['./contrato-dashboard.component.scss']
})
export class ContratoDashboardComponent implements OnInit {
  contratos: ExtendedContrato[] = [];

  @ViewChild('topMontoMayorChart') topMontoMayorChart!: ChartComponent;
  public topMontoMayorChartOptions!: Partial<ChartOptions>;

  @ViewChild('topMontoMenorChart') topMontoMenorChart!: ChartComponent;
  public topMontoMenorChartOptions!: Partial<ChartOptions>;

  @ViewChild('topVigenciaMayorChart') topVigenciaMayorChart!: ChartComponent;
  public topVigenciaMayorChartOptions!: Partial<ChartOptions>;

  @ViewChild('topVigenciaMenorChart') topVigenciaMenorChart!: ChartComponent;
  public topVigenciaMenorChartOptions!: Partial<ChartOptions>;

  @ViewChild('tiposContratosChart') tiposContratosChart!: ChartComponent;
  public tiposContratosChartOptions!: Partial<ChartOptions>;

  @ViewChild('departamentosChart') departamentosChart!: ChartComponent;
  public departamentosChartOptions!: Partial<ChartOptions>;

  @ViewChild('duracionBucketsChart') duracionBucketsChart!: ChartComponent;
  public duracionBucketsChartOptions!: Partial<ChartOptions>;

  constructor(@Inject(ContratoService) private contratoService: ContratoService) {}

  ngOnInit(): void {
    this.fetchContratos();
  }

  private fetchContratos(): void {
    this.contratoService.getContratos().subscribe(data => {
      this.contratos = data as ExtendedContrato[];
      this.initializeCharts();
    });
  }

  private initializeCharts(): void {
    this.createTopMontoCharts();
    this.createVigenciaCharts();
    this.createTiposChart();
    this.createDepartamentosChart();
    this.createDuracionBucketsChart();
  }

  private createTopMontoCharts(): void {
    const sortedByMonto = [...this.contratos].sort((a, b) => (b.monto_total || 0) - (a.monto_total || 0));
    const top10Mayor = sortedByMonto.slice(0, 10);
    const top10Menor = sortedByMonto.slice(-10).reverse();

    this.topMontoMayorChartOptions = {
      series: [
        {
          name: 'Monto Total',
          data: top10Mayor.map(c => c.monto_total || 0)
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: top10Mayor.map(c => `${c.proveedor.nombre} - ${c.no_contrato}`)
      },
      title: {
        text: 'Top 10 Contratos - Mayor Monto'
      }
    };

    this.topMontoMenorChartOptions = {
      series: [
        {
          name: 'Monto Total',
          data: top10Menor.map(c => c.monto_total || 0)
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: top10Menor.map(c => `${c.proveedor.nombre} - ${c.no_contrato}`)
      },
      title: {
        text: 'Top 10 Contratos - Menor Monto'
      }
    };
  }

  private createVigenciaCharts(): void {
    const calcularDuracion = (contrato: ExtendedContrato): number => {
      const inicio = new Date(contrato.fecha_firmado);
      const fin = new Date(contrato.fecha_vencido);
      return Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30)); // Meses
    };

    const sortedByVigencia = [...this.contratos].sort((a, b) => calcularDuracion(b) - calcularDuracion(a));
    const top10MayorVigencia = sortedByVigencia.slice(0, 10);
    const top10MenorVigencia = sortedByVigencia.slice(-10).reverse();

    this.topVigenciaMayorChartOptions = {
      series: [
        {
          name: 'Duración (Meses)',
          data: top10MayorVigencia.map(calcularDuracion)
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: top10MayorVigencia.map(c => `${c.proveedor.nombre} - ${c.no_contrato}`)
      },
      title: {
        text: 'Top 10 Contratos - Mayor Vigencia'
      }
    };

    this.topVigenciaMenorChartOptions = {
      series: [
        {
          name: 'Duración (Meses)',
          data: top10MenorVigencia.map(calcularDuracion)
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: top10MenorVigencia.map(c => `${c.proveedor.nombre} - ${c.no_contrato}`)
      },
      title: {
        text: 'Top 10 Contratos - Menor Vigencia'
      }
    };
  }

  private createTiposChart(): void {
    const tiposCount = this.contratos.reduce((acc, contrato) => {
      const tipo = contrato.tipo_contrato.tipo_contrato;
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.tiposContratosChartOptions = {
      series: [
        {
          name: 'Cantidad de Contratos',
          data: Object.values(tiposCount)
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: Object.keys(tiposCount)
      },
      title: {
        text: 'Tipos de Contratos'
      }
    };
  }

  private createDuracionBucketsChart(): void {
    // Define duration buckets in months
    const buckets = [
      { label: '0-3 meses', min: 0, max: 3 },
      { label: '4-6 meses', min: 4, max: 6 },
      { label: '7-12 meses', min: 7, max: 12 },
      { label: '13-24 meses', min: 13, max: 24 },
      { label: 'Más de 24 meses', min: 25, max: Infinity }
    ];

    // Calculate duration in months for each contract
    const calcularDuracion = (contrato: ExtendedContrato): number => {
      const inicio = new Date(contrato.fecha_firmado);
      const fin = new Date(contrato.fecha_vencido);
      return Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30)); // Meses
    };

    // Count contracts in each bucket
    const bucketCounts = buckets.map(bucket => {
      return this.contratos.filter(c => {
        const duracion = calcularDuracion(c);
        return duracion >= bucket.min && duracion <= bucket.max;
      }).length;
    });

    this.duracionBucketsChartOptions = {
      series: [
        {
          name: 'Cantidad de Contratos',
          data: bucketCounts
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: buckets.map(b => b.label)
      },
      title: {
        text: 'Contratos por Duración'
      }
    };
  }

  private createDepartamentosChart(): void {
    const deptosCount = this.contratos.reduce((acc, contrato) => {
      const depto = contrato.departamento.nombre_dpto;
      acc[depto] = (acc[depto] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.departamentosChartOptions = {
      series: [
        {
          name: 'Cantidad de Contratos',
          data: Object.values(deptosCount)
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: Object.keys(deptosCount)
      },
      title: {
        text: 'Contratos por Departamento'
      }
    };
  }

  public downloadChart(chartId: string): void {
    let chart: ChartComponent | undefined;
    switch(chartId) {
      case 'topMontoMayor':
        chart = this.topMontoMayorChart;
        break;
      case 'topMontoMenor':
        chart = this.topMontoMenorChart;
        break;
      case 'topVigenciaMayor':
        chart = this.topVigenciaMayorChart;
        break;
      case 'topVigenciaMenor':
        chart = this.topVigenciaMenorChart;
        break;
      case 'tiposContratos':
        chart = this.tiposContratosChart;
        break;
      case 'departamentos':
        chart = this.departamentosChart;
        break;
      case 'duracionBuckets':
        chart = this.duracionBucketsChart;
        break;
    }
    if (chart) {
      chart.dataURI().then((value: { imgURI: string }) => {
        const link = document.createElement('a');
        link.download = `${chartId}.png`;
        link.href = value.imgURI;
        link.click();
      });
    }
  }
}