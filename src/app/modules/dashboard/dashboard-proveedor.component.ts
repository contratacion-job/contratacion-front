import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { ProveedorService } from '../proveedores/services/proveedor.service';
import { Proveedor } from '../proveedores/services/proveedor.service';

@Component({
  selector: 'app-dashboard-proveedor',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatCardModule],
  templateUrl: './dashboard-proveedor.component.html',
  styleUrls: ['./dashboard-proveedor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardProveedorComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private proveedores: Proveedor[] = [];

  totalProveedoresChartOptions: ApexOptions;
  proveedoresByTypeChartOptions: ApexOptions;
  proveedoresByStatusChartOptions: ApexOptions;
  proveedoresByMonthChartOptions: ApexOptions;

  proveedoresByTipoEmpresaChartOptions: ApexOptions;
  proveedoresByMinisterioChartOptions: ApexOptions;
  proveedoresByProvinciaChartOptions: ApexOptions;
  proveedoresByMunicipioChartOptions: ApexOptions;

  constructor(
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializar las opciones de los gráficos con valores por defecto
    this.totalProveedoresChartOptions = {
      chart: {
        type: 'radialBar',
        height: 250,
      },
      series: [0],
      labels: ['Proveedores'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
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
        data: []
      }],
      xaxis: {
        categories: []
      }
    };

    this.proveedoresByStatusChartOptions = {
      chart: {
        type: 'donut',
        height: 200,
      },
      series: [0],
      labels: ['Sin datos']
    };

    this.proveedoresByMonthChartOptions = {
      chart: {
        type: 'line',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: []
      }],
      xaxis: {
        categories: []
      }
    };

    this.proveedoresByTipoEmpresaChartOptions = {
      chart: {
        type: 'pie',
        height: 200,
      },
      series: [0],
      labels: ['Sin datos']
    };

    this.proveedoresByMinisterioChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: []
      }],
      xaxis: {
        categories: []
      }
    };

    this.proveedoresByProvinciaChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: []
      }],
      xaxis: {
        categories: []
      }
    };

    this.proveedoresByMunicipioChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: []
      }],
      xaxis: {
        categories: []
      }
    };
  }

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.proveedorService.getProveedores()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (proveedores) => {
          this.proveedores = proveedores;
          this.updateCharts();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading proveedores:', error);
        }
      });
  }

  updateCharts(): void {
    // Total de proveedores
    this.totalProveedoresChartOptions = {
      chart: {
        type: 'radialBar',
        height: 250,
      },
      series: [this.proveedores.length],
      labels: ['Proveedores'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          }
        }
      }
    };

    // Agrupar por ministerio
    const ministerioGroups = this.groupByKey('ministerio', 'nombre_ministerio');
    this.proveedoresByMinisterioChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: Object.values(ministerioGroups.counts)
      }],
      xaxis: {
        categories: Object.keys(ministerioGroups.counts)
      }
    };

    // Agrupar por municipio
    const municipioGroups = this.groupByKey('municipio', 'nombre_municipio');
    this.proveedoresByMunicipioChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: Object.values(municipioGroups.counts)
      }],
      xaxis: {
        categories: Object.keys(municipioGroups.counts)
      }
    };

    // Proveedores por mes (usando la fecha de creación si existe)
    const monthlyData = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    this.proveedores.forEach(proveedor => {
      if (proveedor.fechaCreacion) {
        const date = new Date(proveedor.fechaCreacion);
        if (date.getFullYear() === currentYear) {
          monthlyData[date.getMonth()]++;
        }
      }
    });

    this.proveedoresByMonthChartOptions = {
      chart: {
        type: 'area',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: monthlyData
      }],
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      }
    };

    // Agrupar por tipo
    const tipoGroups = this.groupByKey('tipo');
    this.proveedoresByTypeChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: Object.values(tipoGroups.counts)
      }],
      xaxis: {
        categories: Object.keys(tipoGroups.counts)
      }
    };

    // Agrupar por estado
    const estadoGroups = this.groupByKey('estado');
    this.proveedoresByStatusChartOptions = {
      chart: {
        type: 'donut',
        height: 200,
      },
      series: Object.values(estadoGroups.counts),
      labels: Object.keys(estadoGroups.counts)
    };

    // Agrupar por tipo de empresa
    const tipoEmpresaGroups = this.groupByKey('tipo_empresa');
    this.proveedoresByTipoEmpresaChartOptions = {
      chart: {
        type: 'pie',
        height: 200,
      },
      series: Object.values(tipoEmpresaGroups.counts),
      labels: Object.keys(tipoEmpresaGroups.counts)
    };

    // Agrupar por provincia
    const provinciaGroups = this.groupByKey('provincia', 'nombre_provincia');
    this.proveedoresByProvinciaChartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      series: [{
        name: 'Proveedores',
        data: Object.values(provinciaGroups.counts)
      }],
      xaxis: {
        categories: Object.keys(provinciaGroups.counts)
      }
    };
  }

  private groupByKey(key: string, nestedKey?: string): { counts: { [key: string]: number }, total: number } {
    const counts: { [key: string]: number } = {};
    let total = 0;

    this.proveedores.forEach(proveedor => {
      let value = proveedor[key];
      if (nestedKey && value) {
        value = value[nestedKey];
      }
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
        total++;
      }
    });

    return { counts, total };
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
