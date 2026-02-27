import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../models/food.model';
import { OrderItem } from '../models/order.model';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private notify = inject(NotificationService);
    private cartItems: OrderItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    private cartSubject = new BehaviorSubject<OrderItem[]>(this.cartItems);
    public cart$ = this.cartSubject.asObservable();

    addToCart(food: Food, qty: number = 1) {
        const existingItem = this.cartItems.find((item) => item.food === food._id);

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            this.cartItems.push({
                food: food._id,
                name: food.name,
                image: food.image,
                price: food.price,
                qty: qty,
            });
        }

        this.saveCart();
        this.notify.success(`${food.name} added to cart!`, 'Cart Updated');
    }

    removeFromCart(foodId: string) {
        const item = this.cartItems.find(i => i.food === foodId);
        this.cartItems = this.cartItems.filter((item) => item.food !== foodId);
        this.saveCart();
        if (item) this.notify.info(`${item.name} removed from cart`);
    }

    updateQty(foodId: string, qty: number) {
        const item = this.cartItems.find((i) => i.food === foodId);
        if (item) {
            item.qty = qty;
            if (item.qty <= 0) {
                this.removeFromCart(foodId);
            } else {
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.cartItems = [];
        this.saveCart();
    }

    private saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
        this.cartSubject.next([...this.cartItems]);
    }

    getTotalPrice(): number {
        return this.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    }

    getCartItems(): OrderItem[] {
        return this.cartItems;
    }
}
