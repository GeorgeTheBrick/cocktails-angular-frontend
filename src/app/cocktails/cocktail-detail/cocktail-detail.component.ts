import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Observable,
  catchError,
  tap,
  BehaviorSubject,
  EMPTY,
  Subject,
} from 'rxjs';
import { AuthService, User } from 'src/app/auth/authService';
import { CocktailService, Cocktail } from '../cocktail.service';

@Component({
  selector: 'app-cocktail-detail',
  templateUrl: './cocktail-detail.component.html',
  styleUrls: ['./cocktail-detail.component.css'],
})
export class CocktailDetailComponent implements OnInit {
  public cocktail$!: Observable<Cocktail>;
  public cocktailItem$: Subject<Cocktail> = new Subject<Cocktail>();
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isAllowedEdit$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public errorObject: null | string = null;
  id!: string;

  constructor(
    private cocktailService: CocktailService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.observeLogin();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.cocktail$ = this.cocktailService.getCocktail(params['id']).pipe(
        catchError((err) => {
          this.errorObject = `No cocktail with that ID`;
          return EMPTY;
        }),
        tap((cocktail: Cocktail) => {
          this.cocktailItem$.next(cocktail);
          this.errorObject = null;
        })
      );
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 1);

      this.isAllowedEdit();
    });
  }

  private observeLogin() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  private isAllowedEdit() {
    this.user$ = this.authService.user$;
    this.authService.isAllowed(
      this.user$,
      this.cocktailItem$,
      this.isAllowedEdit$
    );
  }

  onEditCocktail() {
    this.router.navigate([`/cocktails/${this.id}/edit`]);
  }
  onDeleteCocktail() {
    if (confirm('Are you sure you want to delete this cocktail?')) {
      this.cocktailService.deleteCocktail(this.id).subscribe();
      this.router.navigate(['/cocktails/home'], {
        relativeTo: this.route,
        fragment: 'home',
      });
    } else {
      return;
    }
  }
  onNewCocktail() {
    this.router.navigate(['/cocktails/new']);
  }
}
