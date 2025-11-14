import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmationDialogComponent } from '../modal-confirmation-dialog/modal-confirmation-dialog.component';

@Component({
  selector: 'app-recipe-details-page',
  imports: [RouterModule],
  templateUrl: './recipe-details-page.component.html',
  styleUrl: './recipe-details-page.component.scss',
})
export class RecipeDetailsPageComponent implements OnInit {
  recipeId: number;
  currentRecipe: any;
  private dialog = inject(MatDialog);

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
        this.currentRecipe = recipeRes;
      },
    });
  }

  confirmDeletion(recipeId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmationDialogComponent, {
      width: '400px',
      data: { recipeId: recipeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteAndRedirect(recipeId);
      }
    });
  }

  deleteAndRedirect(id: number): void {
    this.recipesService.notifyRecipeDeleted(id);
    this.router.navigate(['/recipes']); 
  }
}
