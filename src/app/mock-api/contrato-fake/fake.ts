export const mockProvincia = [
  { id: 1, nombre_provincia: "Pinar del Río" },
  { id: 2, nombre_provincia: "Artemisa" },
  { id: 3, nombre_provincia: "Mayabeque" },
  { id: 4, nombre_provincia: "La Habana" },
  { id: 5, nombre_provincia: "Matanzas" },
  { id: 6, nombre_provincia: "Villa Clara" },
  { id: 7, nombre_provincia: "Cienfuegos" },
  { id: 8, nombre_provincia: "Sancti Spiritus" },
  { id: 9, nombre_provincia: "Ciego de Avila" },
  { id: 10, nombre_provincia: "Camagüey" },
  { id: 11, nombre_provincia: "Las Tunas" },
  { id: 12, nombre_provincia: "Holguín" },
  { id: 13, nombre_provincia: "Granma" },
  { id: 14, nombre_provincia: "Santiago de Cuba" },
  { id: 15, nombre_provincia: "Guantánamo" },
  { id: 16, nombre_provincia: "Isla de la Juventud" }
];

// Mock data for Municipio
export const mockMunicipio = [
  {
    id: 1,
    provincia_id: 1,
    provincia: mockProvincia[0],
    nombre_municipio: "Plaza de la Revolución"
  },
  {
    id: 2,
    provincia_id: 1,
    provincia: mockProvincia[0],
    nombre_municipio: "Centro Habana"
  },
  {
    id: 3,
    provincia_id: 2,
    provincia: mockProvincia[1],
    nombre_municipio: "Santiago de Cuba"
  },
  {
    id: 4,
    provincia_id: 3,
    provincia: mockProvincia[2],
    nombre_municipio: "Santa Clara"
  }
];

// Mock data for Ministerio
export const mockMinisterio = [
  { id: 1, nombre_ministerio: "MEP", descripcion: "Ministerio de Economía y Planificación" },
  { id: 2, nombre_ministerio: "MFP", descripcion: "Ministerio de Finanzas y Precios" },
  { id: 3, nombre_ministerio: "MTSS", descripcion: "Ministerio de Trabajo y Seguridad Social" },
  { id: 4, nombre_ministerio: "MINCOM", descripcion: "Ministerio de Comunicaciones" },
  { id: 5, nombre_ministerio: "MINDUS", descripcion: "Ministerio de Industrias" },
  { id: 6, nombre_ministerio: "MINEM", descripcion: "Ministerio de Energía y Minas" },
  { id: 7, nombre_ministerio: "MINAG", descripcion: "Ministerio de Agricultura" },
  { id: 8, nombre_ministerio: "MINAZ", descripcion: "Ministerio del Azúcar" },
  { id: 9, nombre_ministerio: "MINAL", descripcion: "Ministerio de la Industria Alimentaria" },
  { id: 10, nombre_ministerio: "MINCIN", descripcion: "Ministerio del Comercio Interior" },
  { id: 11, nombre_ministerio: "MINSAP", descripcion: "Ministerio de Salud Pública" },
  { id: 12, nombre_ministerio: "MINTUR", descripcion: "Ministerio de Turismo" },
  { id: 13, nombre_ministerio: "MICONS", descripcion: "Ministerio de la Construcción" },
  { id: 14, nombre_ministerio: "MITRANS", descripcion: "Ministerio del Transporte" },
  { id: 15, nombre_ministerio: "MINCULT", descripcion: "Ministerio de Cultura" },
  { id: 16, nombre_ministerio: "MINED", descripcion: "Ministerio de Educación" },
  { id: 17, nombre_ministerio: "MES", descripcion: "Ministerio de Educación Superior" },
  { id: 18, nombre_ministerio: "MINREX", descripcion: "Ministerio de Relaciones Exteriores" },
  { id: 19, nombre_ministerio: "MINCEX", descripcion: "Ministerio del Comercio Exterior y la Inversión Extranjera" },
  { id: 20, nombre_ministerio: "MINJUS", descripcion: "Ministerio de Justicia" },
  { id: 21, nombre_ministerio: "MINFAR", descripcion: "Ministerio de las Fuerzas Armadas Revolucionarias" },
  { id: 22, nombre_ministerio: "MININT", descripcion: "Ministerio del Interior" },
  { id: 23, nombre_ministerio: "CITMA", descripcion: "Ministerio de Ciencia, Tecnología y Medio Ambiente" },
  { id: 24, nombre_ministerio: "INRH", descripcion: "Instituto Nacional de Recursos Hidráulicos" },
  { id: 25, nombre_ministerio: "INDER", descripcion: "Instituto Nacional de Deportes, Educación Física y Recreación" },
  { id: 26, nombre_ministerio: "INOTU", descripcion: "Instituto Nacional de Ordenamiento Territorial y Urbanismo" },
  { id: 27, nombre_ministerio: "ICS", descripcion: "Instituto de Información y Comunicación Social" },
  { id: 28, nombre_ministerio: "BCC", descripcion: "Banco Central de Cuba" },
  { id: 29, nombre_ministerio: "TSP", descripcion: "Tribunal Supremo Popular" },
  { id: 30, nombre_ministerio: "FGR", descripcion: "Fiscalía General de la República" },
  { id: 31, nombre_ministerio: "CGR", descripcion: "Contraloría General de la República" }
];


