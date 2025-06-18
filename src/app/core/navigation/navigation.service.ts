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
                console.log('Navigation filtering - User:', user);
                console.log('Navigation filtering - User roles:', user?.roles);
                
                if (!user || !user.roles) {
                    console.log('No user or roles, returning full navigation');
                    return navigation;
                }

                const userRoles = user.roles;
                const isAdmin = userRoles.includes('admin') || userRoles.includes('ADMIN');
                const isUser = userRoles.includes('user') || userRoles.includes('USER');
                
                console.log('Is Admin:', isAdmin, 'Is User:', isUser);
                
                // Si es solo usuario (no admin)
                if (isUser && !isAdmin) {
                    console.log('Applying user role filter');
                    return this.filterAdminOnlyItems(navigation);
                }
                
                console.log('User is admin or no specific role, showing full navigation');
                return navigation;
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
                console.log('Raw navigation loaded:', navigation);
                this._navigation.next(navigation);
            }),
        );
    }

    /**
     * Filter out admin-only navigation items
     */
    private filterAdminOnlyItems(navigation: Navigation): Navigation
    {
        const adminOnlyIds = ['mi-entidad-group'];
        
        console.log('Original navigation items:', navigation.default?.map(item => item.id));
        
        const filtered = {
            ...navigation,
            default: this.filterNavigationItems(navigation.default, adminOnlyIds),
            horizontal: this.filterNavigationItems(navigation.horizontal, adminOnlyIds),
            compact: this.filterNavigationItems(navigation.compact, adminOnlyIds)
        };
        
        console.log('Filtered navigation items:', filtered.default?.map(item => item.id));
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
                    console.log('Excluding navigation item:', item.id);
                }
                return !shouldExclude;
            })
            .map(item => ({
                ...item,
                children: item.children ? this.filterNavigationItems(item.children, excludeIds) : item.children
            }));
    }
}
