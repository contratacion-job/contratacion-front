import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Trabajador } from 'app/models/Type';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  private trabajadores: Trabajador[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Perez',
      cargo: 'Ingeniero',
      departamentoId: 1,
      departamento: { id: 1, nombre_departamento: 'Desarrollo', codigo: '', descripcion: '' },
      email: 'juan.perez@example.com',
      createdAt: new Date('2022-01-01T08:00:00Z'),
      updatedAt: new Date('2023-01-01T08:00:00Z'),
      timeZone: 'America/Havana'
    },
    {
      id: 2,
      nombre: 'Maria',
      apellido: 'Gonzalez',
      cargo: 'Analista',
      departamentoId: 2,
      departamento: { id: 2, nombre_departamento: 'Marketing', codigo: '', descripcion: '' },
      email: 'maria.gonzalez@example.com',
      createdAt: new Date('2022-02-01T08:00:00Z'),
      updatedAt: new Date('2023-02-01T08:00:00Z'),
      timeZone: 'America/Havana'
    }
  ];

  constructor() {}

  getTrabajadores(): Observable<Trabajador[]> {
    return of(this.trabajadores);
  }

  createTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    const newId = this.trabajadores.length > 0 ? Math.max(...this.trabajadores.map(t => t.id)) + 1 : 1;
    const newTrabajador = { ...trabajador, id: newId, createdAt: new Date(), updatedAt: new Date() };
    this.trabajadores.push(newTrabajador);
    return of(newTrabajador);
  }

  updateTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    const index = this.trabajadores.findIndex(t => t.id === trabajador.id);
    if (index !== -1) {
      this.trabajadores[index] = { ...trabajador, updatedAt: new Date() };
      return of(this.trabajadores[index]);
    }
    return of(null);
  }

  deleteTrabajador(id: number): Observable<boolean> {
    const index = this.trabajadores.findIndex(t => t.id === id);
    if (index !== -1) {
      this.trabajadores.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
