import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/authService';
import { Icon } from 'src/app/shared/icon-definition';

@Component({
  selector: 'app-cocktail-start',
  templateUrl: './cocktail-start.component.html',
  styleUrls: ['./cocktail-start.component.css'],
})
export class CocktailStartComponent implements OnInit {
  date!: Date | number;
  public icon = new Icon();
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.observeLogin();
    this.date = new Date().getFullYear();
  }

  private observeLogin() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  public onLogin() {
    this.router.navigate(['/cocktails/login']);
  }

  public onAddCocktail() {
    this.router.navigate(['/cocktails/new']);
  }
}
