import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Suplemento } from 'app/models/Type';
import { mockSuplemento } from 'app/mock-api/suplemento-fake/fake';

@Injectable({
  providedIn: 'root'
})
export class SuplementoService {

  constructor() { }

  getSuplementos(): Observable<Suplemento[]> {
    // Return mock suplementos data as observable
    return of(mockSuplemento);
  }

  // Other service methods as needed
}