// Mock data for TipoContrato

// Mock data for Departamento
export const mockDepartamento = [
  {
    id: 1,
    nombre_departamento: "Departamento de Compras",
    codigo: "COMP",
    descripcion: "Encargado de las compras institucionales"
  },
  {
    id: 2,
    nombre_departamento: "Departamento de Educación",
    codigo: "EDU",
    descripcion: "Gestión de servicios educativos"
  },
  {
    id: 3,
    nombre_departamento: "Departamento de Construcción",
    codigo: "CONST",
    descripcion: "Supervisión de proyectos de construcción"
  },
  {
    id: 4,
    nombre_departamento: "Departamento de Tecnología",
    codigo: "TEC",
    descripcion: "Gestión de servicios tecnológicos"
  }
];
export const mockVigencia = [
  {
    id: 1,
    vigencia: 2023,
    alerta_vigencia: 30,
    tipo_vigencia: "Anual",
    tipo_alerta_vigencia: "Días"
  },
  {
    id: 2,
    vigencia: 2024,
    alerta_vigencia: 15,
    tipo_vigencia: "Anual",
    tipo_alerta_vigencia: "Días"
  },
  {
    id: 3,
    vigencia: 2025,
    alerta_vigencia: 10,
    tipo_vigencia: "Anual",
    tipo_alerta_vigencia: "Días"
  },
  {
    id: 4,
    vigencia: 2024,
    alerta_vigencia: 20,
    tipo_vigencia: "Bianual",
    tipo_alerta_vigencia: "Días"
  },
  {
    id: 5,
    vigencia: 2025,
    alerta_vigencia: 45,
    tipo_vigencia: "Trianual",
    tipo_alerta_vigencia: "Días"
  }
];

// Mock data for Proveedor
export const mockProveedor = [
  {
    id: 1,
    municipio_id: 1,
    ministerio_id: 1,
    nombre: "Empresa de Suministros S.A.",
    codigo: "PRV001",
    telefonos: "555-0101",
    domicilio: "Calle Principal #123",
    municipio: mockMunicipio[0],
    ministerio: mockMinisterio[0], // Solo id y nombre_ministerio
    fechaCreacion: "2023-01-15",
    estado: "Activo",
    tipo: "Empresa Estatal",
    categoria: "Gubernamental"
  },
  {
    id: 2,
    municipio_id: 2,
    ministerio_id: 2,
    nombre: "Servicios Educativos C.A.",
    codigo: "PRV002",
    telefonos: "555-0202",
    domicilio: "Avenida Central #456",
    municipio: mockMunicipio[1],
    ministerio: mockMinisterio[1],
    fechaCreacion: "2023-02-20",
    estado: "Activo",
    tipo: "Cooperativa",
    categoria: "Cooperativa"
  },
  {
    id: 3,
    municipio_id: 3,
    ministerio_id: 3,
    nombre: "Constructora del Este",
    codigo: "PRV003",
    telefonos: "555-0303",
    domicilio: "Carrera 7 #789",
    municipio: mockMunicipio[2],
    ministerio: mockMinisterio[2],
    fechaCreacion: "2023-03-10",
    estado: "Inactivo",
    tipo: "Empresa Privada",
    categoria: "Privada"
  },
  {
    id: 4,
    municipio_id: 1,
    ministerio_id: 1,
    nombre: "Consultoría Técnica Ltda.",
    codigo: "PRV004",
    telefonos: "555-0404",
    domicilio: "Plaza Mayor #321",
    municipio: mockMunicipio[0],
    ministerio: mockMinisterio[0],
    fechaCreacion: "2023-04-05",
    estado: "Activo",
    tipo: "Cooperativa",
    categoria: "Cooperativa"
  },
  {
    id: 5,
    municipio_id: 2,
    ministerio_id: 2,
    nombre: "Eventos Culturales S.A.",
    codigo: "PRV005",
    telefonos: "555-0505",
    domicilio: "Calle Cultural #654",
    municipio: mockMunicipio[1],
    ministerio: mockMinisterio[1],
    fechaCreacion: "2023-05-15",
    estado: "Pendiente",
    tipo: "Empresa Privada",
    categoria: "Privada"
  },
  {
    id: 6,
    municipio_id: 3,
    ministerio_id: 3,
    nombre: "Transportes Unidos",
    codigo: "PRV006",
    telefonos: "555-0606",
    domicilio: "Avenida Principal #987",
    municipio: mockMunicipio[2],
    ministerio: mockMinisterio[2],
    fechaCreacion: "2023-06-20",
    estado: "Activo",
    tipo: "Empresa Estatal",
    categoria: "Gubernamental"
  },
  {
    id: 7,
    municipio_id: 4,
    ministerio_id: 4,
    nombre: "Tecnología Avanzada Corp.",
    codigo: "PRV007",
    telefonos: "555-0707",
    domicilio: "Boulevard Tecnológico #111",
    municipio: mockMunicipio[3],
    ministerio: mockMinisterio[3],
    fechaCreacion: "2023-07-25",
    estado: "Activo",
    tipo: "Empresa Privada",
    categoria: "Privada"
  }
];

