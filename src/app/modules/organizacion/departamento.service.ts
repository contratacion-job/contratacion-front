import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Departamento } from 'app/models/Type';
import { mockDepartamento } from 'app/mock-api/contrato-fake/fake';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  constructor() {}

  getDepartamentos(): Observable<Departamento[]> {
    return of(mockDepartamento);
  }
}
