import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Departamento } from 'app/models/Type';
import { mockDepartamento } from 'app/mock-api/contrato-fake/fake';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private departamentos: Departamento[] = [];

  constructor(private http: HttpClient) {
    this.departamentos = mockDepartamento as Departamento[] || [];
  }

  /**
   * Listar departamentos
   */
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(API_ENDPOINTS.DEPARTAMENTOS)
      .pipe(
        catchError(error => {
          console.error('Error fetching departamentos:', error);
          return of([...this.departamentos]);
        })
      );
  }

  /**
   * Obtener departamento por ID
   */
  getDepartamentoById(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${API_ENDPOINTS.DEPARTAMENTOS}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching departamento by id:', error);
          const departamento = this.departamentos.find(d => d.id === id);
          if (departamento) {
            return of(departamento);
          }
          throw error;
        })
      );
  }

  /**
   * Crear departamento
   */
  createDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(API_ENDPOINTS.DEPARTAMENTOS, departamento)
      .pipe(
        catchError(error => {
          console.error('Error creating departamento:', error);
          const newDepartamento: Departamento = {
            ...departamento,
            id: this.departamentos.length + 1
          };
          this.departamentos.push(newDepartamento);
          return of(newDepartamento);
        })
      );
  }

  /**
   * Actualizar departamento
   */
  updateDepartamento(id: number, departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${API_ENDPOINTS.DEPARTAMENTOS}/${id}`, departamento)
      .pipe(
        catchError(error => {
          console.error('Error updating departamento:', error);
          const index = this.departamentos.findIndex(d => d.id === id);
          if (index !== -1) {
            this.departamentos[index] = { ...departamento, id };
            return of(this.departamentos[index]);
          }
          throw error;
        })
      );
  }

  /**
   * Eliminar departamento
   */
  deleteDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.DEPARTAMENTOS}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting departamento:', error);
          const index = this.departamentos.findIndex(d => d.id === id);
          if (index !== -1) {
            this.departamentos.splice(index, 1);
            return of(void 0);
          }
          throw error;
        })
      );
  }
}