// Mock data for Representantes
export const mockRepresentantes = [
  // Representante para Empresa de Suministros S.A.
  {
    id: 1,
    entidad_id: 1,
    nombre: "Carlos",
    apellidos: "Martínez López",
    cargo: "Director General",
    telefono: "555-0102",
    email: "carlos.martinez@suministros.cu",
    activo: true,
    entidad: {
      id: 1,
      municipio_id: 1,
      nombre_entidad: "Empresa de Suministros S.A.",
      codigo_entidad: "PRV001",
      domicilio_legal: "Calle Principal #123",
      telefonos: "555-0101",
      logo: "suministros_logo.png",
      tipo_empresa: "Empresa Estatal",
      provincia: null,
      municipio: mockMunicipio[0]
    },
    contrato_id: 1
  },
  // Representante para Servicios Educativos C.A.
  {
    id: 2,
    entidad_id: 2,
    nombre: "Ana María",
    apellidos: "González Pérez",
    cargo: "Directora Académica",
    telefono: "555-0203",
    email: "ana.gonzalez@serviciosedu.cu",
    activo: true,
    entidad: {
      id: 2,
      municipio_id: 2,
      nombre_entidad: "Importadora Caribeña S.A.",
      codigo_entidad: "PRV005",
      domicilio_legal: "Avenida del Puerto #500",
      telefonos: "555-0505",
      logo: "logo_importadora.png",
      tipo_empresa: "Importadora",
      municipio: mockMunicipio[0]
    },
    contrato_id: 2
  },
  // Representante para Constructora del Este
  {
    id: 3,
    entidad_id: 3,
    nombre: "Roberto",
    apellidos: "Fernández Díaz",
    cargo: "Gerente de Proyectos",
    telefono: "555-0304",
    email: "roberto.fernandez@constructoraeste.cu",
    activo: true,
    entidad: {
      id: 3,
      municipio_id: 3,
      nombre_entidad: "Constructora del Este",
      codigo_entidad: "PRV003",
      domicilio_legal: "Carrera 7 #789",
      telefonos: "555-0303",
      logo: "logo_constructora.png",
      tipo_empresa: "Empresa Privada",
      municipio: mockMunicipio[2]
    },
    contrato_id: 3
  },
  // Representante para Consultoría Técnica Ltda.
  {
    id: 4,
    entidad_id: 4,
    nombre: "Laura",
    apellidos: "Sánchez Rodríguez",
    cargo: "Jefa de Consultoría",
    telefono: "555-0405",
    email: "laura.sanchez@consultoriatec.cu",
    activo: true,
    entidad: {
      id: 4,
      municipio_id: 1,
      nombre_entidad: "Consultoría Técnica Ltda.",
      codigo_entidad: "PRV004",
      domicilio_legal: "Calle 10 #11-12",
      telefonos: "555-0404",
      logo: "logo_consultoria.png",
      tipo_empresa: "Consultora",
      municipio: mockMunicipio[3]
    },
    contrato_id: 4
  },
  // Representante para Eventos Culturales S.A.
  {
    id: 5,
    entidad_id: 5,
    nombre: "Jorge",
    apellidos: "Hernández Mena",
    cargo: "Director de Eventos",
    telefono: "555-0506",
    email: "jorge.hernandez@eventosculturales.cu",
    activo: true,
    entidad: {
      id: 5,
      municipio_id: 2,
      nombre_entidad: "Empresa de Suministros S.A.",
      codigo_entidad: "PRV001",
      domicilio_legal: "Calle Principal #123",
      telefonos: "555-0101",
      logo: "logo_empresa_1.png",
      tipo_empresa: "Empresa Privada",
      municipio: mockMunicipio[0]
    },
    contrato_id: 5
  },
  // Representante para Transportes Unidos
  {
    id: 6,
    entidad_id: 6,
    nombre: "Marta",
    apellidos: "Díaz Suárez",
    cargo: "Gerente de Operaciones",
    telefono: "555-0607",
    email: "marta.diaz@transportesunidos.cu",
    activo: true,
    entidad: {
      id: 6,
      municipio_id: 3,
      nombre_entidad: "Transportes Unidos",
      codigo_entidad: "PRV006",
      domicilio_legal: "Avenida Principal #987",
      telefonos: "555-0606",
      logo: "logo_transportes.png",
      tipo_empresa: "Empresa Estatal",
      municipio: mockMunicipio[2]
    },
    contrato_id: 6
  },
  // Representante para Tecnología Avanzada Corp.
  {
    id: 7,
    entidad_id: 7,
    nombre: "David",
    apellidos: "García Pérez",
    cargo: "Director de Tecnología",
    telefono: "555-0708",
    email: "david.garcia@tecnologia-avanzada.cu",
    activo: true,
    entidad: {
      id: 7,
      municipio_id: 4,
      nombre_entidad: "Tecnologías Avanzadas",
      codigo_entidad: "PRV002",
      domicilio_legal: "Avenida Tecnológica #456",
      telefonos: "555-0202",
      logo: "logo_tecnologia.png",
      tipo_empresa: "Empresa de Tecnología",
      municipio: mockMunicipio[1]
    },
    contrato_id: 7
  }
  
];



