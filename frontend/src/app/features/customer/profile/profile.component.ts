import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="profile-container animate__animated animate__fadeIn">
      <div class="profile-card">
        <div class="profile-header">
          <h2>My <span>Profile</span></h2>
          <p>Manage your account details and delivery address.</p>
        </div>

        <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
          <div class="form-section">
            <label>Personal Information</label>
            <div class="form-group">
              <input type="text" name="name" [(ngModel)]="profile.name" placeholder="Full Name" required>
            </div>
            <div class="form-group">
              <input type="email" name="email" [(ngModel)]="profile.email" placeholder="Email Address" required>
            </div>
          </div>

          <div class="form-section">
            <label>Saved Delivery Address</label>
            <div class="form-group">
              <input type="text" name="address" [(ngModel)]="profile.address" placeholder="Address (House No, Street)">
            </div>
            <div class="form-row">
              <div class="form-group">
                <input type="text" name="city" [(ngModel)]="profile.city" placeholder="City">
              </div>
              <div class="form-group">
                <input type="text" name="postalCode" [(ngModel)]="profile.postalCode" placeholder="Postal Code">
              </div>
            </div>
            <div class="form-group">
              <input type="text" name="country" [(ngModel)]="profile.country" placeholder="Country">
            </div>
          </div>

          <div class="form-section">
            <label>Change Password (Leave blank to keep current)</label>
            <div class="form-group">
              <input type="password" name="password" [(ngModel)]="profile.password" placeholder="New Password">
            </div>
          </div>

          <button type="submit" class="update-btn" [disabled]="loading">
            {{ loading ? 'Updating...' : 'Save Profile Changes' }}
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      padding: 2rem 0;
    }
    .profile-card {
      background: white;
      padding: 3rem;
      border-radius: 25px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.06);
      width: 100%;
      max-width: 600px;
    }
    .profile-header { text-align: center; margin-bottom: 2.5rem; }
    .profile-header h2 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .profile-header h2 span { color: #ff4757; }
    .profile-header p { color: #888; }

    .form-section { margin-bottom: 2rem; }
    .form-section label { display: block; font-weight: 700; color: #2d3436; margin-bottom: 1rem; border-bottom: 2px solid #f1f2f6; padding-bottom: 0.5rem; }
    
    .form-group { margin-bottom: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    input {
      width: 100%;
      padding: 1rem;
      border: 1px solid #dfe6e9;
      border-radius: 12px;
      font-size: 1rem;
      outline: none;
      transition: 0.3s;
    }
    input:focus { border-color: #ff4757; box-shadow: 0 0 0 4px rgba(255,71,87,0.1); }

    .update-btn {
      width: 100%;
      padding: 1.2rem;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 20px rgba(255,71,87,0.2);
    }
    .update-btn:hover { background: #ff6b81; transform: translateY(-2px); }
    .update-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private notify = inject(NotificationService);

    profile: any = {};
    loading = false;

    ngOnInit() {
        const user = this.authService.currentUserValue;
        if (user) {
            this.profile = { ...user };
            delete this.profile.token;
        }
    }

    updateProfile() {
        this.loading = true;
        this.authService.updateProfile(this.profile).subscribe({
            next: () => {
                this.notify.success('Profile updated successfully!');
                this.loading = false;
            },
            error: () => {
                this.notify.error('Failed to update profile');
                this.loading = false;
            }
        });
    }
}
