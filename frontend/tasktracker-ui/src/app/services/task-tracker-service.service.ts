import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem } from '../models/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskTrackerServiceService {
  private readonly baseUrl = 'http://localhost:5228/api';

  constructor(private http: HttpClient) {}


  getTasks(search?: string, sort?: string): Observable<TaskItem[]> {
  let params: any = {};
  if (search) params.q = search;
  if (sort) params.sort = sort;

  return this.http.get<TaskItem[]>(`${this.baseUrl}/task`, { params });
}


  getTask(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.baseUrl}/task/${id}`);
  }


  createTask(task: TaskItem): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.baseUrl}/task`, task);
  }


  updateTask(id: number, task: TaskItem): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.baseUrl}/task/${id}`, task);
  }

 
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/task/task-delete/${id}`);
  }


  getTest(): Observable<string> {
    return this.http.get(`${this.baseUrl}/test`, {
      responseType: 'text'
    });
  }
}