// Mock data for VigenciaContrato (interface completa con proveedor)
export const mockVigenciaContrato = [
  {
    id: 1,
    vigencia: 2023,
    alerta_vigencia: 30,
    tipo_alerta_vigencia: "Días",
    tipo_vigencia: "Anual",
    proveedor: mockProveedor[0]
  },
  {
    id: 2,
    vigencia: 2024,
    alerta_vigencia: 15,
    tipo_alerta_vigencia: "Días",
    tipo_vigencia: "Anual",
    proveedor: mockProveedor[1]
  },
  {
    id: 3,
    vigencia: 2025,
    alerta_vigencia: 10,
    tipo_alerta_vigencia: "Días",
    tipo_vigencia: "Anual",
    proveedor: mockProveedor[2]
  },
  {
    id: 4,
    vigencia: 2024,
    alerta_vigencia: 20,
    tipo_alerta_vigencia: "Días",
    tipo_vigencia: "Bianual",
    proveedor: mockProveedor[3]
  },
  {
    id: 5,
    vigencia: 2025,
    alerta_vigencia: 45,
    tipo_alerta_vigencia: "Días",
    tipo_vigencia: "Trianual",
    proveedor: mockProveedor[4]
  }
];
export const mockTipoContrato = [
  {
    id: 1,
    nombre_tipo_contrato: "Suministros",
    descripcion: "Contratos para suministro de materiales"
  },
  {
    id: 2,
    nombre_tipo_contrato: "Servicios",
    descripcion: "Contratos para prestación de servicios"
  },
  {
    id: 3,
    nombre_tipo_contrato: "Construcción",
    descripcion: "Contratos para obras de construcción"
  },
  {
    id: 4,
    nombre_tipo_contrato: "Consultoría",
    descripcion: "Contratos para servicios de consultoría"
  },
  {
    id: 5,
    nombre_tipo_contrato: "Mantenimiento",
    descripcion: "Contratos para servicios de mantenimiento"
  }
];
// Mock data for Contrato
export const mockContrato = [
  {
    id: 1,
    vigencia_id: 1,
    proveedor_id: 1,
    tipo_contrato_id: 1,
    no_contrato: 1001,
    fecha_entrada: new Date("2023-01-15"),
    fecha_firmado: new Date("2023-01-10"),
    valor_cup: 100000,
    monto_vencimiento_cup: 90000,
    monto_vencimiento_cl: 70000,
    valor_usd: 4000,
    monto_vencimiento_usd: 3500,
    observaciones: "Contrato para suministros de oficina",
    no_contrato_contratacion: 2001,
    fecha_comite_contratacion: new Date("2023-01-05"),
    no_comite_contratacion: 3001,
    no_acuerdo_comite_contratacion: 4001,
    fecha_comite_administracion: new Date("2023-01-08"),
    no_comite_administracion: 5001,
    no_acuerdo_comite_administracion: 6001,
    departamento_id: 1,
    fecha_vencido: new Date("2023-12-31"),
    valor_monto_restante: 10000,
    entidad: ["Entidad A", "Entidad B"],
    vigencia: mockVigencia[0],
    proveedor: mockProveedor[0],
    tipo_contrato: mockTipoContrato[0],
    departamento: mockDepartamento[0],
    estado: "Vencido"
  },
  {
    id: 2,
    vigencia_id: 2,
    proveedor_id: 2,
    tipo_contrato_id: 2,
    no_contrato: 1002,
    fecha_entrada: new Date("2023-02-20"),
    fecha_firmado: new Date("2023-02-15"),
    valor_cup: 150000,
    monto_vencimiento_cup: 130000,
    monto_vencimiento_cl: 100000,
    valor_usd: 5000,
    monto_vencimiento_usd: 4500,
    observaciones: "Contrato para servicios educativos",
    no_contrato_contratacion: 2002,
    fecha_comite_contratacion: new Date("2023-02-10"),
    no_comite_contratacion: 3002,
    no_acuerdo_comite_contratacion: 4002,
    fecha_comite_administracion: new Date("2023-02-12"),
    no_comite_administracion: 5002,
    no_acuerdo_comite_administracion: 6002,
    departamento_id: 2,
    fecha_vencido: new Date("2024-12-31"),
    valor_monto_restante: 20000,
    entidad: ["Entidad Educativa A"],
    vigencia: mockVigencia[1],
    proveedor: mockProveedor[1],
    tipo_contrato: mockTipoContrato[1],
    departamento: mockDepartamento[1],
    estado: "Activo"
  },
  {
    id: 3,
    vigencia_id: 3,
    proveedor_id: 3,
    tipo_contrato_id: 3,
    no_contrato: 1003,
    fecha_entrada: new Date("2023-03-10"),
    fecha_firmado: new Date("2023-03-05"),
    valor_cup: 120000,
    monto_vencimiento_cup: 100000,
    monto_vencimiento_cl: 80000,
    valor_usd: 4500,
    monto_vencimiento_usd: 4000,
    observaciones: "Contrato para construcción de carretera",
    no_contrato_contratacion: 2003,
    fecha_comite_contratacion: new Date("2023-03-01"),
    no_comite_contratacion: 3003,
    no_acuerdo_comite_contratacion: 4003,
    fecha_comite_administracion: new Date("2023-03-03"),
    no_comite_administracion: 5003,
    no_acuerdo_comite_administracion: 6003,
    departamento_id: 3,
    fecha_vencido: new Date("2025-12-31"),
    valor_monto_restante: 20000,
    entidad: ["Entidad Construcción A"],
    vigencia: mockVigencia[2],
    proveedor: mockProveedor[2],
    tipo_contrato: mockTipoContrato[2],
    departamento: mockDepartamento[2],
    estado: "Activo"
  },
  {
    id: 4,
    vigencia_id: 1,
    proveedor_id: 4,
    tipo_contrato_id: 4,
    no_contrato: 1004,
    fecha_entrada: new Date("2023-04-05"),
    fecha_firmado: new Date("2023-04-01"),
    valor_cup: 40000,
    monto_vencimiento_cup: 35000,
    monto_vencimiento_cl: 25000,
    valor_usd: 1500,
    monto_vencimiento_usd: 1200,
    observaciones: "Contrato para consultoría técnica",
    no_contrato_contratacion: 2004,
    fecha_comite_contratacion: new Date("2023-03-25"),
    no_comite_contratacion: 3004,
    no_acuerdo_comite_contratacion: 4004,
    fecha_comite_administracion: new Date("2023-03-28"),
    no_comite_administracion: 5004,
    no_acuerdo_comite_administracion: 6004,
    departamento_id: 1,
    fecha_vencido: new Date("2023-12-31"),
    valor_monto_restante: 5000,
    entidad: ["Entidad Consultoría A"],
    vigencia: mockVigencia[0],
    proveedor: mockProveedor[3],
    tipo_contrato: mockTipoContrato[3],
    departamento: mockDepartamento[0],
    estado: "Vencido"
  },
  {
    id: 5,
    vigencia_id: 2,
    proveedor_id: 5,
    tipo_contrato_id: 5,
    no_contrato: 1005,
    fecha_entrada: new Date("2023-05-15"),
    fecha_firmado: new Date("2023-05-10"),
    valor_cup: 80000,
    monto_vencimiento_cup: 70000,
    monto_vencimiento_cl: 55000,
    valor_usd: 3000,
    monto_vencimiento_usd: 2500,
    observaciones: "Contrato para mantenimiento de equipos",
    no_contrato_contratacion: 2005,
    fecha_comite_contratacion: new Date("2023-05-05"),
    no_comite_contratacion: 3005,
    no_acuerdo_comite_contratacion: 4005,
    fecha_comite_administracion: new Date("2023-05-08"),
    no_comite_administracion: 5005,
    no_acuerdo_comite_administracion: 6005,
    departamento_id: 4,
    fecha_vencido: new Date("2024-12-31"),
    valor_monto_restante: 10000,
    entidad: ["Entidad Mantenimiento A"],
    vigencia: mockVigencia[1],
    proveedor: mockProveedor[4],
    tipo_contrato: mockTipoContrato[4],
    departamento: mockDepartamento[3],
    estado: "Activo"
  },
  {
    id: 6,
    vigencia_id: 3,
    proveedor_id: 6,
    tipo_contrato_id: 1,
    no_contrato: 1006,
    fecha_entrada: new Date("2023-06-20"),
    fecha_firmado: new Date("2023-06-15"),
    valor_cup: 90000,
    monto_vencimiento_cup: 80000,
    monto_vencimiento_cl: 65000,
    valor_usd: 3500,
    monto_vencimiento_usd: 3000,
    observaciones: "Contrato para transporte de materiales",
    no_contrato_contratacion: 2006,
    fecha_comite_contratacion: new Date("2023-06-10"),
    no_comite_contratacion: 3006,
    no_acuerdo_comite_contratacion: 4006,
    fecha_comite_administracion: new Date("2023-06-12"),
    no_comite_administracion: 5006,
    no_acuerdo_comite_administracion: 6006,
    departamento_id: 2,
    fecha_vencido: new Date("2025-12-31"),
    valor_monto_restante: 10000,
    entidad: ["Entidad Transporte A"],
    vigencia: mockVigencia[2],
    proveedor: mockProveedor[5],
    tipo_contrato: mockTipoContrato[0],
    departamento: mockDepartamento[1],
    estado: "Activo"
  },
  {
    id: 7,
    vigencia_id: 4,
    proveedor_id: 7,
    tipo_contrato_id: 2,
    no_contrato: 1007,
    fecha_entrada: new Date("2023-07-25"),
    fecha_firmado: new Date("2023-07-20"),
    valor_cup: 110000,
    monto_vencimiento_cup: 95000,
    monto_vencimiento_cl: 75000,
    valor_usd: 4200,
    monto_vencimiento_usd: 3800,
    observaciones: "Contrato para servicios tecnológicos",
    no_contrato_contratacion: 2007,
    fecha_comite_contratacion: new Date("2023-07-15"),
    no_comite_contratacion: 3007,
    no_acuerdo_comite_contratacion: 4007,
    fecha_comite_administracion: new Date("2023-07-18"),
    no_comite_administracion: 5007,
    no_acuerdo_comite_administracion: 6007,
    departamento_id: 4,
    fecha_vencido: new Date("2025-12-31"),
    valor_monto_restante: 15000,
    entidad: ["Entidad Tecnológica A"],
    vigencia: mockVigencia[3],
    proveedor: mockProveedor[6],
    tipo_contrato: mockTipoContrato[1],
    departamento: mockDepartamento[3],
    estado: "Activo"
  }
];

