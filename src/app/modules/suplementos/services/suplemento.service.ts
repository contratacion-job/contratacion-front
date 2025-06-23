import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Suplemento } from 'app/models/Type';
import { mockSuplemento } from 'app/mock-api/suplemento-fake/fake';

@Injectable({
  providedIn: 'root'
})
export class SuplementoService {
  private suplementos: Suplemento[] = [];

  constructor() {
    this.suplementos = mockSuplemento || [];
  }

  getSuplementos(): Observable<Suplemento[]> {
    return of([...this.suplementos]);
  }

  createSuplemento(suplemento: Suplemento): Observable<Suplemento> {
    const newSuplemento: Suplemento = {
      ...suplemento,
      id: this.suplementos.length + 1
    };
    this.suplementos.push(newSuplemento);
    return of(newSuplemento);
  }

  updateSuplemento(id: number, suplemento: Suplemento): Observable<Suplemento> {
    const index = this.suplementos.findIndex(s => s.id === id);
    if (index !== -1) {
      this.suplementos[index] = { ...suplemento, id };
      return of(this.suplementos[index]);
    }
    throw new Error('Suplemento not found');
  }

  deleteSuplemento(id: number): Observable<void> {
    const index = this.suplementos.findIndex(s => s.id === id);
    if (index !== -1) {
      this.suplementos.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Suplemento not found');
  }
}
