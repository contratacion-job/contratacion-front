import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexMarkers,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexStroke,
  ApexFill,
  ApexGrid,
  ApexResponsive,
  ChartComponent,
  NgApexchartsModule
} from 'ng-apexcharts';
import { Contrato, TipoContrato, Departamento } from 'app/models/Type';
import { ContratoService } from '../contratos/services/contrato.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries | number[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis | ApexYAxis[];
  markers?: ApexMarkers;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  responsive: ApexResponsive[];
  labels?: string[];
  colors?: string[];
};

export interface ExtendedContrato extends Contrato {
  monto_total: number;
}

@Component({
  selector: 'app-contrato-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './dashboard-contrato.component.html',
  styleUrls: ['./dashboard-contrato.component.scss']
})
export class ContratoDashboardComponent implements OnInit {
  contratos: ExtendedContrato[] = [];
  isLoading = true;
  chartsInitialized = false;

  @ViewChild('topMontoMayorChart') topMontoMayorChart!: ChartComponent;
  @ViewChild('topMontoMenorChart') topMontoMenorChart!: ChartComponent;
  @ViewChild('topVigenciaMayorChart') topVigenciaMayorChart!: ChartComponent;
  @ViewChild('topVigenciaMenorChart') topVigenciaMenorChart!: ChartComponent;
  @ViewChild('tiposContratosChart') tiposContratosChart!: ChartComponent;
  @ViewChild('departamentosChart') departamentosChart!: ChartComponent;
  @ViewChild('duracionBucketsChart') duracionBucketsChart!: ChartComponent;
  @ViewChild('evolucionMensualChart') evolucionMensualChart!: ChartComponent;

  // Paleta de colores estilo Fuse actualizada a tonos grises y azul clarito
  private colorPalette = [
    '#90A4AE', // gris claro
    '#B0BEC5', // gris más claro
    '#CFD8DC', // gris muy claro
    '#E1E8ED', // gris muy suave
    '#2196F3', // azul primario
    '#64B5F6', // azul claro
    '#BBDEFB', // azul muy claro
    '#ECEFF1'  // gris casi blanco
  ];

  // Inicializar todas las opciones con valores por defecto
  public topMontoMayorChartOptions: Partial<ChartOptions> = {};
  public topMontoMenorChartOptions: Partial<ChartOptions> = {};
  public topVigenciaMayorChartOptions: Partial<ChartOptions> = {};
  public topVigenciaMenorChartOptions: Partial<ChartOptions> = {};
  public tiposContratosChartOptions: Partial<ChartOptions> = {};
  public departamentosChartOptions: Partial<ChartOptions> = {};
  public duracionBucketsChartOptions: Partial<ChartOptions> = {};
  public evolucionMensualChartOptions: Partial<ChartOptions> = {};

  constructor(private contratoService: ContratoService) {}

  ngOnInit(): void {
    this.initializeDefaultCharts();
    this.fetchContratos();
     this.contratoService
  }

  // Computed properties for dashboard statistics
  get totalContratos(): number {
    return this.contratos.length;
  }

  get valorTotal(): number {
    const total = this.contratos.reduce((sum, contrato) => sum + (contrato.monto_total || 0), 0);
    return Math.round(total / 1000000 * 100) / 100; // Convert to millions and round to 2 decimals
  }

  get totalProveedores(): number {
    const proveedoresUnicos = new Set();
    this.contratos.forEach(contrato => {
      if (contrato.proveedor?.id) {
        proveedoresUnicos.add(contrato.proveedor.id);
      }
    });
    return proveedoresUnicos.size;
  }

  get totalDepartamentos(): number {
    const departamentosUnicos = new Set();
    this.contratos.forEach(contrato => {
      if (contrato.departamento?.id) {
        departamentosUnicos.add(contrato.departamento.id);
      }
    });
    return departamentosUnicos.size;
  }

