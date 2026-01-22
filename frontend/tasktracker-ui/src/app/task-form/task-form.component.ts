import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskItem } from '../models/Task';
import { TaskTrackerServiceService } from '../services/task-tracker-service.service';
import { NotificationServiceService } from '../services/notification-service.service';

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
  { value: 'New', label: 'New' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Done', label: 'Done' }
];

  priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' }
];


  constructor(
    private fb: FormBuilder,
    private taskService: TaskTrackerServiceService,
    private notificationService: NotificationServiceService
  ) {
   this.taskForm = this.fb.group({
  title: ['', [Validators.required, Validators.maxLength(100)]],
  description: ['', Validators.maxLength(500)],
  status: ['New', Validators.required],
  priority: ['Low', Validators.required],
  dueDate: [null]
});
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.task) {
       const dueDate = this.task.dueDate 
      ? new Date(this.task.dueDate).toISOString().split('T')[0] 
      : null;
      this.taskForm.patchValue({
        title: this.task.title || '',
        description: this.task.description || '',
        status: this.task.status || 'New',
        priority: this.task.priority || 'Low',
        dueDate: dueDate
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
    const title = this.taskForm.get('title')?.value;

  if (!title || !isNaN(Number(title))) {
    this.notificationService.showError('Title cannot be purely numeric');
    return;
  }
    this.isSubmitting = true;
    this.error = null;

    const taskData = {
      ...this.taskForm.value,
      dueDate: this.taskForm.value.dueDate ? new Date(this.taskForm.value.dueDate).toISOString() : null
    };

    const request = this.isEditMode && this.task.id
      ? this.taskService.updateTask(this.task.id, taskData)
      : this.taskService.createTask(taskData);
    console.log(taskData, 'taskdata')
    request.subscribe({
      next: () => {
        const message = this.mode === 'create' 
          ? 'Task created successfully' 
          : 'Task updated successfully';
        
        this.notificationService.showSuccess(message);
        this.saved.emit();
        this.taskForm.reset();
      },
      error: (err: any) => {
      
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