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
  monto_ejecutado?: number;
  cantidad_ejecuciones?: number;
  estado?: string;
  tipo_contrato: {
    nombre_tipo_contrato: string;
  };
  fecha_firmado: string;
  proveedor: {
    nombre: string;
  };
}

interface EjecucionData {
  proveedor: string;
  no_contrato: string;
  no_suplemento?: string;
  monto_ejecutado: number;
  cantidad_ejecuciones: number;
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

  // Gráficos principales
  totalEjecucionChartOptions: ApexOptions = this.getDefaultRadialOptions();
  ejecucionByTypeChartOptions: ApexOptions = this.getDefaultBarOptions();
  ejecucionByStatusChartOptions: ApexOptions = this.getDefaultPieOptions();
  ejecucionByMonthChartOptions: ApexOptions = this.getDefaultAreaOptions();

  // Gráficos de contratos y suplementos con mayor cantidad de ejecuciones
  contratosTopEjecucionesChartOptions: ApexOptions = this.getDefaultModernBarOptions();
  suplementosTopEjecucionesChartOptions: ApexOptions = this.getDefaultModernBarOptions();

  // Top 10 proveedores con contratos
  top10ProveedoresMayorMontoChartOptions: ApexOptions = this.getDefaultModernBarOptions();
  top10ProveedoresMenorMontoChartOptions: ApexOptions = this.getDefaultModernBarOptions();

  // Top 10 proveedores con contratos y suplementos
  top10ProveedoresContratoSuplementoMayorMontoChartOptions: ApexOptions = this.getDefaultModernBarOptions();
  top10ProveedoresContratoSuplementoMenorMontoChartOptions: ApexOptions = this.getDefaultModernBarOptions();

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
                        (contrato.monto_vencimiento_cl || 0),
            monto_ejecutado: contrato.monto_ejecutado || Math.random() * 100000, // Simular datos
            cantidad_ejecuciones: contrato.cantidad_ejecuciones || Math.floor(Math.random() * 10) + 1 // Simular datos
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

