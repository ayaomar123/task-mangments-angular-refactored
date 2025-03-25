import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkStoredToken();
  }

  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('AngularUserToken', response.token);
          this.userSubject.next(this.getUserFromToken(response.token));
        })
      );
  }

  register(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/register`, credentials)
      .pipe(
        tap(response => {
        debugger;
          localStorage.setItem('AngularUserToken', response.token);
          this.userSubject.next(this.getUserFromToken(response.token));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('AngularUserToken');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('AngularUserToken');
  }

  private checkStoredToken(): void {
    const token = localStorage.getItem('AngularUserToken');
    if (token) {
      const user = this.getUserFromToken(token);
      if (user) {
        this.userSubject.next(user);
      } else {
        this.logout();
      }
    }
  }

  private getUserFromToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      if (expirationDate <= new Date()) {
        return null;
      }
      return {
        id: payload.nameid,
        email: payload.email,
      } as User;
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  }
}
