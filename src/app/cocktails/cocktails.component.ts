import { Component, OnInit } from '@angular/core';
import { Icon } from '../shared/icon-definition';

@Component({
  selector: 'app-cocktails',
  templateUrl: './cocktails.component.html',
  styleUrls: ['./cocktails.component.css'],
})
export class CocktailsComponent implements OnInit {
  public icon = new Icon();
  constructor() {}

  ngOnInit(): void {}

  onClickDown() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }
  onClickUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
