export const mockProvincia = [
    { id: 1, nombre_provincia: "Havana" },
    { id: 2, nombre_provincia: "Santiago de Cuba" },
    { id: 3, nombre_provincia: "Matanzas" },
    { id: 4, nombre_provincia: "Cienfuegos" },
    { id: 5, nombre_provincia: "Pinar del Río" },
    { id: 6, nombre_provincia: "Camagüey" },
    { id: 7, nombre_provincia: "Holguín" },
    { id: 8, nombre_provincia: "Villa Clara" },
    { id: 9, nombre_provincia: "Las Tunas" },
    { id: 10, nombre_provincia: "Granma" }
];

export const mockMinisterio = [
    { id: 1, nombre_ministerio: "Ministerio de Salud" },
    { id: 2, nombre_ministerio: "Ministerio de Educación" },
    { id: 3, nombre_ministerio: "Ministerio de Transporte" },
    { id: 4, nombre_ministerio: "Ministerio de Agricultura" },
    { id: 5, nombre_ministerio: "Ministerio de Comercio" },
    { id: 6, nombre_ministerio: "Ministerio de Turismo" },
    { id: 7, nombre_ministerio: "Ministerio de Energía" },
    { id: 8, nombre_ministerio: "Ministerio de Cultura" },
    { id: 9, nombre_ministerio: "Ministerio de Justicia" },
    { id: 10, nombre_ministerio: "Ministerio de Finanzas" }
];

export const mockMunicipio = [
    { id: 1, provincia: mockProvincia[0], nombre_municipio: "Plaza de la Revolución" },
    { id: 2, provincia: mockProvincia[0], nombre_municipio: "Vedado" },
    { id: 3, provincia: mockProvincia[1], nombre_municipio: "Santiago" },
    { id: 4, provincia: mockProvincia[2], nombre_municipio: "Varadero" },
    { id: 5, provincia: mockProvincia[3], nombre_municipio: "Cienfuegos Centro" },
    { id: 6, provincia: mockProvincia[4], nombre_municipio: "Pinar" },
    { id: 7, provincia: mockProvincia[5], nombre_municipio: "Camagüey Centro" },
    { id: 8, provincia: mockProvincia[6], nombre_municipio: "Holguín Ciudad" },
    { id: 9, provincia: mockProvincia[7], nombre_municipio: "Santa Clara" },
    { id: 10, provincia: mockProvincia[8], nombre_municipio: "Las Tunas Centro" }
];

export const mockTipoProveedor = [
    { id: 1, tipo_proveedor: "Persona Jurídica" },
    { id: 2, tipo_proveedor: "Persona Natural" },
    { id: 3, tipo_proveedor: "Cooperativa" },
    { id: 4, tipo_proveedor: "ONG" },
    { id: 5, tipo_proveedor: "Gubernamental" },
    { id: 6, tipo_proveedor: "Internacional" },
    { id: 7, tipo_proveedor: "Privada" },
    { id: 8, tipo_proveedor: "Mixta" },
    { id: 9, tipo_proveedor: "Autónomo" },
    { id: 10, tipo_proveedor: "Asociación" }
];

export const mockProveedor = [
    { id: 1, municipio: mockMunicipio[0], ministerio: mockMinisterio[0], nombre: "Proveedor Salud Havana", codigo: "PRV001", telefonos: "123-456-7890", domicilio: "Calle 23, Havana" },
    { id: 2, municipio: mockMunicipio[1], ministerio: mockMinisterio[1], nombre: "Educa Vedado", codigo: "PRV002", telefonos: "234-567-8901", domicilio: "Calle 5, Vedado" },
    { id: 3, municipio: mockMunicipio[2], ministerio: mockMinisterio[2], nombre: "Transporte Santiago", codigo: "PRV003", telefonos: "345-678-9012", domicilio: "Avenida 10, Santiago" },
    { id: 4, municipio: mockMunicipio[3], ministerio: mockMinisterio[3], nombre: "Agro Varadero", codigo: "PRV004", telefonos: "456-789-0123", domicilio: "Calle 15, Varadero" },
    { id: 5, municipio: mockMunicipio[4], ministerio: mockMinisterio[4], nombre: "Comercio Cienfuegos", codigo: "PRV005", telefonos: "567-890-1234", domicilio: "Calle 20, Cienfuegos" },
    { id: 6, municipio: mockMunicipio[5], ministerio: mockMinisterio[5], nombre: "Turismo Pinar", codigo: "PRV006", telefonos: "678-901-2345", domicilio: "Avenida 25, Pinar" },
    { id: 7, municipio: mockMunicipio[6], ministerio: mockMinisterio[6], nombre: "Energía Camagüey", codigo: "PRV007", telefonos: "789-012-3456", domicilio: "Calle 30, Camagüey" },
    { id: 8, municipio: mockMunicipio[7], ministerio: mockMinisterio[7], nombre: "Cultura Holguín", codigo: "PRV008", telefonos: "890-123-4567", domicilio: "Avenida 35, Holguín" },
    { id: 9, municipio: mockMunicipio[8], ministerio: mockMinisterio[8], nombre: "Justicia Santa Clara", codigo: "PRV009", telefonos: "901-234-5678", domicilio: "Calle 40, Santa Clara" },
    { id: 10, municipio: mockMunicipio[9], ministerio: mockMinisterio[9], nombre: "Finanzas Las Tunas", codigo: "PRV010", telefonos: "012-345-6789", domicilio: "Avenida 45, Las Tunas" }
];

