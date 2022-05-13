import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService, User } from '../auth/authService';
import { Icon } from '../shared/icon-definition';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('sform') searchForm!: NgForm;
  public sort: boolean = false;
  public icon = new Icon();
  public alcoholic: boolean = true;
  public nonAlcoholic: boolean = true;
  public disabledAlcoholic: boolean = false;
  public disabledNonAlcoholic: boolean = false;
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  user$!: Observable<User>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.observeLogin();
    this.user$ = this.authService.user$;
  }

  private observeLogin() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  public onClickProfile() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/cocktails/me']);
  }

  private navigateByFragment(fragment: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      fragment: fragment,
    });
  }

  public onClickMyCocktails() {
    this.navigateByFragment('myCocktails');

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }
  public onLogin() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/cocktails/login']);
  }
  public onLogout() {
    this.authService.logout().subscribe();
  }

  public onHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.router.navigate(['/cocktails/home'], {
      relativeTo: this.route,
      fragment: 'home',
    });
  }

  public onSubmit() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });

    if (this.searchForm.valid) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: this.searchForm.value.search },
      });
      this.searchForm.reset();
    }
  }
  public onRandom() {
    this.navigateByFragment('random');
  }

  public onSort() {
    if (!this.sort) {
      this.navigateByFragment('sort-up');
    } else {
      this.navigateByFragment('sort-down');
    }
    this.sort = !this.sort;
  }

  public onAlcoholicCheck(
    alcoholic: boolean | null,
    nonAlcoholic: boolean | null
  ): void {
    if (this.alcoholic !== this.nonAlcoholic) {
      this.navigateByFragment('show-all');
      this.alcoholic = this.nonAlcoholic = true;
      this.disabledAlcoholic = this.disabledNonAlcoholic = false;
    } else if (this.alcoholic === this.nonAlcoholic) {
      if (alcoholic) {
        this.navigateByFragment('hide-alcoholic');
        this.alcoholic = false;
        this.disabledNonAlcoholic = true;
      } else if (nonAlcoholic) {
        this.navigateByFragment('hide-nonAlcoholic');
        this.nonAlcoholic = false;
        this.disabledAlcoholic = true;
      }
    }
  }
}
