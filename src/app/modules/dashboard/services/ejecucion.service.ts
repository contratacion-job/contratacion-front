import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EjecucionContrato } from '../../../models/Type';
import { mockEjecucionContrato } from '../../../mock-api/contrato-fake/fake';

@Injectable({
  providedIn: 'root'
})
export class EjecucionService {

  constructor() { }

  getEjecuciones(): Observable<EjecucionContrato[]> {
    return of(mockEjecucionContrato as EjecucionContrato[]);
  }

  getEjecucionById(id: number): Observable<EjecucionContrato | undefined> {
    const ejecucion = mockEjecucionContrato.find(e => e.id === id);
    return of(ejecucion as EjecucionContrato | undefined);
  }

  addEjecucion(ejecucion: EjecucionContrato): Observable<EjecucionContrato> {
    (mockEjecucionContrato as any[]).push(ejecucion as any);
    return of(ejecucion);
  }

  updateEjecucion(ejecucion: EjecucionContrato): Observable<EjecucionContrato> {
    const index = mockEjecucionContrato.findIndex(e => e.id === ejecucion.id);
    if (index !== -1) {
      (mockEjecucionContrato as any[])[index] = ejecucion as any;
    }
    return of(ejecucion);
  }

  deleteEjecucion(id: number): Observable<boolean> {
    const index = mockEjecucionContrato.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEjecucionContrato.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
