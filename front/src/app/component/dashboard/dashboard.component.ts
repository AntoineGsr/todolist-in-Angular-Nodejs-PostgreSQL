import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { Task } from 'src/app/model/task';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  taskObj: Task = new Task();
  taskArr1: Task[] = [];
  taskArr2: Task[] = [];
  taskArr3: Task[] = [];
  addTaskValue = '';
  editTaskValue = '';
  editTaskStatus = 0;

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.editTaskValue = '';
    this.editTaskStatus = 0;
    this.addTaskValue = '';
    this.taskObj = new Task();
    this.taskArr1 = [];
    this.taskArr2 = [];
    this.taskArr3= [];
    this.getAllTask();
  }

  addTask() {
    this.taskObj.name = this.addTaskValue;
    this.crudService.addTask(this.taskObj).pipe(
      tap(() => {
        this.ngOnInit();
        this.addTaskValue = '';
      }),
      catchError((err) => {
        alert("Error: addTask");
        console.log("Error: addTask");
        return EMPTY;
      })
    ).subscribe();
  }

  getAllTask() {
    this.getTaskByStatus(0, this.taskArr1);
    this.getTaskByStatus(1, this.taskArr2);
    this.getTaskByStatus(2, this.taskArr3);
  }

  editTask() {
    this.taskObj.name = this.editTaskValue;
    this.taskObj.status = this.editTaskStatus;
    console.log(this.taskObj.id, this.taskObj.name);
    this.crudService.editTask(this.taskObj).pipe(
      tap(() => {
        this.ngOnInit();
      }),
      catchError((err) => {
        alert('Erreur: editTask');
        console.log('Erreur: editTask');
        return EMPTY;
      })
    ).subscribe();
  }

  deleteTask(etask: Task) {
    this.crudService.deleteTask(etask).pipe(
      tap(() => {
        this.ngOnInit();
      }),
      catchError((err) => {
        alert('Erreur: deleteTask');
        console.log('Erreur: deleteTask');
        return EMPTY;
      })
    ).subscribe();
  }

  call(etask: Task) {
    this.taskObj = etask;
    this.editTaskValue = etask.name;
    this.editTaskStatus = etask.status;
  }

  getTaskByStatus(idStatus : number, taskArr : Task[]) {
    this.crudService.getTaskByStatus(idStatus).pipe(
      tap((res) => {
        if (idStatus == 0)
          this.taskArr1 = res;
        if (idStatus == 1)
          this.taskArr2 = res;
        if (idStatus == 2)
          this.taskArr3 = res;
      }),
      catchError((err) => {
        alert('Erreur: getTaskByStatus');
        console.log('Erreur: getTaskByStatus');
        return EMPTY;
      })
    ).subscribe();
  }
}
