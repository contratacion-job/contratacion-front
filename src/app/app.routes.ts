import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';


import { LayoutComponent } from 'app/layout/layout.component';
import { AdminGuard } from './core/auth/guards/admin.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'example'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'dashboards', children: [
                {path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.routes')},
                {path: 'analytics', loadChildren: () => import('app/modules/admin/dashboards/analytics/analytics.routes')},
                {path: 'finance', loadChildren: () => import('app/modules/admin/dashboards/finance/finance.routes')},
                {path: 'crypto', loadChildren: () => import('app/modules/admin/dashboards/crypto/crypto.routes')},
            ]},

            {path: 'apps', children: [

                {path: 'ecommerce', loadChildren: () => import('app/modules/admin/apps/ecommerce/ecommerce.routes')},

            ]},

            // Contratos module
            {path: 'contratos', loadChildren: () => import('app/modules/contratos/contratos-routing.module').then(m => m.ContratosRoutingModule)},

            // Suplementos module
            {path: 'suplementos', loadChildren: () => import('app/modules/suplementos/suplementos-routing.module').then(m => m.SuplementosRoutingModule)},

            // Proveedores module
            {path: 'proveedores', loadChildren: () => import('app/modules/proveedores/proveedores-routing.module').then(m => m.ProveedoresRoutingModule)},

            // Dashboard module
            {path: 'dashboard', loadChildren: () => import('app/modules/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule)},

            // Organización module
{path: 'organizacion', canActivate: [AdminGuard], loadChildren: () => import('app/modules/organizacion/organizacion-routing.module').then(m => m.OrganizacionRoutingModule)},

            // Reportes module
            {path: 'reportes', loadChildren: () => import('app/modules/reportes/reportes-routing.module').then(m => m.ReportesRoutingModule)},

            // Notificaciones module
            {path: 'notificaciones', loadChildren: () => import('app/modules/notificaciones/notificaciones-routing.module').then(m => m.NotificacionesRoutingModule)},


            {path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
        ]
    }
];
