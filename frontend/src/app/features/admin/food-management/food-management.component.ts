import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../../core/services/food.service';
import { Food } from '../../../core/models/food.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-food-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="food-mgmt animate__animated animate__fadeIn">
      <div class="header-row">
        <h3>Food Management</h3>
        <button class="add-btn" (click)="openAddModal()">+ Add New Food</button>
      </div>

      <div class="table-container mt-4">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let food of foods">
              <td><img [src]="food.image" class="thumb"></td>
              <td>{{ food.name }}</td>
              <td>{{ food.category }}</td>
              <td>₹{{ food.price }}</td>
              <td>
                <span class="stock-num" [class.low]="food.countInStock <= 5">
                  {{ food.countInStock }}
                </span>
              </td>
              <td>
                <span class="type-pill" [class.veg]="food.isVeg">
                  {{ food.isVeg ? 'Veg' : 'Non-Veg' }}
                </span>
              </td>
              <td class="actions">
                <button class="edit-btn" (click)="openEditModal(food)">Edit</button>
                <button class="delete-btn" (click)="deleteFood(food._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Previous</button>
        <span>Page {{ currentPage }} / {{ totalPages }}</span>
        <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Next</button>
      </div>

      <!-- Add/Edit Modal (Premium) -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal animate__animated animate__zoomIn" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingFoodId ? 'Update Food Item' : 'Add New Item' }}</h3>
          </div>
          <form (ngSubmit)="saveFood()">
            <div class="form-group">
              <label>Plate Name</label>
              <input type="text" name="name" [(ngModel)]="currentFood.name" required placeholder="e.g. Italian Pasta">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea name="desc" [(ngModel)]="currentFood.description" required rows="2"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Price (₹)</label>
                <input type="number" name="price" [(ngModel)]="currentFood.price" required>
              </div>
              <div class="form-group">
                <label>Category</label>
                <input type="text" name="cat" [(ngModel)]="currentFood.category" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Items in Stock</label>
                <input type="number" name="stock" [(ngModel)]="currentFood.countInStock" required>
              </div>
              <div class="form-group diet-toggle">
                <label>Dietary Type</label>
                <div class="toggle-btns">
                  <button type="button" [class.active]="currentFood.isVeg" (click)="currentFood.isVeg = true">Veg</button>
                  <button type="button" [class.active]="!currentFood.isVeg" (click)="currentFood.isVeg = false">Non-Veg</button>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Image URL or Upload from PC</label>
              <div class="upload-row">
                <input type="text" name="img" [(ngModel)]="currentFood.image" required placeholder="Paste URL or upload -->">
                <label class="file-label">
                  📁
                  <input type="file" (change)="onFileSelected($event)" accept="image/*">
                </label>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="cancel-btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="save-btn" [disabled]="isUploading">{{ editingFoodId ? 'Update Item' : 'Create Item' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: center; }
    .add-btn { background: #ff4757; color: white; border: none; padding: 0.9rem 1.8rem; border-radius: 12px; font-weight: 700; cursor: pointer; }
    
    .table-container { background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1.2rem; border-bottom: 2px solid #f1f2f6; color: #b2bec3; font-size: 0.8rem; text-transform: uppercase; }
    td { padding: 1.2rem; border-bottom: 1px solid #f1f2f6; font-size: 0.95rem; }
    
    .thumb { width: 45px; height: 45px; object-fit: cover; border-radius: 10px; }
    .stock-num { font-weight: 700; color: #2ecc71; }
    .stock-num.low { color: #f1c40f; }
    .type-pill { padding: 0.3rem 0.7rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; background: #e74c3c; color: white; }
    .type-pill.veg { background: #2ecc71; }
    
    .actions { display: flex; gap: 0.5rem; }
    .edit-btn { background: #e3f2fd; color: #1976d2; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; }
    .delete-btn { background: #ffebee; color: #c62828; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; }
    
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.4); backdrop-filter: blur(5px);
      display: flex; justify-content: center; align-items: center; z-index: 2000;
    }
    .modal { background: white; padding: 2.2rem; border-radius: 25px; width: 550px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
    .modal-header { margin-bottom: 1.5rem; border-bottom: 1px solid #f1f2f6; padding-bottom: 0.8rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    label { display: block; margin-bottom: 0.4rem; font-size: 0.85rem; font-weight: 600; color: #2d3436; }
    input, textarea { width: 100%; padding: 0.7rem; border: 1px solid #dfe6e9; border-radius: 10px; font-size: 1rem; outline: none; transition: 0.3s; }
    input:focus, textarea:focus { border-color: #ff4757; }
    
    .toggle-btns { display: flex; background: #f1f2f6; padding: 0.3rem; border-radius: 10px; }
    .toggle-btns button { flex: 1; border: none; padding: 0.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; background: transparent; }
    .toggle-btns button.active { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

    .upload-row { display: flex; gap: 0.5rem; align-items: center; }
    .file-label { 
      background: #f1f2f6; padding: 0.7rem; border-radius: 10px; cursor: pointer; 
      font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
      transition: 0.3s; width: 45px; height: 45px;
    }
    .file-label:hover { background: #dfe6e9; }
    .file-label input { display: none; }

    .pagination { margin-top: 2rem; display: flex; justify-content: flex-end; align-items: center; gap: 1.5rem; }
    .pagination button { padding: 0.6rem 1.2rem; background: white; border-radius: 8px; font-weight: 600; }
  `]
})
export class FoodManagementComponent implements OnInit {
  private foodService = inject(FoodService);
  foods: Food[] = [];
  showModal = false;
  editingFoodId: string | null = null;
  currentFood: Partial<Food> = {};
  isUploading = false;

  currentPage = 1;
  totalPages = 1;
  limit = 10;

  ngOnInit() {
    this.loadFoods();
  }

  loadFoods() {
    this.foodService.getFoods({ page: this.currentPage, limit: this.limit }).subscribe((res: any) => {
      this.foods = res.data.foods;
      this.totalPages = res.data.pagination.totalPages;
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadFoods();
  }

  openAddModal() {
    this.editingFoodId = null;
    this.currentFood = { name: '', description: '', price: 0, category: '', image: '', isAvailable: true };
    this.showModal = true;
  }

  openEditModal(food: Food) {
    this.editingFoodId = food._id;
    this.currentFood = { ...food };
    this.showModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.foodService.uploadImage(file).subscribe({
        next: (res: any) => {
          this.currentFood.image = environment.baseUrl + res.data;
          this.isUploading = false;
        },
        error: (err) => {
          console.error(err);
          this.isUploading = false;
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  saveFood() {
    if (this.editingFoodId) {
      this.foodService.updateFood(this.editingFoodId, this.currentFood).subscribe(() => {
        this.loadFoods();
        this.closeModal();
      });
    } else {
      this.foodService.createFood(this.currentFood).subscribe(() => {
        this.loadFoods();
        this.closeModal();
      });
    }
  }

  deleteFood(id: string) {
    if (confirm('Are you sure you want to delete this food item? Any active orders won\'t be affected.')) {
      this.foodService.deleteFood(id).subscribe(() => this.loadFoods());
    }
  }
}
