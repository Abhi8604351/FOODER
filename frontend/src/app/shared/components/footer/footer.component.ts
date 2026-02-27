import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2026 FoodFlex Delivery. All rights reserved.</p>
        <div class="socials">
          <a href="#">FB</a>
          <a href="#">IG</a>
          <a href="#">TW</a>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background: #2f3542;
      color: white;
      padding: 2rem 0;
      margin-top: 4rem;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }
    .socials a {
      color: white;
      text-decoration: none;
      margin-left: 1rem;
    }
  `]
})
export class FooterComponent { }
