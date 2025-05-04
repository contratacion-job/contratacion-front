import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockEjecucionContrato } from 'app/mock-api/contrato-fake/fake';

import { Proveedor, Contrato } from 'app/models/Type';

export interface Ejecucion {
  id: number;
  proveedor: Proveedor;
  contrato: Contrato;
  costo_cup: number;
  costo_cl: number;
  trabajo_ejecutado: string;
  fecha_ejecucion: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class EjecucionService {
  constructor() {}

  getEjecuciones(): Observable<Ejecucion[]> {
    return of(mockEjecucionContrato);
  }

  getEjecucion(id: number): Observable<Ejecucion | undefined> {
    const ejecucion = mockEjecucionContrato.find(e => e.id === id);
    return of(ejecucion);
  }

  createEjecucion(ejecucion: Ejecucion): Observable<Ejecucion> {
    // Mock create: add to array (not persistent)
    mockEjecucionContrato.push(ejecucion);
    return of(ejecucion);
  }

  updateEjecucion(id: number, ejecucion: Ejecucion): Observable<Ejecucion | undefined> {
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
