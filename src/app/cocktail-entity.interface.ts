import { Cocktail } from './cocktails/cocktail.service';

export interface CocktailEntity {
  alcoholic: Cocktail[];
  nonAlcoholic: Cocktail[];
}
