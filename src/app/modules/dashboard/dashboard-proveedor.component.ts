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
import { Proveedor } from 'app/models/Type';
import { ProveedorService } from '../proveedores/services/proveedor.service';
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

@Component({
  selector: 'app-proveedor-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './dashboard-proveedor.component.html',
  styleUrls: ['./dashboard-proveedor.component.scss']
})
export class DashboardProveedorComponent implements OnInit {
  proveedores: Proveedor[] = [];
  isLoading = true;
  chartsInitialized = false;

  @ViewChild('totalProveedoresChart') totalProveedoresChart!: ChartComponent;
  @ViewChild('proveedoresByTypeChart') proveedoresByTypeChart!: ChartComponent;
  @ViewChild('proveedoresByStatusChart') proveedoresByStatusChart!: ChartComponent;
  @ViewChild('proveedoresByTipoEmpresaChart') proveedoresByTipoEmpresaChart!: ChartComponent;
  @ViewChild('proveedoresByMinisterioChart') proveedoresByMinisterioChart!: ChartComponent;
  @ViewChild('proveedoresByProvinciaChart') proveedoresByProvinciaChart!: ChartComponent;
  @ViewChild('proveedoresByMunicipioChart') proveedoresByMunicipioChart!: ChartComponent;
  @ViewChild('proveedoresByMonthChart') proveedoresByMonthChart!: ChartComponent;

  public totalProveedoresChartOptions: Partial<ChartOptions> = {};
  public proveedoresByTypeChartOptions: Partial<ChartOptions> = {};
  public proveedoresByStatusChartOptions: Partial<ChartOptions> = {};
  public proveedoresByTipoEmpresaChartOptions: Partial<ChartOptions> = {};
  public proveedoresByMinisterioChartOptions: Partial<ChartOptions> = {};
  public proveedoresByProvinciaChartOptions: Partial<ChartOptions> = {};
  public proveedoresByMunicipioChartOptions: Partial<ChartOptions> = {};
  public proveedoresByMonthChartOptions: Partial<ChartOptions> = {};

