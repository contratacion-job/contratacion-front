import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, tap } from 'rxjs';
import { Trabajador, TrabajadorDialogData } from '../../../models/Type';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';
// Interfaz local para departamentos simplificada
export interface DepartamentoSimple {
  id: number;
  nombre: string;
}

// Ajusta según tu configuración

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los trabajadores
   */
  getTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${API_ENDPOINTS.TRABAJADORES}`)
      .pipe(
        tap(data => console.log('Trabajadores obtenidos:', data)),
        catchError(error => {
          console.error('Error al obtener trabajadores:', error);
          return of(this.getMockTrabajadores());
        })
      );
  }

  /**
   * Buscar trabajadores por término
   */
  searchTrabajadores(searchTerm: string): Observable<Trabajador[]> {
    if (!searchTerm.trim()) {
      return this.getTrabajadores();
    }

    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<Trabajador[]>(`${API_ENDPOINTS.TRABAJADORES}`, { params })
      .pipe(
        catchError(error => {
          console.error('Error en búsqueda de trabajadores:', error);
          // Fallback: filtrar datos mock
          return of(this.getMockTrabajadores().filter(t => 
            t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.email.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        })
      );
  }

  /**
   * Obtener trabajador por ID
   */
  getTrabajadorById(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${API_ENDPOINTS.TRABAJADORES}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener trabajador por ID:', error);
          const mockTrabajador = this.getMockTrabajadores().find(t => t.id === id);
          return of(mockTrabajador || {} as Trabajador);
        })
      );
  }

  /**
   * Crear nuevo trabajador
   */
  createTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    const trabajadorData = {
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      usuario: trabajador.usuario || trabajador.email,
      contrasena: trabajador.contrasena || 'temporal123',
      cargo: trabajador.cargo,
      departamento_id: trabajador.departamento_id,
      email: trabajador.email,
      telefono: trabajador.telefono || '',
      telefono_movil: trabajador.telefono_movil || '',
      rol: trabajador.rol
    };

    return this.http.post<Trabajador>(`${API_ENDPOINTS.TRABAJADORES}`, trabajadorData)
      .pipe(
        tap(data => console.log('Trabajador creado:', data)),
        catchError(error => {
          console.error('Error al crear trabajador:', error);
          // Simular creación exitosa para desarrollo
          const newTrabajador: Trabajador = {
            ...trabajadorData,
            id: Date.now(),
            departamentoId: trabajadorData.departamento_id,
            fecha_creacion: new Date(),
            activo: true
          };
          return of(newTrabajador);
        })
      );
  }

  /**
   * Actualizar trabajador
   */
  updateTrabajador(id: number, trabajador: Trabajador): Observable<Trabajador> {
    const trabajadorData = {
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      usuario: trabajador.usuario || trabajador.email,
      cargo: trabajador.cargo,
      departamento_id: trabajador.departamento_id,
      email: trabajador.email,
      telefono: trabajador.telefono || '',
      telefono_movil: trabajador.telefono_movil || '',
      rol: trabajador.rol
    };

    return this.http.put<Trabajador>(`${API_ENDPOINTS.TRABAJADORES}/${id}`, trabajadorData)
      .pipe(
        tap(data => console.log('Trabajador actualizado:', data)),
        catchError(error => {
          console.error('Error al actualizar trabajador:', error);
          return of({ 
            ...trabajadorData, 
            id,
            departamentoId: trabajadorData.departamento_id 
          } as Trabajador);
        })
      );
  }

  /**
   * Eliminar trabajador
   */
  deleteTrabajador(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.TRABAJADORES}/${id}`)
      .pipe(
        tap(() => console.log('Trabajador eliminado:', id)),
        catchError(error => {
          console.error('Error al eliminar trabajador:', error);
          return of();
        })
      );
  }

  /**
   * Obtener departamentos simplificados
   */
  getDepartamentos(): Observable<DepartamentoSimple[]> {
    return this.http.get<DepartamentoSimple[]>(`${API_ENDPOINTS.DEPARTAMENTOS}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener departamentos:', error);
          return of(this.getMockDepartamentos());
        })
      );
  }

  /**
   * Exportar trabajadores a Excel
   */
  exportToExcel(): Observable<Blob> {
    return this.http.get(`${API_ENDPOINTS.TRABAJADORES_EXPORT_EXCEL}`, { 
      responseType: 'blob' 
    }).pipe(
      catchError(error => {
        console.error('Error al exportar a Excel:', error);
        return of(new Blob());
      })
    );
  }

  /**
   * Exportar trabajadores a PDF
   */
  exportToPdf(): Observable<Blob> {
    return this.http.get(`${API_ENDPOINTS.TRABAJADORES_EXPORT_PDF}`, { 
      responseType: 'blob' 
    }).pipe(
      catchError(error => {
        console.error('Error al exportar a PDF:', error);
        return of(new Blob());
      })
    );
  }

  /**
   * Datos mock para desarrollo/fallback
   */
  private getMockTrabajadores(): Trabajador[] {
    return [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        usuario: 'juan.perez',
        cargo: 'Desarrollador Senior',
        departamento_id: 2,
        departamentoId: 2,
        email: 'juan.perez@empresa.com',
        telefono: '123-456-7890',
        telefono_movil: '098-765-4321',
        rol: 'user',
        activo: true
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        usuario: 'maria.gonzalez',
        cargo: 'Gerente de RRHH',
        departamento_id: 1,
        departamentoId: 1,
        email: 'maria.gonzalez@empresa.com',
        telefono: '123-456-7891',
        rol: 'admin',
        activo: true
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        usuario: 'carlos.rodriguez',
        cargo: 'Analista Financiero',
        departamento_id: 3,
        departamentoId: 3,
        email: 'carlos.rodriguez@empresa.com',
        telefono: '123-456-7892',
        rol: 'user',
        activo: true
      }
    ];
  }

  /**
   * Departamentos mock
   */
  private getMockDepartamentos(): DepartamentoSimple[] {
    return [
      { id: 1, nombre: 'Recursos Humanos' },
      { id: 2, nombre: 'Tecnología' },
      { id: 3, nombre: 'Finanzas' },
      { id: 4, nombre: 'Operaciones' },
      { id: 5, nombre: 'Marketing' },
      { id: 6, nombre: 'Ventas' }
    ];
  }
}
