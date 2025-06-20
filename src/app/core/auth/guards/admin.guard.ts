import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { Role } from 'app/core/auth/roles';
import { map, tap } from 'rxjs';

export const AdminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService);

    return userService.user$.pipe(
        tap(user => {
            console.log('AdminGuard user:', user);
        }),
        map(user => {
            const hasAdminRole = user && user.roles && user.roles.includes(Role.ADMIN);
           // console.log('AdminGuard hasAdminRole:', hasAdminRole);
            if (hasAdminRole) {
                return true;
            } else {
                // Redirect to home or unauthorized page
                return router.parseUrl('/home');
            }
        })
    );
};