export const mockDepartamento = [
    { id: 1, nombre_dpto: "Recursos Humanos" },
    { id: 2, nombre_dpto: "Finanzas" },
    { id: 3, nombre_dpto: "Logística" },
    { id: 4, nombre_dpto: "Producción" },
    { id: 5, nombre_dpto: "Ventas" },
    { id: 6, nombre_dpto: "Tecnología" },
    { id: 7, nombre_dpto: "Marketing" },
    { id: 8, nombre_dpto: "Legal" },
    { id: 9, nombre_dpto: "Operaciones" },
    { id: 10, nombre_dpto: "Administración" }
];

export const mockVigenciaContrato = [
    { id: 1, vigencia: 2023, alerta_vigencia: 30, tipo_alerta_vigencia: "Días" },
    { id: 2, vigencia: 2024, alerta_vigencia: 15, tipo_alerta_vigencia: "Días" },
    { id: 3, vigencia: 2025, alerta_vigencia: 60, tipo_alerta_vigencia: "Días" },
    { id: 4, vigencia: 2023, alerta_vigencia: 1, tipo_alerta_vigencia: "Meses" },
    { id: 5, vigencia: 2024, alerta_vigencia: 2, tipo_alerta_vigencia: "Meses" },
    { id: 6, vigencia: 2025, alerta_vigencia: 45, tipo_alerta_vigencia: "Días" },
    { id: 7, vigencia: 2023, alerta_vigencia: 90, tipo_alerta_vigencia: "Días" },
    { id: 8, vigencia: 2024, alerta_vigencia: 3, tipo_alerta_vigencia: "Meses" },
    { id: 9, vigencia: 2025, alerta_vigencia: 10, tipo_alerta_vigencia: "Días" },
    { id: 10, vigencia: 2023, alerta_vigencia: 120, tipo_almo_alerta_vigencia: "Días" }
];

export const mockTipoContrato = [
    { id: 1, tipo_contrato: "Suministro" },
    { id: 2, tipo_contrato: "Servicios" },
    { id: 3, tipo_contrato: "Obra Pública" },
    { id: 4, tipo_contrato: "Consultoría" },
    { id: 5, tipo_contrato: "Arrendamiento" },
    { id: 6, tipo_contrato: "Mantenimiento" },
    { id: 7, tipo_contrato: "Construcción" },
    { id: 8, tipo_contrato: "Capacitación" },
    { id: 9, tipo_contrato: "Eventos" },
    { id: 10, tipo_contrato: "Transporte" }
];

