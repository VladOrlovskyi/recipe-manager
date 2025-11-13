import { Routes } from '@angular/router';
import { RecipesPageComponent } from './recipes-page.component';

export const RECIPES_ROUTES: Routes = [
  {
    path: '',
    component: RecipesPageComponent,
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import(
            './components/recipe-details-page/recipe-details-page.component'
          ).then((m) => m.RecipeDetailsPageComponent),
      },
    ],
  },
];
