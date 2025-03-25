import { NotificationService } from './../../services/notificatio.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryServiceService } from '../../services/category-service.service';
import { CommonModule } from '@angular/common';
import { Category, createNewCategory } from '../../models/category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  imports: [ReactiveFormsModule,CommonModule],
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit,OnDestroy {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  notifications: { type: string, message: string }[] = [];
  private subscription!: Subscription;

  constructor(private fb: FormBuilder, private categoryService: CategoryServiceService,private notificationService:NotificationService) {
    this.categoryForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.loadCategories();
  }

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.notifications.push(notification);
      setTimeout(() => this.notifications.shift(), 3000);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCategories() {
    this.categoryService.loadCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: err => this.notificationService.error('Error loading categories')
    });
  }

  saveCategory() {
    if (this.categoryForm.valid) {
      const category = this.categoryForm.value;
      this.categoryService.createOrUpdateCategory(category).subscribe({
        next: res => {
          this.notificationService.success('Category saved successfully!');
          this.resetForm();
          this.loadCategories();
        },
        error: err => this.notificationService.error('Data not saved')
      });
    }
  }

  editCategory(category: Category) {
    this.categoryForm.patchValue(category);
    this.isEditing = true;
  }

  deleteCategory(id: number) {
    const confirmation = confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.notificationService.success('Category Deleted successfully!');
        },
        error: err => this.notificationService.error('Failed to delete category')
      });
    }
  }

  resetForm() {
    this.categoryForm.reset(createNewCategory());
    this.isEditing = false;
  }
}
