// Interfaces existentes actualizadas
export interface Trabajador {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  cargo: string;
  departamento_id: number;
  departamento?: Departamento;
  email: string;
  telefono?: string;
  telefono_movil?: string;
  rol: 'admin' | 'supervisor' | 'empleado';
  activo?: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  // Mantener compatibilidad con propiedades anteriores
  departamentoId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  timeZone?: string;
}

export interface TrabajadorDialogData {
  isEdit: boolean;
  trabajador?: Trabajador;
}

export interface CreateTrabajadorRequest {
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena: string;
  cargo: string;
  departamento_id: number;
  email: string;
  telefono?: string;
  telefono_movil?: string;
  rol?: 'admin' | 'supervisor' | 'empleado';
}

export interface UpdateTrabajadorRequest {
  nombre?: string;
  apellido?: string;
  usuario?: string;
  contrasena?: string;
  cargo?: string;
  departamento_id?: number;
  email?: string;
  telefono?: string;
  telefono_movil?: string;
  rol?: 'admin' | 'supervisor' | 'empleado';
}

export interface Departamento {
  id: number;
  nombre_departamento: string;
  codigo: string;
  descripcion: string;
}