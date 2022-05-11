import { Cocktail } from './cocktails/cocktail.service';

export interface CocktailEntity {
  cocktails: Cocktail[];
  cocktail: Cocktail;
}