export const mockContrato = [
    { id: 1, vigencia: mockVigenciaContrato[0], proveedor: mockProveedor[0], tipo_contrato: mockTipoContrato[0], no_contrato: "CTR001", fecha_entrada: "2023-01-15", fecha_firmado: "2023-01-20", valor_cup: 10000, monto_venimiento_cup: 2000, valor_cl: 8000, monto_venimiento_cl: 1500, valor_usd: 500, monto_venimiento_usd: 100, observaciones: "Contrato inicial", no_comite_contratacion: 1, fecha_comite_contratacion: "2023-01-10", no_acuerdo_comite_contratacion: 101, fecha_acuerdo_comite_contratacion: "2023-01-12", no_comite_administracion: 201, fecha_comite_administracion: "2023-01-14" },
    { id: 2, vigencia: mockVigenciaContrato[1], proveedor: mockProveedor[1], tipo_contrato: mockTipoContrato[1], no_contrato: "CTR002", fecha_entrada: "2024-02-10", fecha_firmado: "2024-02-15", valor_cup: 12000, monto_venimiento_cup: 2500, valor_cl: 9000, monto_venimiento_cl: 1800, valor_usd: 600, monto_venimiento_usd: 120, observaciones: "Contrato educativo", no_comite_contratacion: 2, fecha_comite_contratacion: "2024-02-05", no_acuerdo_comite_contratacion: 102, fecha_acuerdo_comite_contratacion: "2024-02-07", no_comite_administracion: 202, fecha_comite_administracion: "2024-02-09" },
    { id: 3, vigencia: mockVigenciaContrato[2], proveedor: mockProveedor[2], tipo_contrato: mockTipoContrato[2], no_contrato: "CTR003", fecha_entrada: "2025-03-20", fecha_firmado: "2025-03-25", valor_cup: 15000, monto_venimiento_cup: 3000, valor_cl: 11000, monto_venimiento_cl: 2200, valor_usd: 700, monto_venimiento_usd: 140, observaciones: "Obra pública", no_comite_contratacion: 3, fecha_comite_contratacion: "2025-03-15", no_acuerdo_comite_contratacion: 103, fecha_acuerdo_comite_contratacion: "2025-03-17", no_comite_administracion: 203, fecha_comite_administracion: "2025-03-19" },
    { id: 4, vigencia: mockVigenciaContrato[3], proveedor: mockProveedor[3], tipo_contrato: mockTipoContrato[3], no_contrato: "CTR004", fecha_entrada: "2023-04-10", fecha_firmado: "2023-04-15", valor_cup: 8000, monto_venimiento_cup: 1600, valor_cl: 6000, monto_venimiento_cl: 1200, valor_usd: 400, monto_venimiento_usd: 80, observaciones: "Consultoría agrícola", no_comite_contratacion: 4, fecha_comite_contratacion: "2023-04-05", no_acuerdo_comite_contratacion: 104, fecha_acuerdo_comite_contratacion: "2023-04-07", no_comite_administracion: 204, fecha_comite_administracion: "2023-04-09" },
    { id: 5, vigencia: mockVigenciaContrato[4], proveedor: mockProveedor[4], tipo_contrato: mockTipoContrato[4], no_contrato: "CTR005", fecha_entrada: "2024-05-15", fecha_firmado: "2024-05-20", valor_cup: 9000, monto_venimiento_cup: 1800, valor_cl: 7000, monto_venimiento_cl: 1400, valor_usd: 450, monto_venimiento_usd: 90, observaciones: "Arrendamiento", no_comite_contratacion: 5, fecha_comite_contratacion: "2024-05-10", no_acuerdo_comite_contratacion: 105, fecha_acuerdo_comite_contratacion: "2024-05-12", no_comite_administracion: 205, fecha_comite_administracion: "2024-05-14" },
    { id: 6, vigencia: mockVigenciaContrato[5], proveedor: mockProveedor[5], tipo_contrato: mockTipoContrato[5], no_contrato: "CTR006", fecha_entrada: "2025-06-20", fecha_firmado: "2025-06-25", valor_cup: 11000, monto_venimiento_cup: 2200, valor_cl: 8500, monto_venimiento_cl: 1700, valor_usd: 550, monto_venimiento_usd: 110, observaciones: "Mantenimiento turístico", no_comite_contratacion: 6, fecha_comite_contratacion: "2025-06-15", no_acuerdo_comite_contratacion: 106, fecha_acuerdo_comite_contratacion: "2025-06-17", no_comite_administracion: 206, fecha_comite_administracion: "2025-06-19" },
    { id: 7, vigencia: mockVigenciaContrato[6], proveedor: mockProveedor[6], tipo_contrato: mockTipoContrato[6], no_contrato: "CTR007", fecha_entrada: "2023-07-10", fecha_firmado: "2023-07-15", valor_cup: 13000, monto_venimiento_cup: 2600, valor_cl: 9500, monto_venimiento_cl: 1900, valor_usd: 650, monto_venimiento_usd: 130, observaciones: "Construcción energética", no_comite_contratacion: 7, fecha_comite_contratacion: "2023-07-05", no_acuerdo_comite_contratacion: 107, fecha_acuerdo_comite_contratacion: "2023-07-07", no_comite_administracion: 207, fecha_comite_administracion: "2023-07-09" },
    { id: 8, vigencia: mockVigenciaContrato[7], proveedor: mockProveedor[7], tipo_contrato: mockTipoContrato[7], no_contrato: "CTR008", fecha_entrada: "2024-08-15", fecha_firmado: "2024-08-20", valor_cup: 14000, monto_venimiento_cup: 2800, valor_cl: 10000, monto_venimiento_cl: 2000, valor_usd: 700, monto_venimiento_usd: 140, observaciones: "Capacitación cultural", no_comite_contratacion: 8, fecha_comite_contratacion: "2024-08-10", no_acuerdo_comite_contratacion: 108, fecha_acuerdo_comite_contratacion: "2024-08-12", no_comite_administracion: 208, fecha_comite_administracion: "2024-08-14" },
    { id: 9, vigencia: mockVigenciaContrato[8], proveedor: mockProveedor[8], tipo_contrato: mockTipoContrato[8], no_contrato: "CTR009", fecha_entrada: "2025-09-20", fecha_firmado: "2025-09-25", valor_cup: 16000, monto_venimiento_cup: 3200, valor_cl: 12000, monto_venimiento_cl: 2400, valor_usd: 800, monto_venimiento_usd: 160, observaciones: "Evento judicial", no_comite_contratacion: 9, fecha_comite_contratacion: "2025-09-15", no_acuerdo_comite_contratacion: 109, fecha_acuerdo_comite_contratacion: "2025-09-17", no_comite_administracion: 209, fecha_comite_administracion: "2025-09-19" },
    { id: 10, vigencia: mockVigenciaContrato[9], proveedor: mockProveedor[9], tipo_contrato: mockTipoContrato[9], no_contrato: "CTR010", fecha_entrada: "2023-10-10", fecha_firmado: "2023-10-15", valor_cup: 17000, monto_venimiento_cup: 3400, valor_cl: 13000, monto_venimiento_cl: 2600, valor_usd: 850, monto_venimiento_usd: 170, observaciones: "Transporte financiero", no_comite_contratacion: 10, fecha_comite_contratacion: "2023-10-05", no_acuerdo_comite_contratacion: 110, fecha_acuerdo_comite_contratacion: "2023-10-07", no_comite_administracion: 210, fecha_comite_administracion: "2023-10-09" }
];

