// Table: tipo_proveedor
export interface TipoProveedor {
  id: number;
  tipo_proveedor: string;
}

// Table: tipo_contrato
export interface TipoContrato {
  id: number;
  nombre_tipo_contrato: string;
  descripcion: string;
}

// Table: vigencia
export interface Vigencia {
  id: number;
  vigencia: number;
  alerta_vigencia: number;
  tipo_vigencia: string;
  tipo_alerta_vigencia: string;
}

export interface VigenciaContrato {
  id: number;
  vigencia: number;
  alerta_vigencia: number;
  tipo_alerta_vigencia: string;
  tipo_vigencia: string;
  proveedor: any;
  proveedorId?: number;
  tipo_contratoId?: number;
}

// Table: provincia
export interface Provincia {
  id: number;
  nombre_provincia: string;
}

// Table: ministerio
export interface Ministerio {
  id: number;
  nombre_ministerio: string;
  descripcion: string;
}

// Table: municipio
export interface Municipio {
  id: number;
  provincia_id: number;
  nombre_municipio: string;
  provincia: Provincia;
}

// Table: entidad
export interface Entidad {
  id: number;
  municipio_id: number;
  nombre_entidad: string;
  codigo_entidad: string;
  domicilio_legal: string;
  telefonos: string;
  logo: string;
  tipo_empresa: string;
  provincia?: Provincia;
  municipio: Municipio;
}

// Table: departamento
export interface Departamento {
  id: number;
  nombre_departamento: string;
  codigo: string;
  descripcion: string;
}

// Table: proveedor
export interface Proveedor {
  id: number;
  municipio_id: number;
  ministerio_id: number;
  nombre: string;
  codigo: string;
  telefonos: string;
  domicilio: string;
  municipio: Municipio;
  ministerio: Ministerio;
  fechaCreacion: string;
   representantes?: Representante[];
}

// Table: suplemento
export interface Suplemento {
  id: number;
  estado?: string; // Added optional estado property to support filtering expired suplementos
  vigencia_id: number;
  proveedor_id: number;
  tipo_contrato_id: number;
  no_contrato_id: number;
  departamento_id: number;
  fecha_entrada: Date;
  fecha_firmado: Date;
  valor_cup: number;
  monto_vencimiento_cup: number;
  monto_vencimiento_cl: number;
  valor_usd: number;
  monto_vencimiento_usd: number;
  observaciones: string;
  no_contrato_contratacion: number;
  fecha_comite_contratacion: Date;
  no_comite_contratacion: number;
  no_acuerdo_comite_contratacion: number;
  fecha_comite_administracion: Date;
  no_comite_administracion: number;
  no_acuerdo_comite_administracion: number;
  fecha_vencido: Date;
  valor_monto_restante: number;
  vigencia: Vigencia;
  proveedor: Proveedor;
  tipo_contrato: TipoContrato;
  departamento: Departamento;
}

// Table: contrato
export interface Contrato {
  id: number;
  vigencia_id: number;
  proveedor_id: number;
  tipo_contrato_id: number;
  no_contrato: number;
  fecha_entrada: Date;
  fecha_firmado: Date;
  valor_cup: number;
  monto_vencimiento_cup: number;
  monto_vencimiento_cl: number;
  valor_usd: number;
  monto_vencimiento_usd: number;
  observaciones: string;
  no_contrato_contratacion: number;
  fecha_comite_contratacion: Date;
  no_comite_contratacion: number;
  no_acuerdo_comite_contratacion: number;
  fecha_comite_administracion: Date;
  no_comite_administracion: number;
  no_acuerdo_comite_administracion: number;
  departamento_id: number;
  fecha_vencido: Date;
  valor_monto_restante: number;
  entidad: string[];
  vigencia: Vigencia;
  proveedor: Proveedor;
  tipo_contrato: TipoContrato;
  departamento: Departamento;
  estado?: string;
}

// Table: ejecucion_contrato
export interface EjecucionContrato {
  id: number;
  proveedor_id: number;
  no_contrato_id: number;
  costo_cup: number;
  costo_cl: number;
  trabajo_ejecutado: string;
  fecha_ejecucion: Date;
  proveedor: Proveedor;
  contrato: Contrato;
}

// Table: ejecucion_suplemento
export interface EjecucionSuplemento {
  id: number;
  proveedor_id: number;
  no_contrato_id: number;
  no_suplemento_id: number;
  costo_cup: number;
  costo_cl: number;
  trabajo_ejecutado: string;
  fecha_ejecucion: Date;
  proveedor: Proveedor;
  contrato: Contrato;
  suplemento: Suplemento;
  estado?: string; // Added optional estado property to support filtering expired ejecuciones
}

