
export interface Notification {
  id: string;
  tipo: 'Suplemento' | 'Contrato' | 'EjecucionContrato' | 'Proveedor'| 'Licencia';
  texto: string;
  fecha: Date;
   color: string;
  icono: string; // Usando los iconos de tu ejemplo anterior
}