export const mockSuplemento = [
    { id: 1, vigencia: mockVigenciaContrato[0], proveedor: mockProveedor[0], tipo_contrato: mockTipoContrato[0], contrato: mockContrato[0], departamento: mockDepartamento[0], fecha_entrada: "2023-02-01", fecha_firmado: "2023-02-05", valor_cup: 2000, monto_venimiento_cup: 400, valor_cl: 1500, monto_venimiento_cl: 300, valor_usd: 100, monto_venimiento_usd: 20, observaciones: "Suplemento 1", no_comite_contratacion: 11, fecha_comite_contratacion: "2023-01-28", no_acuerdo_comite_contratacion: 111, fecha_acuerdo_comite_contratacion: "2023-01-30", no_comite_administracion: 211, fecha_comite_administracion: "2023-02-02" },
    { id: 2, vigencia: mockVigenciaContrato[1], proveedor: mockProveedor[1], tipo_contrato: mockTipoContrato[1], contrato: mockContrato[1], departamento: mockDepartamento[1], fecha_entrada: "2024-03-01", fecha_firmado: "2024-03-05", valor_cup: 2200, monto_venimiento_cup: 440, valor_cl: 1600, monto_venimiento_cl: 320, valor_usd: 110, monto_venimiento_usd: 22, observaciones: "Suplemento 2", no_comite_contratacion: 12, fecha_comite_contratacion: "2024-02-26", no_acuerdo_comite_contratacion: 112, fecha_acuerdo_comite_contratacion: "2024-02-28", no_comite_administracion: 212, fecha_comite_administracion: "2024-03-02" },
    { id: 3, vigencia: mockVigenciaContrato[2], proveedor: mockProveedor[2], tipo_contrato: mockTipoContrato[2], contrato: mockContrato[2], departamento: mockDepartamento[2], fecha_entrada: "2025-04-01", fecha_firmado: "2025-04-05", valor_cup: 2400, monto_venimiento_cup: 480, valor_cl: 1700, monto_venimiento_cl: 340, valor_usd: 120, monto_venimiento_usd: 24, observaciones: "Suplemento 3", no_comite_contratacion: 13, fecha_comite_contratacion: "2025-03-27", no_acuerdo_comite_contratacion: 113, fecha_acuerdo_comite_contratacion: "2025-03-29", no_comite_administracion: 213, fecha_comite_administracion: "2025-03-31" },
    { id: 4, vigencia: mockVigenciaContrato[3], proveedor: mockProveedor[3], tipo_contrato: mockTipoContrato[3], contrato: mockContrato[3], departamento: mockDepartamento[3], fecha_entrada: "2023-05-01", fecha_firmado: "2023-05-05", valor_cup: 2600, monto_venimiento_cup: 520, valor_cl: 1800, monto_venimiento_cl: 360, valor_usd: 130, monto_venimiento_usd: 26, observaciones: "Suplemento 4", no_comite_contratacion: 14, fecha_comite_contratacion: "2023-04-26", no_acuerdo_comite_contratacion: 114, fecha_acuerdo_comite_contratacion: "2023-04-28", no_comite_administracion: 214, fecha_comite_administracion: "2023-04-30" },
    { id: 5, vigencia: mockVigenciaContrato[4], proveedor: mockProveedor[4], tipo_contrato: mockTipoContrato[4], contrato: mockContrato[4], departamento: mockDepartamento[4], fecha_entrada: "2024-06-01", fecha_firmado: "2024-06-05", valor_cup: 2800, monto_venimiento_cup: 560, valor_cl: 1900, monto_venimiento_cl: 380, valor_usd: 140, monto_venimiento_usd: 28, observaciones: "Suplemento 5", no_comite_contratacion: 15, fecha_comite_contratacion: "2024-05-27", no_acuerdo_comite_contratacion: 115, fecha_acuerdo_comite_contratacion: "2024-05-29", no_comite_administracion: 215, fecha_comite_administracion: "2024-05-31" },
    { id: 6, vigencia: mockVigenciaContrato[5], proveedor: mockProveedor[5], tipo_contrato: mockTipoContrato[5], contrato: mockContrato[5], departamento: mockDepartamento[5], fecha_entrada: "2025-07-01", fecha_firmado: "2025-07-05", valor_cup: 3000, monto_venimiento_cup: 600, valor_cl: 2000, monto_venimiento_cl: 400, valor_usd: 150, monto_venimiento_usd: 30, observaciones: "Suplemento 6", no_comite_contratacion: 16, fecha_comite_contratacion: "2025-06-26", no_acuerdo_comite_contratacion: 116, fecha_acuerdo_comite_contratacion: "2025-06-28", no_comite_administracion: 216, fecha_comite_administracion: "2025-06-30" },
    { id: 7, vigencia: mockVigenciaContrato[6], proveedor: mockProveedor[6], tipo_contrato: mockTipoContrato[6], contrato: mockContrato[6], departamento: mockDepartamento[6], fecha_entrada: "2023-08-01", fecha_firmado: "2023-08-05", valor_cup: 3200, monto_venimiento_cup: 640, valor_cl: 2100, monto_venimiento_cl: 420, valor_usd: 160, monto_venimiento_usd: 32, observaciones: "Suplemento 7", no_comite_contratacion: 17, fecha_comite_contratacion: "2023-07-27", no_acuerdo_comite_contratacion: 117, fecha_acuerdo_comite_contratacion: "2023-07-29", no_comite_administracion: 217, fecha_comite_administracion: "2023-07-31" },
    { id: 8, vigencia: mockVigenciaContrato[7], proveedor: mockProveedor[7], tipo_contrato: mockTipoContrato[7], contrato: mockContrato[7], departamento: mockDepartamento[7], fecha_entrada: "2024-09-01", fecha_firmado: "2024-09-05", valor_cup: 3400, monto_venimiento_cup: 680, valor_cl: 2200, monto_venimiento_cl: 440, valor_usd: 170, monto_venimiento_usd: 34, observaciones: "Suplemento 8", no_comite_contratacion: 18, fecha_comite_contratacion: "2024-08-27", no_acuerdo_comite_contratacion: 118, fecha_acuerdo_comite_contratacion: "2024-08-29", no_comite_administracion: 218, fecha_comite_administracion: "2024-08-31" },
    { id: 9, vigencia: mockVigenciaContrato[8], proveedor: mockProveedor[8], tipo_contrato: mockTipoContrato[8], contrato: mockContrato[8], departamento: mockDepartamento[8], fecha_entrada: "2025-10-01", fecha_firmado: "2025-10-05", valor_cup: 3600, monto_venimiento_cup: 720, valor_cl: 2300, monto_venimiento_cl: 460, valor_usd: 180, monto_venimiento_usd: 36, observaciones: "Suplemento 9", no_comite_contratacion: 19, fecha_comite_contratacion: "2025-09-26", no_acuerdo_comite_contratacion: 119, fecha_acuerdo_comite_contratacion: "2025-09-28", no_comite_administracion: 219, fecha_comite_administracion: "2025-09-30" },
    { id: 10, vigencia: mockVigenciaContrato[9], proveedor: mockProveedor[9], tipo_contrato: mockTipoContrato[9], contrato: mockContrato[9], departamento: mockDepartamento[9], fecha_entrada: "2023-11-01", fecha_firmado: "2023-11-05", valor_cup: 3800, monto_venimiento_cup: 760, valor_cl: 2400, monto_venimiento_cl: 480, valor_usd: 190, monto_venimiento_usd: 38, observaciones: "Suplemento 10", no_comite_contratacion: 20, fecha_comite_contratacion: "2023-10-27", no_acuerdo_comite_contratacion: 120, fecha_acuerdo_comite_contratacion: "2023-10-29", no_comite_administracion: 220, fecha_comite_administracion: "2023-10-31" }
];

