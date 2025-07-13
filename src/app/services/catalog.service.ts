import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMinisterios(): Observable<any> {
    console.log('Calling getMinisterios');
    return this.http.get(API_ENDPOINTS.CATALOGOS.MINISTERIOS)
      .pipe(
        tap({
          next: data => console.log('getMinisterios response:', data),
          error: error => console.error('getMinisterios error:', error)
        })
      );
  }

  getProvincias(): Observable<any> {
    console.log('Calling getProvincias');
    return this.http.get(API_ENDPOINTS.CATALOGOS.PROVINCIAS)
      .pipe(
        tap({
          next: data => console.log('getProvincias response:', data),
          error: error => console.error('getProvincias error:', error)
        })
      );
  }

  getMunicipios(): Observable<any> {
    console.log('Calling getMunicipios');
    return this.http.get(API_ENDPOINTS.CATALOGOS.MUNICIPIOS)
      .pipe(
        tap({
          next: data => console.log('getMunicipios response:', data),
          error: error => console.error('getMunicipios error:', error)
        })
      );
  }

  getTiposEmpresa(): Observable<any> {
    console.log('Calling getTiposEmpresa');
    return this.http.get(API_ENDPOINTS.CATALOGOS.TIPOS_EMPRESA)
      .pipe(
        tap({
          next: data => console.log('getTiposEmpresa response:', data),
          error: error => console.error('getTiposEmpresa error:', error)
        })
      );
  }
}
