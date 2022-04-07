import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { CocktailService, Cocktail } from '../cocktail.service';

@Component({
  selector: 'app-cocktail-detail',
  templateUrl: './cocktail-detail.component.html',
  styleUrls: ['./cocktail-detail.component.css'],
})
export class CocktailDetailComponent implements OnInit {
  public cocktail$!: Observable<Cocktail | undefined>;

  constructor(
    private cocktailService: CocktailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.cocktail$ = this.cocktailService.getCocktail(params['id']);
      setTimeout(() => {
        innerWidth < 768
          ? window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          : window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1);
    });
  }
}
