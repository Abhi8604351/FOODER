import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard animate__animated animate__fadeIn">
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon orders">📦</div>
          <div class="stat-info">
            <h4>Total Orders</h4>
            <p class="value">{{ stats?.totalOrders || 0 }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon revenue">💰</div>
          <div class="stat-info">
            <h4>Total Revenue</h4>
            <p class="value">₹{{ (stats?.totalRevenue || 0).toFixed(2) }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">⏳</div>
          <div class="stat-info">
            <h4>Pending Delivery</h4>
            <p class="value">{{ stats?.pendingOrders || 0 }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon items">✅</div>
          <div class="stat-info">
            <h4>Delivered</h4>
            <p class="value">{{ stats?.deliveredOrders || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content mt-4">
        <div class="recent-orders">
          <h3>Recent Activity</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of recentOrders">
                  <td>#{{ order._id.slice(-6) }}</td>
                  <td>{{ order.user?.name }}</td>
                  <td>₹{{ order.totalPrice.toFixed(2) }}</td>
                  <td>
                    <span class="badge" [class.success]="order.isDelivered">
                      {{ order.isDelivered ? 'Delivered' : 'Pending' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="revenue-chart">
          <h3>Monthly Revenue</h3>
          <div class="chart-placeholder">
            <div class="bar-container" *ngFor="let month of stats?.statsByMonth">
              <div class="bar" [style.height.%]="(month.revenue / (stats?.totalRevenue || 1)) * 1000"></div>
              <span class="month-label">Month {{ month._id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }
    .stat-icon {
      width: 60px; height: 60px; border-radius: 15px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
    }
    .stat-icon.orders { background: #e3f2fd; color: #1976d2; }
    .stat-icon.revenue { background: #e8f5e9; color: #2e7d32; }
    .stat-icon.pending { background: #fff3e0; color: #ef6c00; }
    .stat-icon.items { background: #f3e5f5; color: #7b1fa2; }
    
    .stat-info h4 { color: #636e72; font-size: 0.9rem; margin-bottom: 0.3rem; }
    .stat-info .value { font-size: 1.6rem; font-weight: 800; color: #2d3436; }
    
    .dashboard-content { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    .recent-orders, .revenue-chart { background: white; border-radius: 20px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
    
    .table-container { margin-top: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem; border-bottom: 2px solid #f1f2f6; color: #b2bec3; font-size: 0.8rem; text-transform: uppercase; }
    td { padding: 1rem; border-bottom: 1px solid #f1f2f6; font-size: 0.9rem; }
    
    .badge { padding: 0.4rem 0.8rem; border-radius: 10px; font-size: 0.75rem; font-weight: 700; background: #ffeaa7; color: #d63031; }
    .badge.success { background: #55efc4; color: #00b894; }

    .chart-placeholder { height: 200px; display: flex; align-items: flex-end; gap: 1rem; margin-top: 2rem; border-bottom: 1px solid #dfe6e9; }
    .bar-container { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .bar { width: 100%; background: #ff4757; border-radius: 5px 5px 0 0; min-height: 5px; }
    .month-label { font-size: 0.7rem; color: #b2bec3; }
    
    @media (max-width: 992px) {
      .dashboard-content { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);

  stats: any;
  recentOrders: any[] = [];

  ngOnInit() {
    this.orderService.getStats().subscribe(stats => {
      this.stats = stats;
    });
    this.orderService.getAllOrders().subscribe(orders => {
      this.recentOrders = orders.slice(0, 5);
    });
  }
}
