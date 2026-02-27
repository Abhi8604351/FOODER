import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page">
      <h1>Shopping <span>Cart</span></h1>
      
      <div class="cart-layout" *ngIf="items.length > 0; else emptyCart">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of items">
            <img [src]="item.image" [alt]="item.name">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="unit-price">₹{{ item.price }}</p>
            </div>
            <div class="qty-control">
              <button (click)="cartService.updateQty(item.food, item.qty - 1)">-</button>
              <span>{{ item.qty }}</span>
              <button (click)="cartService.updateQty(item.food, item.qty + 1)">+</button>
            </div>
            <div class="item-total">
              ₹{{ (item.price * item.qty).toFixed(2) }}
            </div>
            <button class="remove-btn" (click)="cartService.removeFromCart(item.food)">×</button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Items ({{ items.length }})</span>
            <span>₹{{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <hr>
          <div class="summary-total">
            <span>Total</span>
            <span>₹{{ totalPrice.toFixed(2) }}</span>
          </div>
          <button class="checkout-btn" (click)="goToCheckout()">Proceed to Checkout</button>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-state">
          <p>Your cart is empty.</p>
          <a routerLink="/" class="back-link">Go to Shop</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-page h1 span { color: #ff4757; }
    .cart-layout { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; margin-top: 2rem; }
    
    .cart-items { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
    .cart-item {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f1f2f6;
    }
    .cart-item img { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; margin-right: 1.5rem; }
    .item-details { flex-grow: 1; }
    .item-details h3 { margin: 0; font-size: 1.1rem; }
    .unit-price { color: #888; margin-top: 0.3rem; }
    
    .qty-control { display: flex; align-items: center; gap: 1rem; margin: 0 2rem; }
    .qty-control button {
      width: 30px; height: 30px; border-radius: 50%; border: 1px solid #dfe4ea;
      background: white; cursor: pointer; transition: 0.3s;
    }
    .qty-control button:hover { background: #f1f2f6; }
    
    .item-total { font-weight: 700; width: 80px; text-align: right; }
    .remove-btn { background: none; border: none; font-size: 1.5rem; color: #dfe4ea; cursor: pointer; margin-left: 1.5rem; }
    .remove-btn:hover { color: #ff4757; }

    .cart-summary {
      background: #2f3542;
      color: white;
      padding: 2rem;
      border-radius: 15px;
      height: fit-content;
    }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: #ced4da; }
    .summary-total { display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 800; margin: 1.5rem 0; }
    .checkout-btn {
      width: 100%;
      padding: 1rem;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.3s;
    }
    .checkout-btn:hover { background: #ff6b81; }

    .empty-state { text-align: center; margin-top: 5rem; }
    .back-link { display: inline-block; margin-top: 1rem; color: #ff4757; font-weight: 600; text-decoration: none; }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  router = inject(Router);

  get items() {
    return this.cartService.getCartItems();
  }

  get totalPrice() {
    return this.cartService.getTotalPrice();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
