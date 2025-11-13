import {
  Component,
  computed,
  effect,
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
import { RouterModule, RouterOutlet } from '@angular/router';
import { RecipesNavbarComponent } from './components/recipes-navbar/recipes-navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
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
  totalItems = computed(() => this.filteredData().length);
  pageSizeOptions: number[] = [5, 10, 25, 100];
  recipesTags: string[] = [];
  searchControl = new FormControl('', { nonNullable: true });
  tagControl = new FormControl('All', { nonNullable: true });

  searchFilter = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300)),
    { initialValue: this.searchControl.value }
  );
  tagFilter = toSignal(this.tagControl.valueChanges, {
    initialValue: this.tagControl.value,
  });

  filteredData = computed(() => {
    const data = this.dataSource();
    const search = this.searchFilter().toLowerCase().trim();
    const tag = this.tagFilter();

    return data.filter((recipe) => {
      const matchesSearch =
        !search ||
        recipe.name.toLowerCase().includes(search) ||
        recipe.cuisine.toLowerCase().includes(search);

      const matchesTag =
        tag === 'All' ||
        (recipe.tags &&
          Array.isArray(recipe.tags) &&
          recipe.tags.includes(tag));

      return matchesSearch && matchesTag;
    });
  });

  paginatedData = computed(() => {
    const data = this.filteredData();
    const pageSize = this.pageSizeSignal();
    const pageIndex = this.pageIndexSignal();

    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return data.slice(start, end);
  });

  constructor(public recipesService: RecipesService) {
    effect(() => {
      this.searchFilter();
      this.tagFilter();

      if (this.pageIndexSignal() !== 0) {
        this.pageIndexSignal.set(0);
      }
    });
  }

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
