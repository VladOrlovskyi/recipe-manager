import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private apiUrl = 'https://dummyjson.com';

  constructor(private _http: HttpClient) {}

  getRecipes(tag?: string): Observable<any> {
    let url: string;

    if (tag && tag !== 'All') {
      url = `${this.apiUrl}/recipes/tag/${tag}`;
    } else {
      url = `${this.apiUrl}/recipes`;
    }

    return this._http.get<any>(url);
  }

  getRecipe(id: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/recipes/${id}`);
  }

  getRecipesTags(): Observable<string[]> {
    return this._http.get<string[]>(`${this.apiUrl}/recipes/tags`);
  }
}
