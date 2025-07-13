import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { TipoContrato } from 'app/models/Type';
import { mockTipoContrato } from 'app/mock-api/contrato-fake/fake';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {
  private tiposContrato: TipoContrato[] = [];

  constructor(private http: HttpClient) {
    this.tiposContrato = mockTipoContrato as TipoContrato[] || [];
  }

  /**
   * Listar tipos de contrato
   */
  getTiposContrato(): Observable<TipoContrato[]> {
    // Usar el endpoint de contratos con un parámetro o crear uno específico
    return this.http.get<TipoContrato[]>(`${API_ENDPOINTS.BASE_URL}/tipo-contratos`)
      .pipe(
        catchError(error => {
          console.error('Error fetching tipos contrato:', error);
          return of([...this.tiposContrato]);
        })
      );
  }

  /**
   * Obtener tipo de contrato por ID
   */
  getTipoContratoById(id: number): Observable<TipoContrato> {
    return this.http.get<TipoContrato>(`${API_ENDPOINTS.BASE_URL}/tipo-contratos/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching tipo contrato by id:', error);
          const tipoContrato = this.tiposContrato.find(tc => tc.id === id);
          if (tipoContrato) {
            return of(tipoContrato);
          }
          throw error;
        })
      );
  }

  /**
   * Crear tipo de contrato
   */
  createTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
    return this.http.post<TipoContrato>(`${API_ENDPOINTS.BASE_URL}/tipo-contratos`, tipoContrato)
      .pipe(
        catchError(error => {
          console.error('Error creating tipo contrato:', error);
          const newTipoContrato: TipoContrato = {
            ...tipoContrato,
            id: this.tiposContrato.length + 1
          };
          this.tiposContrato.push(newTipoContrato);
          return of(newTipoContrato);
        })
      );
  }

  /**
   * Actualizar tipo de contrato
   */
  updateTipoContrato(id: number, tipoContrato: TipoContrato): Observable<TipoContrato> {
    return this.http.put<TipoContrato>(`${API_ENDPOINTS.BASE_URL}/tipo-contratos/${id}`, tipoContrato)
      .pipe(
        catchError(error => {
          console.error('Error updating tipo contrato:', error);
          const index = this.tiposContrato.findIndex(tc => tc.id === id);
          if (index !== -1) {
            this.tiposContrato[index] = { ...tipoContrato, id };
            return of(this.tiposContrato[index]);
          }
          throw error;
        })
      );
  }

  /**
   * Eliminar tipo de contrato
   */
  deleteTipoContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.BASE_URL}/tipo-contratos/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting tipo contrato:', error);
          const index = this.tiposContrato.findIndex(tc => tc.id === id);
          if (index !== -1) {
            this.tiposContrato.splice(index, 1);
            return of(void 0);
          }
          throw error;
        })
      );
  }
}