// Mock data for EjecucionContrato
export const mockEjecucionContrato = [
  {
    id: 1,
    proveedor_id: 1,
    no_contrato_id: 1,
    costo_cup: 5000,
    costo_cl: 4000,
    trabajo_ejecutado: "Entrega de suministros",
    fecha_ejecucion: new Date("2025-03-01"),
    proveedor: mockProveedor[0],
    contrato: mockContrato[0]
  },
  {
    id: 2,
    proveedor_id: 2,
    no_contrato_id: 2,
    costo_cup: 6000,
    costo_cl: 4500,
    trabajo_ejecutado: "Servicios educativos",
    fecha_ejecucion: new Date("2025-04-01"),
    proveedor: mockProveedor[1],
    contrato: mockContrato[1]
  },
  {
    id: 3,
    proveedor_id: 1,
    no_contrato_id: 1,
    costo_cup: 5000,
    costo_cl: 4000,
    trabajo_ejecutado: "Entrega de suministros",
    fecha_ejecucion: new Date("2023-03-01"),
    proveedor: mockProveedor[0],
    contrato: mockContrato[0]
  },
  {
    id: 4,
    proveedor_id: 2,
    no_contrato_id: 2,
    costo_cup: 6000,
    costo_cl: 4500,
    trabajo_ejecutado: "Servicios educativos",
    fecha_ejecucion: new Date("2024-04-01"),
    proveedor: mockProveedor[1],
    contrato: mockContrato[1]
  },
  {
    id: 5,
    proveedor_id: 3,
    no_contrato_id: 3,
    costo_cup: 7000,
    costo_cl: 5000,
    trabajo_ejecutado: "Construcción carretera",
    fecha_ejecucion: new Date("2025-05-01"),
    proveedor: mockProveedor[2],
    contrato: mockContrato[2]
  },
  {
    id: 6,
    proveedor_id: 4,
    no_contrato_id: 4,
    costo_cup: 4000,
    costo_cl: 3000,
    trabajo_ejecutado: "Consultoría técnica",
    fecha_ejecucion: new Date("2023-06-01"),
    proveedor: mockProveedor[3],
    contrato: mockContrato[3]
  },
  {
    id: 7,
    proveedor_id: 5,
    no_contrato_id: 5,
    costo_cup: 8000,
    costo_cl: 6000,
    trabajo_ejecutado: "Mantenimiento",
    fecha_ejecucion: new Date("2024-07-01"),
    proveedor: mockProveedor[4],
    contrato: mockContrato[4]
  },
  {
    id: 8,
    proveedor_id: 6,
    no_contrato_id: 6,
    costo_cup: 9000,
    costo_cl: 7000,
    trabajo_ejecutado: "Transporte de materiales",
    fecha_ejecucion: new Date("2024-08-01"),
    proveedor: mockProveedor[5],
    contrato: mockContrato[5]
  },
  {
    id: 9,
    proveedor_id: 7,
    no_contrato_id: 7,
    costo_cup: 12000,
    costo_cl: 9000,
    trabajo_ejecutado: "Implementación de sistema",
    fecha_ejecucion: new Date("2024-09-01"),
    proveedor: mockProveedor[6],
    contrato: mockContrato[6]
  }
];

