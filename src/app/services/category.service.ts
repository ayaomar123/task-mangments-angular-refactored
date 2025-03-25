import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  loadCategories() {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createOrUpdateCategory(category: Category) {
    if (category.id === 0) {
      return this.http.post(this.apiUrl, category);
    } else {
      return this.http.put(`${this.apiUrl}/${category.id}`, category);
    }
  }

  createCategory(category: Category) {
    return this.http.post(this.apiUrl, category);
  }

  updateCategory(category: Category) {
    return this.http.put(`${this.apiUrl}/${category.id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
