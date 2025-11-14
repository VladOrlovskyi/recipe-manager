import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-recipe-details-page',
  imports: [RouterModule],
  templateUrl: './recipe-details-page.component.html',
  styleUrl: './recipe-details-page.component.scss',
})
export class RecipeDetailsPageComponent implements OnInit {
  recipeId: number;
  currentRecipe: any;

  constructor(
    public recipesService: RecipesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const isIdValid = id && !isNaN(+id) && +id > 0;

      if (!isIdValid) {
        this.router.navigate(['../'], { relativeTo: this.route });
        return;
      }
    });
    this.getRecipe(this.recipeId);
  }

  getRecipe(id: number) {
    this.recipesService.getRecipe(id).subscribe({
      next: (recipeRes) => {
        console.log({ recipeRes });
        this.currentRecipe = recipeRes;
      },
    });
  }
}