// Contratos vencidos
export const expiredContracts = [
  {
    id: 1,
    vigencia_id: 1,
    proveedor_id: 1,
    tipo_contrato_id: 1,
    no_contrato: 1001,
    fecha_entrada: new Date("2023-01-15"),
    fecha_firmado: new Date("2023-01-10"),
    valor_cup: 100000,
    monto_vencimiento_cup: 90000,
    monto_vencimiento_cl: 70000,
    valor_usd: 4000,
    monto_vencimiento_usd: 3500,
    observaciones: "Contrato para suministros de oficina",
    no_contrato_contratacion: 2001,
    fecha_comite_contratacion: new Date("2023-01-05"),
    no_comite_contratacion: 3001,
    no_acuerdo_comite_contratacion: 4001,
    fecha_comite_administracion: new Date("2023-01-08"),
    no_comite_administracion: 5001,
    no_acuerdo_comite_administracion: 6001,
    departamento_id: 1,
    fecha_vencido: new Date("2023-12-31"),
    valor_monto_restante: 10000,
    entidad: ["Entidad A", "Entidad B"],
    vigencia: mockVigencia[0],
    proveedor: mockProveedor[0],
    tipo_contrato: mockTipoContrato[0],
    departamento: mockDepartamento[0],
    estado: "Vencido"
  },
  {
    id: 4,
    vigencia_id: 1,
    proveedor_id: 4,
    tipo_contrato_id: 4,
    no_contrato: 1004,
    fecha_entrada: new Date("2023-04-05"),
    fecha_firmado: new Date("2023-04-01"),
    valor_cup: 40000,
    monto_vencimiento_cup: 35000,
    monto_vencimiento_cl: 25000,
    valor_usd: 1500,
    monto_vencimiento_usd: 1200,
    observaciones: "Contrato para consultoría técnica",
    no_contrato_contratacion: 2004,
    fecha_comite_contratacion: new Date("2023-03-25"),
    no_comite_contratacion: 3004,
    no_acuerdo_comite_contratacion: 4004,
    fecha_comite_administracion: new Date("2023-03-28"),
    no_comite_administracion: 5004,
    no_acuerdo_comite_administracion: 6004,
    departamento_id: 1,
    fecha_vencido: new Date("2023-12-31"),
    valor_monto_restante: 5000,
    entidad: ["Entidad Consultoría A"],
    vigencia: mockVigencia[0],
    proveedor: mockProveedor[3],
    tipo_contrato: mockTipoContrato[3],
    departamento: mockDepartamento[0],
    estado: "Vencido"
  }
];

