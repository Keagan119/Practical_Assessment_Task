// task-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskItem } from '../models/Task';
import { TaskTrackerServiceService } from '../services/task-tracker-service.service';

type FormMode = 'create' | 'edit';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() mode: FormMode = 'create';
  @Input() task: Partial<TaskItem> = {};
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  
  taskForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  
  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];
  
  priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskTrackerServiceService,
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      status: ['pending', Validators.required],
      priority: ['medium', Validators.required],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.task) {
      this.taskForm.patchValue({
        title: this.task.title || '',
        description: this.task.description || '',
        status: this.task.status || 'pending',
        priority: this.task.priority || 'medium',
        dueDate: this.task.dueDate || null
      });
    }
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get formTitle(): string {
    return this.isEditMode ? 'Edit Task' : 'Create New Task';
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const taskData = {
      ...this.taskForm.value,
      dueDate: this.taskForm.value.dueDate || null
    };

    const request = this.isEditMode && this.task.id
      ? this.taskService.updateTask(this.task.id, taskData)
      : this.taskService.createTask(taskData);

    request.subscribe({
      next: () => {
        this.saved.emit();
        this.taskForm.reset();
      },
      error: (err: any) => {
        console.error('Error saving task:', err);
        this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} task. Please try again.`;
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
    this.taskForm.reset();
  }
}