// Table: log
export interface Log {
  id: number;
  usuario: string;
  fecha: Date;
  tabla: string;
  accion: string;
}

// Table: notificacion
export interface Notificacion {
  id: number;
  tipo: 'Suplemento' | 'Contrato' | 'EjecucionContrato' | 'Proveedor' | 'Licencia';
  texto: string;
  fecha: Date;
  color: string;
  icono: string;
}

// Table: revision


// Table: usuario
export interface Usuario {
  id: number;
  username: string;
  roles: string;
  password: string;
  name: string;
  apellidos: string;
  cargo: string;
  correo: string;
  movil: number;
  extension: number;
}

// ===== INTERFACES AGREGADAS =====

// Table: licencia (Agregada)
export interface Licencia {
  id: number;
  entidad_id: number;
  numero_licencia: string;
  tipo_licencia: string;
  fecha_emision: Date;
  fecha_vencimiento: Date;
  estado: string;
  observaciones?: string;
  entidad: Entidad;
}

// Table: representantes (Agregada)
export interface Representante {
  id: number;
  entidad_id: number;
  nombre: string;
  apellidos: string;
  cargo: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  entidad: Entidad;
}

// Table: contratos_entidad (Tabla de relación agregada)
export interface ContratoEntidad {
  id: number;
  contrato_id: number;
  entidad_id: number;
  fecha_asignacion: Date;
  activo: boolean;
  contrato: Contrato;
  entidad: Entidad;
}

// Table: suplementos_entidad (Tabla de relación agregada)
export interface SuplementoEntidad {
  id: number;
  suplemento_id: number;
  entidad_id: number;
  fecha_asignacion: Date;
  activo: boolean;
  suplemento: Suplemento;
  entidad: Entidad;
}

// Table: documentos (Agregada)

// Table: configuracion (Agregada para configuraciones del sistema)
export interface Configuracion {
  id: number;
  clave: string;
  valor: string;
  descripcion?: string;
  tipo: 'string' | 'number' | 'boolean' | 'json';
  fecha_modificacion: Date;
  usuario_modificacion_id: number;
}

// Table: alertas (Agregada para alertas del sistema)
export interface Alerta {
  id: number;
  tipo: 'vencimiento_contrato' | 'vencimiento_licencia' | 'presupuesto' | 'sistema';
  titulo: string;
  mensaje: string;
  fecha_creacion: Date;
  fecha_vencimiento?: Date;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'activa' | 'vista' | 'cerrada';
  usuario_id?: number;
  entidad_tipo?: string;
  entidad_id?: number;
  color: string;
  icono: string;
  usuario?: Usuario;
}

// Table: trabajador
export interface Trabajador {
  id?: number;
  nombre: string;
  apellido: string; // Cambiado de 'apellidos' a 'apellido' para coincidir con backend
  usuario: string;
  contrasena?: string;
  cargo: string;
  departamento_id: number; // Mantenemos este nombre para coincidir con backend
  departamentoId?: number; // Alias para compatibilidad
  email: string;
  telefono?: string;
  telefono_movil?: string;
  rol: 'admin' | 'user' | 'supervisor' | 'empleado';
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  activo?: boolean;
}

// ===== TIPOS AUXILIARES AGREGADOS =====

// Tipos para estados comunes
export type EstadoContrato = 'activo' | 'vencido' | 'cancelado' | 'suspendido' | 'renovado';
export type EstadoProveedor = 'activo' | 'inactivo' | 'suspendido' | 'bloqueado';
export type EstadoLicencia = 'vigente' | 'vencida' | 'renovada' | 'cancelada';
export type TipoMoneda = 'CUP' | 'USD' | 'CL';


// Interfaces para estadísticas y reportes
export interface EstadisticaContrato {
  total_contratos: number;
  valor_total_cup: number;
  valor_total_usd: number;
  contratos_activos: number;
  contratos_vencidos: number;
  contratos_por_vencer: number;
  promedio_valor_contrato: number;
}

export interface EstadisticaProveedor {
  total_proveedores: number;
  proveedores_activos: number;
  proveedores_con_contratos: number;
  valor_total_contratado: number;
  promedio_contratos_por_proveedor: number;
}

// Add these interfaces if they don't exist
export interface CreateTrabajadorRequest {
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  departamentoId: number;
  cargo?: string;
  contrasena: string;
}

export interface UpdateTrabajadorRequest {
  id?: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  departamentoId?: number;
  cargo?: string;
  contrasena?: string;
}

export interface TrabajadorDialogData {
  trabajador?: Trabajador;
  isEdit: boolean;
}
