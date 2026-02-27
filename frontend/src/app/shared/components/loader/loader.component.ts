import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loader-overlay" *ngIf="loadingService.loading$ | async">
      <div class="loader-bar"></div>
    </div>
  `,
    styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 9999;
      background: rgba(255,255,255,0.1);
    }
    .loader-bar {
      height: 100%;
      background: #ff4757;
      width: 0%;
      animation: loading 2s infinite ease-in-out;
    }
    @keyframes loading {
      0% { width: 0; left: 0; }
      50% { width: 70%; left: 15%; }
      100% { width: 0; left: 100%; }
    }
  `]
})
export class LoaderComponent {
    loadingService = inject(LoadingService);
}