export const mockEjecucionContrato = [
    { id: 1, proveedor: mockProveedor[0], contrato: mockContrato[0], costo_cup: 5000, costo_cl: 4000, trabajo_ejecutado: "Entrega de suministros", fecha_ejecucion: "2023-03-01" },
    { id: 2, proveedor: mockProveedor[1], contrato: mockContrato[1], costo_cup: 6000, costo_cl: 4500, trabajo_ejecutado: "Servicios educativos", fecha_ejecucion: "2024-04-01" },
    { id: 3, proveedor: mockProveedor[2], contrato: mockContrato[2], costo_cup: 7000, costo_cl: 5000, trabajo_ejecutado: "Construcción carretera", fecha_ejecucion: "2025-05-01" },
    { id: 4, proveedor: mockProveedor[3], contrato: mockContrato[3], costo_cup: 4000, costo_cl: 3000, trabajo_ejecutado: "Consultoría técnica", fecha_ejecucion: "2023-06-01" },
    { id: 5, proveedor: mockProveedor[4], contrato: mockContrato[4], costo_cup: 4500, costo_cl: 3500, trabajo_ejecutado: "Arrendamiento equipos", fecha_ejecucion: "2024-07-01" },
    { id: 6, proveedor: mockProveedor[5], contrato: mockContrato[5], costo_cup: 5500, costo_cl: 4200, trabajo_ejecutado: "Mantenimiento hotel", fecha_ejecucion: "2025-08-01" },
    { id: 7, proveedor: mockProveedor[6], contrato: mockContrato[6], costo_cup: 6500, costo_cl: 4800, trabajo_ejecutado: "Instalación eléctrica", fecha_ejecucion: "2023-09-01" },
    { id: 8, proveedor: mockProveedor[7], contrato: mockContrato[7], costo_cup: 7000, costo_cl: 5000, trabajo_ejecutado: "Capacitación personal", fecha_ejecucion: "2024-10-01" },
    { id: 9, proveedor: mockProveedor[8], contrato: mockContrato[8], costo_cup: 8000, costo_cl: 6000, trabajo_ejecutado: "Organización evento", fecha_ejecucion: "2025-11-01" },
    { id: 10, proveedor: mockProveedor[9], contrato: mockContrato[9], costo_cup: 8500, costo_cl: 6500, trabajo_ejecutado: "Transporte mercancías", fecha_ejecucion: "2023-12-01" }
];

