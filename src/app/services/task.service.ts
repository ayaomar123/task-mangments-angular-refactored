import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Task } from '../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  getTasks(filters?: { categoryId?: number, status?: boolean, dueDate?: string }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.categoryId !== undefined) {
        params = params.set('categoryId', filters.categoryId.toString());
      }
      if (filters.status !== undefined) {
        params = params.set('status', filters.status.toString());
      }
      if (filters.dueDate) {
        params = params.set('dueDate', filters.dueDate);
      }
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createNewTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