  private colorPalette = [
    '#90A4AE', '#B0BEC5', '#CFD8DC', '#E1E8ED',
    '#2196F3', '#64B5F6', '#BBDEFB', '#ECEFF1'
  ];

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.proveedorService.getDashboardproveedor().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servicio proveedor:', data);
        this.proveedores = data;
        this.updateCharts();
        this.isLoading = false;
        this.chartsInitialized = true;
      },
      error: (error) => {
        console.error('Error fetching dashboard proveedores:', error);
        this.isLoading = false;
        this.initializeEmptyCharts();
      }
    });
  }

  private initializeCharts(): void {
    this.initializeTotalProveedoresChart();
    this.initializeProveedoresByTypeChart();
    this.initializeProveedoresByStatusChart();
    this.initializeProveedoresByTipoEmpresaChart();
    this.initializeProveedoresByMinisterioChart();
    this.initializeProveedoresByProvinciaChart();
    this.initializeProveedoresByMunicipioChart();
    this.initializeProveedoresByMonthChart();
  }

  private initializeEmptyCharts(): void {
    this.chartsInitialized = true;
  }

  private updateCharts(): void {
    this.updateTotalProveedoresChart();
    this.updateProveedoresByTypeChart();
    this.updateProveedoresByStatusChart();
    this.updateProveedoresByTipoEmpresaChart();
    this.updateProveedoresByMinisterioChart();
    this.updateProveedoresByProvinciaChart();
    this.updateProveedoresByMunicipioChart();
    this.updateProveedoresByMonthChart();
  }

  private initializeTotalProveedoresChart(): void {
    this.totalProveedoresChartOptions = {
      series: [0],
      chart: {
        type: 'radialBar',
        height: 320,
        toolbar: { show: false }
      },
      labels: ['Total Proveedores'],
      colors: [this.colorPalette[5]],
      plotOptions: {
        radialBar: {
          hollow: { size: '70%' },
          dataLabels: {
            name: { fontSize: '18px', color: '#64748B', fontWeight: 'bold' },
            value: { fontSize: '28px', color: '#1E293B', fontWeight: 'bold' }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [this.colorPalette[4]],
          opacityFrom: 0.9,
          opacityTo: 0.7,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round'
      },
      tooltip: {
        enabled: true,
        theme: 'dark'
      }
    };
  }
  
  private initializeProveedoresByTypeChart(): void {
    this.proveedoresByTypeChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      xaxis: { categories: [], labels: { style: { colors: '#64748B', fontSize: '12px' } } },
      colors: [this.colorPalette[1]],
      plotOptions: { bar: { horizontal: false, columnWidth: '70%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' }
    };
  }

  private updateTotalProveedoresChart(): void {
    const total = this.proveedores.length;
    this.totalProveedoresChartOptions = {
      ...this.totalProveedoresChartOptions,
      series: [total]
    };
    console.log('Opciones totalProveedoresChart:', this.totalProveedoresChartOptions);
  }

  private updateProveedoresByTypeChart(): void {
    const counts = this.countByProperty('tipo', 'nombre_tipo', this.proveedores);
    this.proveedoresByTypeChartOptions = {
      ...this.proveedoresByTypeChartOptions,
      series: [{ name: 'Cantidad', data: counts.values }],
      xaxis: { categories: counts.keys }
    };
    console.log('Opciones proveedoresByTypeChart:', this.proveedoresByTypeChartOptions);
  }

  private initializeProveedoresByStatusChart(): void {
    this.proveedoresByStatusChartOptions = {
      series: [],
      chart: {
        type: 'pie',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      labels: [],
      colors: this.colorPalette,
      dataLabels: { enabled: true },
      tooltip: { theme: 'light' },
      legend: { position: 'bottom', fontSize: '12px', labels: { colors: '#64748B' } }
    };
  }

  private updateProveedoresByStatusChart(): void {
    const counts = this.countByProperty('estado', 'nombre_estado', this.proveedores);
    this.proveedoresByStatusChartOptions = {
      ...this.proveedoresByStatusChartOptions,
      series: counts.values,
      labels: counts.keys
    };
    console.log('Opciones proveedoresByStatusChart:', this.proveedoresByStatusChartOptions);
  }

  private initializeProveedoresByTipoEmpresaChart(): void {
    this.proveedoresByTipoEmpresaChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      xaxis: { categories: [] },
      colors: [this.colorPalette[2]],
      plotOptions: { bar: { horizontal: false, columnWidth: '70%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' }
    };
  }

  private updateProveedoresByTipoEmpresaChart(): void {
    const counts = this.countByProperty('tipo_empresa', 'nombre_tipo_empresa', this.proveedores);
    this.proveedoresByTipoEmpresaChartOptions = {
      ...this.proveedoresByTipoEmpresaChartOptions,
      series: [{ name: 'Cantidad', data: counts.values }],
      xaxis: { categories: counts.keys }
    };
    console.log('Opciones proveedoresByTipoEmpresaChart:', this.proveedoresByTipoEmpresaChartOptions);
  }

  private initializeProveedoresByMinisterioChart(): void {
    this.proveedoresByMinisterioChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      xaxis: { categories: [] },
      colors: [this.colorPalette[3]],
      plotOptions: { bar: { horizontal: false, columnWidth: '70%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' }
    };
  }

  private updateProveedoresByMinisterioChart(): void {
    const counts = this.countByProperty('ministerio', 'nombre_ministerio', this.proveedores);
    this.proveedoresByMinisterioChartOptions = {
      ...this.proveedoresByMinisterioChartOptions,
      series: [{ name: 'Cantidad', data: counts.values }],
      xaxis: { categories: counts.keys }
    };
    console.log('Opciones proveedoresByMinisterioChart:', this.proveedoresByMinisterioChartOptions);
  }

  private initializeProveedoresByProvinciaChart(): void {
    this.proveedoresByProvinciaChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      xaxis: { categories: [] },
      colors: [this.colorPalette[4]],
      plotOptions: { bar: { horizontal: false, columnWidth: '70%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' }
    };
  }

  private updateProveedoresByProvinciaChart(): void {
    const counts = this.countByProperty('provincia', 'nombre_provincia', this.proveedores);
    this.proveedoresByProvinciaChartOptions = {
      ...this.proveedoresByProvinciaChartOptions,
      series: [{ name: 'Cantidad', data: counts.values }],
      xaxis: { categories: counts.keys }
    };
    console.log('Opciones proveedoresByProvinciaChart:', this.proveedoresByProvinciaChartOptions);
  }

  private initializeProveedoresByMunicipioChart(): void {
    this.proveedoresByMunicipioChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      xaxis: { categories: [] },
      colors: [this.colorPalette[5]],
      plotOptions: { bar: { horizontal: false, columnWidth: '70%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' }
    };
  }

  private updateProveedoresByMunicipioChart(): void {
    const counts = this.countByProperty('municipio', 'nombre_municipio', this.proveedores);
    this.proveedoresByMunicipioChartOptions = {
      ...this.proveedoresByMunicipioChartOptions,
      series: [{ name: 'Cantidad', data: counts.values }],
      xaxis: { categories: counts.keys }
    };
    console.log('Opciones proveedoresByMunicipioChart:', this.proveedoresByMunicipioChartOptions);
  }

  private initializeProveedoresByMonthChart(): void {
    this.proveedoresByMonthChartOptions = {
      series: [],
      chart: {
        type: 'line',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      xaxis: { categories: [] },
      colors: [this.colorPalette[6]],
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' }
    };
  }

  private updateProveedoresByMonthChart(): void {
    const counts = this.countByMonth(this.proveedores);
    this.proveedoresByMonthChartOptions = {
      ...this.proveedoresByMonthChartOptions,
      series: [{ name: 'Cantidad', data: counts.values }],
      xaxis: { categories: counts.keys }
    };
    console.log('Opciones proveedoresByMonthChart:', this.proveedoresByMonthChartOptions);
  }

  private countByProperty(property: string, subProperty: string, items: any[]): { keys: string[], values: number[] } {
    const counts: { [key: string]: number } = {};
    items.forEach(item => {
      const key = item[property]?.[subProperty] || 'Desconocido';
      counts[key] = (counts[key] || 0) + 1;
    });
    return { keys: Object.keys(counts), values: Object.values(counts) };
  }

  private countByMonth(items: any[]): { keys: string[], values: number[] } {
    const counts: { [key: string]: number } = {};
    items.forEach(item => {
      const fecha = new Date(item.fecha_registro);
      const key = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
      counts[key] = (counts[key] || 0) + 1;
    });
    return { keys: Object.keys(counts), values: Object.values(counts) };
  }
}
