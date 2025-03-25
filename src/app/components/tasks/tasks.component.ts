import { NotificationService } from './../../services/notificatio.service';
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { createNewTask, Task } from '../../models/tasks';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { StatusPipe } from "../../pipes/status.pipe";
import { PirorityPipe } from "../../pipes/pirority.pipe";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, StatusPipe, PirorityPipe],
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasksForm: FormGroup;
  tasks: Task[] = [];
  categories: Category[] = [];

  //filters
  selectedCategoryId: number | null = null;
  selectedStatus: boolean | null = null;
  selectedDueDate: string = '';

  notifications: { type: string, message: string }[] = [];
  private subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.tasksForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [false, Validators.required],
      priority: [1, Validators.required],
      dueDate: [new Date(), Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadTasks();
    this.loadCategories();

    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.notifications.push(notification);
      setTimeout(() => this.notifications.shift(), 3000);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadTasks() {
    this.taskService.getTasks({
      categoryId: this.selectedCategoryId ?? undefined,
      status: this.selectedStatus ?? undefined,
      dueDate: this.selectedDueDate || undefined
    }).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onFilterChange() {
    this.loadTasks();
  }

  resetFilters() {
    this.selectedCategoryId = null;
    this.selectedStatus = null;
    this.selectedDueDate = '';
    this.loadTasks();
  }

  loadCategories() {
    this.categoryService.loadCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  saveTask() {
    const task: Task = this.tasksForm.value;
    if (task.id === 0) {
      this.taskService.createNewTask(task).subscribe(() => {
        this.tasksForm.reset(createNewTask());
        this.notificationService.success('Task Created successfully')
      });
    } else {
      debugger;
      this.taskService.updateTask(task).subscribe(() => {
        this.tasksForm.reset(createNewTask());
        debugger;
        this.notificationService.success('Task Updated successfully')
      });
    }
    this.loadTasks();
  }

  onEdit(task: Task) {
    this.tasksForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toString().split('T')[0] : '',
      categoryId: task.category?.id ?? null
    });
  }


  deleteTask(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.notificationService.success('Task Deleted successfully!');
        this.loadTasks();
      });
    }
  }

  resetForm() {
    this.tasksForm.reset(createNewTask());
  }
}
