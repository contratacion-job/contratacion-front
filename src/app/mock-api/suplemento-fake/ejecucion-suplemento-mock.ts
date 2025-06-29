import { EjecucionSuplemento } from 'app/models/Type';

export const mockEjecucionSuplemento: EjecucionSuplemento[] = [
  {
    id: 1,
    proveedor_id: 1,
    no_contrato_id: 101,
    no_suplemento_id: 201,
    costo_cup: 5000,
    costo_cl: 0,
    trabajo_ejecutado: 'Trabajo de mantenimiento',
    fecha_ejecucion: new Date('2023-12-01'),
    proveedor: { id: 1, municipio_id: 1, ministerio_id: 1, nombre: 'Proveedor A', codigo: 'P001', telefonos: '12345678', domicilio: 'Calle 1', municipio: null, ministerio: null, fechaCreacion: '2023-01-01' },
    contrato: { id: 101, vigencia_id: 1, proveedor_id: 1, tipo_contrato_id: 1, no_contrato: 1001, fecha_entrada: new Date('2023-01-01'), fecha_firmado: new Date('2023-01-10'), valor_cup: 100000, monto_vencimiento_cup: 0, monto_vencimiento_cl: 0, valor_usd: 0, monto_vencimiento_usd: 0, observaciones: '', no_contrato_contratacion: 1001, fecha_comite_contratacion: new Date('2023-01-05'), no_comite_contratacion: 1, no_acuerdo_comite_contratacion: 1, fecha_comite_administracion: new Date('2023-01-07'), no_comite_administracion: 1, no_acuerdo_comite_administracion: 1, departamento_id: 1, fecha_vencido: new Date('2023-11-30'), valor_monto_restante: 0, entidad: [], vigencia: null, proveedor: null, tipo_contrato: null, departamento: null, estado: 'Vencido' },
    suplemento: { id: 201, estado: 'Vencido', vigencia_id: 1, proveedor_id: 1, tipo_contrato_id: 1, no_contrato_id: 101, departamento_id: 1, fecha_entrada: new Date('2023-01-15'), fecha_firmado: new Date('2023-01-20'), valor_cup: 20000, monto_vencimiento_cup: 0, monto_vencimiento_cl: 0, valor_usd: 0, monto_vencimiento_usd: 0, observaciones: '', no_contrato_contratacion: 1001, fecha_comite_contratacion: new Date('2023-01-18'), no_comite_contratacion: 1, no_acuerdo_comite_contratacion: 1, fecha_comite_administracion: new Date('2023-01-19'), no_comite_administracion: 1, no_acuerdo_comite_administracion: 1, fecha_vencido: new Date('2023-11-30'), valor_monto_restante: 0, vigencia: null, proveedor: null, tipo_contrato: null, departamento: null }
  },
  {
    id: 2,
    proveedor_id: 2,
    no_contrato_id: 102,
    no_suplemento_id: 202,
    costo_cup: 3000,
    costo_cl: 0,
    trabajo_ejecutado: 'Reparación de equipo',
    fecha_ejecucion: new Date('2023-11-15'),
    proveedor: { id: 2, municipio_id: 2, ministerio_id: 2, nombre: 'Proveedor B', codigo: 'P002', telefonos: '87654321', domicilio: 'Calle 2', municipio: null, ministerio: null, fechaCreacion: '2023-02-01' },
    contrato: { id: 102, vigencia_id: 2, proveedor_id: 2, tipo_contrato_id: 2, no_contrato: 1002, fecha_entrada: new Date('2023-02-01'), fecha_firmado: new Date('2023-02-10'), valor_cup: 80000, monto_vencimiento_cup: 0, monto_vencimiento_cl: 0, valor_usd: 0, monto_vencimiento_usd: 0, observaciones: '', no_contrato_contratacion: 1002, fecha_comite_contratacion: new Date('2023-02-05'), no_comite_contratacion: 2, no_acuerdo_comite_contratacion: 2, fecha_comite_administracion: new Date('2023-02-07'), no_comite_administracion: 2, no_acuerdo_comite_administracion: 2, departamento_id: 2, fecha_vencido: new Date('2023-10-31'), valor_monto_restante: 0, entidad: [], vigencia: null, proveedor: null, tipo_contrato: null, departamento: null, estado: 'Vencido' },
    suplemento: { id: 202, estado: 'Vencido', vigencia_id: 2, proveedor_id: 2, tipo_contrato_id: 2, no_contrato_id: 102, departamento_id: 2, fecha_entrada: new Date('2023-02-15'), fecha_firmado: new Date('2023-02-20'), valor_cup: 15000, monto_vencimiento_cup: 0, monto_vencimiento_cl: 0, valor_usd: 0, monto_vencimiento_usd: 0, observaciones: '', no_contrato_contratacion: 1002, fecha_comite_contratacion: new Date('2023-02-18'), no_comite_contratacion: 2, no_acuerdo_comite_contratacion: 2, fecha_comite_administracion: new Date('2023-02-19'), no_comite_administracion: 2, no_acuerdo_comite_administracion: 2, fecha_vencido: new Date('2023-10-31'), valor_monto_restante: 0, vigencia: null, proveedor: null, tipo_contrato: null, departamento: null }
  }
];
