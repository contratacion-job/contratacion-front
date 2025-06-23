import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Log } from 'app/models/Type';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent implements OnInit {
  logs: Log[] = [
    { id: 1, usuario: 'admin', fecha: new Date('2024-06-23T10:30:00'), tabla: 'contrato', accion: 'CREATE' },
    { id: 2, usuario: 'juan.perez', fecha: new Date('2024-06-23T10:25:00'), tabla: 'suplemento', accion: 'UPDATE' },
    { id: 3, usuario: 'maria.garcia', fecha: new Date('2024-06-23T10:20:00'), tabla: 'ejecucion de contrato', accion: 'DELETE' },
    { id: 4, usuario: 'admin', fecha: new Date('2024-06-23T10:15:00'), tabla: 'usuario', accion: 'READ' },
    { id: 5, usuario: 'carlos.lopez', fecha: new Date('2024-06-23T10:10:00'), tabla: 'ejecucion de suplemento', accion: 'UPDATE' },
    { id: 6, usuario: 'ana.martinez', fecha: new Date('2024-06-23T10:05:00'), tabla: 'proveedores', accion: 'CREATE' },
    { id: 7, usuario: 'pedro.rodriguez', fecha: new Date('2024-06-23T10:00:00'), tabla: 'representante', accion: 'READ' },
    { id: 8, usuario: 'lucia.fernandez', fecha: new Date('2024-06-23T09:55:00'), tabla: 'contrato', accion: 'CREATE' },
    { id: 9, usuario: 'miguel.torres', fecha: new Date('2024-06-23T09:50:00'), tabla: 'suplemento', accion: 'UPDATE' },
    { id: 10, usuario: 'sofia.ramirez', fecha: new Date('2024-06-23T09:45:00'), tabla: 'proveedores', accion: 'DELETE' },
    { id: 11, usuario: 'diego.vargas', fecha: new Date('2024-06-23T09:40:00'), tabla: 'ejecucion de contrato', accion: 'CREATE' },
    { id: 12, usuario: 'Carmen.ruiz', fecha: new Date('2024-06-23T09:35:00'), tabla: 'representante', accion: 'UPDATE' },
    { id: 13, usuario: 'fernando.lopez', fecha: new Date('2024-06-23T09:30:00'), tabla: 'ejecucion de suplemento', accion: 'READ' },
    { id: 14, usuario: 'patricia.mendez', fecha: new Date('2024-06-23T09:25:00'), tabla: 'usuario', accion: 'CREATE' },
    { id: 15, usuario: 'roberto.castro', fecha: new Date('2024-06-23T09:20:00'), tabla: 'contrato', accion: 'DELETE' }
  ];

  // Filtros
  searchTerm: string = '';
  filterUser: string = '';
  filterTable: string = '';
  filterAction: string = '';
  showFilters: boolean = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Datos calculados
  filteredLogs: Log[] = [];
  paginatedLogs: Log[] = [];
  uniqueUsers: string[] = [];
  uniqueTables: string[] = [];
  uniqueActions: string[] = [];
  totalPages: number = 0;

  ngOnInit(): void {
    this.calculateUniqueValues();
    this.applyFilters();
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

    this.totalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedLogs = this.filteredLogs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
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
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredLogs.length);
  }

  refresh(): void {
    // Implementar lógica de actualización
    console.log('Actualizando logs...');
  }

  export(): void {
    // Implementar lógica de exportación
    console.log('Exportando logs...');
  }
}