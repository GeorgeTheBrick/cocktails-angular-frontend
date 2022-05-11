import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthService } from '../authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public errorObject: null | string = null;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}
  onSignup() {
    this.router.navigate(['/cocktails/signup']);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;

    this.authService
      .login(username, password)
      .pipe(
        catchError((err) => {
          this.errorObject = err.error.message;
          return EMPTY;
        }),
        tap(() => {
          this.errorObject = null;
        })
      )
      .subscribe();
  }
}
