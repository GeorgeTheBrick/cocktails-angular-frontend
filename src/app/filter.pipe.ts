import { Pipe, PipeTransform } from '@angular/core';
import { Cocktail } from './cocktails/cocktail.service';

@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(
    value: Cocktail[] | null,
    filterState: boolean | undefined
  ): Cocktail[] | undefined | null {
    if (filterState === undefined) {
      return value;
    }

    return value?.filter(
      (cocktail: Cocktail) => cocktail.alcoholic === filterState
    );
  }
}
