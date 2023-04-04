import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../model/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  serviceURL : string = "http://localhost:3000/tasks";

  constructor(private http : HttpClient) {
  }

  addTask(task : Task) : Observable<Task> {
    return this.http.post<Task>(this.serviceURL, task);
  }

  getAllTask() : Observable<Task[]> {
    return this.http.get<Task[]>(this.serviceURL);
  }

  deleteTask(task : Task) : Observable<Task> {
    return this.http.delete<Task>(this.serviceURL + '/' + task.id);
  }

  editTask(task : Task) : Observable<Task> {
    return this.http.put<Task>(this.serviceURL + '/' + task.id, task);
  }

  getTaskByStatus(idStatus : number) : Observable<Task[]> {
    return this.http.get<Task[]>(this.serviceURL + '/getTaskByStatus/' + idStatus);
  }
}