// Contratos próximos a vencer
export const contractsNearExpiry = [
  {
    id: 2,
    vigencia_id: 2,
    proveedor_id: 2,
    tipo_contrato_id: 2,
    no_contrato: 1002,
    fecha_entrada: new Date("2023-02-20"),
    fecha_firmado: new Date("2023-02-15"),
    valor_cup: 150000,
    monto_vencimiento_cup: 130000,
    monto_vencimiento_cl: 100000,
    valor_usd: 5000,
    monto_vencimiento_usd: 4500,
    observaciones: "Contrato para servicios educativos",
    no_contrato_contratacion: 2002,
    fecha_comite_contratacion: new Date("2023-02-10"),
    no_comite_contratacion: 3002,
    no_acuerdo_comite_contratacion: 4002,
    fecha_comite_administracion: new Date("2023-02-12"),
    no_comite_administracion: 5002,
    no_acuerdo_comite_administracion: 6002,
    departamento_id: 2,
    fecha_vencido: new Date("2024-12-31"),
    valor_monto_restante: 20000,
    entidad: ["Entidad Educativa A"],
    vigencia: mockVigencia[1],
    proveedor: mockProveedor[1],
    tipo_contrato: mockTipoContrato[1],
    departamento: mockDepartamento[1],
    estado: "Próximo a vencer"
  },
  {
    id: 5,
    vigencia_id: 2,
    proveedor_id: 5,
    tipo_contrato_id: 5,
    no_contrato: 1005,
    fecha_entrada: new Date("2023-05-15"),
    fecha_firmado: new Date("2023-05-10"),
    valor_cup: 80000,
    monto_vencimiento_cup: 70000,
    monto_vencimiento_cl: 55000,
    valor_usd: 3000,
    monto_vencimiento_usd: 2500,
    observaciones: "Contrato para mantenimiento de equipos",
    no_contrato_contratacion: 2005,
    fecha_comite_contratacion: new Date("2023-05-05"),
    no_comite_contratacion: 3005,
    no_acuerdo_comite_contratacion: 4005,
    fecha_comite_administracion: new Date("2023-05-08"),
    no_comite_administracion: 5005,
    no_acuerdo_comite_administracion: 6005,
    departamento_id: 4,
    fecha_vencido: new Date("2024-12-31"),
    valor_monto_restante: 10000,
    entidad: ["Entidad Mantenimiento A"],
    vigencia: mockVigencia[1],
    proveedor: mockProveedor[4],
    tipo_contrato: mockTipoContrato[4],
    departamento: mockDepartamento[3],
    estado: "Próximo a vencer"
  }
];

// Estadísticas de contratos
export const contractStats = {
  total: 7,
  activos: 5,
  vencidos: 2,
  proximosAVencer: 2,
  valorTotal: 690000,
  valorEjecutado: 51000,
  valorPendiente: 639000
};

// Estadísticas por año
export const contractStatsByYear = [
  {
    year: 2023,
    total: 3,
    activos: 1,
    vencidos: 2,
    valorTotal: 260000,
    valorEjecutado: 15000
  },
  {
    year: 2024,
    total: 2,
    activos: 2,
    vencidos: 0,
    valorTotal: 230000,
    valorEjecutado: 14000
  },
  {
    year: 2025,
    total: 2,
    activos: 2,
    vencidos: 0,
    valorTotal: 200000,
    valorEjecutado: 22000
  }
];

// Estadísticas por proveedor
export const contractStatsByProvider = [
  {
    proveedor: mockProveedor[0],
    totalContratos: 1,
    valorTotal: 100000,
    valorEjecutado: 10000,
    estado: "Vencido"
  },
  {
    proveedor: mockProveedor[1],
    totalContratos: 1,
    valorTotal: 150000,
    valorEjecutado: 10500,
    estado: "Próximo a vencer"
  },
  {
    proveedor: mockProveedor[2],
    totalContratos: 1,
    valorTotal: 120000,
    valorEjecutado: 7000,
    estado: "Activo"
  },
  {
    proveedor: mockProveedor[3],
    totalContratos: 1,
    valorTotal: 40000,
    valorEjecutado: 4000,
    estado: "Vencido"
  },
  {
    proveedor: mockProveedor[4],
    totalContratos: 1,
    valorTotal: 80000,
    valorEjecutado: 8000,
    estado: "Próximo a vencer"
  },
  {
    proveedor: mockProveedor[5],
    totalContratos: 1,
    valorTotal: 90000,
    valorEjecutado: 9000,
    estado: "Activo"
  },
  {
    proveedor: mockProveedor[6],
    totalContratos: 1,
    valorTotal: 110000,
    valorEjecutado: 12000,
    estado: "Activo"
  }
];

