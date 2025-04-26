interface Contrato {
    id: number;
    vigencia: VigenciaContrato;
    proveedor: Proveedor;
    tipo_contrato: TipoContrato;
    no_contrato: string;
    fecha_entrada: string;
    fecha_firmado: string;
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
}

interface Departamento {
    id: number;
    nombre_dpto: string;
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

interface EjecucionSuplemento {
    id: number;
    proveedor: Proveedor;
    contrato: Contrato;
    suplemento: Suplemento;
    costo_cup: number;
    costo_cl: number;
    trabajo_ejecutado: string;
    fecha_ejecucion: string;
}

interface Ministerio {
    id: number;
    nombre_ministerio: string;
}

interface Municipio {
    id: number;
    provincia: Provincia;
    nombre_municipio: string;
}

interface Provincia {
    id: number;
    nombre_provincia: string;
}

interface Proveedor {
    id: number;
    municipio: Municipio;
    ministerio: Ministerio;
    nombre: string;
    codigo: string;
    telefonos: string;
    domicilio: string;
}

interface Suplemento {
    id: number;
    vigencia: VigenciaContrato;
    proveedor: Proveedor;
    tipo_contrato: TipoContrato;
    contrato: Contrato;
    departamento: Departamento;
    fecha_entrada: string;
    fecha_firmado: string;
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
}

interface Entidad {
    id: number;
    municipio: Municipio;
    nombre_entidad: string;
    codigo_entidad: string;
    domicilio_legal: string;
    telefonos: string;
    logo: string;
}

interface Notificacion {
    id: number;
    observaciones: string;
    texto: string;
    fecha: string;
}

interface Revision {
    id: number;
    fecha_ultima_revision: string;
}

interface Usuario {
    id: number;
    username: string;
    roles: string;
    password: string;
    nombre: string;
    apellidos: string;
    cargo: string;
    correo: string;
    movil: string;
    extension: number;
}

interface VigenciaContrato {
    id: number;
    vigencia: number;
    alerta_vigencia: number;
    tipo_alerta_vigencia: string;
}

interface TipoContrato {
    id: number;
    tipo_contrato: string;
}

interface TipoProveedor {
    id: number;
    tipo_proveedor: string;
}