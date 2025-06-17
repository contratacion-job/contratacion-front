/* eslint-disable */
import { Notificacion } from 'app/models/Type';
import { DateTime } from 'luxon';

/* Get the current instant */
const now = DateTime.now();
const coloresPorTipo: Record<Notificacion['tipo'], string> = {
  Contrato: '#ef4444',           // Rojo
  Suplemento: '#f59e42',         // Naranja
  EjecucionContrato: '#22c55e',  // Verde
  Proveedor: '#f59e42',
   Licencia: '#f59e43',           // Naranja (puedes cambiarlo a rojo o verde)
};

export const notificaciones: Notificacion[] = [
  {
    id: 1,
    tipo: 'Contrato',
    texto: 'El contrato de Juan Pérez está por vencer en 5 días.',
    fecha: now.plus({ days: 5 }).toJSDate(),
    icono: 'heroicons_mini:star',
    color: coloresPorTipo['Contrato'],
  },
  {
    id: 2,
    tipo: 'Contrato',
    texto: 'El contrato de María Gómez ha vencido hace 2 días.',
    fecha: now.minus({ days: 2 }).toJSDate(),
    icono: 'heroicons_mini:star',
    color: coloresPorTipo['Contrato'],
  },
  {
    id: 3,
    tipo: 'Licencia',
    texto: 'Su licencia esta al caducar',
    fecha: now.plus({ days: 1 }).toJSDate(),
    icono: 'heroicons_mini:envelope',
    color: coloresPorTipo['Suplemento'],
  },
  {
    id: 4,
    tipo: 'EjecucionContrato',
    texto: 'El contrato temporal de Ana Martínez vence hoy.',
    fecha: now.toJSDate(),
    icono: 'heroicons_mini:arrow-path',
    color: coloresPorTipo['EjecucionContrato'],
  },
  {
    id: 5,
    tipo: 'Suplemento',
    texto: 'La licencia de conducir de Luis Fernández está próxima a vencer en 3 días.',
    fecha: now.plus({ days: 3 }).toJSDate(),
    icono: 'heroicons_mini:envelope',
    color: coloresPorTipo['Suplemento'],
  },
  {
    id: 6,
    tipo: 'Proveedor',
    texto: 'El proveedor XYZ ha actualizado sus condiciones de servicio.',
    fecha: now.minus({ days: 1 }).toJSDate(),
    icono: 'heroicons_mini:user',
    color: coloresPorTipo['Proveedor'],
  },
  {
    id: 7,
    tipo: 'Contrato',
    texto: 'El contrato indefinido de Pedro Sánchez está activo y sin vencimiento próximo.',
    fecha: now.toJSDate(),
    icono: 'heroicons_mini:star',
    color: coloresPorTipo['Contrato'],
  },
  {
    id: 8,
    tipo: 'Suplemento',
    texto: 'La licencia médica de Laura Díaz ha expirado hace 3 días.',
    fecha: now.minus({ days: 3 }).toJSDate(),
    icono: 'heroicons_mini:envelope',
    color: coloresPorTipo['Suplemento'],
  },
  {
    id: 9,
    tipo: 'EjecucionContrato',
    texto: 'El contrato de Juan Pérez fue renovado recientemente.',
    fecha: now.minus({ days: 10 }).toJSDate(),
    icono: 'heroicons_mini:arrow-path',
    color: coloresPorTipo['EjecucionContrato'],
  },
  {
    id: 10,
    tipo: 'Proveedor',
    texto: 'Nuevo proveedor registrado para el área de suministros.',
    fecha: now.plus({ days: 7 }).toJSDate(),
    icono: 'heroicons_mini:user',
    color: coloresPorTipo['Proveedor'],
  },
];