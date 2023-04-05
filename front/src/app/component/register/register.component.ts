import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { AuthService } from 'src/app/service/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  password = '';
  email = '';
  user : User = new User();

  constructor(private crudService: CrudService, private  authService: AuthService) {}

  ngOnInit(): void {
    this.email = "";
    this.password = "";
    this.user = new User();
  }

  login() {
    this.user.email = this.email;
    this.user.password_hash = this.password;
    console.log(this.user.email, this.user.password_hash);
    this.authService.login(this.user).pipe(
      tap((res) => {
        this.ngOnInit();
      }),
      catchError((err) => {
        alert('Erreur: login');
        console.log('Erreur: login');
        return EMPTY;
      })
    ).subscribe();
  }
}
