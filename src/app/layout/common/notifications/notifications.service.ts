import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { catchError, forkJoin, map, Observable, of, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';

@Injectable({providedIn: 'root'})
export class NotificationsService
{
    private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]>
    {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    getAll(): Observable<Notification[]>
    {
        return this._httpClient.get<Notification[]>('api/common/notifications').pipe(
            tap((notifications) =>
            {
                this._notifications.next(notifications);
            }),
        );
    }

    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.post<Notification>('api/common/notifications', {notification}).pipe(
                map((newNotification) =>
                {
                    // Update the notifications with the new notification
                    this._notifications.next([...notifications, newNotification]);

                    // Return the new notification from observable
                    return newNotification;
                }),
            )),
        );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(id: string, notification: Notification): Observable<Notification>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.patch<Notification>('api/common/notifications', {
                id,
                notification,
            }).pipe(
                map((updatedNotification: Notification) =>
                {
                    // Find the index of the updated notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Update the notification
                    notifications[index] = updatedNotification;

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated notification
                    return updatedNotification;
                }),
            )),
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id: string): Observable<boolean>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>('api/common/notifications', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Delete the notification
                    notifications.splice(index, 1);

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }
    getAlls(): Observable<Notification[]> {
        return this._httpClient.get<Notification[]>(API_ENDPOINTS.NOTIFICACIONES).pipe(
            tap((notifications) => {
                    console.log(notifications);
                this._notifications.next(notifications);
            }),
            catchError(error => {
                console.error('Error fetching notifications:', error);
                return of([]);
            })
        );
    }

    /**
     * Get notification by ID
     */
    getByIds(id: string): Observable<Notification> {
        return this._httpClient.get<Notification>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`).pipe(
            catchError(error => {
                console.error(`Error fetching notification ${id}:`, error);
                throw error;
            })
        );
    }

    /**
     * Create a notification
     */
    creates(notification: Partial<Notification>): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.post<Notification>(API_ENDPOINTS.NOTIFICACIONES, notification).pipe(
                map((newNotification) => {
                    this._notifications.next([...notifications, newNotification]);
                    return newNotification;
                }),
                catchError(error => {
                    console.error('Error creating notification:', error);
                    throw error;
                })
            ))
        );
    }

    /**
     * Update a notification
     */
    updates(id: string, notification: Partial<Notification>): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.put<Notification>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`, notification).pipe(
                map((updatedNotification) => {
                    const index = notifications.findIndex(item => item.id === id);
                    notifications[index] = updatedNotification;
                    this._notifications.next(notifications);
                    return updatedNotification;
                }),
                catchError(error => {
                    console.error(`Error updating notification ${id}:`, error);
                    throw error;
                })
            ))
        );
    }

    /**
     * Delete a notification
     */
    deletes(id: string): Observable<boolean> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`).pipe(
                map((isDeleted) => {
                    const index = notifications.findIndex(item => item.id === id);
                    notifications.splice(index, 1);
                    this._notifications.next(notifications);
                    return isDeleted;
                }),
                catchError(error => {
                    console.error(`Error deleting notification ${id}:`, error);
                    throw error;
                })
            ))
        );
    }

   
  
   /*  markAsReads(id: string): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.put<Notification>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}/marcar-leida`, {}).pipe(
                map((updatedNotification) => {
                    const index = notifications.findIndex(item => item.id === id);
                    notifications[index] = { ...notifications[index], read: true };
                    this._notifications.next(notifications);
                    return updatedNotification;
                }),
                catchError(error => {
                    console.error(`Error marking notification ${id} as read:`, error);
                    throw error;
                })
            ))
        );
    }
   */
    /**
     * Mark all notifications as read
     */
   /**   markAllAsReads(): Observable<boolean> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => {
                const unreadNotifications = notifications.filter(n => !n.read);
                if (unreadNotifications.length === 0) {
                    return of(true);
                }
                const markReadObservables = unreadNotifications.map(n => this.markAsReads(n.id));
                return forkJoin(markReadObservables).pipe(
                    map(() => true),
                    catchError(error => {
                        console.error('Error marking all notifications as read:', error);
                        return of(false);
                    })
                );
            })
        );
    }  */
  
}
