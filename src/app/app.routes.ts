import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [publicGuard],
    component: LoginPageComponent,
  },
  {
    path: 'recipes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./components/recipes-page/recipes.routes').then(
        (m) => m.RECIPES_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: '/404', // Need create Not Found Component
  },
];
