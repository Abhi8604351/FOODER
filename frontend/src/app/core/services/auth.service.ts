import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private notify = inject(NotificationService);
    private apiUrl = `${environment.apiUrl}/users`;

    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(
        JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    public currentUser$ = this.currentUserSubject.asObservable();

    public get currentUserValue(): AuthResponse | null {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            map((res) => {
                const user = res.data;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                this.notify.success(`Welcome back, ${user.name}!`);
                return user;
            })
        );
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, { name, email, password }).pipe(
            map((res) => {
                const user = res.data;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                this.notify.success('Account created successfully!');
                return user;
            })
        );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
        this.notify.info('Logged out successfully');
    }

    updateProfile(profileData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/profile`, profileData).pipe(
            map(res => {
                const user = { ...this.currentUserValue, ...res.data };
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return res;
            })
        );
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/forgotpassword`, { email });
    }

    resetPassword(token: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/resetpassword/${token}`, { password });
    }

    isAdmin(): boolean {
        return this.currentUserValue?.role === 'admin';
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }
}
