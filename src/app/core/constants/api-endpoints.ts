import { environment } from 'environments/environment';

export const API_ENDPOINTS = {
  BASE_URL: environment.apiUrl,
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password'
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  // Contratos
  CONTRATOS: `${environment.apiUrl}/contratos`,
  CONTRATOS_VENCIDOS: `${environment.apiUrl}/contratos/vencidos`,

  CATALOGOS: {
    MINISTERIOS: `${environment.apiUrl}/catalogos/ministerios`,
    PROVINCIAS: `${environment.apiUrl}/catalogos/provincias`,
    MUNICIPIOS: `${environment.apiUrl}/catalogos/municipios`,
    TIPOS_EMPRESA: `${environment.apiUrl}/catalogos/tipos-empresa`
  },
  // Departamentos
  DEPARTAMENTOS: `${environment.apiUrl}/departamentos`,
  DEPARTAMENTOS_EXPORT_EXCEL: `${environment.apiUrl}/departamentos/exportar/excel`,
  DEPARTAMENTOS_EXPORT_PDF: `${environment.apiUrl}/departamentos/exportar/pdf`,

  // Ejecución de Contratos
  EJECUCIONES_CONTRATO: `${environment.apiUrl}/ejecuciones-contrato`,

  // Ejecución de Suplementos
  EJECUCION_SUPLEMENTOS: `${environment.apiUrl}/ejecucion-suplementos`,

  // Estadísticas
  ESTADISTICAS: {
    DASHBOARD: `${environment.apiUrl}/estadisticas/dashboard`,
    CONTRATOS: `${environment.apiUrl}/estadisticas/contratos`,
    PROVEEDORES: `${environment.apiUrl}/estadisticas/proveedores`,
    EJECUCION: `${environment.apiUrl}/estadisticas/ejecucion`,
    EXPORT_REPORTE_GENERAL: `${environment.apiUrl}/estadisticas/exportar/reporte-general`
  },

  // Licencias
  LICENCIAS: `${environment.apiUrl}/licencias`,

  // Logs
  LOGS: {
    BASE: `${environment.apiUrl}/logs`,
    EXPORT_EXCEL: `${environment.apiUrl}/logs/export/excel`,
    EXPORT_PDF: `${environment.apiUrl}/logs/export/pdf`,
    DELETE_ALL: `${environment.apiUrl}/logs/todos`,
    CLEAN: `${environment.apiUrl}/logs/limpiar`
  },

  // Mi Entidad
  MI_ENTIDAD: `${environment.apiUrl}/mi-entidad`,

  // Notificaciones
  NOTIFICACIONES: `${environment.apiUrl}/notificaciones`,

  // Proveedores
  PROVEEDORES: `${environment.apiUrl}/proveedores`,
  PROVEEDORES_EXPORT_EXCEL: `${environment.apiUrl}/proveedores/exportar/excel`,
  PROVEEDORES_EXPORT_PDF: `${environment.apiUrl}/proveedores/exportar/pdf`,

  // Representantes
  REPRESENTANTES: `${environment.apiUrl}/representantes`,
  REPRESENTANTES_EXPORT_EXCEL: `${environment.apiUrl}/representantes/exportar/excel`,
  REPRESENTANTES_EXPORT_PDF: `${environment.apiUrl}/representantes/exportar/pdf`,

//Trabajadores
TRABAJADORES: `${environment.apiUrl}/trabajadores`,
TRABAJADORES_EXPORT_EXCEL: `${environment.apiUrl}/trabajadores/exportar/excel`,
TRABAJADORES_EXPORT_PDF: `${environment.apiUrl}/trabajadores/exportar/pdf`,

  // Suplementos
  SUPLEMENTOS: `${environment.apiUrl}/suplementos`
} as const;
