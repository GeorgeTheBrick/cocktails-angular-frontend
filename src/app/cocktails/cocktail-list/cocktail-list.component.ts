import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { filter, map, Observable, take, tap } from 'rxjs';
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

  constructor(
    private cocktailService: CocktailService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cocktailList$ = this.cocktailService.getCocktails();
    this.isLoading$ = this.cocktailService.observeLoading();

    this.route.queryParams.subscribe((params: Params) => {
      if (params['search']) {
        this.cocktailList$ = this.cocktailService
          .searchCocktails(params['search'])
          .pipe(
            tap((cocktails: Cocktail[]) => {
              if (cocktails.length === 0) {
                return alert('Cocktail does not exist!');
              }
            })
          );
      }
    });

    this.route.fragment.subscribe((fragment: string | null | Params) => {
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
        this.randomCocktail();
      }
    });
  }

  private randomCocktail(): Observable<Cocktail> {
    return (this.cocktailList$ = this.cocktailService.getCocktails().pipe(
      map((cocktails: Cocktail[]) => {
        if (this.filteredStatus === false) {
          return cocktails.filter(
            (cocktail: Cocktail) => cocktail.alcoholic === false
          );
        } else if (this.filteredStatus === true) {
          return cocktails.filter(
            (cocktail: Cocktail) => cocktail.alcoholic === true
          );
        } else {
          return cocktails;
        }
      }),
      map((cocktails: Cocktail[]) => {
        const randomIndex: number = Math.trunc(
          Math.random() * cocktails.length
        );
        return cocktails.filter(
          (cocktail: Cocktail, i: number) => i === randomIndex
        );
      }),
      tap((cocktails: Cocktail[] | any) =>
        cocktails.map((cocktail: Cocktail) =>
          this.router.navigate([`/cocktails/${cocktail.id}`])
        )
      )
    ));
  }
}
