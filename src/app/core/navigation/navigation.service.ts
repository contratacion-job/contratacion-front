import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap, combineLatest, map, filter } from 'rxjs';
import { UserService } from 'app/core/user/user.service';

@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return combineLatest([
            this._navigation.asObservable(),
            this._userService.user$.pipe(
                filter(user => !!user) // Solo continuar cuando el usuario esté disponible
            )
        ]).pipe(
            map(([navigation, user]) => {
               
                if (!user || !user.roles) {
                  
                    return navigation;
                }

                return this.filterNavigationByRole(navigation, user.roles);
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) =>
            {
            
                this._navigation.next(navigation);
            }),
        );
    }

    /**
     * Filter navigation based on user roles
     */
    private filterNavigationByRole(navigation: Navigation, userRoles: string[]): Navigation
    {
        
        // Roles que pueden ver "Mi Entidad"
        const canAccessMiEntidad = this.hasAnyRole(userRoles, ['admin', 'administrador', 'superadmin']);
        
        // Roles que pueden ver "Gestión de Usuarios"
        const canAccessUserManagement = this.hasAnyRole(userRoles, ['admin', 'administrador', 'superadmin']);
        
     
        
        // Determinar qué elementos filtrar
        const itemsToFilter = [];
        
        if (!canAccessMiEntidad) {
            itemsToFilter.push('mi-entidad-group');
        }
        
        if (!canAccessUserManagement) {
            itemsToFilter.push('gestion-usuarios-group');
        }
        
        // Si no hay elementos que filtrar, devolver navegación completa
        if (itemsToFilter.length === 0) {
          
            return navigation;
        }
        
        // Filtrar elementos según los permisos
       
        return this.filterSpecificItems(navigation, itemsToFilter);
    }

    /**
     * Check if user has any of the specified roles
     */
    private hasAnyRole(userRoles: string[], allowedRoles: string[]): boolean
    {
        return userRoles.some(role => 
            allowedRoles.includes(role.toLowerCase()) || 
            allowedRoles.includes(role.toUpperCase()) ||
            allowedRoles.includes(role)
        );
    }

    /**
     * Filter out specific navigation items
     */
    private filterSpecificItems(navigation: Navigation, excludeIds: string[]): Navigation
    {
     
        const filtered = {
            ...navigation,
            default: this.filterNavigationItems(navigation.default, excludeIds),
            horizontal: this.filterNavigationItems(navigation.horizontal, excludeIds),
            compact: this.filterNavigationItems(navigation.compact, excludeIds)
        };
        
       
        return filtered;
    }

    /**
     * Recursively filter navigation items
     */
    private filterNavigationItems(items: any[], excludeIds: string[]): any[]
    {
        if (!items) return items;
        
        return items
            .filter(item => {
                const shouldExclude = excludeIds.includes(item.id);
                if (shouldExclude) {
                  
                }
                return !shouldExclude;
            })
            .map(item => ({
                ...item,
                children: item.children ? this.filterNavigationItems(item.children, excludeIds) : item.children
            }));
    }
}
