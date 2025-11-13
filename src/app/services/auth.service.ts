import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';

  constructor(private _http: HttpClient, private router: Router) {}

  private _getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private _getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['']);
  }

  loginUser(user: any): Observable<any> {
    return this._http.post(`https://dummyjson.com/auth/login`, user, {
      headers: this._getHeaders(),
    });
  }

  authenticateUser(token: string): Observable<any> {
    return this._http.get(`https://dummyjson.com/auth/me`, {
      headers: this._getAuthHeaders(token),
    });
  }
}
