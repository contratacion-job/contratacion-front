import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajador, CreateTrabajadorRequest, UpdateTrabajadorRequest } from '../models/Type';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  private apiUrl = 'your-backend-api-url/api/trabajadores'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.apiUrl);
  }

  getTrabajadorById(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.apiUrl}/${id}`);
  }

  createTrabajador(trabajador: CreateTrabajadorRequest): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.apiUrl, trabajador);
  }

  updateTrabajador(id: number, trabajador: UpdateTrabajadorRequest): Observable<Trabajador> {
    // Incluir contrasena en la actualización si está presente
    return this.http.put<Trabajador>(`${this.apiUrl}/${id}`, trabajador);
  }

  deleteTrabajador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchTrabajadores(searchTerm: string): Observable<Trabajador[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<Trabajador[]>(`${this.apiUrl}/search`, { params });
  }

  // Filtros adicionales para backend
  getTrabajadoresByDepartamento(departamentoId: number): Observable<Trabajador[]> {
    const params = new HttpParams().set('departamentoId', departamentoId.toString());
    return this.http.get<Trabajador[]>(this.apiUrl, { params });
  }
}