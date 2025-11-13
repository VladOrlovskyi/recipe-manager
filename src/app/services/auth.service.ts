import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

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
