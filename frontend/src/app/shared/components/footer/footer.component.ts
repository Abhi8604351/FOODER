import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <p class="copyright">&copy; 2026 FoodFlex Delivery. All rights reserved.</p>
        </div>
        
        <div class="footer-section developer-info">
          <h4>About Developer</h4>
          <p><strong>{{ 'ABHISHEK DINESH SINGH' }}</strong></p>
          <p>📞 +91 8604351930</p>
          <p>🆔 ROLL NO S116</p>
        </div>

        <div class="footer-section">
          <h4>Connect</h4>
          <div class="socials">
            <a href="https://www.linkedin.com/in/a8b6h0/" target="_blank" title="LinkedIn">LinkedIn</a>
            <a href="https://www.instagram.com/justabhishek__?igsh=ZGlvYnVzbTc4N3Y4" target="_blank" title="Instagram">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1e272e;
      color: #d1d8e0;
      padding: 3rem 0;
      margin-top: 5rem;
      border-top: 1px solid #2f3542;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 2rem;
    }
    .footer-section h4 {
      color: #ff4757;
      margin-bottom: 1.2rem;
      font-size: 1.1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .developer-info p {
      margin: 0.4rem 0;
      font-size: 0.95rem;
    }
    .copyright {
      font-size: 0.9rem;
      opacity: 0.8;
    }
    .socials {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .socials a {
      color: #70a1ff;
      text-decoration: none;
      font-weight: 500;
      transition: 0.3s;
    }
    .socials a:hover {
      color: white;
      text-decoration: underline;
    }
  `]
})
export class FooterComponent { }
