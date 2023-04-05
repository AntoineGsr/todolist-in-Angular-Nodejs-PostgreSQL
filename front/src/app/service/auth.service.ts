import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  serviceUrl = 'http://localhost:3000';
  isLoggedIn : boolean = false;

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(this.serviceUrl + '/register', user);
  }

  login(user: User): Observable<User> {
    this.isLoggedIn = true;
    return this.http.post<User>(this.serviceUrl + '/login', user);
  }
}
