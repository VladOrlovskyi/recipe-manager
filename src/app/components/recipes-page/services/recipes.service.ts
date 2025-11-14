import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private apiUrl = 'https://dummyjson.com/recipes';
  private recipeDeletedSource = new Subject<number>();
  recipeDeleted$: Observable<number> = this.recipeDeletedSource.asObservable();
  
  constructor(private _http: HttpClient) {}

  searchRecipes(query: string): Observable<any> {
    let params = new HttpParams().set('q', query);
    return this._http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getRecipesByTag(tag?: string): Observable<any> {
    let url: string;

    if (tag && tag !== 'All') {
      url = `${this.apiUrl}/tag/${tag}`;
    } else {
      url = this.apiUrl + '?limit=0&select=';
    }

    return this._http.get<any>(url);
  }

  combineTagAndSearch(tag: string, search: string): Observable<any[]> {
    const tagRequest = this.getRecipesByTag(tag).pipe(
      map((res) => res.recipes || [])
    );
    const searchRequest = this.searchRecipes(search).pipe(
      map((res) => res.recipes || [])
    );

    return forkJoin([tagRequest, searchRequest]);
  }

  getRecipe(id: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/${id}`);
  }

  getRecipesTags(): Observable<string[]> {
    return this._http.get<string[]>(`${this.apiUrl}/tags`);
  }

  getRecipesWithPagination(limit: number, skip: number): Observable<any> {
    const params = new HttpParams().set('limit', limit).set('skip', skip);

    return this._http.get<any>(this.apiUrl, { params });
  }

  notifyRecipeDeleted(id: number): void {
    this.recipeDeletedSource.next(id);
  }
}
