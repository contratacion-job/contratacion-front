import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockEjecucionContrato } from 'app/mock-api/contrato-fake/fake';
import { EjecucionContrato } from 'app/models/Type';

@Injectable({
  providedIn: 'root'
})
export class EjecucionService {
  constructor() {}

  getEjecuciones(): Observable<EjecucionContrato[]> {
    return of(mockEjecucionContrato);
  }

  getEjecucion(id: number): Observable<EjecucionContrato | undefined> {
    const ejecucion = mockEjecucionContrato.find(e => e.id === id);
    return of(ejecucion);
  }

  createEjecucion(ejecucion: EjecucionContrato): Observable<EjecucionContrato> {
    // Mock create: add to array (not persistent)
    mockEjecucionContrato.push(ejecucion);
    return of(ejecucion);
  }

  updateEjecucion(id: number, ejecucion: EjecucionContrato): Observable<EjecucionContrato | undefined> {
    const index = mockEjecucionContrato.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEjecucionContrato[index] = ejecucion;
      return of(ejecucion);
    }
    return of(undefined);
  }

  deleteEjecucion(id: number): Observable<void> {
    const index = mockEjecucionContrato.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEjecucionContrato.splice(index, 1);
    }
    return of();
  }
}
