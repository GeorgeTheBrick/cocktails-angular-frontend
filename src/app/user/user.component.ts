import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { AuthService, User } from '../auth/authService';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user$!: Observable<User>;
  public openUploadForm$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$;
  }

  public onLogout() {
    this.authService.logout().subscribe();
  }

  public onMyCocktails() {
    this.router.navigate([], {
      relativeTo: this.route,
      fragment: 'myCocktails',
    });
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }

  public onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const body: any = form.value;
    this.openUploadForm$.next(false);
    this.user$
      .pipe(
        take(1),
        map((user: any) => {
          if (!user) {
            return;
          }
          user.photo = form.value.photo;
          localStorage.setItem('userData', JSON.stringify(user));
          return this.authService.updateUser(user.id, body).subscribe();
        })
      )
      .subscribe();
  }

  public onUpload() {
    this.openUploadForm$.next(true);
  }

  public onCancel() {
    this.openUploadForm$.next(false);
  }
}
