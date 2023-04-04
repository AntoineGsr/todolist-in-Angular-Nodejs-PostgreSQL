import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  password = '';
  email = '';

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
  }
}
