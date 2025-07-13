
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { Entidad } from 'app/models/Type';
@Injectable({
  providedIn: 'root'
})
export class EntidadService {

  private entidad: Entidad[] = [];
  constructor(private http: HttpClient) { }

  getLogs(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(API_ENDPOINTS.MI_ENTIDAD)
      .pipe(
        tap(data => console.log('entidad fetched:', data)),
        catchError(error => {
          console.error('Error fetching contratos:', error);
          return of([...this.entidad]);
        })
      );
  }

    getContratoById(id: number): Observable<Entidad> {
      return this.http.get<Entidad>(`${API_ENDPOINTS.MI_ENTIDAD}/${id}`)
        .pipe(
          catchError(error => {
            console.error('Error fetching contrato by id:', error);
            const contrato = this.entidad.find(c => c.id === id);
            if (contrato) {
              return of(contrato);
            }
            throw error;
          })
        );
    }

    /**
     * Crear contrato
     */
    createContrato(entidad: Entidad): Observable<Entidad> {
      return this.http.post<Entidad>(API_ENDPOINTS.MI_ENTIDAD, entidad)
        .pipe(
          catchError(error => {
            console.error('Error creating contrato:', error);
            const newContrato: Entidad = {
              ...entidad,
              id: this.entidad.length

            };
            this.entidad.push(newContrato);
            return of(newContrato);
          })
        );
    }

    /**
     * Actualizar contrato
     */
    updateContrato(id: number, entidad: Entidad): Observable<Entidad> {
      return this.http.put<Entidad>(`${API_ENDPOINTS.MI_ENTIDAD}/${id}`, entidad)
        .pipe(
          catchError(error => {
            console.error('Error updating contrato:', error);
            const index = this.entidad.findIndex(c => c.id === id);
            if (index !== -1) {
              this.entidad[index] = { ...entidad, id };
              return of(this.entidad[index]);
            }

            throw new Error('Contrato not found');
          })
        );
    }

    /**
     * Eliminar contrato
     */
    deleteContrato(id: number): Observable<void> {
      return this.http.delete<void>(`${API_ENDPOINTS.MI_ENTIDAD}/${id}`)
        .pipe(
          catchError(error => {
            console.error('Error deleting contrato:', error);
            const index = this.entidad.findIndex(c => c.id === id);
            if (index !== -1) {
              this.entidad.splice(index, 1);
              return of(void 0);
            }


            throw new Error('Contrato not found');
          })
        );
    }


}
