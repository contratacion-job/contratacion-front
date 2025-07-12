import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Contrato } from 'app/models/Type';
import { mockContrato, expiredContracts, mockDepartamento } from 'app/mock-api/contrato-fake/fake';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private contratos: Contrato[] = [];
  private expired: Contrato[] = [];

  constructor(private http: HttpClient) {
    this.contratos = mockContrato as Contrato[] || [];
    this.expired = expiredContracts as Contrato[] || [];
  }

  /**
   * Listar contratos
   */


getContratos(): Observable<Contrato[]> {
  return this.http.get<Contrato[]>(API_ENDPOINTS.CONTRATOS)
    .pipe(
      tap(data => console.log('Contratos fetched:', data)),
      catchError(error => {
        console.error('Error fetching contratos:', error);
        return of([...this.contratos]);
      })
    );
}

  /**
   * Obtener contrato por ID
   */
  getContratoById(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${API_ENDPOINTS.CONTRATOS}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching contrato by id:', error);
          const contrato = this.contratos.find(c => c.id === id) || this.expired.find(c => c.id === id);
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
  createContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(API_ENDPOINTS.CONTRATOS, contrato)
      .pipe(
        catchError(error => {
          console.error('Error creating contrato:', error);
          const newContrato: Contrato = {
            ...contrato,
            id: this.contratos.length + this.expired.length + 1,
            departamento: contrato.departamento || mockDepartamento[0],
            estado: contrato.estado || 'Activo'
          };
          this.contratos.push(newContrato);
          return of(newContrato);
        })
      );
  }

  /**
   * Actualizar contrato
   */
  updateContrato(id: number, contrato: Contrato): Observable<Contrato> {
    return this.http.put<Contrato>(`${API_ENDPOINTS.CONTRATOS}/${id}`, contrato)
      .pipe(
        catchError(error => {
          console.error('Error updating contrato:', error);
          const index = this.contratos.findIndex(c => c.id === id);
          if (index !== -1) {
            this.contratos[index] = { ...contrato, id };
            return of(this.contratos[index]);
          }
          const expiredIndex = this.expired.findIndex(c => c.id === id);
          if (expiredIndex !== -1) {
            this.expired[expiredIndex] = { ...contrato, id };
            return of(this.expired[expiredIndex]);
          }
          throw new Error('Contrato not found');
        })
      );
  }

  /**
   * Eliminar contrato
   */
  deleteContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.CONTRATOS}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting contrato:', error);
          const index = this.contratos.findIndex(c => c.id === id);
          if (index !== -1) {
            this.contratos.splice(index, 1);
            return of(void 0);
          }
          const expiredIndex = this.expired.findIndex(c => c.id === id);
          if (expiredIndex !== -1) {
            this.expired.splice(expiredIndex, 1);
            return of(void 0);
          }
          throw new Error('Contrato not found');
        })
      );
  }

  /**
   * Obtener contratos vencidos con paginación
   */
  getVencidoEjecucionContratos(page: number, size: number): Observable<{ data: Contrato[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('estado', 'Vencido');

    return this.http.get<{ data: Contrato[]; total: number }>(API_ENDPOINTS.CONTRATOS_VENCIDOS, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching vencidos contratos:', error);
          const expired = this.expired.filter(c => c.estado === 'Vencido');
          const start = page * size;
          const end = start + size;
          const data = expired.slice(start, end);
          const total = expired.length;
          return of({ data, total });
        })
      );
  }

  /**
   * Obtener contratos por proveedor
   */
  getContratosByProveedor(proveedorId: number): Observable<Contrato[]> {
    const params = new HttpParams().set('proveedor_id', proveedorId.toString());

    return this.http.get<Contrato[]>(API_ENDPOINTS.CONTRATOS, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching contratos by proveedor:', error);
          const contratos = this.contratos.filter(c => c.proveedor?.id === proveedorId);
          return of(contratos);
        })
      );
  }

  /**
   * Obtener contratos por departamento
   */
  getContratosByDepartamento(departamentoId: number): Observable<Contrato[]> {
    const params = new HttpParams().set('departamento_id', departamentoId.toString());

    return this.http.get<Contrato[]>(API_ENDPOINTS.CONTRATOS, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching contratos by departamento:', error);
          const contratos = this.contratos.filter(c => c.departamento?.id === departamentoId);
          return of(contratos);
        })
      );
  }

  // ===== MÉTODOS LEGACY (para compatibilidad) =====

  getExpiredContratos(): Observable<Contrato[]> {
    return of([...this.expired]);
  }

  transferExpiredContratos(): Observable<Contrato[]> {
    const expired = this.contratos.filter(c => c.estado === 'Vencido');
    if (expired.length > 0) {
      this.expired.push(...expired);
      this.contratos = this.contratos.filter(c => c.estado !== 'Vencido');
    }
    return of(expired);
  }

  restoreContrato(id: number): Observable<Contrato> {
    const index = this.expired.findIndex(c => c.id === id);
    if (index !== -1) {
      const restored = { ...this.expired[index], estado: 'Activo' };
      this.contratos.push(restored);
      this.expired.splice(index, 1);
      return of(restored);
    }
    throw new Error('Expired contrato not found');
  }


  getDashboard(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(API_ENDPOINTS.ESTADISTICAS.DASHBOARD)
      .pipe(
        tap(data => console.log('Contratos fetched:', data)),
        catchError(error => {
          console.error('Error fetching contratos:', error);
          return of([...this.contratos]);
        })
      );
  }

}
