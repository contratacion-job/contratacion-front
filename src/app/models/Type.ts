export interface Contrato {
  id: number;
  vigencia: VigenciaContrato;
  vigencia_id: number;
  proveedor: Proveedor;
  proveedor_id: number;
  tipo_contrato: TipoContrato;
  tipo_contrato_id: number;
  departamento: Departamento;
  no_contrato: string;
  no_contrato_contratacion: string;
  fecha_entrada: string;
  fecha_firmado: string;
  fecha_vencido: string;
  valor_cup: number;
  monto_venimiento_cup: number;
  valor_cl: number;
  monto_venimiento_cl: number;
  valor_usd: number;
  monto_venimiento_usd: number;
  observaciones: string;
  no_comite_contratacion: number;
  fecha_comite_contratacion: string;
  no_acuerdo_comite_contratacion: number;
  fecha_acuerdo_comite_contratacion: string;
  no_comite_administracion: number;
  fecha_comite_administracion: string;
  estado: string;
}

export interface Proveedor {
  id: number;
  municipio: Municipio;
  municipio_id: number;
  ministerio: Ministerio;
  ministerio_id: number;
  nombre: string;
  codigo: string;
  telefonos: string;
  domicilio: string;
}

export interface TipoContrato {
  id: number;
  tipo_contrato: string;
}

export interface VigenciaContrato {
  id: number;
  vigencia: number;
  alerta_vigencia: number;
  tipo_alerta_vigencia: string;
  tipo_vigencia: string;
  proveedor: Proveedor;
}

export interface Departamento {
  id: number;
  nombre_dpto: string;
}

export interface Municipio {
  id: number;
  provincia: Provincia;
  nombre_municipio: string;
}

export interface Provincia {
  id: number;
  nombre_provincia: string;
}

export interface Ministerio {
  id: number;
  nombre_ministerio: string;
}
interface EjecucionContrato {
  id: number;
  proveedor: Proveedor;
  contrato: Contrato;
  costo_cup: number;
  costo_cl: number;
  trabajo_ejecutado: string;
  fecha_ejecucion: string;
}