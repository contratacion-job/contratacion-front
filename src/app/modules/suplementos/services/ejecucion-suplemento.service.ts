import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EjecucionSuplemento } from 'app/models/Type';
import { mockEjecucionSuplemento } from 'app/mock-api/suplemento-fake/ejecucion-suplemento-mock';

@Injectable({
  providedIn: 'root'
})
export class EjecucionSuplementoService {
  private ejecuciones: EjecucionSuplemento[] = [];

  constructor() {
    // Initialize with mock data for testing
    this.ejecuciones = mockEjecucionSuplemento;
  }

  getExpiredEjecuciones(page: number, size: number): Observable<{ data: EjecucionSuplemento[]; total: number }> {
    // For demo, filter expired ejecuciones and paginate
    const expired = this.ejecuciones.filter(e => e.estado === 'Vencido');
    const start = page * size;
    const end = start + size;
    const data = expired.slice(start, end);
    const total = expired.length;
    return of({ data, total });
  }
}
