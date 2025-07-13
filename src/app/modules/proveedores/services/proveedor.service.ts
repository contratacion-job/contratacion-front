import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

import { Proveedor } from 'app/models/Type';

export { Proveedor };

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = API_ENDPOINTS.PROVEEDORES;
  private useMockData = false; // Cambiar a false cuando el backend esté listo
  private contratos: Proveedor[] = [];
  constructor(private http: HttpClient) {}

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<{data: Proveedor[]}>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


    getDashboardproveedor(): Observable<Proveedor[]> {
      return this.http.get<Proveedor[]>(API_ENDPOINTS.ESTADISTICAS.CONTRATOS)
        .pipe(
          tap(data => console.log('proveedor dash fetched:', data)),
          catchError(error => {
            console.error('Error fetching contratos:', error);
            return of([...this.contratos]);
          })
        );
    }
}