export const mockEjecucionSuplemento = [
    { id: 1, proveedor: mockProveedor[0], contrato: mockContrato[0], suplemento: mockSuplemento[0], costo_cup: 1000, costo_cl: 800, trabajo_ejecutado: "Suministro adicional", fecha_ejecucion: "2023-03-15" },
    { id: 2, proveedor: mockProveedor[1], contrato: mockContrato[1], suplemento: mockSuplemento[1], costo_cup: 1100, costo_cl: 850, trabajo_ejecutado: "Servicios extra", fecha_ejecucion: "2024-04-15" },
    { id: 3, proveedor: mockProveedor[2], contrato: mockContrato[2], suplemento: mockSuplemento[2], costo_cup: 1200, costo_cl: 900, trabajo_ejecutado: "Obra adicional", fecha_ejecucion: "2025-05-15" },
    { id: 4, proveedor: mockProveedor[3], contrato: mockContrato[3], suplemento: mockSuplemento[3], costo_cup: 1300, costo_cl: 950, trabajo_ejecutado: "Consultoría extendida", fecha_ejecucion: "2023-06-15" },
    { id: 5, proveedor: mockProveedor[4], contrato: mockContrato[4], suplemento: mockSuplemento[4], costo_cup: 1400, costo_cl: 1000, trabajo_ejecutado: "Arrendamiento extra", fecha_ejecucion: "2024-07-15" },
    { id: 6, proveedor: mockProveedor[5], contrato: mockContrato[5], suplemento: mockSuplemento[5], costo_cup: 1500, costo_cl: 1100, trabajo_ejecutado: "Mantenimiento adicional", fecha_ejecucion: "2025-08-15" },
    { id: 7, proveedor: mockProveedor[6], contrato: mockContrato[6], suplemento: mockSuplemento[6], costo_cup: 1600, costo_cl: 1200, trabajo_ejecutado: "Construcción extra", fecha_ejecucion: "2023-09-15" },
    { id: 8, proveedor: mockProveedor[7], contrato: mockContrato[7], suplemento: mockSuplemento[7], costo_cup: 1700, costo_cl: 1300, trabajo_ejecutado: "Capacitación adicional", fecha_ejecucion: "2024-10-15" },
    { id: 9, proveedor: mockProveedor[8], contrato: mockContrato[8], suplemento: mockSuplemento[8], costo_cup: 1800, costo_cl: 1400, trabajo_ejecutado: "Evento extendido", fecha_ejecucion: "2025-11-15" },
    { id: 10, proveedor: mockProveedor[9], contrato: mockContrato[9], suplemento: mockSuplemento[9], costo_cup: 1900, costo_cl: 1500, trabajo_ejecutado: "Transporte adicional", fecha_ejecucion: "2023-12-15" }
];

