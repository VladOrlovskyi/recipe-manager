import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-recipe-details-page',
  imports: [RouterModule],
  templateUrl: './recipe-details-page.component.html',
  styleUrl: './recipe-details-page.component.scss',
})
export class RecipeDetailsPageComponent implements OnInit {
  recipeId: number;
  currentRecipe:any

  constructor(
    public recipesService: RecipesService,
    private route: ActivatedRoute
  ) {
    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getRecipe(this.recipeId);
  }

  getRecipe(id: number) {
    this.recipesService.getRecipe(id).subscribe({
      next: (recipeRes) => {
        console.log({ recipeRes });
        this.currentRecipe = recipeRes
      },
    });
  }
}
