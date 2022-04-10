import { Component, Input, OnInit } from '@angular/core';
import { Cocktail } from '../../cocktail.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-cocktail-item',
  templateUrl: './cocktail-item.component.html',
  styleUrls: ['./cocktail-item.component.css'],
})
export class CocktailItemComponent implements OnInit {
  @Input() cocktailItem!: Cocktail;
  @Input() index!: number;
  defaultImage: string = environment.imagePlaceholder;
  constructor() {}

  ngOnInit(): void {}
}
