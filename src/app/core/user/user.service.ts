import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap, of } from 'rxjs';
import { users } from 'app/mock-api/common/user/data';

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

    getUsers(): Observable<User[]> {


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
}
