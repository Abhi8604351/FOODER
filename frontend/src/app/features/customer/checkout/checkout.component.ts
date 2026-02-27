import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-page">
      <h1>Checkout</h1>
      
      <div class="checkout-grid" *ngIf="cartService.getCartItems().length > 0; else noItems">
        <div class="shipping-form">
          <h3>Shipping Address</h3>
          <form #shipForm="ngForm">
            <div class="form-group">
              <label>Address</label>
              <input type="text" name="address" [(ngModel)]="address" required placeholder="House No, Street">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input type="text" name="city" [(ngModel)]="city" required placeholder="New York">
              </div>
              <div class="form-group">
                <label>Postal Code</label>
                <input type="text" name="postalCode" [(ngModel)]="postalCode" required placeholder="10001">
              </div>
            </div>
            <div class="form-group">
              <label>Country</label>
              <input type="text" name="country" [(ngModel)]="country" required placeholder="USA">
            </div>
          </form>

          <h3 class="mt-4">Payment Method</h3>
          <div class="payment-method">
            <label>
              <input type="radio" name="payment" value="Cash" checked>
              Cash on Delivery (Standard)
            </label>
          </div>
        </div>

        <div class="order-preview">
          <h3>Your Order</h3>
          <div class="preview-items">
            <div class="preview-item" *ngFor="let item of cartService.getCartItems()">
              <span>{{ item.qty }}x {{ item.name }}</span>
              <span>₹{{ (item.price * item.qty).toFixed(2) }}</span>
            </div>
          </div>
          <hr>
          <div class="preview-total">
            <span>Total to Pay</span>
            <span>₹{{ cartService.getTotalPrice().toFixed(2) }}</span>
          </div>
          <button class="place-order-btn" [disabled]="!shipForm.valid" (click)="placeOrder()">Place Order</button>
        </div>
      </div>

      <ng-template #noItems>
        <div class="empty-state">No items in cart to checkout.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .checkout-grid { display: grid; grid-template-columns: 1fr 400px; gap: 3rem; margin-top: 2rem; }
    h3 { margin-bottom: 1.5rem; }
    .mt-4 { margin-top: 2rem; }
    
    .form-group { margin-bottom: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; }
    input[type="text"] {
      width: 100%; padding: 0.8rem; border: 1px solid #dfe4ea; border-radius: 8px;
    }
    
    .payment-method { background: white; padding: 1.5rem; border-radius: 10px; border: 1px solid #dfe4ea; }
    
    .order-preview { background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); height: fit-content; }
    .preview-items { margin-bottom: 1.5rem; }
    .preview-item { display: flex; justify-content: space-between; margin-bottom: 0.8rem; color: #555; }
    .preview-total { display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 800; margin-top: 1.5rem; color: #ff4757; }
    
    .place-order-btn {
      width: 100%; padding: 1rem; background: #2f3542; color: white; border: none; border-radius: 10px;
      font-weight: 700; cursor: pointer; margin-top: 2rem; transition: 0.3s;
    }
    .place-order-btn:hover:not(:disabled) { background: #ff4757; }
    .place-order-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  address = '';
  city = '';
  postalCode = '';
  country = '';

  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.address = user.address || '';
      this.city = user.city || '';
      this.postalCode = user.postalCode || '';
      this.country = user.country || '';
    }
  }

  placeOrder() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    const order = {
      orderItems: this.cartService.getCartItems(),
      shippingAddress: {
        address: this.address,
        city: this.city,
        postalCode: this.postalCode,
        country: this.country
      },
      paymentMethod: 'Cash',
      totalPrice: this.cartService.getTotalPrice()
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      }
    });
  }
}
