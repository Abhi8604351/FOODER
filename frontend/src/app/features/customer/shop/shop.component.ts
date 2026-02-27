import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../../core/services/food.service';
import { CartService } from '../../../core/services/cart.service';
import { Food } from '../../../core/models/food.model';
import { debounceTime, Subject, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shop-container animate__animated animate__fadeIn">
      <header class="shop-header">
        <h1>Gourmet <span>Delights</span></h1>
        <p>Premium food, delivered fast to your doorstep.</p>
      </header>
      
      <div class="shop-controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search for dishes..." 
            [(ngModel)]="searchQuery"
            (input)="onSearchChange($event)"
          >
          <span class="search-icon">🔍</span>
        </div>

        <div class="filters-container">
          <div class="categories">
            <button [class.active]="currentCategory === 'All'" (click)="filterByCategory('All')">All</button>
            <button *ngFor="let cat of categories" [class.active]="currentCategory === cat" (click)="filterByCategory(cat)">
              {{ cat }}
            </button>
          </div>

          <div class="diet-filter">
            <button [class.active]="dietFilter === 'all'" (click)="setDietFilter('all')">All</button>
            <button class="veg" [class.active]="dietFilter === 'veg'" (click)="setDietFilter('veg')">Veg Only</button>
            <button class="non-veg" [class.active]="dietFilter === 'non-veg'" (click)="setDietFilter('non-veg')">Non-Veg</button>
          </div>
        </div>
      </div>

      <div class="food-grid" *ngIf="foods.length > 0; else noResults">
        <div class="food-card animate__animated animate__fadeInUp" *ngFor="let food of foods">
          <div class="img-wrapper">
            <img [src]="food.image" [alt]="food.name">
            <div class="badge-row">
              <span class="veg-badge" [class.non-veg]="!food.isVeg">
                 {{ food.isVeg ? 'Veg' : 'Non-Veg' }}
              </span>
              <span class="stock-badge" *ngIf="food.countInStock <= 5 && food.countInStock > 0">
                Only {{ food.countInStock }} Left!
              </span>
              <span class="stock-badge out" *ngIf="food.countInStock === 0">
                Sold Out
              </span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-header">
              <h4>{{ food.name }}</h4>
              <span class="price">₹{{ food.price }}</span>
            </div>
            <p>{{ food.description }}</p>
            <div class="card-footer">
              <span class="category-tag">{{ food.category }}</span>
              <button class="add-btn" 
                      [disabled]="food.countInStock === 0" 
                      (click)="addToCart(food)">
                {{ food.countInStock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noResults>
        <div class="empty-state">
          <p>No dishes found matching your criteria.</p>
          <button (click)="resetFilters()">Clear all filters</button>
        </div>
      </ng-template>

      <!-- Pagination (Simple) -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .shop-header { text-align: center; margin-bottom: 3rem; }
    .shop-header h1 { font-size: 3.5rem; margin-bottom: 0.5rem; letter-spacing: -1px; }
    .shop-header h1 span { color: #ff4757; }
    
    .shop-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3.5rem;
    }

    .search-box {
      width: 100%;
      max-width: 600px;
      position: relative;
    }
    .search-box input {
      width: 100%;
      padding: 1rem 1.5rem 1rem 3.5rem;
      border: none;
      border-radius: 30px;
      background: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      font-size: 1.1rem;
      outline: none;
      transition: 0.3s;
    }
    .search-box input:focus { box-shadow: 0 10px 30px rgba(255,71,87,0.15); }
    .search-icon { position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); font-size: 1.2rem; }

    .filter-bar {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .filter-bar button {
      padding: 0.7rem 1.8rem;
      border: none;
      background: white;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      box-shadow: 0 5px 15px rgba(0,0,0,0.03);
      transition: 0.3s;
    }
    .categories button.active, .categories button:hover {
      background: #ff4757;
      color: white;
      transform: translateY(-2px);
    }
    .diet-filter { display: flex; gap: 0.5rem; background: white; padding: 0.4rem; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
    .diet-filter button { padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; border: none; background: transparent; cursor: pointer; transition: 0.3s; }
    .diet-filter button.active { background: #2d3436; color: white; }
    .diet-filter button.veg.active { background: #2ecc71; color: white; }
    .diet-filter button.non-veg.active { background: #e74c3c; color: white; }

    .food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2.5rem; }
    .food-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.05); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; }
    .food-card:hover { transform: translateY(-12px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    
    .img-wrapper { position: relative; height: 220px; }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    
    .badge-row { position: absolute; top: 1rem; left: 1rem; right: 1rem; display: flex; justify-content: space-between; align-items: flex-start; }
    .veg-badge { background: #2ecc71; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
    .veg-badge.non-veg { background: #e74c3c; }
    
    .stock-badge { background: #f1c40f; color: #2d3436; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; }
    .stock-badge.out { background: #2d3436; color: white; }

    .card-body { padding: 1.8rem; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .card-header h4 { margin: 0; font-size: 1.2rem; }
    .price { font-weight: 800; color: #ff4757; font-size: 1.2rem; }
    .card-body p { color: #636e72; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; height: 2.7rem; overflow: hidden; }
    
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .category-tag { background: #f1f2f6; padding: 0.3rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; color: #747d8c; }
    
    .add-btn { padding: 0.6rem 1.2rem; background: #2d3436; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .add-btn:hover:not(:disabled) { background: #ff4757; }
    .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .pagination { margin-top: 4rem; display: flex; justify-content: center; align-items: center; gap: 2rem; }
    .pagination button { padding: 0.8rem 1.5rem; background: white; border-radius: 12px; font-weight: 700; color: #333; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

    .empty-state { text-align: center; padding: 5rem; background: white; border-radius: 20px; }
  `]
})
export class ShopComponent implements OnInit {
  private foodService = inject(FoodService);
  private cartService = inject(CartService);

  foods: Food[] = [];
  categories: string[] = [];
  currentCategory = 'All';
  searchQuery = '';
  private searchSubject = new Subject<string>();

  currentPage = 1;
  totalPages = 1;
  limit = 8;
  dietFilter: 'all' | 'veg' | 'non-veg' = 'all';

  ngOnInit() {
    this.loadFoods();
    this.loadCategories();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadFoods();
    });
  }

  loadFoods() {
    const params: any = {
      page: this.currentPage,
      limit: this.limit,
      category: this.currentCategory,
      search: this.searchQuery
    };

    this.foodService.getFoods(params).subscribe((res: any) => {
      let filteredFoods = res.data.foods;

      // Client side diet filtering for smoother experience
      if (this.dietFilter === 'veg') {
        filteredFoods = filteredFoods.filter((f: any) => f.isVeg);
      } else if (this.dietFilter === 'non-veg') {
        filteredFoods = filteredFoods.filter((f: any) => !f.isVeg);
      }

      this.foods = filteredFoods;
      this.totalPages = res.data.pagination.totalPages;
    });
  }

  private loadCategories() {
    this.foodService.getCategories().subscribe((cats: string[]) => {
      this.categories = ['All', ...cats];
    });
  }

  setDietFilter(filter: 'all' | 'veg' | 'non-veg') {
    this.dietFilter = filter;
    this.loadFoods();
  }

  filterByCategory(cat: string) {
    this.currentCategory = cat;
    this.currentPage = 1;
    this.loadFoods();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadFoods();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearchChange(event: any) {
    this.searchSubject.next(this.searchQuery);
  }

  resetFilters() {
    this.searchQuery = '';
    this.currentCategory = 'All';
    this.dietFilter = 'all';
    this.currentPage = 1;
    this.loadFoods();
  }


  addToCart(food: Food) {
    this.cartService.addToCart(food);
  }
}
