import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        // Check if route is restricted by role
        if (route.data['role'] && route.data['role'] !== authService.currentUserValue?.role) {
            // role not authorised so redirect to home page
            router.navigate(['/']);
            return false;
        }
        // authorised so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
