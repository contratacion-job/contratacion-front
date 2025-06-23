import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Representante } from 'app/models/Type';
import { mockRepresentantes } from 'app/mock-api/contrato-fake/fake';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {
  private representantes: Representante[] = [...mockRepresentantes];

  constructor() {}

  getRepresentantes(): Observable<Representante[]> {
    return of(this.representantes);
  }

  getRepresentante(id: number): Observable<Representante | undefined> {
    const representante = this.representantes.find(r => r.id === id);
    return of(representante);
  }

  createRepresentante(representante: Representante): Observable<Representante> {
    const newRepresentante = {
      ...representante,
      id: Math.max(...this.representantes.map(r => r.id)) + 1
    };
    this.representantes.push(newRepresentante);
    return of(newRepresentante);
  }

  updateRepresentante(id: number, representante: Representante): Observable<Representante | undefined> {
    const index = this.representantes.findIndex(r => r.id === id);
    if (index !== -1) {
      this.representantes[index] = { ...representante, id };
      return of(this.representantes[index]);
    }
    return of(undefined);
  }

  deleteRepresentante(id: number): Observable<void> {
    const index = this.representantes.findIndex(r => r.id === id);
    if (index !== -1) {
      this.representantes.splice(index, 1);
    }
    return of(void 0);
  }
}
