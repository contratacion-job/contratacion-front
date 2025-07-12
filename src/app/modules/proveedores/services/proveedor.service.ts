import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mockProveedor } from 'app/mock-api/contrato-fake/fake';

export interface Proveedor {
  id: number;
  nombre: string;
  codigo: string;
  telefonos: string;
  domicilio: string;
  municipio?: any;
  ministerio?: any;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = '/api/proveedores';
  private useMockData = true; // Cambiar a false cuando el backend esté listo
  private proveedores: Proveedor[] = [...mockProveedor];

  constructor(private http: HttpClient) {}

  getProveedores(): Observable<Proveedor[]> {
    console.log('Fetching proveedores list');
    if (this.useMockData) {
      return of(this.proveedores);
    }
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  getProveedor(id: number): Observable<Proveedor> {
    console.log(`Fetching proveedor with id ${id}`);
    if (this.useMockData) {
      const proveedor = this.proveedores.find(p => p.id === id);
      return of(proveedor);
    }
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    console.log('Creating proveedor:', proveedor);
    if (this.useMockData) {
      const newProveedor = {
        ...proveedor,
        id: Math.max(...this.proveedores.map(p => p.id)) + 1
      };
      this.proveedores.push(newProveedor);
      return of(newProveedor);
    }
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    console.log(`Updating proveedor with id ${id}:`, proveedor);
    if (this.useMockData) {
      const index = this.proveedores.findIndex(p => p.id === id);
      if (index !== -1) {
        this.proveedores[index] = { ...proveedor, id };
        return of(this.proveedores[index]);
      }
    }
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<void> {
    console.log(`Deleting proveedor with id ${id}`);
    if (this.useMockData) {
      const index = this.proveedores.findIndex(p => p.id === id);
      if (index !== -1) {
        this.proveedores.splice(index, 1);
      }
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
