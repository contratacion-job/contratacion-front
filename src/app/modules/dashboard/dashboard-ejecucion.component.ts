import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { ContratoService } from '../contratos/services/contrato.service';

interface Contrato {
  no_contrato: number;
  valor_cup: number;
  valor_usd: number;
  monto_vencimiento_cup: number;
  monto_vencimiento_usd: number;
  monto_vencimiento_cl: number;
  monto_total: number;
  estado?: string;
  tipo_contrato: {
    nombre_tipo_contrato: string;
  };
  fecha_firmado: string;
  proveedor: {
    nombre: string;
  };
}

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

  contratos: Contrato[] = [];
  
  // Inicializar todas las opciones con valores por defecto
  totalEjecucionChartOptions: ApexOptions = this.getDefaultRadialOptions();
  ejecucionByTypeChartOptions: ApexOptions = this.getDefaultBarOptions();
  ejecucionByStatusChartOptions: ApexOptions = this.getDefaultPieOptions();
  ejecucionByMonthChartOptions: ApexOptions = this.getDefaultAreaOptions();
  contratosTopEjecucionesChartOptions: ApexOptions = this.getDefaultBarOptions();
  suplementosTopEjecucionesChartOptions: ApexOptions = this.getDefaultBarOptions();
  top10ProveedoresMayorMontoChartOptions: ApexOptions = this.getDefaultBarOptions();
  top10ProveedoresMenorMontoChartOptions: ApexOptions = this.getDefaultBarOptions();
  top10ProveedoresContratoSuplementoMayorMontoChartOptions: ApexOptions = this.getDefaultBarOptions();
  top10ProveedoresContratoSuplementoMenorMontoChartOptions: ApexOptions = this.getDefaultBarOptions();

  constructor(private contratoService: ContratoService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private loadDashboardData(): void {
    this.contratoService.getDashboardEjecucion()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos del servicio:', data);
          this.contratos = data.map(contrato => ({
            ...contrato,
            monto_total: (contrato.valor_cup || 0) + 
                        (contrato.valor_usd || 0) + 
                        (contrato.monto_vencimiento_cup || 0) + 
                        (contrato.monto_vencimiento_usd || 0) + 
                        (contrato.monto_vencimiento_cl || 0)
          }));

          this.initializeCharts();
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
        }
      });
  }

  private initializeCharts(): void {
    this.setupTotalEjecucionChart();
    this.setupEjecucionByTypeChart();
    this.setupEjecucionByStatusChart();
    this.setupEjecucionByMonthChart();
    this.setupContratosTopEjecucionesChart();
    this.setupSuplementosTopEjecucionesChart();
    this.setupTop10ProveedoresMayorMontoChart();
    this.setupTop10ProveedoresMenorMontoChart();
    this.setupTop10ProveedoresContratoSuplementoMayorMontoChart();
    this.setupTop10ProveedoresContratoSuplementoMenorMontoChart();
  }

  private getDefaultRadialOptions(): ApexOptions {
    return {
      chart: {
        type: 'radialBar',
        height: 300,
        sparkline: { enabled: false },
        background: 'transparent'
      },
      series: [0],
      labels: ['Cargando...'],
      plotOptions: {
        radialBar: {
          hollow: { size: '65%' },
          track: { background: '#f1f5f9', strokeWidth: '100%' },
          dataLabels: {
            name: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
            value: { fontSize: '24px', color: '#0f172a', fontWeight: '700' }
          }
        }
      },
      colors: ['#6366f1'],
      stroke: { lineCap: 'round' }
    };
  }

  private getDefaultBarOptions(): ApexOptions {
    return {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{ name: 'Datos', data: [] }],
      xaxis: { categories: [] },
      colors: ['#6366f1'],
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: false,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false }
    };
  }

  private getDefaultPieOptions(): ApexOptions {
    return {
      chart: {
        type: 'donut',
        height: 350,
        background: 'transparent'
      },
      series: [],
      labels: [],
      colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                fontSize: '14px',
                color: '#64748b'
              }
            }
          }
        }
      },
      legend: { show: false }
    };
  }

  private getDefaultAreaOptions(): ApexOptions {
    return {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{ name: 'Datos', data: [] }],
      xaxis: { categories: [] },
      colors: ['#6366f1'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      stroke: { curve: 'smooth', width: 3 },
      grid: { show: false }
    };
  }

  private setupTotalEjecucionChart(): void {
    const totalContratos = this.contratos.length;
    const contratosEjecutados = this.contratos.filter(c => c.estado === 'ejecutado').length;
    const porcentajeEjecucion = totalContratos > 0 ? Math.round((contratosEjecutados / totalContratos) * 100) : 0;

    this.totalEjecucionChartOptions = {
      chart: {
        type: 'radialBar',
        height: 280,
        sparkline: { enabled: false },
        background: 'transparent'
      },
      series: [porcentajeEjecucion],
      labels: ['Ejecución Total'],
      plotOptions: {
        radialBar: {
          hollow: { size: '65%' },
          track: { 
            background: '#f1f5f9', 
            strokeWidth: '100%',
            margin: 10
          },
          dataLabels: {
            name: {
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '500',
              offsetY: 10
            },
            value: {
              fontSize: '32px',
              color: '#0f172a',
              fontWeight: '700',
              offsetY: -10,
              formatter: (val: number) => `${val}%`
            }
          }
        }
      },
      colors: ['#6366f1'],
      stroke: { lineCap: 'round' }
    };
  }

  private setupEjecucionByTypeChart(): void {
    const tiposEjecucion = this.contratos.reduce((acc, contrato) => {
      acc[contrato.tipo_contrato.nombre_tipo_contrato] = (acc[contrato.tipo_contrato.nombre_tipo_contrato] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.ejecucionByTypeChartOptions = {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Contratos',
        data: Object.values(tiposEjecucion)
      }],
      xaxis: {
        categories: Object.keys(tiposEjecucion),
        labels: {
          style: { colors: '#64748b', fontSize: '12px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' }
        }
      },
      colors: ['#6366f1'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          columnWidth: '50%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupEjecucionByStatusChart(): void {
    const estadosEjecucion = this.contratos.reduce((acc, contrato) => {
      acc[contrato.estado] = (acc[contrato.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.ejecucionByStatusChartOptions = {
      chart: {
        type: 'donut',
        height: 350,
        background: 'transparent'
      },
      series: Object.values(estadosEjecucion),
      labels: Object.keys(estadosEjecucion),
      colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                fontSize: '16px',
                color: '#0f172a',
                fontWeight: '600',
                label: 'Total',
                formatter: () => this.contratos.length.toString()
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '12px', fontWeight: '600' }
      },
      legend: { show: false },
      stroke: { width: 0 },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupEjecucionByMonthChart(): void {
    const ejecucionPorMes = this.getEjecucionPorMes();

    this.ejecucionByMonthChartOptions = {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Monto Ejecutado',
        data: ejecucionPorMes.values
      }],
      xaxis: {
        categories: ejecucionPorMes.months,
        labels: {
          style: { colors: '#64748b', fontSize: '12px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' },
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      colors: ['#6366f1'],
      stroke: { curve: 'smooth', width: 3 },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupContratosTopEjecucionesChart(): void {
    const topContratos = this.contratos
      .sort((a, b) => b.monto_total - a.monto_total)
      .slice(0, 10);

    this.contratosTopEjecucionesChartOptions = {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Monto Total',
        data: topContratos.map(c => c.monto_total)
      }],
      xaxis: {
        categories: topContratos.map(c => c.no_contrato),
        labels: {
          rotate: -45,
          style: { colors: '#64748b', fontSize: '10px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' },
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      colors: ['#10b981'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupSuplementosTopEjecucionesChart(): void {
    const suplementos = this.contratos
      .filter(c => c.no_contrato.toString().toLowerCase().includes('sup'))
      .sort((a, b) => b.monto_total - a.monto_total)
      .slice(0, 10);

    this.suplementosTopEjecucionesChartOptions = {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Monto Total',
        data: suplementos.map(c => c.monto_total)
      }],
      xaxis: {
        categories: suplementos.map(c => c.no_contrato),
        labels: {
          rotate: -45,
          style: { colors: '#64748b', fontSize: '10px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' },
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      colors: ['#8b5cf6'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupTop10ProveedoresMayorMontoChart(): void {
    const proveedoresMontos = this.contratos.reduce((acc, contrato) => {
      const proveedor = contrato.proveedor?.nombre || 'Sin proveedor';
      acc[proveedor] = (acc[proveedor] || 0) + contrato.monto_total;
      return acc;
    }, {} as Record<string, number>);

    const topProveedores = Object.entries(proveedoresMontos)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    this.top10ProveedoresMayorMontoChartOptions = {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Monto Total',
        data: topProveedores.map(([,monto]) => monto)
      }],
      xaxis: {
        categories: topProveedores.map(([proveedor]) => proveedor),
        labels: {
          rotate: -45,
          style: { colors: '#64748b', fontSize: '10px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' },
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      colors: ['#f59e0b'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupTop10ProveedoresMenorMontoChart(): void {
    const proveedoresMontos = this.contratos.reduce((acc, contrato) => {
      const proveedor = contrato.proveedor?.nombre || 'Sin proveedor';
      acc[proveedor] = (acc[proveedor] || 0) + contrato.monto_total;
      return acc;
    }, {} as Record<string, number>);

    const bottomProveedores = Object.entries(proveedoresMontos)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 10);

    this.top10ProveedoresMenorMontoChartOptions = {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Monto Total',
        data: bottomProveedores.map(([,monto]) => monto)
      }],
      xaxis: {
        categories: bottomProveedores.map(([proveedor]) => proveedor),
        labels: {
          rotate: -45,
          style: { colors: '#64748b', fontSize: '10px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' },
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      colors: ['#ef4444'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupTop10ProveedoresContratoSuplementoMayorMontoChart(): void {
    const contratosConSuplemento = this.contratos.filter(c => 
      this.contratos.some(sup => sup.no_contrato.toString().includes(c.no_contrato.toString().split('-')[0]) && 
                                sup.no_contrato.toString().toLowerCase().includes('sup'))
    );

    const proveedoresConSuplemento = contratosConSuplemento.reduce((acc, contrato) => {
      const key = `${contrato.proveedor?.nombre || 'Sin proveedor'} - ${contrato.no_contrato}`;
      acc[key] = (acc[key] || 0) + contrato.monto_total;
      return acc;
    }, {} as Record<string, number>);

    const topProveedoresConSuplemento = Object.entries(proveedoresConSuplemento)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    this.top10ProveedoresContratoSuplementoMayorMontoChartOptions = {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Monto Total',
        data: topProveedoresConSuplemento.map(([,monto]) => monto)
      }],
      xaxis: {
        categories: topProveedoresConSuplemento.map(([proveedor]) => proveedor),
        labels: {
          rotate: -45,
          style: { colors: '#64748b', fontSize: '10px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' },
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      colors: ['#06b6d4'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private setupTop10ProveedoresContratoSuplementoMenorMontoChart(): void {
    const contratosConSuplemento = this.contratos.filter(c => 
      this.contratos.some(sup => sup.no_contrato.toString().includes(c.no_contrato.toString().split('-')[0]) && 
                                sup.no_contrato.toString().toLowerCase().includes('sup'))
    );

    const proveedoresConSuplemento = contratosConSuplemento.reduce((acc, contrato) => {
      const key = `${contrato.proveedor?.nombre || 'Sin proveedor'} - ${contrato.no_contrato}`;
      acc[key] = (acc[key] || 0) + contrato.monto_total;
      return acc;
    }, {} as Record<string, number>);

    const bottomProveedoresConSuplemento = Object.entries(proveedoresConSuplemento)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 10);

    this.top10ProveedoresContratoSuplementoMenorMontoChartOptions = {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        background: 'transparent'
      },
      series: [{
        name: 'Monto Total',
        data: bottomProveedoresConSuplemento.map(([,monto]) => monto)
      }],
      xaxis: {
        categories: bottomProveedoresConSuplemento.map(([proveedor]) => proveedor),
        labels: {
          rotate: -45,
          style: { colors: '#64748b', fontSize: '10px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#64748b', fontSize: '12px' },
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      colors: ['#f97316'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      grid: { show: false },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      }
    };
  }

  private getEjecucionPorMes(): { months: string[], values: number[] } {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ejecucionPorMes = new Array(12).fill(0);

    this.contratos.forEach(contrato => {
      if (contrato.fecha_firmado) {
        const fecha = new Date(contrato.fecha_firmado);
        const mes = fecha.getMonth();
        if (mes >= 0 && mes < 12) {
          ejecucionPorMes[mes] += contrato.monto_total;
        }
      }
    });

    return {
      months: meses,
      values: ejecucionPorMes
    };
  }
}