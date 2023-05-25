import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CocktailsComponent } from './cocktails/cocktails.component';
import { CocktailListComponent } from './cocktails/cocktail-list/cocktail-list.component';
import { CocktailItemComponent } from './cocktails/cocktail-list/cocktail-item/cocktail-item.component';
import { CocktailDetailComponent } from './cocktails/cocktail-detail/cocktail-detail.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CocktailStartComponent } from './cocktails/cocktail-start/cocktail-start.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortPipe } from './sort.pipe';
import { FilterPipe } from './filter.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CocktailEditComponent } from './cocktails/cocktail-edit/cocktail-edit.component';
import { UserComponent } from './user/user.component';
import {
  CocktailDetailModalComponent
} from "./cocktails/cocktail-detail/cocktail-detail-modal/cocktail-detail-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    CocktailsComponent,
    CocktailListComponent,
    CocktailItemComponent,
    CocktailDetailComponent,
    HeaderComponent,
    CocktailStartComponent,
    SortPipe,
    FilterPipe,
    AuthComponent,
    LoginComponent,
    SignupComponent,
    CocktailEditComponent,
    UserComponent,
    CocktailDetailModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