  private getDefaultModernBarOptions(): ApexOptions {
    return {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          }
        }
      },
      series: [{ name: 'Datos', data: [] }],
      xaxis: {
        categories: [],
        labels: {
          rotate: -45,
          style: {
            colors: '#64748b',
            fontSize: '11px',
            fontWeight: '500'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '12px',
            fontWeight: '500'
          }
        }
      },
      colors: ['#6366f1'],
      plotOptions: {
        bar: {
          borderRadius: 12,
          columnWidth: '65%',
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '11px',
          fontWeight: '600',
          colors: ['#ffffff']
        }
      },
      grid: {
        show: true,
        borderColor: '#f1f5f9',
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      }
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

  // Gráfico de contratos con mayor cantidad de ejecuciones
  private setupContratosTopEjecucionesChart(): void {
    const contratosRegulares = this.contratos
      .filter(c => !c.no_contrato.toString().toLowerCase().includes('sup'))
      .sort((a, b) => (b.cantidad_ejecuciones || 0) - (a.cantidad_ejecuciones || 0))
      .slice(0, 10);

    this.contratosTopEjecucionesChartOptions = {
      ...this.getDefaultModernBarOptions(),
      series: [{
        name: 'Cantidad de Ejecuciones',
        data: contratosRegulares.map(c => c.cantidad_ejecuciones || 0)
      }],
      xaxis: {
        ...this.getDefaultModernBarOptions().xaxis,
        categories: contratosRegulares.map(c => `${c.no_contrato}`)
      },
      colors: ['#10b981'],
      title: {
        text: 'Top 10 Contratos con Mayor Cantidad de Ejecuciones',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a'
        }
      },
      tooltip: {
        ...this.getDefaultModernBarOptions().tooltip,
        y: {
          formatter: (value: number) => `${value} ejecuciones`
        }
      }
    };
  }

  // Gráfico de suplementos con mayor cantidad de ejecuciones
  private setupSuplementosTopEjecucionesChart(): void {
    const suplementos = this.contratos
      .filter(c => c.no_contrato.toString().toLowerCase().includes('sup'))
      .sort((a, b) => (b.cantidad_ejecuciones || 0) - (a.cantidad_ejecuciones || 0))
      .slice(0, 10);

    this.suplementosTopEjecucionesChartOptions = {
      ...this.getDefaultModernBarOptions(),
      series: [{
        name: 'Cantidad de Ejecuciones',
        data: suplementos.map(c => c.cantidad_ejecuciones || 0)
      }],
      xaxis: {
        ...this.getDefaultModernBarOptions().xaxis,
        categories: suplementos.map(c => `${c.no_contrato}`)
      },
      colors: ['#8b5cf6'],
      title: {
        text: 'Top 10 Suplementos con Mayor Cantidad de Ejecuciones',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a'
        }
      },
      tooltip: {
        ...this.getDefaultModernBarOptions().tooltip,
        y: {
          formatter: (value: number) => `${value} ejecuciones`
        }
      }
    };
  }

  // Top 10 proveedores con mayor monto ejecutado
  private setupTop10ProveedoresMayorMontoChart(): void {
    const proveedoresData = this.getProveedoresData();
    const topProveedores = proveedoresData
      .sort((a, b) => b.monto_ejecutado - a.monto_ejecutado)
      .slice(0, 10);

    this.top10ProveedoresMayorMontoChartOptions = {
      ...this.getDefaultModernBarOptions(),
      series: [{
        name: 'Monto Ejecutado',
        data: topProveedores.map(p => p.monto_ejecutado)
      }],
      xaxis: {
        ...this.getDefaultModernBarOptions().xaxis,
        categories: topProveedores.map(p => `${p.proveedor} - ${p.no_contrato}`)
      },
      colors: ['#f59e0b'],
      title: {
        text: 'Top 10 Proveedores con Mayor Monto Ejecutado',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a'
        }
      }
    };
  }

  // Top 10 proveedores con menor monto ejecutado
  private setupTop10ProveedoresMenorMontoChart(): void {
    const proveedoresData = this.getProveedoresData();
    const bottomProveedores = proveedoresData
      .sort((a, b) => a.monto_ejecutado - b.monto_ejecutado)
      .slice(0, 10);

    this.top10ProveedoresMenorMontoChartOptions = {
      ...this.getDefaultModernBarOptions(),
      series: [{
        name: 'Monto Ejecutado',
        data: bottomProveedores.map(p => p.monto_ejecutado)
      }],
      xaxis: {
        ...this.getDefaultModernBarOptions().xaxis,
        categories: bottomProveedores.map(p => `${p.proveedor} - ${p.no_contrato}`)
      },
      colors: ['#ef4444'],
      title: {
        text: 'Top 10 Proveedores con Menor Monto Ejecutado',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a'
        }
      }
    };
  }

  // Top 10 proveedores con contrato y suplemento - mayor monto
  private setupTop10ProveedoresContratoSuplementoMayorMontoChart(): void {
    const proveedoresConSuplemento = this.getProveedoresConSuplemento();
    const topProveedoresConSuplemento = proveedoresConSuplemento
      .sort((a, b) => b.monto_ejecutado - a.monto_ejecutado)
      .slice(0, 10);

    this.top10ProveedoresContratoSuplementoMayorMontoChartOptions = {
      ...this.getDefaultModernBarOptions(),
      series: [{
        name: 'Monto Ejecutado',
        data: topProveedoresConSuplemento.map(p => p.monto_ejecutado)
      }],
      xaxis: {
        ...this.getDefaultModernBarOptions().xaxis,
        categories: topProveedoresConSuplemento.map(p =>
          `${p.proveedor} - ${p.no_contrato}${p.no_suplemento ? ' / ' + p.no_suplemento : ''}`
        )
      },
      colors: ['#06b6d4'],
      title: {
        text: 'Top 10 Proveedores (Contrato + Suplemento) Mayor Monto',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a'
        }
      }
    };
  }

  // Top 10 proveedores con contrato y suplemento - menor monto
  private setupTop10ProveedoresContratoSuplementoMenorMontoChart(): void {
    const proveedoresConSuplemento = this.getProveedoresConSuplemento();
    const bottomProveedoresConSuplemento = proveedoresConSuplemento
      .sort((a, b) => a.monto_ejecutado - b.monto_ejecutado)
      .slice(0, 10);

    this.top10ProveedoresContratoSuplementoMenorMontoChartOptions = {
      ...this.getDefaultModernBarOptions(),
      series: [{
        name: 'Monto Ejecutado',
        data: bottomProveedoresConSuplemento.map(p => p.monto_ejecutado)
      }],
      xaxis: {
        ...this.getDefaultModernBarOptions().xaxis,
        categories: bottomProveedoresConSuplemento.map(p =>
          `${p.proveedor} - ${p.no_contrato}${p.no_suplemento ? ' / ' + p.no_suplemento : ''}`
        )
      },
      colors: ['#f97316'],
      title: {
        text: 'Top 10 Proveedores (Contrato + Suplemento) Menor Monto',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a'
        }
      }
    };
  }

  // Helper para obtener datos de proveedores
  private getProveedoresData(): EjecucionData[] {
    return this.contratos.map(contrato => ({
      proveedor: contrato.proveedor?.nombre || 'Sin proveedor',
      no_contrato: contrato.no_contrato.toString(),
      monto_ejecutado: contrato.monto_ejecutado || 0,
      cantidad_ejecuciones: contrato.cantidad_ejecuciones || 0
    }));
  }

  // Helper para obtener proveedores con suplementos
  private getProveedoresConSuplemento(): EjecucionData[] {
    const proveedoresMap = new Map<string, EjecucionData>();

    this.contratos.forEach(contrato => {
      const baseContrato = contrato.no_contrato.toString().split('-')[0];
      const proveedor = contrato.proveedor?.nombre || 'Sin proveedor';
      const key = `${proveedor}-${baseContrato}`;

      if (!proveedoresMap.has(key)) {
        proveedoresMap.set(key, {
          proveedor,
          no_contrato: baseContrato,
          monto_ejecutado: 0,
          cantidad_ejecuciones: 0
        });
      }

      const data = proveedoresMap.get(key)!;
      data.monto_ejecutado += contrato.monto_ejecutado || 0;
      data.cantidad_ejecuciones += contrato.cantidad_ejecuciones || 0;

      // Si es un suplemento, agregarlo
      if (contrato.no_contrato.toString().toLowerCase().includes('sup')) {
        data.no_suplemento = contrato.no_contrato.toString();
      }
    });

    return Array.from(proveedoresMap.values())
      .filter(data => data.no_suplemento); // Solo los que tienen suplementos
  }

  private getEjecucionPorMes(): { months: string[], values: number[] } {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ejecucionPorMes = new Array(12).fill(0);

    this.contratos.forEach(contrato => {
      if (contrato.fecha_firmado) {
        const fecha = new Date(contrato.fecha_firmado);
        const mes = fecha.getMonth();
        if (mes >= 0 && mes < 12) {
          ejecucionPorMes[mes] += contrato.monto_ejecutado || 0;
        }
      }
    });

    return {
      months: meses,
      values: ejecucionPorMes
    };
  }
}
