import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="admin-wrapper">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/admin/foods" routerLinkActive="active">Manage Foods</a>
          <a routerLink="/admin/orders" routerLinkActive="active">Manage Orders</a>
          <a routerLink="/admin/users" routerLinkActive="active">Manage Users</a>
          <a routerLink="/" class="back-link">Back to Shop</a>
        </nav>
        <div class="sidebar-footer">
          <button (click)="authService.logout()">Logout</button>
        </div>
      </aside>
      <main class="admin-content">
        <header class="admin-header">
          <h3>Welcome, {{ authService.currentUserValue?.name }}</h3>
        </header>
        <div class="page-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f4f7f6;
    }
    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
      padding: 2rem 0;
    }
    .sidebar-header { padding: 0 2rem 2rem; border-bottom: 1px solid #34495e; }
    .sidebar-nav { flex-grow: 1; display: flex; flex-direction: column; margin-top: 1rem; }
    .sidebar-nav a {
      padding: 1rem 2rem;
      color: #bdc3c7;
      text-decoration: none;
      transition: 0.3s;
    }
    .sidebar-nav a:hover, .sidebar-nav a.active {
      background: #34495e;
      color: white;
    }
    .back-link { border-top: 1px solid #34495e; margin-top: auto !important; }
    .sidebar-footer { padding: 2rem; }
    .sidebar-footer button {
      width: 100%;
      padding: 0.8rem;
      background: #e74c3c;
      border: none;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
    .admin-content { flex-grow: 1; }
    .admin-header {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .page-body { padding: 2rem; }
  `]
})
export class AdminLayoutComponent {
    authService = inject(AuthService);
}
