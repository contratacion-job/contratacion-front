export interface VigenciaContrato {
  id: number;
  vigencia: number;
  alerta_vigencia: number;
  tipo_alerta_vigencia: string;
  tipo_vigencia?: string;
  proveedorId?: number;
  tipo_contratoId?: number;
}
