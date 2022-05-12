import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { map, Observable, tap, catchError, EMPTY } from 'rxjs';
import { Cocktail, CocktailService } from '../cocktail.service';

@Component({
  selector: 'app-cocktail-list',
  templateUrl: './cocktail-list.component.html',
  styleUrls: ['./cocktail-list.component.css'],
})
export class CocktailListComponent implements OnInit {
  public cocktailList$!: Observable<Cocktail[]>;
  public isLoading$!: Observable<boolean>;
  public toggleSort: boolean = true;
  public filteredStatus: boolean | undefined;
  public errorObject: null | string = null;

  constructor(
    private cocktailService: CocktailService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.cocktailList$ = this.cocktailService.getCocktails().pipe(
      catchError((err) => {
        this.errorObject = err.statusText + ` (${err.status})`;
        return EMPTY;
      }),
      tap(() => {
        this.errorObject = null;
      })
    );
    this.isLoading$ = this.cocktailService.observeLoading();

    this.searchOnParams();
    this.sortOnFragment();
  }

  private searchOnParams() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['search']) {
        this.cocktailList$ = this.cocktailService
          .searchCocktails(params['search'].toLowerCase())
          .pipe(
            catchError((err) => {
              this.errorObject = `Cocktail ${err.statusText}`;
              return EMPTY;
            }),
            tap(() => {
              this.errorObject = null;
            })
          );
      }
    });
  }
  private sortOnFragment() {
    this.route.fragment.subscribe((fragment: string | null | Params) => {
      if (fragment === 'home') {
        this.errorObject = null;
        this.cocktailList$ = this.cocktailService.getCocktails().pipe(
          catchError((err) => {
            this.errorObject = err.statusText + ` (${err.status})`;
            return EMPTY;
          })
        );
      }

      if (fragment === 'sort-down') {
        this.toggleSort = true;
      } else if (fragment === 'sort-up') {
        this.toggleSort = false;
      }

      if (fragment === 'hide-alcoholic') {
        this.filteredStatus = false;
      } else if (fragment === 'hide-nonAlcoholic') {
        this.filteredStatus = true;
      } else if (fragment === 'show-all') {
        this.filteredStatus = undefined;
      }

      if (fragment === 'random') {
        this.errorObject = null;
        if (this.filteredStatus === false) {
          this.cocktailList$ = this.cocktailService.randomCocktail(
            this.filteredStatus.toString()
          );
          this.navigateToRandomCocktail();
        } else if (this.filteredStatus === true) {
          this.cocktailList$ = this.cocktailService.randomCocktail(
            this.filteredStatus.toString()
          );
          this.navigateToRandomCocktail();
        } else {
          this.cocktailList$ = this.cocktailService.randomCocktail('showAll');
          this.navigateToRandomCocktail();
        }
      }

      if (fragment === 'myCocktails') {
        this.cocktailList$ = this.cocktailService.getMyCocktails().pipe(
          catchError((err) => {
            this.errorObject = err.error.message;
            return EMPTY;
          })
        );
      }
    });
  }

  private navigateToRandomCocktail() {
    this.cocktailService.cocktail$
      .pipe(
        map((cocktail) =>
          this.router.navigate([`/cocktails/${cocktail[0]._id}`])
        )
      )
      .subscribe();
  }
}
