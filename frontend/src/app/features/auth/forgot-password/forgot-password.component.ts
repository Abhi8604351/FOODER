import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-container animate__animated animate__fadeIn">
      <div class="auth-card">
        <div class="auth-header">
          <h2>{{ step === 1 ? 'Forgot Password?' : 'Reset Password' }}</h2>
          <p>{{ step === 1 ? 'Enter your email to receive a reset token.' : 'Enter your token and new password.' }}</p>
        </div>

        <form (ngSubmit)="step === 1 ? handleForgot() : handleReset()">
          <div *ngIf="step === 1">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" name="email" [(ngModel)]="email" required placeholder="name@example.com">
            </div>
            <button type="submit" class="auth-btn" [disabled]="loading">
              {{ loading ? 'Sending...' : 'Get Reset Token' }}
            </button>
          </div>

          <div *ngIf="step === 2">
            <div class="form-group">
              <label>Reset Token</label>
              <input type="text" name="token" [(ngModel)]="token" required placeholder="Enter token">
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" name="password" [(ngModel)]="password" required placeholder="••••••••">
            </div>
            <button type="submit" class="auth-btn" [disabled]="loading">
              {{ loading ? 'Resetting...' : 'Update Password' }}
            </button>
          </div>

          <div class="auth-footer">
            <a routerLink="/auth/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 70vh; }
    .auth-card { background: white; padding: 3rem; border-radius: 25px; box-shadow: 0 15px 40px rgba(0,0,0,0.06); width: 100%; max-width: 450px; }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-header h2 { font-size: 2rem; color: #2d3436; margin-bottom: 0.5rem; }
    .auth-header p { color: #888; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; }
    input { width: 100%; padding: 1rem; border: 1px solid #dfe6e9; border-radius: 12px; outline: none; }
    .auth-btn { width: 100%; padding: 1rem; background: #ff4757; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; margin-top: 1rem; }
    .auth-footer { text-align: center; margin-top: 2rem; }
    .auth-footer a { color: #ff4757; text-decoration: none; font-weight: 600; }
  `]
})
export class ForgotPasswordComponent {
    private authService = inject(AuthService);
    private notify = inject(NotificationService);

    step = 1;
    email = '';
    token = '';
    password = '';
    loading = false;

    handleForgot() {
        this.loading = true;
        this.authService.forgotPassword(this.email).subscribe({
            next: (res) => {
                // In this demo app, the token is returned directly
                this.notify.success('Reset token generated! Copy it from below.');
                alert(`Your reset token is: ${res.data.token}`); // Temporary for demo
                this.step = 2;
                this.loading = false;
            },
            error: () => {
                this.notify.error('User not found');
                this.loading = false;
            }
        });
    }

    handleReset() {
        this.loading = true;
        this.authService.resetPassword(this.token, this.password).subscribe({
            next: () => {
                this.notify.success('Password updated! Please login.');
                this.loading = false;
                this.step = 1;
            },
            error: () => {
                this.notify.error('Invalid or expired token');
                this.loading = false;
            }
        });
    }
}
