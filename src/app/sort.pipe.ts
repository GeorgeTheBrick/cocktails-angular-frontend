import { Pipe, PipeTransform } from '@angular/core';
import { Cocktail } from './cocktails/cocktail.service';

@Pipe({
  name: 'sort',
  pure: false,
})
export class SortPipe implements PipeTransform {
  transform(value: Cocktail[] | null, ascending: boolean): Cocktail[] | null {
    if (ascending === true) {
      return value!.sort((a: Cocktail, b: Cocktail) =>
        a.name.localeCompare(b.name)
      );
    } else {
      return value!.sort((b: Cocktail, a: Cocktail) =>
        a.name.localeCompare(b.name)
      );
    }
  }
}
