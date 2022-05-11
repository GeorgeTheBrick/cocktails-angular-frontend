import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CocktailStartComponent } from './cocktails/cocktail-start/cocktail-start.component';
import { CocktailDetailComponent } from './cocktails/cocktail-detail/cocktail-detail.component';
import { CocktailsComponent } from './cocktails/cocktails.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { CocktailEditComponent } from './cocktails/cocktail-edit/cocktail-edit.component';
import { AuthGuard } from './auth/auth.guard';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/cocktails/home', pathMatch: 'full' },
  {
    path: 'cocktails',
    component: CocktailsComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: CocktailStartComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'login', component: LoginComponent },
      { path: 'me', component: UserComponent, canActivate: [AuthGuard] },
      {
        path: 'new',
        component: CocktailEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id',
        component: CocktailDetailComponent,
      },
      {
        path: ':id/edit',
        component: CocktailEditComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: '**', redirectTo: '/cocktails/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
