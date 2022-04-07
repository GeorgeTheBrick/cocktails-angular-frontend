import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  BehaviorSubject,
  filter,
  find,
  map,
  Observable,
  of,
  Subject,
  subscribeOn,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ApiService } from '../api.service';
import { CocktailEntity } from '../cocktail-entity.interface';

export interface Cocktail {
  id: string;
  name: string;
  image: string;
  alcoholic: boolean;
  ingredients?: string[];
  measure?: string[];
  instructions?: string;
}

export interface Error {
  error: { error: string };
  name: string;
  status: number | null;
  statusText: string;
}

@Injectable({ providedIn: 'root' })
export class CocktailService {
  public cocktails$: BehaviorSubject<Cocktail[]> = new BehaviorSubject<
    Cocktail[]
  >([]);

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public errorMessage: Error = {
    error: { error: '' },
    name: '',
    status: null,
    statusText: '',
  };

  constructor(private apiService: ApiService, private router: Router) {
    this.isLoading$.next(true);
    this.fetchCocktails()
      .pipe(
        map((cocktails: CocktailEntity) => {
          return [...cocktails.alcoholic, ...cocktails.nonAlcoholic];
        }),
        tap((cocktails: Cocktail[]) => {
          this.cocktails$.next(cocktails);
          this.isLoading$.next(false);
        })
      )
      .subscribe(
        (response) => {},
        (error) => {
          this.router.navigate(['/error']);
          this.errorMessage = {
            error: error.error,
            name: error.name,
            status: error.status,
            statusText: error.statusText,
          };
        }
      );
  }

  public observeLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  private fetchCocktails(): Observable<CocktailEntity> {
    return this.apiService.get();
  }

  public getCocktails(): Observable<Cocktail[]> {
    return this.cocktails$.pipe(filter((cocktail) => !!cocktail));
  }
  public getCocktail(id: string): Observable<Cocktail | undefined> {
    return this.cocktails$.pipe(
      map((cocktails: Cocktail[]) => {
        return cocktails.find((cocktail: Cocktail) => {
          return cocktail.id === id;
        });
      })
    );
  }

  public searchCocktails(query: string): Observable<Cocktail[]> {
    return this.cocktails$.pipe(
      take(1),
      map((cocktails: Cocktail[]) =>
        cocktails.filter((cocktail: Cocktail) => {
          if (query === '??') {
            return cocktail;
          } else {
            return (
              cocktail.name.toLowerCase().includes(query.toLowerCase()) ||
              cocktail.id.includes(query) ||
              cocktail.ingredients
                ?.filter((el) => el.toLowerCase().includes(query.toLowerCase()))
                .join('')
            );
          }
        })
      )
    );
  }
}
