import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Observable,
  catchError,
  tap,
  BehaviorSubject,
  EMPTY,
  Subject, takeUntil, Subscription,
} from 'rxjs';
import { AuthService } from 'src/app/auth/authService';
import { CocktailService, Cocktail } from '../cocktail.service';
import {BotService} from "../../bot/bot.service";

@Component({
  selector: 'app-cocktail-detail',
  templateUrl: './cocktail-detail.component.html',
  styleUrls: ['./cocktail-detail.component.css'],
})
export class CocktailDetailComponent implements OnInit, OnDestroy {
  public cocktail$!: Observable<Cocktail>;
  public cocktailItem$: Subject<Cocktail> = new Subject<Cocktail>();
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public botResponse$: Subject<string> = new Subject<string>();
  public isBotLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isAllowedEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public errorObject: null | string = null;
  public id!: string;
  public botSubscription: Subscription = new Subscription();

  private cocktail!: Cocktail | undefined;
  private saveResponse!: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private cocktailService: CocktailService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private botService: BotService,
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
          if (this.cocktail) {
            this.botSubscription.unsubscribe();
            this.cocktail = undefined;
            this.saveResponse = false;
            this.botResponse$.next("");
            this.isBotLoading$.next(true);
          }

          this.cocktailItem$.next(cocktail);
          this.cocktail = cocktail;
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

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  public onBotButtonClick(): void {
    if (!this.cocktail) {
      return;
    }

    if (!this.saveResponse) {
      this.isBotLoading$.next(true);
      this.errorObject = null;
      this.botSubscription = this.botService.getResponse(this.cocktail)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          catchError((err) => {
            if (err.status === 429) {
              this.errorObject = 'Request limit (3 requests per minute) reached' +
                ` (${err.status}). Try again in a minute.`;
            }

            return EMPTY;
          }),
        )
        .subscribe((response: any) => {
          this.botResponse$.next(response.choices[0].message.content);
          this.isBotLoading$.next(false);
          this.saveResponse = true;
        });
    }
  }
}
