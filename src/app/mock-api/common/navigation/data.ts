/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // Contratos section
    {
        id: 'contratos-group',
        title: 'Contratos',
        subtitle: 'Gestión de contratos',
        type: 'collapsable',
        icon: 'heroicons_outline:document-text',
        children: [
            {
                id: 'vigencia',
                title: 'Tablero',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/dashboard/dashboard-contrato',
            },
            {
                id: 'tipos-contratos',
                title: 'Lista de Contratos',
                type: 'basic',
                icon: 'heroicons_outline:document-check',
                link: '/contratos/list',
            },
            {
                id: 'monto-vencimiento',
                title: 'Vencidos',
                type: 'basic',
                icon: 'heroicons_outline:receipt-percent',
                link: '/contratos/vencidos',
            },
            {
                id: 'ejecucion',
                title: 'Ejecucion',
                subtitle: 'Gestión de ejecuciones',
                type: 'collapsable',
                icon: 'heroicons_outline:document-duplicate',
                children: [
                    {
                        id: 'ejecucion-tablero',
                        title: 'Tablero',
                        type: 'basic',
                        icon: 'heroicons_outline:archive-box',
                        link: '/dashboard/dashboard-ejecucion',
                    },
                    {
                        id: 'ejecucion-contrato',
                        title: 'Ejecucion de contrato',
                        type: 'basic',
                        icon: 'heroicons_outline:arrow-trending-up',
                        link: '/contratos/ejecucion',
                    },
                    {
                        id: 'ejecucion-vencidos',
                        title: 'Vencidos',
                        type: 'basic',
                        icon: 'heroicons_outline:receipt-percent',
                        link: '/contratos/vencidas',
                    },
                ],
            },
        ],
    },

    // Suplementos section

    // Proveedores section
    {
        id: 'proveedores-group',
        title: 'Proveedores',
        subtitle: 'Gestión de proveedores',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'proveedores-tablero',
                title: 'Tablero',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/dashboard/dashboard-proveedor',
            },
            {
                id: 'proveedores',
                title: 'Lista de Proveedores',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/proveedores/lista',
            },
            {
                id: 'representantes',
                title: 'Representantes',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/proveedores/representantes',
            },
        ],
    },

    // Ejecución Contratos section
    {
        id: 'suplemento-group',
        title: 'Suplementos',
        subtitle: 'Gestión de suplementos',
        type: 'collapsable',
        icon: 'heroicons_outline:chart-bar',
        children: [
            {
                id: 'suplemento-tablero',
                title: 'Tablero',
                type: 'basic',
                icon: 'heroicons_outline:check-circle',
                link: '/dashboard/dashboard-ejecucion',
            },
            {
                id: 'ejecucion-suplementos',
                title: 'Suplementos',
                type: 'basic',
                icon: 'heroicons_outline:document-duplicate',
                link: '/suplementos/list',
            },
            {
                id: 'ejecucion-vencidas',
                title: 'Vencidas',
                type: 'basic',
                icon: 'heroicons_outline:receipt-percent',
                link: '/suplementos/vencidas',
            },
            {
                id: 'suplementos-group',
                title: 'Ejecucion',
                subtitle: 'Gestión de suplementos',
                type: 'collapsable',
                icon: 'heroicons_outline:document-duplicate',
                children: [
                    {
                        id: 'suplementos-tablero',
                        title: 'Tablero',
                        type: 'basic',
                        icon: 'heroicons_outline:archive-box',
                        link: '/dashboard/dashboard-suplimento',
                    },
                    {
                        id: 'suplementos-vencidos',
                        title: 'Ejecucion de suplementos',
                        type: 'basic',
                        icon: 'heroicons_outline:arrow-trending-up',
                        link: '/suplementos/ejecucion',
                    },
                    {
                        id: 'suplementos-vencidos',
                        title: 'Vencidos',
                        type: 'basic',
                        icon: 'heroicons_outline:receipt-percent',
                        link: '/suplementos/vencidos',
                    },
                ],
            },
        ],
    },

    // Mi Entidad section (Admin Only)
    {
        id: 'mi-entidad-group',
        title: 'Mi Entidad',
        subtitle: 'Organización interna - Solo Admin',
        type: 'collapsable',
        icon: 'heroicons_outline:building-office',
        roles: ['admin'],
        children: [
            {
                id: 'Entidad',
                title: 'Entidad',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/organizacion/entidad',
            },
            {
                id: 'departamentos',
                title: 'Departamentos',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/organizacion/departamentos',
            },
            {
                id: 'trabajadores',
                title: 'Trabajadores',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/organizacion/trabajadores',
            },
            {
                id: 'configuracion-correo',
                title: 'Configuración de Correo',
                type: 'basic',
                icon: 'heroicons_outline:envelope',
                link: '/notificaciones/correo',
            },
               {
                id: 'logs',
                title: 'Logs del sistema',
                type: 'basic',
                icon: 'heroicons_outline:window',
                link: '/organizacion/log',
            },
        ],
    },

    // Soporte section
    {
        id: 'soporte-group',
        title: 'Soporte',
        subtitle: 'Asistencia técnica',
        type: 'collapsable',
        icon: 'heroicons_outline:lifebuoy',
        children: [
            {
                id: 'gestion-bd',
                title: 'Gestión BD',
                type: 'basic',
                icon: 'heroicons_outline:circle-stack',
                link: '/organizacion/bd',
            },
            {
                id: 'licencia',
                title: 'Licencia',
                type: 'basic',
                icon: 'heroicons_outline:key',
                link: '/organizacion/licencia',
            },
        ],
    },
    // En tu navegación, agregar:
    {
        id: 'gestion-usuarios-group',
        title: 'Administración',
        subtitle: 'Gestión del sistema',
        type: 'group',
        icon: 'heroicons_outline:cog-6-tooth',
        children: [
            {
                id: 'gestion-usuarios',
                title: 'Gestión de Usuarios',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/admin/usuarios',
            },
        ],
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];

export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];

export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
