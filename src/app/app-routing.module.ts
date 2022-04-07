import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CocktailStartComponent } from './cocktails/cocktail-start/cocktail-start/cocktail-start.component';
import { CocktailDetailComponent } from './cocktails/cocktail-detail/cocktail-detail.component';
import { CocktailsComponent } from './cocktails/cocktails.component';
import { ErrorPageComponent } from './error-page/error-page/error-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/cocktails/home', pathMatch: 'full' },
  {
    path: 'cocktails',
    component: CocktailsComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: CocktailStartComponent },

      {
        path: ':id',
        component: CocktailDetailComponent,
      },
    ],
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: '/cocktails/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
