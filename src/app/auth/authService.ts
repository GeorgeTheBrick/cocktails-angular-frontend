import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { Cocktail } from '../cocktails/cocktail.service';

export interface AuthResponseData {
  status: string;
  user: { photo: string; username: string; _id: string; role: string };
  expiresIn: number;
  token: string;
}

export interface User {
  username: string;
  id: string;
  expiresIn: number;
  role: string;
  photo: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit {
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isLoggedIn$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {}

  public signup(
    username: string,
    password: string,
    passwordConfirm: string
  ): Observable<User> {
    return this.apiService
      .post<AuthResponseData>('users/signup', {
        username,
        password,
        passwordConfirm,
      })
      .pipe(
        map((resData: AuthResponseData) => this.createUser(resData)),
        tap((resData: User) => {
          this.checkLogin(resData);
          this.autoLogout(resData.expiresIn - new Date(Date.now()).getTime());
        })
      );
  }

  public login(username: string, password: string): Observable<User> {
    return this.apiService
      .post<AuthResponseData>('users/login', { username, password })
      .pipe(
        map((resData: AuthResponseData) => this.createUser(resData)),
        tap((resData: User) => {
          this.checkLogin(resData);
          this.autoLogout(resData.expiresIn - new Date(Date.now()).getTime());
          this.router.navigate(['/cocktails']);
        })
      );
  }

  private createUser(resData: AuthResponseData) {
    const currentUser = {
      username: resData.user.username,
      id: resData.user._id,
      expiresIn: resData.expiresIn,
      role: resData.user.role,
      photo: resData.user.photo,
      token: resData.token,
    };
    this.user$.next(currentUser);
    localStorage.setItem('userData', JSON.stringify(currentUser));
    return currentUser;
  }

  private checkLogin(user: User) {
    if (user) {
      this.isLoggedIn$.next(true);
    } else {
      this.isLoggedIn$.next(false);
    }
  }

  public logout(): Observable<any> {
    return this.apiService.get('users/logout').pipe(
      tap(() => {
        this.user$.next(null);
        this.isLoggedIn$.next(false);
        localStorage.removeItem('userData');
        this.router.navigate(['/cocktails']);
      })
    );
  }

  public autoLogin() {
    const userData: {
      username: string;
      id: string;
      expiresIn: number;
      role: string;
      photo: string;
      token: string;
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    }
    this.user$.next(userData);
    this.checkLogin(userData);

    const currentTime: number = new Date(Date.now()).getTime();
    const timeUntilExpire: number = userData.expiresIn - currentTime;
    if (userData.expiresIn > currentTime) {
      this.autoLogout(timeUntilExpire);
    } else {
      this.logout().subscribe();
    }
  }

  private autoLogout(expiresIn: number) {
    const timeout = setTimeout(() => {
      this.logout().subscribe();
    }, expiresIn);
  }

  public isAllowed(
    getUser: Observable<User>,
    getCocktail: Observable<Cocktail>,
    isAllowed: BehaviorSubject<boolean>
  ) {
    getUser
      .pipe(
        switchMap((user: User) =>
          getCocktail.pipe(
            map((cocktail: Cocktail) => {
              if (!user) {
                return;
              }
              if (user.id === cocktail.createdBy || user.role === 'admin') {
                return isAllowed.next(true);
              } else {
                return isAllowed.next(false);
              }
            })
          )
        )
      )
      .subscribe();
  }

  public updateUser(id: string, body: User): Observable<User> {
    return this.apiService.patch(`users/${id}`, body);
  }
}
