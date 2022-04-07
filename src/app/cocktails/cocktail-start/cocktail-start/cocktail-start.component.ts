import { Component, OnInit } from '@angular/core';
import { Icon } from 'src/app/shared/icon-definition';

@Component({
  selector: 'app-cocktail-start',
  templateUrl: './cocktail-start.component.html',
  styleUrls: ['./cocktail-start.component.css'],
})
export class CocktailStartComponent implements OnInit {
  date!: Date | number;
  public icon = new Icon();
  constructor() {}

  ngOnInit(): void {
    this.date = new Date().getFullYear();
  }
}
