import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap, of, catchError } from 'rxjs';
import { users } from 'app/mock-api/common/user/data';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Usuario } from 'app/models/Type';


@Injectable({providedIn: 'root'})
export class UserService
{
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) =>
            {
                this._user.next(user);
            }),
        );
    }

    /**
     * Get the list of fake users
     */

    getUser(): Observable<User[]> {


        // Transform the data to match the User interface (name -> name)
        const transformedUsers = users.map(user => {
            const transformedUser = {
                ...user,
                // Ensure all required properties are present
                name: user.name || user.username, // Use name or fallback to username
            };
            return transformedUser;
        });



        return of(transformedUsers as User[]).pipe(
            tap(users => {

            })
        );
    }


    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) =>
            {
                this._user.next(response);
            }),
        );
    }

  getUsers(): Observable<Usuario[]> {
    return this._httpClient.get<Usuario[]>(API_ENDPOINTS.USERS.BASE)
      .pipe(
        tap(data => console.log('Users fetched:', data)),
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      );
  }

  addUser(user: Usuario): Observable<Usuario> {
    return this._httpClient.post<Usuario>(API_ENDPOINTS.USERS.BASE, user)
      .pipe(
        tap(data => console.log('User added:', data)),
        catchError(error => {
          console.error('Error adding user:', error);
          throw error;
        })
      );
  }

  updateUser(user: Usuario): Observable<Usuario> {
    return this._httpClient.put<Usuario>(`${API_ENDPOINTS.USERS.BASE}/${user.id}`, user)
      .pipe(
        tap(data => console.log('User updated:', data)),
        catchError(error => {
          console.error('Error updating user:', error);
          throw error;
        })
      );
  }

  deleteUser(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${API_ENDPOINTS.USERS.BASE}/${id}`)
      .pipe(
        tap(() => console.log('User deleted:', id)),
        catchError(error => {
          console.error('Error deleting user:', error);
          throw error;
        })
      );
  }

  getUsersByRole(): Observable<{ role: string, count: number }[]> {
    // Mock implementation; replace with actual API call if available
    return this.getUsers().pipe(
      map(users => {
        const roleCounts: { [key: string]: number } = {};
        users.forEach(user => {
          const roles = Array.isArray(user.roles) ? user.roles : user.roles.split(',');
          roles.forEach(role => {
            roleCounts[role.trim()] = (roleCounts[role.trim()] || 0) + 1;
          });
        });
        return Object.entries(roleCounts).map(([role, count]) => ({ role, count }));
      })
    );
  }


  login(credentials: { usuario: string, contrasena: string }): Observable<any> {
    return this._httpClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(data => console.log('Login successful:', data)),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout(): Observable<void> {
    return this._httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT, {})
      .pipe(
        tap(() => console.log('Logout successful')),
        catchError(error => {
          console.error('Logout error:', error);
          throw error;
        })
      );
  }

  refreshToken(): Observable<any> {
    return this._httpClient.post(API_ENDPOINTS.AUTH.REFRESH, {})
      .pipe(
        tap(data => console.log('Token refreshed:', data)),
        catchError(error => {
          console.error('Token refresh error:', error);
          throw error;
        })
      );
  }

  getProfile(): Observable<any> {
    return this._httpClient.get(API_ENDPOINTS.USERS.PROFILE)
      .pipe(
        tap(data => console.log('Profile fetched:', data)),
        catchError(error => {
          console.error('Error fetching profile:', error);
          throw error;
        })
      );
  }

  changePassword(data: { contrasena_actual: string, contrasena_nueva: string }): Observable<void> {
    return this._httpClient.post<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data)
      .pipe(
        tap(() => console.log('Password changed')),
        catchError(error => {
          console.error('Error changing password:', error);
          throw error;
        })
      );
  }
}
