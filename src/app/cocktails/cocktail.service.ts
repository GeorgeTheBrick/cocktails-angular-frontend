import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { CocktailEntity } from '../cocktail-entity.interface';

export interface Cocktail {
  id: string;
  name: string;
  image: string;
  alcoholic: boolean;
  ingredients?: { name: string; measure: string }[];
  instructions?: string;
  _id: string;
  createdBy?: string;
}

@Injectable({ providedIn: 'root' })
export class CocktailService {
  public cocktail$: Subject<Cocktail[]> = new Subject();

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  constructor(private apiService: ApiService, private router: Router) {}

  public observeLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  private fetchCocktails(): Observable<CocktailEntity> {
    return this.apiService.get('cocktails');
  }

  public fetchCocktail(id: string): Observable<CocktailEntity> {
    return this.apiService.get(`cocktails/${id}`);
  }

  public fetchSearch(query: string): Observable<CocktailEntity> {
    return this.apiService.get(`cocktails/${query}`);
  }

  public fetchRandom(query: string): Observable<CocktailEntity> {
    return this.apiService.get(`cocktails/${query}`);
  }

  private fetchMyCocktails(): Observable<CocktailEntity> {
    return this.apiService.get(`cocktails/myCocktails`);
  }

  public createCocktail(body: Cocktail): Observable<Cocktail> {
    return this.apiService.post(`cocktails`, body);
  }

  public updateCocktail(id: string, body: Cocktail): Observable<Cocktail> {
    return this.apiService.patch(`cocktails/${id}`, body);
  }

  public deleteCocktail(id: string): Observable<Cocktail> {
    return this.apiService.delete(`cocktails/${id}`);
  }
  public getMyCocktails(): Observable<Cocktail[]> {
    return this.fetchMyCocktails().pipe(
      map((data: CocktailEntity) => data.cocktails)
    );
  }
  public getCocktails(): Observable<Cocktail[]> {
    return this.fetchCocktails().pipe(
      map((data: CocktailEntity) => data.cocktails)
    );
  }

  public getCocktail(id: string): Observable<Cocktail> {
    return this.fetchCocktail(id).pipe(
      map((data: CocktailEntity) => data.cocktail)
    );
  }

  public searchCocktails(query: string): Observable<Cocktail[]> {
    return this.fetchSearch(`?search=${query}`).pipe(
      map((data: CocktailEntity) => data.cocktails)
    );
  }

  public randomCocktail(query: string): Observable<Cocktail[]> {
    return this.fetchRandom(`random/?alcoholic=${query}`).pipe(
      map((data: CocktailEntity) => {
        return [data.cocktail];
      }),
      tap((cocktails: Cocktail[]) => this.cocktail$.next(cocktails))
    );
  }
}
