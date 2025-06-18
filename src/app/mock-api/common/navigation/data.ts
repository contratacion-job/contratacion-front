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
                title: 'Tipos',
                type: 'basic',
                icon: 'heroicons_outline:document-check',
                link: '/contratos/tipos',
            },
            {
                id: 'monto-vencimiento',
                title: 'Vencidos',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/contratos/vencidos',
            },
            {
                id: 'suplementos-group',
                title: 'Suplementos',
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
                        title: 'Vencidos',
                        type: 'basic',
                        icon: 'heroicons_outline:currency-dollar',
                        link: '/suplementos/vencidos',
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
                id: 'proveedores-representantes',
                title: 'Representantes',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/proveedores/lista',
            }

        ],
    },

    // Ejecución Contratos section
    {
        id: 'ejecucion-group',
        title: 'Ejecución Contratos',
        subtitle: 'Seguimiento de ejecución',
        type: 'collapsable',
        icon: 'heroicons_outline:chart-bar',
        children: [
            {
                id: 'ejecucion-tablero',
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
                link: '/contratos/contratos',
            },
            {
                id: 'ejecucion-vencidas',
                title: 'Vencidas',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/contratos/vencidas',
            },
        ],
    },

    // Mi Entidad section (Admin Only)
    {
        id: 'mi-entidad-group',
        title: 'Mi Entidad',
        subtitle: 'Organización interna - Solo Admin',
        type: 'collapsable',
        icon: 'heroicons_outline:office-building',
         roles: ['admin'],
        children: [
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
                link: '/organizacion/configuracion-correo',
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
                icon: 'heroicons_outline:database',
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