export const mockEntidad = [
    { id: 1, municipio: mockMunicipio[0], nombre_entidad: "Hospital Havana", codigo_entidad: "ENT001", domicilio_legal: "Calle 23, Havana", telefonos: "123-456-7890", logo: "hospital_logo.png" },
    { id: 2, municipio: mockMunicipio[1], nombre_entidad: "Escuela Vedado", codigo_entidad: "ENT002", domicilio_legal: "Calle 5, Vedado", telefonos: "234-567-8901", logo: "escuela_logo.png" },
    { id: 3, municipio: mockMunicipio[2], nombre_entidad: "Transporte Santiago", codigo_entidad: "ENT003", domicilio_legal: "Avenida 10, Santiago", telefonos: "345-678-9012", logo: "transporte_logo.png" },
    { id: 4, municipio: mockMunicipio[3], nombre_entidad: "Granja Varadero", codigo_entidad: "ENT004", domicilio_legal: "Calle 15, Varadero", telefonos: "456-789-0123", logo: "granja_logo.png" },
    { id: 5, municipio: mockMunicipio[4], nombre_entidad: "Tienda Cienfuegos", codigo_entidad: "ENT005", domicilio_legal: "Calle 20, Cienfuegos", telefonos: "567-890-1234", logo: "tienda_logo.png" },
    { id: 6, municipio: mockMunicipio[5], nombre_entidad: "Hotel Pinar", codigo_entidad: "ENT006", domicilio_legal: "Avenida 25, Pinar", telefonos: "678-901-2345", logo: "hotel_logo.png" },
    { id: 7, municipio: mockMunicipio[6], nombre_entidad: "Planta Camagüey", codigo_entidad: "ENT007", domicilio_legal: "Calle 30, Camagüey", telefonos: "789-012-3456", logo: "planta_logo.png" },
    { id: 8, municipio: mockMunicipio[7], nombre_entidad: "Teatro Holguín", codigo_entidad: "ENT008", domicilio_legal: "Avenida 35, Holguín", telefonos: "890-123-4567", logo: "teatro_logo.png" },
    { id: 9, municipio: mockMunicipio[8], nombre_entidad: "Tribunal Santa Clara", codigo_entidad: "ENT009", domicilio_legal: "Calle 40, Santa Clara", telefonos: "901-234-5678", logo: "tribunal_logo.png" },
    { id: 10, municipio: mockMunicipio[9], nombre_entidad: "Banco Las Tunas", codigo_entidad: "ENT010", domicilio_legal: "Avenida 45, Las Tunas", telefonos: "012-345-6789", logo: "banco_logo.png" }
];

