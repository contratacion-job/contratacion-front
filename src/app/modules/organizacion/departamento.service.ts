import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from 'app/models/Type';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private baseUrl = API_ENDPOINTS.DEPARTAMENTOS;

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<{ success: boolean; message: string; data: Departamento[]; pagination: any; timestamp: string }> {
    console.log('Fetching departamentos list from backend');
    const observable = this.http.get<{ success: boolean; message: string; data: Departamento[]; pagination: any; timestamp: string }>(this.baseUrl);
    observable.subscribe(response => console.log('Response from getDepartamentos:', response));
    return observable;
  }

  getDepartamentoById(id: number): Observable<Departamento> {
    console.log(`Fetching departamento with id ${id} from backend`);
    const observable = this.http.get<Departamento>(`${this.baseUrl}/${id}`);
    observable.subscribe(response => console.log(`Response from getDepartamentoById(${id}):`, response));
    return observable;
  }

  createDepartamento(departamento: Departamento): Observable<Departamento> {
    console.log('Creating departamento:', departamento);
    const observable = this.http.post<Departamento>(this.baseUrl, departamento);
    observable.subscribe(response => console.log('Response from createDepartamento:', response));
    return observable;
  }

  updateDepartamento(id: number, departamento: Departamento): Observable<Departamento> {
    console.log(`Updating departamento with id ${id}:`, departamento);
    const observable = this.http.put<Departamento>(`${this.baseUrl}/${id}`, departamento);
    observable.subscribe(response => console.log(`Response from updateDepartamento(${id}):`, response));
    return observable;
  }

  deleteDepartamento(id: number): Observable<void> {
    console.log(`Deleting departamento with id ${id}`);
    const observable = this.http.delete<void>(`${this.baseUrl}/${id}`);
    observable.subscribe(() => console.log(`Response from deleteDepartamento(${id}): success`));
    return observable;
  }
}
