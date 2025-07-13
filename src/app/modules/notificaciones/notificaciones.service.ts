import { notificaciones } from './../../mock-api/common/notifications/data';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { Notificacion } from 'app/models/Type';
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {


  private notificaciones: Notificacion[] = [];
  constructor(private http: HttpClient) { }
  getNotificacion(): Observable<Notificacion[]> {
      return this.http.get<Notificacion[]>(API_ENDPOINTS.NOTIFICACIONES)
        .pipe(
          tap(data => console.log('entidad fetched:', data)),
          catchError(error => {
            console.error('Error fetching contratos:', error);
            return of([...this.notificaciones]);
          })
        );
    }

      getNotificacionById(id: number): Observable<Notificacion> {
        return this.http.get<Notificacion>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`)
          .pipe(
            catchError(error => {
              console.error('Error fetching contrato by id:', error);
              const notificaciones = this.notificaciones.find(c => c.id === id);
              if (notificaciones) {
                return of(notificaciones);
              }
              throw error;
            })
          );
      }

      /**
       * Crear contrato
       */
      createNotificacion(notificaciones: Notificacion): Observable<Notificacion> {
        return this.http.post<Notificacion>(API_ENDPOINTS.NOTIFICACIONES, notificaciones)
          .pipe(
            catchError(error => {
              console.error('Error creating contrato:', error);
              const newContrato: Notificacion = {
                ...notificaciones,
                id: this.notificaciones.length

              };
              this.notificaciones.push(newContrato);
              return of(newContrato);
            })
          );
      }

      /**
       * Actualizar contrato
       */
      updateNotificacion(id: number, notificaciones: Notificacion): Observable<Notificacion> {
        return this.http.put<Notificacion>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`, notificaciones)
          .pipe(
            catchError(error => {
              console.error('Error updating contrato:', error);
              const index = this.notificaciones.findIndex(c => c.id === id);
              if (index !== -1) {
                this.notificaciones[index] = { ...notificaciones, id };
                return of(this.notificaciones[index]);
              }

              throw new Error('Contrato not found');
            })
          );
      }
      updatereadNotificacion(id: number, notificaciones: Notificacion): Observable<Notificacion> {
        return this.http.put<Notificacion>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`, notificaciones)
          .pipe(
            catchError(error => {
              console.error('Error updating contrato:', error);
              const index = this.notificaciones.findIndex(c => c.id === id);
              if (index !== -1) {
                this.notificaciones[index] = { ...notificaciones, id };
                return of(this.notificaciones[index]);
              }

              throw new Error('Contrato not found');
            })
          );
      }


      /**
       * Eliminar contrato
       */
      deleteNotificacion(id: number): Observable<void> {
        return this.http.delete<void>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`)
          .pipe(
            catchError(error => {
              console.error('Error deleting contrato:', error);
              const index = this.notificaciones.findIndex(c => c.id === id);
              if (index !== -1) {
                this.notificaciones.splice(index, 1);
                return of(void 0);
              }


              throw new Error('Contrato not found');
            })
          );
      }


}
