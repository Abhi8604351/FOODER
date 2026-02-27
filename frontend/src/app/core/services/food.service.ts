import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FoodService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/foods`;
    private uploadUrl = `${environment.apiUrl}/upload`;

    getFoods(params: any = {}): Observable<any> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (params[key]) httpParams = httpParams.append(key, params[key]);
        });
        return this.http.get<any>(this.apiUrl, { params: httpParams });
    }

    getCategories(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/categories`);
    }

    getFoodById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createFood(food: Partial<Food>): Observable<any> {
        return this.http.post<any>(this.apiUrl, food);
    }

    updateFood(id: string, food: Partial<Food>): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, food);
    }

    deleteFood(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post(this.uploadUrl, formData);
    }
}
