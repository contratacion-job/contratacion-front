import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Log } from 'app/models/Type';
import { SystemService } from './system.service';
import { saveAs } from 'file-saver';
interface ApiLog {
  id: number;
  action: string;
  createdAt: string;
  description: string;
  details: string;
  timestamp: string;
  updatedAt: string;
  user_id: number;
}

interface ApiResponse {
  message: string;
  data: ApiLog[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent implements OnInit {
  logs: Log[] = [];
  loading: boolean = true;
  error: string = '';

  // Paginación del servidor
  serverPagination = {
    total: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 50
  };

  // Filtros
  searchTerm: string = '';
  filterUser: string = '';
  filterTable: string = '';
  filterAction: string = '';
  showFilters: boolean = false;

  // Paginación local (para los datos filtrados)
  localCurrentPage: number = 1;
  itemsPerPage: number = 10;

  // Datos calculados
  filteredLogs: Log[] = [];
  paginatedLogs: Log[] = [];
  uniqueUsers: string[] = [];
  uniqueTables: string[] = [];
  uniqueActions: string[] = [];
  localTotalPages: number = 0;

  constructor(
    private logService: SystemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(page: number = 1): void {
    this.loading = true;
    this.error = '';

    this.logService.getLogs().subscribe({
      next: (response: any) => {
        console.log('Respuesta completa:', response);

        if (response && response.data && Array.isArray(response.data)) {
          const apiResponse = response as ApiResponse;

          // Actualizar información de paginación del servidor
          this.serverPagination = {
            total: apiResponse.pagination.total,
            currentPage: apiResponse.pagination.page,
            totalPages: apiResponse.pagination.pages,
            limit: apiResponse.pagination.limit
          };

          // Transformar los datos
          this.logs = this.transformApiData(apiResponse.data);
          this.calculateUniqueValues();
          this.applyFilters();
        } else {
          console.error('Estructura de datos inesperada:', response);
          this.error = 'Estructura de datos inesperada del servidor';
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar logs:', error);
        this.error = 'Error al cargar los logs del sistema';
        this.loading = false;
      }
    });
  }

  transformApiData(apiData: ApiLog[]): Log[] {
    return apiData.map(item => {
      let tabla = this.extractTableFromDetails(item.details);
      if (!tabla) {
        tabla = this.extractTableFromDescription(item.description);
      }

      return {
        id: item.id,
        usuario: `ID: ${item.user_id}`, // Por ahora mostramos el ID, después se cambiará por el nombre
        fecha: new Date(item.createdAt),
        tabla: tabla,
        accion: this.mapActionToSpanish(item.action)
      };
    });
  }

  extractTableFromDetails(details: string): string {
    try {
      const parsedDetails = JSON.parse(details);
      if (parsedDetails.tipo) {
        return parsedDetails.tipo;
      }
    } catch (e) {
      console.warn('No se pudo parsear details:', details);
    }
    return '';
  }

  extractTableFromDescription(description: string): string {
    // Extraer información de la tabla desde la descripción
    if (description.includes('Catalogo')) {
      return 'catalogo';
    }
    if (description.includes('ministerios')) {
      return 'ministerios';
    }
    if (description.includes('municipios')) {
      return 'municipios';
    }
    // Agregar más casos según sea necesario
    return 'sistema';
  }

  mapActionToSpanish(action: string): string {
    const actionMap: { [key: string]: string } = {
      'consultar': 'READ',
      'crear': 'CREATE',
      'actualizar': 'UPDATE',
      'eliminar': 'DELETE'
    };
    return actionMap[action] || action.toUpperCase();
  }

  calculateUniqueValues(): void {
    this.uniqueUsers = [...new Set(this.logs.map(log => log.usuario))];
    this.uniqueTables = [...new Set(this.logs.map(log => log.tabla))];
    this.uniqueActions = [...new Set(this.logs.map(log => log.accion))];
  }

  applyFilters(): void {
    this.filteredLogs = this.logs.filter(log => {
      const matchesSearch = this.searchTerm === '' ||
        log.usuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.tabla.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.accion.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesUser = this.filterUser === '' || log.usuario === this.filterUser;
      const matchesTable = this.filterTable === '' || log.tabla === this.filterTable;
      const matchesAction = this.filterAction === '' || log.accion === this.filterAction;

      return matchesSearch && matchesUser && matchesTable && matchesAction;
    });

    this.localTotalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    this.localCurrentPage = Math.min(this.localCurrentPage, Math.max(1, this.localTotalPages));
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.localCurrentPage - 1) * this.itemsPerPage;
    this.paginatedLogs = this.filteredLogs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSearchChange(): void {
    this.localCurrentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.localCurrentPage = 1;
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterUser = '';
    this.filterTable = '';
    this.filterAction = '';
    this.localCurrentPage = 1;
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.localTotalPages) {
      this.localCurrentPage = page;
      this.updatePagination();
    }
  }

  // Métodos para paginación del servidor (si quieres implementarla después)
  changeServerPage(page: number): void {
    if (page >= 1 && page <= this.serverPagination.totalPages) {
      this.loadLogs(page);
    }
  }

  getActionClass(action: string): string {
    switch (action) {
      case 'CREATE': return 'action-create';
      case 'READ': return 'action-read';
      case 'UPDATE': return 'action-update';
      case 'DELETE': return 'action-delete';
      default: return 'action-default';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.localTotalPages }, (_, i) => i + 1);
  }

  getStartIndex(): number {
    return (this.localCurrentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.localCurrentPage * this.itemsPerPage, this.filteredLogs.length);
  }

  refresh(): void {
    this.loadLogs(this.serverPagination.currentPage);
  }

exportToExcel() {
    this.loading = true;
    this.logService.exportToExcel().subscribe({
      next: (blob) => {
        saveAs(blob, 'logs.xlsx');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  exportToPDF() {
    this.loading = true;
    this.logService.exportToPDF().subscribe({
      next: (blob) => {
        saveAs(blob, 'logs.pdf');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteLogs() {
    this.loading = true;
    this.logService.logsdelete().subscribe({
      next: () => {
        this.loading = false;
        // Optionally, refresh logs or update UI
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
