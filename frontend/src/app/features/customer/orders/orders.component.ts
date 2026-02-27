import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-container animate__animated animate__fadeIn">
      <div class="page-header">
        <h2>My <span>Orders</span></h2>
        <button class="refresh-btn" (click)="loadOrders()" [class.spinning]="isLoading">
          🔄 {{ isLoading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
      <p class="auto-refresh-hint">Auto-refreshes every 30 seconds</p>
      
      <div *ngIf="orders.length > 0; else noOrders" class="orders-list">
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header">
            <div>
              <h3>Order #{{ order._id.slice(-6).toUpperCase() }}</h3>
              <b class="date">{{ order.createdAt | date:'medium' }}</b>
            </div>
            <div class="status-actions">
              <span class="status-badge" [class]="order.status?.toLowerCase().replace(' ', '-')">
                {{ order.status || 'Pending' }}
              </span>
              <button class="invoice-btn" (click)="generateInvoice(order)">
                📄 Invoice
              </button>
            </div>
          </div>

          <div class="order-items">
            <div class="item" *ngFor="let item of order.orderItems">
              <img [src]="item.image" [alt]="item.name">
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.qty }} x ₹{{ item.price }}</p>
              </div>
              <span class="subtotal">₹{{ (item.qty * item.price).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="address">
              <strong>Delivery to:</strong>
              <p>{{ order.shippingAddress.address }}, {{ order.shippingAddress.city }}</p>
            </div>
            <div class="total-row">
              <span>Total Amount Paid</span>
              <span class="total-price">₹{{ order.totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noOrders>
        <div class="empty-state">
          <div class="icon">🍱</div>
          <h3>No orders yet</h3>
          <p>Hungry? Start exploring our menu!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .orders-container { max-width: 900px; margin: 0 auto; padding: 2rem 0; }
    h2 { font-size: 2.5rem; margin-bottom: 2rem; }
    h2 span { color: #ff4757; }
    
    .order-card { background: white; border-radius: 25px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
    .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; border-bottom: 1px solid #f1f2f6; padding-bottom: 1.5rem; }
    .order-header h3 { margin: 0; font-size: 1.2rem; }
    .date { color: #95a5a6; font-size: 0.85rem; }
    
    .status-actions { display: flex; align-items: center; gap: 1rem; }
    .status-badge { padding: 0.4rem 1.2rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; background: #dfe6e9; color: #636e72; }
    .status-badge.pending { background: #fff3e0; color: #f39c12; }
    .status-badge.preparing { background: #e3f2fd; color: #1976d2; }
    .status-badge.out-for-delivery { background: #f3e5f5; color: #9b59b6; }
    .status-badge.delivered { background: #e8f5e9; color: #27ae60; }
    
    .invoice-btn { background: #f1f2f6; border: none; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; font-size: 0.85rem; }
    .invoice-btn:hover { background: #e2e2e2; }

    .order-items { margin-bottom: 2rem; }
    .item { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.2rem; }
    .item img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; }
    .item-info { flex: 1; }
    .item-info h4 { margin: 0 0 0.3rem; font-size: 1rem; }
    .item-info p { margin: 0; color: #7f8c8d; font-size: 0.9rem; }
    .subtotal { font-weight: 700; color: #2d3436; }

    .order-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 1.5rem; border-top: 1px dashed #dfe6e9; }
    .address { color: #636e72; font-size: 0.85rem; }
    .address p { margin: 0.3rem 0 0; }
    .total-row { text-align: right; }
    .total-row span { display: block; font-size: 0.8rem; color: #95a5a6; margin-bottom: 0.3rem; }
    .total-price { font-size: 1.5rem; font-weight: 900; color: #ff4757; }

    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .refresh-btn { background: #f1f2f6; border: none; padding: 0.6rem 1.2rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; font-size: 0.9rem; }
    .refresh-btn:hover { background: #dfe6e9; }
    .refresh-btn.spinning { opacity: 0.7; cursor: wait; }
    .auto-refresh-hint { font-size: 0.8rem; color: #b2bec3; margin-bottom: 2rem; }
    .empty-state { text-align: center; padding: 5rem; background: white; border-radius: 25px; }
    .empty-state .icon { font-size: 4rem; margin-bottom: 1rem; }
  `]
})
export class OrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  orders: any[] = [];
  isLoading = false;
  private pollInterval: any;

  ngOnInit() {
    this.loadOrders();
    // Auto-poll every 30 seconds
    this.pollInterval = setInterval(() => this.loadOrders(), 30000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  generateInvoice(order: any) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 71, 87);
    doc.text('FoodFlex Pro', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Invoice for Order #' + order._id.slice(-6).toUpperCase(), 14, 30);
    doc.text('Date: ' + new Date(order.createdAt).toLocaleDateString(), 14, 35);

    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Shipping Address:', 14, 50);
    doc.setFontSize(10);
    doc.text(order.shippingAddress.address, 14, 56);
    doc.text(order.shippingAddress.city + ', ' + order.shippingAddress.postalCode, 14, 61);
    doc.text(order.shippingAddress.country, 14, 66);

    // Items Table
    const tableData = order.orderItems.map((item: any) => [
      item.name,
      item.qty,
      '₹' + item.price.toFixed(2),
      '₹' + (item.qty * item.price).toFixed(2)
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Item', 'Qty', 'Price', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [255, 71, 87] }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Total Amount: ₹' + order.totalPrice.toFixed(2), 140, finalY);

    // Save
    doc.save(`Invoice_${order._id.slice(-6)}.pdf`);
  }
}
