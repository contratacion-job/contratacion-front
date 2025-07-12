import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Representante } from 'app/models/Type';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {

  private baseUrl = API_ENDPOINTS.REPRESENTANTES;

  constructor(private http: HttpClient) {}

  getRepresentantes(): Observable<Representante[]> {
    console.log('Fetching representantes list from backend');
    return this.http.get<Representante[]>(this.baseUrl);
  }

  getRepresentanteById(id: number): Observable<Representante> {
    console.log(`Fetching representante with id ${id} from backend`);
    return this.http.get<Representante>(`${this.baseUrl}/${id}`);
  }

  createRepresentante(representante: Representante): Observable<Representante> {
    console.log('Creating representante:', representante);
    return this.http.post<Representante>(this.baseUrl, representante);
  }

  updateRepresentante(id: number, representante: Representante): Observable<Representante> {
    console.log(`Updating representante with id ${id}:`, representante);
    return this.http.put<Representante>(`${this.baseUrl}/${id}`, representante);
  }

  deleteRepresentante(id: number): Observable<void> {
    console.log(`Deleting representante with id ${id}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