  private initializeDefaultCharts(): void {
    const defaultOptions = this.getDefaultChartOptions();

    this.topMontoMayorChartOptions = { ...defaultOptions };
    this.topMontoMenorChartOptions = { ...defaultOptions, chart: { ...defaultOptions.chart, type: 'donut' } };
    this.topVigenciaMayorChartOptions = { ...defaultOptions, chart: { ...defaultOptions.chart, type: 'area' } };
    this.topVigenciaMenorChartOptions = { ...defaultOptions };
    this.tiposContratosChartOptions = { ...defaultOptions, chart: { ...defaultOptions.chart, type: 'radar' } };
    this.departamentosChartOptions = { ...defaultOptions };
    this.duracionBucketsChartOptions = { ...defaultOptions };
    this.evolucionMensualChartOptions = { ...defaultOptions, chart: { ...defaultOptions.chart, type: 'line' } };
  }

  private getDefaultChartOptions(): Partial<ChartOptions> {
    return {
      series: [{
        name: 'Datos',
        data: [10, 20, 30, 40, 50] // Datos de ejemplo
      }],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['A', 'B', 'C', 'D', 'E'],
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      title: {
        text: undefined
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        style: {
          fontSize: '12px'
        }
      },
      legend: {
        show: false
      },
      grid: {
        show: true,
        borderColor: '#E2E8F0',
        strokeDashArray: 0,
        position: 'back'
      },
      colors: ['#3F51B5'],
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 250
            }
          }
        }
      ]
    };
  }

  // Método para descargar gráficas en diferentes formatos
  downloadChart(chartType: string, format: 'png' | 'svg' | 'pdf' = 'png'): void {
    try {
      let chart: ChartComponent | undefined;

      switch (chartType) {
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
        case 'evolucionMensual':
          chart = this.evolucionMensualChart;
          break;
      }

      if (chart && (chart as any).chart) {
        const options = {
          scale: format === 'svg' ? 1 : 2,
          width: 1200,
          height: 600
        };

        if (format === 'svg') {
          (chart as any).chart.dataURI(options).then((uri: any) => {
            const link = document.createElement('a');
            link.href = uri.imgURI;
            link.download = `${chartType}-chart.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        } else if (format === 'pdf') {
          console.log('PDF export requires additional library');
        } else {
          (chart as any).chart.dataURI(options).then((uri: any) => {
            const link = document.createElement('a');
            link.href = uri.imgURI;
            link.download = `${chartType}-chart.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        }
      }
    } catch (error) {
      console.error('Error al descargar gráfica:', error);
    }
  }

  private fetchContratos(): void {
    this.isLoading = true;
    this.contratoService.getContratos().subscribe({
      next: (data) => {
        this.contratos = data.map(contrato => ({
          ...contrato,
          monto_total: (contrato.valor_cup || 0) + (contrato.valor_usd || 0)
        })) as ExtendedContrato[];

        // Esperar un poco para que el DOM se actualice
        setTimeout(() => {
          this.initializeCharts();
          this.isLoading = false;
          this.chartsInitialized = true;
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching contratos:', error);
        this.isLoading = false;
        this.initializeEmptyCharts();
      }
    });
  }

  private initializeEmptyCharts(): void {
    this.chartsInitialized = true;
  }

  private initializeCharts(): void {
    if (this.contratos.length === 0) {
      this.initializeEmptyCharts();
      return;
    }

    this.createTopMontoChart();
    this.createTopMontoPieChart();
    this.createVigenciaAreaChart();
    this.createEvolucionMensualChart();
    this.createTiposRadarChart();
    this.createDepartamentosChart();
    this.createDuracionHeatmapChart();
  }

  private createTopMontoChart(): void {
    const sortedByMonto = [...this.contratos].sort((a, b) => (b.monto_total || 0) - (a.monto_total || 0));
    const top10 = sortedByMonto.slice(0, 10);

    this.topMontoMayorChartOptions = {
      series: [{
        name: 'Monto Total',
        data: top10.map(c => c.monto_total || 0)
      }],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 8,
          distributed: true // Colores distribuidos
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: top10.map(c => c.proveedor?.nombre?.substring(0, 15) + '...' || 'N/A'),
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          },
          rotate: -45
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          },
          formatter: function (val: number) {
            return '$' + (val / 1000000).toFixed(1) + 'M';
          }
        }
      },
      colors: [
        this.colorPalette[5], // azul primario
        this.colorPalette[6], // azul claro
        this.colorPalette[7], // azul muy claro
        this.colorPalette[1], // gris claro
        this.colorPalette[2], // gris medio
        this.colorPalette[3], // gris azulado
        this.colorPalette[4], // gris oscuro
        this.colorPalette[0], // gris muy claro
        this.colorPalette[8], // azul casi blanco
        this.colorPalette[5]  // azul primario (repetido)
      ],
      grid: {
        show: true,
        borderColor: '#E2E8F0',
        strokeDashArray: 3
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return '$' + val.toLocaleString();
          }
        }
      },
      legend: {
        show: false
      }
    };
  }

  private createTopMontoPieChart(): void {
    const sortedByMonto = [...this.contratos].sort((a, b) => (b.monto_total || 0) - (a.monto_total || 0));
    const top6 = sortedByMonto.slice(0, 6);

    this.topMontoMenorChartOptions = {
      series: top6.map(c => c.monto_total || 0),
      chart: {
        type: 'donut',
        height: 320,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      labels: top6.map(c => c.proveedor?.nombre?.substring(0, 20) + '...' || 'N/A'),
      colors: [this.colorPalette[4], this.colorPalette[5], this.colorPalette[0], this.colorPalette[1], this.colorPalette[2], this.colorPalette[3]],
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1) + '%';
        },
        style: {
          fontSize: '12px',
          colors: ['#fff'],
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#64748B',
                formatter: function (w: any) {
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  return '$' + (total / 1000000).toFixed(1) + 'M';
                }
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '12px',
        labels: {
          colors: '#64748B'
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return '$' + val.toLocaleString();
          }
        }
      }
    };
  }

  private createVigenciaAreaChart(): void {
    const calcularDuracion = (contrato: ExtendedContrato): number => {
      if (!contrato.fecha_firmado || !contrato.fecha_vencido) return 0;
      const inicio = new Date(contrato.fecha_firmado);
      const fin = new Date(contrato.fecha_vencido);
      return Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30));
    };

    const sortedByVigencia = [...this.contratos].sort((a, b) => calcularDuracion(b) - calcularDuracion(a));
    const top10 = sortedByVigencia.slice(0, 10);

    this.topVigenciaMayorChartOptions = {
      series: [{
        name: 'Duración (Meses)',
        data: top10.map(calcularDuracion)
      }],
      chart: {
        type: 'area',
        height: 320,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#06B6D4'],
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      },
      xaxis: {
        categories: top10.map(c => c.proveedor?.nombre?.substring(0, 10) + '...' || 'N/A'),
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      colors: [this.colorPalette[5]],
      grid: {
        show: true,
        borderColor: '#E2E8F0',
        strokeDashArray: 3
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val + ' meses';
          }
        }
      }
    };
  }

  private createEvolucionMensualChart(): void {
    const mesesData = this.contratos.reduce((acc, contrato) => {
      if (contrato.fecha_firmado) {
        const fecha = new Date(contrato.fecha_firmado);
        const mes = fecha.getMonth();
        const año = fecha.getFullYear();
        const key = `${año}-${mes.toString().padStart(2, '0')}`;

        if (!acc[key]) {
          acc[key] = { count: 0, monto: 0 };
        }
        acc[key].count++;
        acc[key].monto += contrato.monto_total || 0;
      }
      return acc;
    }, {} as any);

    const sortedKeys = Object.keys(mesesData).sort();
    const last12Months = sortedKeys.slice(-12);

    this.evolucionMensualChartOptions = {
      series: [
        {
          name: 'Cantidad',
          type: 'column',
          data: last12Months.map(key => mesesData[key].count)
        },
        {
          name: 'Monto (M$)',
          type: 'line',
          data: last12Months.map(key => mesesData[key].monto / 1000000)
        }
      ],
      chart: {
        height: 320,
        type: 'line',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      stroke: {
        width: [0, 4],
        curve: 'smooth'
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 6,
        colors: ['#FFFFFF'],
        strokeColors: '#EF4444',
        strokeWidth: 2,
        hover: {
          size: 8
        }
      },
      xaxis: {
        categories: last12Months.map(key => {
          const [año, mes] = key.split('-');
          return new Date(parseInt(año), parseInt(mes)).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
        }),
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      yaxis: [
        {
          title: {
            text: 'Cantidad',
            style: {
              color: '#64748B',
              fontSize: '12px'
            }
          },
          labels: {
            style: {
              colors: '#64748B',
              fontSize: '12px'
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Monto (M$)',
            style: {
              color: '#64748B',
              fontSize: '12px'
            }
          },
          labels: {
            style: {
              colors: '#64748B',
              fontSize: '12px'
            }
          }
        }
      ],
      colors: [this.colorPalette[4], this.colorPalette[2]],
      grid: {
        show: true,
        borderColor: '#E2E8F0',
        strokeDashArray: 3
      },
      legend: {
        show: true,
        position: 'top',
        labels: {
          colors: '#64748B'
        }
      },
      tooltip: {
        theme: 'light',
        shared: true,
        intersect: false
      }
    };
  }

  private createTiposRadarChart(): void {
    const tiposContratos = this.contratos.reduce((acc, contrato) => {
      const tipo = contrato.tipo_contrato?.nombre_tipo_contrato || 'Desconocido';
      if (!acc[tipo]) acc[tipo] = 0;
      acc[tipo]++;
      return acc;
    }, {} as { [key: string]: number });

    const tiposArray = Object.entries(tiposContratos);

    this.tiposContratosChartOptions = {
      series: [{
        name: 'Cantidad',
        data: tiposArray.map(([_, count]) => count)
      }],
      chart: {
        height: 320,
        type: 'radar',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      xaxis: {
        categories: tiposArray.map(([tipo, _]) => tipo.substring(0, 15) + (tipo.length > 15 ? '...' : ''))
      },
      colors: [this.colorPalette[1]],
      dataLabels: {
        enabled: true,
        style: {
          colors: [this.colorPalette[1]],
          fontSize: '11px'
        }
      },
      plotOptions: {
        radar: {
          size: 120,
          polygons: {
            strokeColors: '#E2E8F0',
            strokeWidth: '2',
            fill: {
              colors: ['#F0FDF4', '#DCFCE7']
            }
          }
        }
      },
      markers: {
        size: 5,
        colors: [this.colorPalette[1]],
        strokeColors: '#FFFFFF',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },

      fill: {
        opacity: 0.4
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val + ' contratos';
          }
        }
      }
    };
  }

  private createDepartamentosChart(): void {
    const departamentos = this.contratos.reduce((acc, contrato) => {
      const departamento = contrato.departamento?.nombre_departamento || 'Desconocido';
      if (!acc[departamento]) acc[departamento] = 0;
      acc[departamento]++;
      return acc;
    }, {} as { [key: string]: number });

    const departamentosArray = Object.entries(departamentos).sort((a, b) => b[1] - a[1]);

    this.departamentosChartOptions = {
      series: [{
        name: 'Contratos',
        data: departamentosArray.map(([_, count]) => count)
      }],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          barHeight: '70%',
          distributed: true
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'],
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      xaxis: {
        categories: departamentosArray.map(([dept, _]) => dept.substring(0, 20) + (dept.length > 20 ? '...' : '')),
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      colors: [this.colorPalette[0], this.colorPalette[2], this.colorPalette[4], this.colorPalette[1], this.colorPalette[5], this.colorPalette[3], this.colorPalette[6], this.colorPalette[7]],
      grid: {
        show: true,
        borderColor: '#E2E8F0',
        strokeDashArray: 3
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val + ' contratos';
          }
        }
      }
    };
  }

  private createDuracionHeatmapChart(): void {
    const calcularDuracion = (contrato: ExtendedContrato): number => {
      if (!contrato.fecha_firmado || !contrato.fecha_vencido) return 0;
      const inicio = new Date(contrato.fecha_firmado);
      const fin = new Date(contrato.fecha_vencido);
      return Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    };

    const duracionBuckets = this.contratos.reduce((acc, contrato) => {
      const duracion = calcularDuracion(contrato);
      let bucket = '';

      if (duracion <= 30) bucket = '0-30 días';
      else if (duracion <= 90) bucket = '31-90 días';
      else if (duracion <= 180) bucket = '91-180 días';
      else if (duracion <= 365) bucket = '181-365 días';
      else bucket = '> 365 días';

      if (!acc[bucket]) acc[bucket] = 0;
      acc[bucket]++;
      return acc;
    }, {} as { [key: string]: number });

    const bucketsArray = Object.entries(duracionBuckets);

    this.duracionBucketsChartOptions = {
      series: [{
        name: 'Contratos',
        data: bucketsArray.map(([_, count]) => count)
      }],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '65%',
          borderRadius: 8,
          distributed: true
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'],
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      xaxis: {
        categories: bucketsArray.map(([bucket, _]) => bucket),
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      colors: [this.colorPalette[1], this.colorPalette[4], this.colorPalette[0], this.colorPalette[2], this.colorPalette[3]],
      grid: {
        show: true,
        borderColor: '#E2E8F0',
        strokeDashArray: 3
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val + ' contratos';
          }
        }
      }
    };
  }

  // Función adicional para crear un gráfico de líneas con múltiples series
  private createTopVigenciaMenorChart(): void {
    const calcularDuracion = (contrato: ExtendedContrato): number => {
      if (!contrato.fecha_firmado || !contrato.fecha_vencido) return 0;
      const inicio = new Date(contrato.fecha_firmado);
      const fin = new Date(contrato.fecha_vencido);
      return Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30));
    };

    const sortedByVigencia = [...this.contratos].sort((a, b) => calcularDuracion(a) - calcularDuracion(b));
    const top8 = sortedByVigencia.slice(0, 8);

    this.topVigenciaMenorChartOptions = {
      series: [
        {
          name: 'Duración (Meses)',
          data: top8.map(calcularDuracion)
        },
        {
          name: 'Monto (M$)',
          data: top8.map(c => (c.monto_total || 0) / 1000000)
        }
      ],
      chart: {
        height: 320,
        type: 'line',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      stroke: {
        width: [4, 4],
        curve: 'smooth',
        dashArray: [0, 5]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: [6, 6],
        colors: ['#FFFFFF', '#FFFFFF'],
        strokeColors: ['#8B5CF6', '#06B6D4'],
        strokeWidth: 2,
        hover: {
          size: 8
        }
      },
      xaxis: {
        categories: top8.map(c => c.proveedor?.nombre?.substring(0, 10) + '...' || 'N/A'),
        labels: {
          style: {
            colors: '#64748B',
            fontSize: '12px'
          }
        }
      },
      yaxis: [
        {
          title: {
            text: 'Duración (Meses)',
            style: {
              color: '#64748B'
            }
          },
          labels: {
            style: {
              colors: '#64748B'
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Monto (M$)',
            style: {
              color: '#64748B'
            }
          },
          labels: {
            style: {
              colors: '#64748B'
            }
          }
        }
      ],
      colors: [this.colorPalette[1], this.colorPalette[5]],
      grid: {
        show: true,
        borderColor: '#E2E8F0',
        strokeDashArray: 3
      },
      legend: {
        show: true,
        position: 'top',
        labels: {
          colors: '#64748B'
        }
      },
      tooltip: {
        theme: 'light',
        shared: true,
        intersect: false
      }
    };
  }



}
