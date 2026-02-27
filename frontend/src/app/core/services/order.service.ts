import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from '../models/order.model';
import { NotificationService } from './notification.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private http = inject(HttpClient);
    private notify = inject(NotificationService);
    private apiUrl = `${environment.apiUrl}/orders`;

    createOrder(order: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, order).pipe(
            map(res => {
                this.notify.success('Order placed successfully!');
                return res.data;
            })
        );
    }

    getOrderById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(res => res.data));
    }

    getMyOrders(): Observable<Order[]> {
        return this.http.get<any>(`${this.apiUrl}/myorders`).pipe(map(res => res.data));
    }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<any>(this.apiUrl).pipe(map(res => res.data));
    }

    getStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`).pipe(map(res => res.data));
    }

    updateOrderStatus(id: string, status: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status }).pipe(
            map(res => {
                this.notify.success(`Order set to ${status}`);
                return res.data;
            })
        );
    }

    deliverOrder(id: string): Observable<any> {
        return this.updateOrderStatus(id, 'Delivered');
    }
}
