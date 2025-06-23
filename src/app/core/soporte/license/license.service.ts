import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Licencia {
  id: number;
  entidad_id: number;
  numero_licencia: string;
  tipo_licencia: string;
  fecha_emision: Date;
  fecha_vencimiento: Date;
  estado: string;
  observaciones?: string;
  entidad: any; // Use any to simplify
}

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  constructor() { }

  getLicense(): Observable<Licencia> {
    const mockLicense: Licencia = {
      id: 1,
      entidad_id: 1,
      numero_licencia: 'ABC-123-XYZ',
      tipo_licencia: 'Software',
      fecha_emision: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 10),
      fecha_vencimiento: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 20),
      estado: 'Activo',
      entidad: {}
    };
    return of(mockLicense);
  }
}