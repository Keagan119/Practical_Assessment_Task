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

  constructor(
    private service: TaskTrackerServiceService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.error = null;
    
    this.service.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log(this.tasks, 'tasls')
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error = 'Failed to load tasks. Please try again later.';
        this.isLoading = false;
      }
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