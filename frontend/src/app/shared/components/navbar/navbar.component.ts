import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">Food<span>Flex</span></a>
        
        <ul class="nav-links">
          <li class="theme-switch" (click)="toggleTheme()">
            <span>{{ isDarkMode ? '🌙' : '☀️' }}</span>
          </li>
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Shop</a></li>
          <li *ngIf="authService.isLoggedIn() && authService.isAdmin()">
            <a routerLink="/admin" routerLinkActive="active">Admin Dashboard</a>
          </li>
          <li *ngIf="authService.isLoggedIn() && !authService.isAdmin()">
            <a routerLink="/orders" routerLinkActive="active">My Orders</a>
          </li>
          <li>
            <a routerLink="/cart" class="cart-btn">
              Cart <span class="badge" *ngIf="(cartItemsCount$ | async) as count">{{ count }}</span>
            </a>
          </li>
          <li *ngIf="!authService.isLoggedIn()">
            <a routerLink="/auth/login" class="login-btn">Login</a>
          </li>
          <li *ngIf="authService.isLoggedIn()" class="user-menu">
            <a routerLink="/profile" class="user-name">Hi, {{ authService.currentUserValue?.name }}</a>
            <button (click)="authService.logout()" class="logout-btn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--nav-bg, white);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: 0.3s;
    }
    .theme-switch { cursor: pointer; font-size: 1.2rem; filter: grayscale(1); transition: 0.3s; }
    .theme-switch:hover { filter: grayscale(0); transform: scale(1.1); }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: #333;
      text-decoration: none;
    }
    .logo span { color: #ff4757; }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      align-items: center;
    }
    .nav-links a {
      text-decoration: none;
      color: #555;
      font-weight: 500;
      transition: 0.3s;
    }
    .nav-links a:hover, .nav-links a.active { color: #ff4757; }
    .badge {
      background: #ff4757;
      color: white;
      padding: 2px 6px;
      border-radius: 50%;
      font-size: 0.7rem;
      vertical-align: top;
    }
    .login-btn, .logout-btn {
      padding: 0.5rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
    }
    .login-btn {
      background: #ff4757;
      color: white !important;
    }
    .logout-btn {
      background: #f1f2f6;
      border: 1px solid #dfe4ea;
      margin-left: 1rem;
    }
    .user-menu { display: flex; align-items: center; }
    .user-menu .user-name { text-decoration: none; color: inherit; font-weight: 600; margin-right: 10px; }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);

  isDarkMode = localStorage.getItem('theme') === 'dark';

  cartItemsCount$ = this.cartService.cart$.pipe(
    map(items => items.reduce((acc, item) => acc + item.qty, 0))
  );

  constructor() {
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
