/* eslint-disable */
/* eslint-disable */
export const users = [
    {
        id    : '1',
        username: 'admin',
        password: 'admin',
        name  : 'Admin User',
        apellidos: 'Admin',
        cargo: 'Administrator',
        correo: 'admin@company.com',
        movil: 1234567890,
        extension: 100,
        avatar: 'assets/admin.png',
        status: 'online',
        roles : ['admin']
    },
    {
        id    : '2',
        username: 'user',
        password: 'user',
        name  : 'Normal User',
        apellidos: 'User',
        cargo: 'User',
        correo: 'user@company.com',
        movil: 1234567891,
        extension: 101,
        avatar: 'assets/admin.png',
        status: 'online',
        roles : ['user']
    },
    {
        id    : '3',
        username: 'visor',
        password: 'visor',
        name  : 'Visor User',
        apellidos: 'Visor',
        cargo: 'Viewer',
        correo: 'visor@company.com',
        movil: 1234567892,
        extension: 102,
        avatar: 'assets/admin.png',
        status: 'online',
        roles : ['visor'] // Solo visualiza, imprime y exporta
    },
    {
        id    : '4',
        username: 'operador',
        password: 'operador',
        name  : 'Operador User',
        apellidos: 'Operador',
        cargo: 'Operator',
        correo: 'operador@company.com',
        movil: 1234567893,
        extension: 103,
        avatar: 'assets/admin.png',
        status: 'online',
        roles : ['operador'] // Agrega y modifica contratos/suplementos, sin eliminar
    },
    {
        id    : '5',
        username: 'ejecutor',
        password: 'ejecutor',
        name  : 'Ejecutor User',
        apellidos: 'Ejecutor',
        cargo: 'Executor',
        correo: 'ejecutor@company.com',
        movil: 1234567894,
        extension: 104,
        avatar: 'assets/admin.png',
        status: 'online',
        roles : ['ejecutor'] // Ejecuta contratos, rebaja facturas
    },
    {
        id    : '6',
        username: 'administrador',
        password: 'administrador',
        name  : 'Administrador User',
        apellidos: 'Administrador',
        cargo: 'Administrator',
        correo: 'administrador@company.com',
        movil: 1234567895,
        extension: 105,
        avatar: 'assets/admin.png',
        status: 'online',
        roles : ['administrador'] // Elimina contratos, modifica Mi Entidad, salva/restaura BD
    },
    {
        id    : '7',
        username: 'superadmin',
        password: 'superadmin',
        name  : 'Super Admin',
        apellidos: 'Super',
        cargo: 'Super Administrator',
        correo: 'superadmin@system.com',
        movil: 1234567896,
        extension: 106,
        avatar: 'assets/admin.png',
        status: 'online',
        roles : ['superadmin'] // Acceso total al sistema
    }
];