export const mockNotificacion = [
    { id: 1, observaciones: "Contrato a punto de vencer", texto: "Revisar contrato CTR001", fecha: "2023-02-15" },
    { id: 2, observaciones: "Pago pendiente", texto: "Proveedor PRV002 solicita pago", fecha: "2024-03-10" },
    { id: 3, observaciones: "Fecha límite", texto: "Suplemento SUP003 vence pronto", fecha: "2025-04-20" },
    { id: 4, observaciones: "Revisión necesaria", texto: "Contrato CTR004 necesita revisión", fecha: "2023-05-01" },
    { id: 5, observaciones: "Documento faltante", texto: "Falta documentación PRV005", fecha: "2024-06-15" },
    { id: 6, observaciones: "Aprobación pendiente", texto: "Contrato CTR006 espera aprobación", fecha: "2025-07-10" },
    { id: 7, observaciones: "Error en datos", texto: "Revisar datos de PRV007", fecha: "2023-08-01" },
    { id: 8, observaciones: "Fecha de entrega", texto: "Entrega de SUP008 programada", fecha: "2024-09-20" },
    { id: 9, observaciones: "Alerta de vigencia", texto: "Contrato CTR009 próximo a vencer", fecha: "2025-10-15" },
    { id: 10, observaciones: "Confirmación requerida", texto: "Confirmar pago a PRV010", fecha: "2023-11-01" }
];

export const mockRevision = [
    { id: 1, fecha_ultima_revision: "2023-01-30" },
    { id: 2, fecha_ultima_revision: "2024-02-28" },
    { id: 3, fecha_ultima_revision: "2025-03-31" },
    { id: 4, fecha_ultima_revision: "2023-04-30" },
    { id: 5, fecha_ultima_revision: "2024-05-31" },
    { id: 6, fecha_ultima_revision: "2025-06-30" },
    { id: 7, fecha_ultima_revision: "2023-07-31" },
    { id: 8, fecha_ultima_revision: "2024-08-31" },
    { id: 9, fecha_ultima_revision: "2025-09-30" },
    { id: 10, fecha_ultima_revision: "2023-10-31" }
];

export const mockUsuario = [
    { id: 1, username: "admin1", roles: "admin", password: "admin123", nombre: "Juan", apellidos: "Pérez", cargo: "Administrador", correo: "juan.perez@email.com", movil: "123-456-7890", extension: 101 },
    { id: 2, username: "user1", roles: "user", password: "user123", nombre: "María", apellidos: "Gómez", cargo: "Analista", correo: "maria.gomez@email.com", movil: "234-567-8901", extension: 102 },
    { id: 3, username: "manager1", roles: "manager", password: "manager123", nombre: "Carlos", apellidos: "López", cargo: "Gerente", correo: "carlos.lopez@email.com", movil: "345-678-9012", extension: 103 },
    { id: 4, username: "admin2", roles: "admin", password: "admin456", nombre: "Ana", apellidos: "Martínez", cargo: "Administrador", correo: "ana.martinez@email.com", movil: "456-789-0123", extension: 104 },
    { id: 5, username: "user2", roles: "user", password: "user456", nombre: "Luis", apellidos: "Rodríguez", cargo: "Técnico", correo: "luis.rodriguez@email.com", movil: "567-890-1234", extension: 105 },
    { id: 6, username: "manager2", roles: "manager", password: "manager456", nombre: "Sofía", apellidos: "Hernández", cargo: "Gerente", correo: "sofia.hernandez@email.com", movil: "678-901-2345", extension: 106 },
    { id: 7, username: "admin3", roles: "admin", password: "admin789", nombre: "Pedro", apellidos: "Sánchez", cargo: "Administrador", correo: "pedro.sanchez@email.com", movil: "789-012-3456", extension: 107 },
    { id: 8, username: "user3", roles: "user", password: "user789", nombre: "Laura", apellidos: "Díaz", cargo: "Analista", correo: "laura.diaz@email.com", movil: "890-123-4567", extension: 108 },
    { id: 9, username: "manager3", roles: "manager", password: "manager789", nombre: "Diego", apellidos: "Ramírez", cargo: "Gerente", correo: "diego.ramirez@email.com", movil: "901-234-5678", extension: 109 },
    { id: 10, username: "admin4", roles: "admin", password: "admin012", nombre: "Elena", apellidos: "Torres", cargo: "Administrador", correo: "elena.torres@email.com", movil: "012-345-6789", extension: 110 }
];