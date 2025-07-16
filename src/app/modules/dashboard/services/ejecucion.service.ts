import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EjecucionContrato } from '../../../models/Type';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EjecucionService {
  constructor(private http: HttpClient) {}

  getEjecuciones(): Observable<EjecucionContrato[]> {
    return this.http.get<{ success: boolean, message: string, data: EjecucionContrato[], pagination: any, timestamp: string }>(API_ENDPOINTS.EJECUCIONES_CONTRATO).pipe(
      map(response => response.data || []),
      catchError((error) => {
        console.error('Error fetching ejecuciones:', error);
        return of([]);
      })
    );
  }

  addEjecucion(ejecucion: EjecucionContrato): Observable<any> {
    return this.http.post(API_ENDPOINTS.EJECUCIONES_CONTRATO, ejecucion).pipe(
      catchError((error) => {
        console.error('Error adding ejecucion:', error);
        throw error;
      })
    );
  }

  updateEjecucion(ejecucion: EjecucionContrato): Observable<any> {
    return this.http.put(`${API_ENDPOINTS.EJECUCIONES_CONTRATO}/${ejecucion.id}`, ejecucion).pipe(
      catchError((error) => {
        console.error('Error updating ejecucion:', error);
        throw error;
      })
    );
  }

  deleteEjecucion(id: number): Observable<any> {
    return this.http.delete(`${API_ENDPOINTS.EJECUCIONES_CONTRATO}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting ejecucion:', error);
        throw error;
      })
    );
  }
}