// Estadísticas por tipo de contrato
export const contractStatsByType = [
  {
    tipoContrato: mockTipoContrato[0],
    totalContratos: 2,
    valorTotal: 190000,
    valorEjecutado: 14000
  },
  {
    tipoContrato: mockTipoContrato[1],
    totalContratos: 2,
    valorTotal: 260000,
    valorEjecutado: 18500
  },
  {
    tipoContrato: mockTipoContrato[2],
    totalContratos: 1,
    valorTotal: 120000,
    valorEjecutado: 7000
  },
  {
    tipoContrato: mockTipoContrato[3],
    totalContratos: 1,
    valorTotal: 40000,
    valorEjecutado: 4000
  },
  {
    tipoContrato: mockTipoContrato[4],
    totalContratos: 1,
    valorTotal: 80000,
    valorEjecutado: 8000
  }
];

// Ejecuciones por mes
export const executionsByMonth = [
  { mes: "Enero", ejecuciones: 0, valor: 0 },
  { mes: "Febrero", ejecuciones: 0, valor: 0 },
  { mes: "Marzo", ejecuciones: 2, valor: 10000 },
  { mes: "Abril", ejecuciones: 2, valor: 12000 },
  { mes: "Mayo", ejecuciones: 1, valor: 7000 },
  { mes: "Junio", ejecuciones: 1, valor: 4000 },
  { mes: "Julio", ejecuciones: 1, valor: 8000 },
  { mes: "Agosto", ejecuciones: 1, valor: 9000 },
  { mes: "Septiembre", ejecuciones: 1, valor: 12000 },
  { mes: "Octubre", ejecuciones: 0, valor: 0 },
  { mes: "Noviembre", ejecuciones: 0, valor: 0 },
  { mes: "Diciembre", ejecuciones: 0, valor: 0 }
];

// Alertas de contratos
export const contractAlerts = [
  {
    id: 1,
    contrato: mockContrato[1],
    tipo: "Próximo a vencer",
    diasRestantes: 15,
    mensaje: "El contrato 1002 vence en 15 días",
    prioridad: "Alta",
    fecha: new Date("2024-12-16")
  },
  {
    id: 2,
    contrato: mockContrato[4],
    tipo: "Próximo a vencer",
    diasRestantes: 15,
    mensaje: "El contrato 1005 vence en 15 días",
    prioridad: "Alta",
    fecha: new Date("2024-12-16")
  },
  {
    id: 3,
    contrato: mockContrato[0],
    tipo: "Vencido",
    diasRestantes: -360,
    mensaje: "El contrato 1001 está vencido desde hace 360 días",
    prioridad: "Crítica",
    fecha: new Date("2023-12-31")
  },
  {
    id: 4,
    contrato: mockContrato[3],
    tipo: "Vencido",
    diasRestantes: -360,
    mensaje: "El contrato 1004 está vencido desde hace 360 días",
    prioridad: "Crítica",
    fecha: new Date("2023-12-31")
  }
];

// Proveedores más activos
export const mostActiveProviders = [
  {
    proveedor: mockProveedor[1],
    totalContratos: 1,
    totalEjecuciones: 2,
    valorTotal: 150000,
    valorEjecutado: 10500,
    ultimaEjecucion: new Date("2025-04-01")
  },
  {
    proveedor: mockProveedor[6],
    totalContratos: 1,
    totalEjecuciones: 1,
    valorTotal: 110000,
    valorEjecutado: 12000,
    ultimaEjecucion: new Date("2024-09-01")
  },
  {
    proveedor: mockProveedor[5],
    totalContratos: 1,
    totalEjecuciones: 1,
    valorTotal: 90000,
    valorEjecutado: 9000,
    ultimaEjecucion: new Date("2024-08-01")
  },
  {
    proveedor: mockProveedor[4],
    totalContratos: 1,
    totalEjecuciones: 1,
    valorTotal: 80000,
    valorEjecutado: 8000,
    ultimaEjecucion: new Date("2024-07-01")
  },
  {
    proveedor: mockProveedor[2],
    totalContratos: 1,
    totalEjecuciones: 1,
    valorTotal: 120000,
    valorEjecutado: 7000,
    ultimaEjecucion: new Date("2025-05-01")
  }
];

// Resumen ejecutivo
export const executiveSummary = {
  contratosActivos: 5,
  contratosVencidos: 2,
  contratosProximosAVencer: 2,
  valorTotalContratos: 690000,
  valorTotalEjecutado: 51000,
  porcentajeEjecucion: 7.39,
  proveedoresActivos: 7,
  tiposContratoActivos: 5,
  alertasActivas: 4,
  tendenciaEjecucion: "Positiva",
  mesConMayorEjecucion: "Septiembre",
  proveedorMasActivo: "Tecnología Avanzada Corp.",
  departamentoConMasContratos: "Departamento de Compras"
};

