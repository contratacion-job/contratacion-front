import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suplemento } from 'app/models/Type';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SuplementoService {

  private baseUrl = API_ENDPOINTS.SUPLEMENTOS;
  private ejecucionSuplementosUrl = API_ENDPOINTS.EJECUCION_SUPLEMENTOS;

  constructor(private http: HttpClient) {}

  getSuplementos(): Observable<Suplemento[]> {
    console.log('Fetching suplementos list from backend');
    const observable = this.http.get<Suplemento[]>(this.baseUrl);
    observable.subscribe(response => console.log('Response from getSuplementos:', response));
    return observable;
  }

  getSuplementosVencidos(page: number, size: number): Observable<{ data: Suplemento[]; total: number }> {
    console.log(`Fetching expired suplementos page ${page} size ${size}`);
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<{ data: Suplemento[]; total: number }>(this.ejecucionSuplementosUrl, { params });
  }

  getSuplementoById(id: number): Observable<Suplemento> {
    console.log(`Fetching suplemento with id ${id} from backend`);
    const observable = this.http.get<Suplemento>(`${this.baseUrl}/${id}`);
    observable.subscribe(response => console.log(`Response from getSuplementoById(${id}):`, response));
    return observable;
  }

  createSuplemento(suplemento: Suplemento): Observable<Suplemento> {
    console.log('Creating suplemento:', suplemento);
    const observable = this.http.post<Suplemento>(this.baseUrl, suplemento);
    observable.subscribe(response => console.log('Response from createSuplemento:', response));
    return observable;
  }

  updateSuplemento(id: number, suplemento: Suplemento): Observable<Suplemento> {
    console.log(`Updating suplemento with id ${id}:`, suplemento);
    const observable = this.http.put<Suplemento>(`${this.baseUrl}/${id}`, suplemento);
    observable.subscribe(response => console.log(`Response from updateSuplemento(${id}):`, response));
    return observable;
  }

  deleteSuplemento(id: number): Observable<void> {
    console.log(`Deleting suplemento with id ${id}`);
    const observable = this.http.delete<void>(`${this.baseUrl}/${id}`);
    observable.subscribe(() => console.log(`Response from deleteSuplemento(${id}): success`));
    return observable;
  }


getEjecucionSuplementos(): Observable<Suplemento[]> {
  console.log('Fetching suplementos list from backend');
  const observable = this.http.get<Suplemento[]>(this.ejecucionSuplementosUrl);
  observable.subscribe(response => console.log('Response from getSuplementos:', response));
  return observable;
}

getEjecucionSuplementosVencidos(page: number, size: number): Observable<{ data: Suplemento[]; total: number }> {
  console.log(`Fetching expired suplementos page ${page} size ${size}`);
  const params = {
    page: page.toString(),
    size: size.toString()
  };
  return this.http.get<{ data: Suplemento[]; total: number }>(this.ejecucionSuplementosUrl, { params });
}

getEjecucionSuplementoById(id: number): Observable<Suplemento> {
  console.log(`Fetching suplemento with id ${id} from backend`);
  const observable = this.http.get<Suplemento>(`${this.ejecucionSuplementosUrl}/${id}`);
  observable.subscribe(response => console.log(`Response from getSuplementoById(${id}):`, response));
  return observable;
}

createEjecucionSuplemento(suplemento: Suplemento): Observable<Suplemento> {
  console.log('Creating suplemento:', suplemento);
  const observable = this.http.post<Suplemento>(this.ejecucionSuplementosUrl, suplemento);
  observable.subscribe(response => console.log('Response from createSuplemento:', response));
  return observable;
}

updateEjecucionSuplemento(id: number, suplemento: Suplemento): Observable<Suplemento> {
  console.log(`Updating suplemento with id ${id}:`, suplemento);
  const observable = this.http.put<Suplemento>(`${this.ejecucionSuplementosUrl}/${id}`, suplemento);
  observable.subscribe(response => console.log(`Response from updateSuplemento(${id}):`, response));
  return observable;
}

deleteEjecucionSuplemento(id: number): Observable<void> {
  console.log(`Deleting suplemento with id ${id}`);
  const observable = this.http.delete<void>(`${this.ejecucionSuplementosUrl}/${id}`);
  observable.subscribe(() => console.log(`Response from deleteSuplemento(${id}): success`));
  return observable;
}
}
