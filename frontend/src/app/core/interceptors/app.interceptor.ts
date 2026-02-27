import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';
import { catchError, finalize, throwError } from 'rxjs';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const loadingService = inject(LoadingService);
    const notify = inject(NotificationService);

    const currentUser = authService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;

    loadingService.setLoading(true);

    if (isLoggedIn) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${currentUser.token}`,
            },
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMsg = 'An unknown error occurred!';

            if (error.error instanceof ErrorEvent) {
                errorMsg = `Error: ${error.error.message}`;
            } else {
                errorMsg = (error.error as any)?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;

                if (error.status === 401) {
                    authService.logout();
                    notify.error('Session expired. Please login again.');
                }
            }

            if (error.status !== 401) {
                notify.error(errorMsg);
            }

            return throwError(() => error);
        }),
        finalize(() => {
            loadingService.setLoading(false);
        })
    );
};
