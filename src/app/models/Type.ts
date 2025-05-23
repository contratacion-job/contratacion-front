export interface TipoProveedor {
  id: number;
  tipo_proveedor: string;
}

// Table: tipo_contrato
export interface TipoContrato {
  id: number;
  tipo_contrato: string;
}

// Table: vigencia
export interface Vigencia {
  id: number;
  alerta_vigencia: number;
  tipo_vigencia: string;
  tipo_alerta_vigencia: string;
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
}

// Table: municipio
export interface Municipio {
  id: number;
  provincia_id: number;
  nombre_municipio: string;
  provincia: Provincia; // Relationship: belongs to provincia
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
  municipio: Municipio; // Relationship: belongs to municipio
}

// Table: departamento
export interface Departamento {
  id: number;
  nombre_dpto: string;
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
  municipio: Municipio; // Relationship: belongs to municipio
  ministerio: Ministerio; // Relationship: belongs to ministerio
  fechaCreacion?: string;
  estado?: string;
  tipo?: string;
  categoria?: string;
}

// Table: vigencia_contrato
export interface VigenciaContrato {
  id: number;
  vigencia: number;
  alerta_vigencia: number;
  tipo_vigencia: string;
  tipo_alerta_vigencia: string;
  proveedor: Proveedor; // Relationship: belongs to proveedor
}

// Table: suplemento
export interface Suplemento {
  id: number;
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
  vigencia: Vigencia; // Relationship: belongs to vigencia
  proveedor: Proveedor; // Relationship: belongs to proveedor
  tipo_contrato: TipoContrato; // Relationship: belongs to tipo_contrato
  departamento: Departamento; // Relationship: belongs to departamento
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
  vigencia: Vigencia; // Relationship: belongs to vigencia
  proveedor: Proveedor; // Relationship: belongs to proveedor
  tipo_contrato: TipoContrato; // Relationship: belongs to tipo_contrato
  departamento: Departamento; // Relationship: belongs to departamento
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
  proveedor: Proveedor; // Relationship: belongs to proveedor
  contrato: Contrato; // Relationship: belongs to contrato
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
  proveedor: Proveedor; // Relationship: belongs to proveedor
  contrato: Contrato; // Relationship: belongs to contrato
  suplemento: Suplemento; // Relationship: belongs to suplemento
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
  texto: string;
  fecha: Date;
}

// Table: revision
export interface Revision {
  id: number;
  fecha_ultima_revision: Date;
}

// Table: usuario
export interface Usuario {
  id: number;
  username: string;
  roles: string;
  password: string;
  nombre: string;
  apellidos: string;
  cargo: string;
  correo: string;
  movil: number;
  extension: number;
}
