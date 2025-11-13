import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RecipesPageComponent } from './components/recipes-page/recipes-page.component';

export const routes: Routes = [
    {
        path:'',
        pathMatch:"full",
        component:LoginPageComponent
    },
    {
        path:'recipes',
        pathMatch:"full",
        component:RecipesPageComponent
        // need use loadComponent
    },
    {
        path:'**', redirectTo:'/404', // Need create Not Found Component
    }
];
