import {
  Component,
  computed,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RecipesService } from './services/recipes.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { RecipesNavbarComponent } from './components/recipes-navbar/recipes-navbar.component';

@Component({
  selector: 'app-recipes-page',
  imports: [
    RecipesNavbarComponent,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    RouterOutlet,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.scss',
})
export class RecipesPageComponent implements OnInit {
  dataSource: WritableSignal<any[]> = signal([]);
  displayedColumns: string[] = [
    'Image',
    'Name',
    'Cuisine',
    'Difficulty',
    'Calories',
    'Tags',
    'Actions',
  ];
  isLoading = signal(true);
  pageSizeSignal: WritableSignal<number> = signal(10);
  pageIndexSignal: WritableSignal<number> = signal(0);
  totalItems = computed(() => this.dataSource().length);
  pageSizeOptions: number[] = [5, 10, 25, 100];
  recipesTags: string[] = [];

  paginatedData = computed(() => {
    const data = this.dataSource();
    const pageSize = this.pageSizeSignal();
    const pageIndex = this.pageIndexSignal();

    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return data.slice(start, end);
  });

  constructor(
    public recipesService: RecipesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getRecipes();
    this.getRecipesTags();
  }

  getRecipes() {
    this.recipesService.getRecipes().subscribe({
      next: (resRecipes) => {
        console.log({ resRecipes });
        console.log(resRecipes.recipes);

        this.dataSource.set(resRecipes.recipes);
        this.isLoading.set(false);
      },
    });
  }

  getRecipesTags() {
    this.recipesService.getRecipesTags().subscribe({
      next: (resTags) => {
        console.log({ resTags });
        this.recipesTags = resTags;
      },
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSizeSignal.set(event.pageSize);
    this.pageIndexSignal.set(event.pageIndex);
  }
}
