import { Contrato } from 'app/models/Type';

export const vencidoEjecucionContracts: Contrato[] = [
  {
    id: 1001,
    no_contrato: 'EC-2023-001',
    proveedor: { nombre: 'Proveedor A' },
    tipo_contrato: { tipo_contrato: 'Ejecución' },
    valor_cup: 150000,
    fecha_inicio: new Date('2022-01-01'),
    fecha_vencido: new Date('2023-01-01'),
    estado: 'Vencido'
  },
  {
    id: 1002,
    no_contrato: 'EC-2023-002',
    proveedor: { nombre: 'Proveedor B' },
    tipo_contrato: { tipo_contrato: 'Ejecución' },
    valor_cup: 200000,
    fecha_inicio: new Date('2022-06-01'),
    fecha_vencido: new Date('2023-06-01'),
    estado: 'Vencido'
  }
];
