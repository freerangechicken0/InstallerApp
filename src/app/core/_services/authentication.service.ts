import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';
  private token: string;
  private expiresAt: number;
  public user: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(
    private httpClient: HttpClient
  ) {
    this.token = localStorage.getItem('token') || '';
    this.expiresAt = +localStorage.getItem('expiresAt') || 0;
  }

  public login(email: string, password: string): Observable<{ authType: string, expiresIn: number, token: string }> {
    return this.httpClient.post<{ authType: string, expiresIn: number, token: string }>(this.baseUrl + 'auth/login', { email, password })
      .pipe(tap((loginResponse) => {
        this.token = loginResponse.token;
        this.expiresAt = +loginResponse.expiresIn + Math.floor(Date.now() / 1000);
        localStorage.setItem('token', this.token);
        localStorage.setItem('expiresAt', this.expiresAt.toString());
      }));
  }

  public logout(): void {
    this.httpClient.post<{ msg: string }>(this.baseUrl + 'auth/logout', {}).subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      this.user.next(null);
    });
  }

  public getToken(): string {
    if (this.expiresAt < Math.floor(Date.now() / 1000)) {
      this.token = '';
      this.expiresAt = 0;
    }
    return this.token;
  }

  public getExpiresAt(): number {
    return this.expiresAt;
  }

  public getUser(): void {
    this.httpClient.get<{ data: User }>(this.baseUrl + 'auth/user').subscribe((user) => {
      this.user.next(user.data);
    });
  }
}
