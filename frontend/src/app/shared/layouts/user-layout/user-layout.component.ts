import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-user-layout',
    standalone: true,
    imports: [NavbarComponent, FooterComponent, RouterModule],
    template: `
    <app-navbar></app-navbar>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
    styles: [`
    .content {
      min-height: 80vh;
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 2rem;
    }
  `]
})
export class UserLayoutComponent { }
