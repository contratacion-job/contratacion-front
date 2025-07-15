import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';
import { Log } from 'app/models/Type';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private log: Log[] = [];
  constructor(private http: HttpClient) {

  }

  /**
   * Listar departamentos
   */

getLogs(): Observable<Log[]> {
  return this.http.get<Log[]>(API_ENDPOINTS.LOGS.BASE)
    .pipe(
      tap(data => console.log('log fetched:', data)),
      catchError(error => {
        console.error('Error fetching contratos:', error);
        return of([...this.log]);
      })
    );
}
logsdelete(): Observable<Log[]> {
  return this.http.delete<Log[]>(API_ENDPOINTS.LOGS.DELETE_ALL)
    .pipe(
      tap(data => console.log('log fetched:', data)),
      catchError(error => {
        console.error('Error fetching contratos:', error);
        return of([...this.log]);
      })
    );
}

  exportToExcel(): Observable<Blob> {
    return this.http.post(API_ENDPOINTS.LOGS.EXPORT_EXCEL, {}, { responseType: 'blob' })
      .pipe(
        tap(data => console.log('Excel export initiated')),
        catchError(error => {
          console.error('Error exporting logs to Excel:', error);
          return of(new Blob());
        })
      );
  }

  exportToPDF(): Observable<Blob> {
    return this.http.post(API_ENDPOINTS.LOGS.EXPORT_PDF, {}, { responseType: 'blob' })
      .pipe(
        tap(data => console.log('PDF export initiated')),
        catchError(error => {
          console.error('Error exporting logs to PDF:', error);
          return of(new Blob());
        })
      );
  }
}
