import { Routes } from '@angular/router';
import { UserLayoutComponent } from './shared/layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // User Routes
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/customer/shop/shop.component').then(m => m.ShopComponent)
            },
            {
                path: 'cart',
                loadComponent: () => import('./features/customer/cart/cart.component').then(m => m.CartComponent)
            },
            {
                path: 'checkout',
                loadComponent: () => import('./features/customer/checkout/checkout.component').then(m => m.CheckoutComponent),
                canActivate: [authGuard]
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/customer/orders/orders.component').then(m => m.OrdersComponent),
                canActivate: [authGuard]
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/customer/profile/profile.component').then(m => m.ProfileComponent),
                canActivate: [authGuard]
            },
            {
                path: 'auth/login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'auth/register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'auth/forgot-password',
                loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
            }
        ]
    },
    // Admin Routes
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        data: { role: 'admin' },
        children: [
            {
                path: '',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'foods',
                loadComponent: () => import('./features/admin/food-management/food-management.component').then(m => m.FoodManagementComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/admin/orders-management/orders-management.component').then(m => m.OrdersManagementComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
