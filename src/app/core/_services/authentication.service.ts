import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';
  private token: string;
  private expiresIn: number;

  constructor(
    private httpClient: HttpClient
  ) {
    //&& localStorage.getItem('expiresIn') < Date.now
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.expiresIn = +localStorage.getItem('expiresIn');
    }
   }

  public login(email: string, password: string): Observable<{authType: string, expiresIn: number, token: string}> {
    return this.httpClient.post<{authType: string, expiresIn: number, token: string}>(this.baseUrl + 'auth/login', {email, password})
    .pipe(tap((loginResponse) => {
      localStorage.setItem('token', loginResponse.token)
      localStorage.setItem('expiresIn', loginResponse.expiresIn.toString())
      this.token = loginResponse.token;
      this.expiresIn = loginResponse.expiresIn;
    }));
  }

  public logout(): Observable<{msg: string}> {
    return this.httpClient.post<{msg: string}>(this.baseUrl + 'auth/logout', {})
      .pipe(tap((logoutResponse) => {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
      }));
  }

  public getToken(): string {
    return this.token
  }

  public getExpiresIn(): number {
    return this.expiresIn;
  }

}
