import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { Cocktail, CocktailService } from '../cocktails/cocktail.service';
import { AuthService, User } from './authService';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  public cocktail$!: Observable<Cocktail>;
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private cocktailService: CocktailService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | any> | Promise<boolean> | any {
    this.cocktail$ = this.cocktailService.getCocktail(route.params['id']);
    this.user$ = this.authService.user$;

    if (route.params['id']) {
      this.user$
        .pipe(
          switchMap((user: User) =>
            this.cocktail$.pipe(
              map((cocktail: Cocktail) => {
                if (!user) {
                  return;
                }
                if (user.id === cocktail.createdBy || user.role === 'admin') {
                  return true;
                } else {
                  return this.router.navigate([`../`]);
                }
              })
            )
          )
        )
        .subscribe();
    }

    return this.authService.user$.pipe(
      map((user: any) => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/cocktails/login']);
      })
    );
  }
}
