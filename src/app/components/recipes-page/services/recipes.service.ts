import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private _http: HttpClient) {}

  getRecipes(): Observable<any> {
    return this._http.get(`https://dummyjson.com/recipes`);
  }

  getRecipe(id: number): Observable<any> {
    return this._http.get(`https://dummyjson.com/recipes/${id}`);
  }

  getRecipesTags(): Observable<any> {
    return this._http.get(`https://dummyjson.com/recipes/tags`);
  }
}
