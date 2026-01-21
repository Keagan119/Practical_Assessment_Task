import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { TaskItem } from '../models/Task';
import { environment } from '../../environments/environment';
import { NotificationServiceService } from './notification-service.service';

@Injectable({
  providedIn: 'root'
})
export class TaskTrackerServiceService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private notificationService: NotificationServiceService) {}

   private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = error.error?.detail || error.error?.title || error.message;
    } else if (error.status >= 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    }
    this.notificationService.showError(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  getTasks(search?: string, sort?: string): Observable<TaskItem[]> {
  let params: any = {};
  if (search) params.q = search;
  if (sort) params.sort = sort;

  return this.http.get<TaskItem[]>(`${this.baseUrl}/task`, { params })
  .pipe(
        catchError(this.handleError.bind(this))
      );
  ;
}


  getSingleTask(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.baseUrl}/task/${id}`)
    .pipe(
        catchError(this.handleError.bind(this))
      );
  ;
    ;
  }


  createTask(task: TaskItem): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.baseUrl}/task`, task)
    .pipe(
        tap(() => {
          this.notificationService.showSuccess('Task created successfully');
        }),
        catchError(this.handleError.bind(this))
      );
    ;
  }


  updateTask(id: number, task: TaskItem): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.baseUrl}/task/${id}`, task)
    .pipe(
        tap(() => {
          this.notificationService.showSuccess('Task updated successfully');
        }),
        catchError(this.handleError.bind(this))
      );
    ;
  }

 
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/task/task-delete/${id}`)
    .pipe(
        tap(() => {
          this.notificationService.showSuccess('Task deleted successfully');
        }),
        catchError(this.handleError.bind(this))
      );
    ;
  }


  getTest(): Observable<string> {
    return this.http.get(`${this.baseUrl}/test`, {
      responseType: 'text'
    });
  }
}

