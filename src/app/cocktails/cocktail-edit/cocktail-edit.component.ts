import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { Cocktail, CocktailService } from '../cocktail.service';

@Component({
  selector: 'app-cocktail-edit',
  templateUrl: './cocktail-edit.component.html',
  styleUrls: ['./cocktail-edit.component.css'],
})
export class CocktailEditComponent implements OnInit {
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public errorObject: null | string = null;
  editMode = false;
  cocktailForm!: FormGroup;
  id!: string;
  cocktail$!: Observable<Cocktail>;

  constructor(
    private cocktailService: CocktailService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
    });

    this.initForm();
  }

  onSubmit() {
    if (this.editMode) {
      const cocktailData: any = {
        name: this.cocktailForm.value.name,
        image: this.cocktailForm.value.imagePath,
        alcoholic: this.cocktailForm.value.isAlcoholic === '1' ? true : false,
        instructions: this.cocktailForm.value.instructions,
        ingredients: this.cocktailForm.value.ingredients,
      };
      this.cocktailService
        .updateCocktail(this.id, cocktailData)
        .pipe(
          catchError((err) => {
            this.errorObject = `${err.error.message} (${err.status})`;
            return EMPTY;
          }),
          tap(() => {
            this.errorObject = null;
            this.router.navigate([`cocktails/${this.id}`]);
          })
        )
        .subscribe();
    } else {
      const cocktailData: any = {
        name: this.cocktailForm.value.name,
        image: this.cocktailForm.value.imagePath,
        alcoholic: this.cocktailForm.value.isAlcoholic === '1' ? true : false,
        instructions: this.cocktailForm.value.instructions,
        ingredients: this.cocktailForm.value.ingredients,
        createdBy: JSON.parse(localStorage.getItem('userData')!).id,
      };
      this.cocktailService
        .createCocktail(cocktailData)
        .subscribe((res: any) =>
          this.router.navigate([`cocktails/${res.cocktail._id}`])
        );
    }
  }

  onCancel() {
    if (this.cocktailForm.dirty) {
      if (confirm('Are you sure you want to leave editing?')) {
        this.router.navigate(['../'], {
          relativeTo: this.route,
        });
      } else {
        return;
      }
    } else {
      this.router.navigate(['../'], {
        relativeTo: this.route,
      });
    }
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.cocktailForm.get('ingredients')).removeAt(index);
  }

  getControls() {
    return (<FormArray>this.cocktailForm.get('ingredients')).controls;
  }

  odAddIngredient() {
    (<FormArray>this.cocktailForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        measure: new FormControl(null),
      })
    );
  }

  private initForm() {
    let cocktailName: string = '';
    let cocktailImagePath: string = '';
    let cocktailIsAlcoholic: string = '';
    let cocktailIngredients = new FormArray([]);
    let cocktailInstructions: string | undefined = '';

    this.generateForm(
      cocktailName,
      cocktailImagePath,
      cocktailIngredients,
      cocktailInstructions,
      cocktailIsAlcoholic
    );

    if (this.editMode) {
      this.cocktailService
        .getCocktail(this.id)
        .pipe(
          map((cocktail: Cocktail) => {
            cocktailName = cocktail.name;
            cocktailImagePath = cocktail.image;
            cocktailInstructions = cocktail.instructions;
            cocktailIsAlcoholic = cocktail.alcoholic ? '1' : '2';

            if (cocktail['ingredients']) {
              for (let ingredient of cocktail.ingredients) {
                cocktailIngredients.push(
                  new FormGroup({
                    name: new FormControl(ingredient.name, Validators.required),
                    measure: new FormControl(ingredient.measure),
                  })
                );
              }
            }
            this.generateForm(
              cocktailName,
              cocktailImagePath,
              cocktailIngredients,
              cocktailInstructions,
              cocktailIsAlcoholic
            );
          })
        )
        .subscribe();
    }
  }

  private generateForm(
    cocktailName: string,
    cocktailImagePath: string,
    cocktailIngredients: FormArray,
    cocktailInstructions: string | undefined,
    cocktailIsAlcoholic: string
  ) {
    this.cocktailForm = new FormGroup({
      name: new FormControl(cocktailName, Validators.required),
      imagePath: new FormControl(cocktailImagePath, Validators.required),
      ingredients: cocktailIngredients,
      instructions: new FormControl(cocktailInstructions, Validators.required),
      isAlcoholic: new FormControl(cocktailIsAlcoholic, Validators.required),
    });
  }
}
