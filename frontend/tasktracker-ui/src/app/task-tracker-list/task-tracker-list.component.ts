// task-tracker-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskTrackerServiceService } from '../services/task-tracker-service.service';
import { TaskItem } from '../models/Task';

@Component({
  selector: 'app-task-tracker-list',
  templateUrl: './task-tracker-list.component.html',
  styleUrls: ['./task-tracker-list.component.css']
})
export class TaskTrackerListComponent implements OnInit {
  tasks: TaskItem[] = [];
  isLoading = true;
  error: string | null = null;
  showTaskForm = false;
  selectedTask: TaskItem | null = null;
  searchQuery: string = '';
  sortOption: string = 'dueDate:asc';
  constructor(
    private service: TaskTrackerServiceService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.error = null;
    
    this.service.getTasks(this.searchQuery, this.sortOption).subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => this.error = 'Failed to fetch tasks. Please try again.',
      complete: () => this.isLoading = false
    });
  }

  onAddTask(): void {
    this.selectedTask = null;
    this.showTaskForm = true;
  }

  onEditTask(task: TaskItem): void {
    this.selectedTask = { ...task };
    this.showTaskForm = true;
  }

  onTaskSaved(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
    this.loadTasks();
  }

  onCancelEdit(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
  }

  onDeleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.service.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.error = 'Failed to delete task. Please try again.';
        }
      });
    }
  }
}