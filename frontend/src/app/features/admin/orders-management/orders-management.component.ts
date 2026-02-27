import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-mgmt animate__animated animate__fadeIn">
      <div class="header-row">
        <h3>Order <span>Management</span></h3>
        <p>Total Orders to handle: {{ orders.length }}</p>
      </div>
      
      <div class="table-container mt-4">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Current Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td>#{{ order._id.slice(-6).toUpperCase() }}</td>
              <td>
                <div class="cust-info">
                  <strong>{{ order.user?.name }}</strong>
                  <span>{{ order.user?.email }}</span>
                </div>
              </td>
              <td>
                <div class="item-summary" [title]="getItemList(order)">
                  {{ order.orderItems.length }} meals
                </div>
              </td>
              <td class="total">₹{{ order.totalPrice.toFixed(2) }}</td>
              <td>
                <span class="status-pill" [class]="order.status?.toLowerCase().replace(' ', '-')">
                  {{ order.status || 'Pending' }}
                </span>
              </td>
              <td class="actions">
                <select [value]="order.status || 'Pending'" 
                        (change)="changeStatus(order._id, $event)">
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .orders-mgmt { padding: 1rem; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header-row h3 span { color: #ff4757; }
    .header-row p { color: #7f8c8d; font-weight: 600; }

    .table-container { background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1.2rem; border-bottom: 2px solid #f1f2f6; color: #b2bec3; font-size: 0.8rem; text-transform: uppercase; }
    td { padding: 1.2rem; border-bottom: 1px solid #f1f2f6; font-size: 0.95rem; }
    
    .cust-info { display: flex; flex-direction: column; }
    .cust-info span { font-size: 0.8rem; color: #95a5a6; }
    .total { font-weight: 800; color: #2d3436; }

    .status-pill { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; background: #dfe6e9; color: #636e72; }
    .status-pill.pending { background: #fff3e0; color: #e67e22; }
    .status-pill.preparing { background: #e3f2fd; color: #1976d2; }
    .status-pill.out-for-delivery { background: #f3e5f5; color: #9b59b6; }
    .status-pill.delivered { background: #e8f5e9; color: #27ae60; }
    
    select { padding: 0.5rem; border-radius: 8px; border: 1px solid #dfe6e9; font-weight: 600; outline: none; cursor: pointer; transition: 0.3s; }
    select:focus { border-color: #ff4757; }
  `]
})
export class OrdersManagementComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: any[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(orders => this.orders = orders);
  }

  changeStatus(id: string, event: any) {
    const status = event.target.value;
    this.orderService.updateOrderStatus(id, status).subscribe(() => this.loadOrders());
  }

  getItemList(order: any): string {
    return order.orderItems.map((i: any) => i.name).join(', ');
  }
}
