import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-card">
      <h2>Register</h2>
      <p>Create an account to start ordering delicious food.</p>
      
      <form (ngSubmit)="onRegister()" #registerForm="ngForm">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="name" [(ngModel)]="name" required placeholder="John Doe">
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" [(ngModel)]="email" required placeholder="name@example.com">
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" [(ngModel)]="password" required placeholder="••••••••">
        </div>

        <div class="error-msg" *ngIf="error">{{ error }}</div>

        <button type="submit" [disabled]="!registerForm.form.valid" class="auth-btn">Register</button>
      </form>

      <div class="auth-footer">
        Already have an account? <a routerLink="/auth/login">Login</a>
      </div>
    </div>
  `,
    styles: [`
    .auth-card {
      max-width: 400px;
      margin: 5rem auto;
      padding: 3rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    }
    h2 { margin-bottom: 0.5rem; text-align: center; }
    p { color: #777; text-align: center; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
    input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #dfe4ea;
      border-radius: 10px;
      transition: 0.3s;
    }
    input:focus { border-color: #ff4757; outline: none; box-shadow: 0 0 0 3px rgba(255,71,87,0.1); }
    .auth-btn {
      width: 100%;
      padding: 1rem;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 1rem;
    }
    .auth-btn:disabled { background: #ffa4a2; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 2rem; color: #777; }
    .auth-footer a { color: #ff4757; font-weight: 600; text-decoration: none; }
    .error-msg { color: #e74c3c; background: #fee2e2; padding: 0.8rem; border-radius: 10px; margin-bottom: 1rem; text-align: center; font-size: 0.9rem; }
  `]
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    name = '';
    email = '';
    password = '';
    error = '';

    onRegister() {
        this.authService.register(this.name, this.email, this.password).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.error = err.error.message || 'Registration failed';
            }
        });
    }
}
