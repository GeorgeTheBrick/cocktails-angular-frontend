import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { AuthService } from '../authService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  isValid: boolean = true;
  public errorObject: null | string = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;
    const passwordConfirm = form.value.passwordConfirm;
    if (password !== passwordConfirm) {
      this.isValid = false;
      return;
    }

    this.authService
      .signup(username, password, passwordConfirm)
      .pipe(
        catchError((err) => {
          this.errorObject = err.error.message;
          return EMPTY;
        }),
        map(() => {
          if (this.errorObject) {
            this.errorObject = null;
          }
          if (!this.errorObject) {
            this.router.navigate(['/cocktails']);
          }
        })
      )
      .subscribe();
  }
}
