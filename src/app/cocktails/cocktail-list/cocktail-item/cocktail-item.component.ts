import { Component, Input, OnInit } from '@angular/core';
import { Cocktail } from '../../cocktail.service';

@Component({
  selector: 'app-cocktail-item',
  templateUrl: './cocktail-item.component.html',
  styleUrls: ['./cocktail-item.component.css'],
})
export class CocktailItemComponent implements OnInit {
  @Input() cocktailItem!: Cocktail;
  public innerWidth = window.innerWidth;
  @Input() index!: number;

  constructor() {}

  ngOnInit(): void {}
}
